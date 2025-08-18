import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import WavEncoder from 'wav-encoder';
import VM from 'scratch-vm';

import { connect } from 'react-redux';

import {
    computeChunkedRMS,
    encodeAndAddSoundToVM,
    downsampleIfNeeded,
    dropEveryOtherSample
} from '../lib/audio/audio-util.js';
import AudioEffects from '../lib/audio/audio-effects.js';
import SoundEditorComponent from '../components/sound-editor/sound-editor.jsx';
import AudioBufferPlayer from '../lib/audio/audio-buffer-player.js';
import log from '../lib/log.js';
import confirmStyles from '../css/confirm-dialog.css';

const UNDO_STACK_SIZE = 250;

const MAX_RMS = 1.2;

class SoundEditor extends React.Component {
    constructor(props) {
        super(props);
        bindAll(this, [
            'copy',
            'copyCurrentBuffer',
            'handleCopyToNew',
            'handleStoppedPlaying',
            'handleChangeName',
            'handlePlay',
            'handleStopPlaying',
            'handleUpdatePlayhead',
            'handleDelete',
            'handleUpdateTrim',
            'handleEffect',
            'handleUndo',
            'handleRedo',
            'submitNewSamples',
            'handleCopy',
            'handlePaste',
            'paste',
            'handleKeyPress',
            'handleContainerClick',
            'setRef',
            'resampleBufferToRate',
            'handleModifyMenu',
            'handleFormatMenu',
            'getSelectionBuffer'
        ]);
        this.state = {
            copyBuffer: null,
            chunkLevels: computeChunkedRMS(this.props.samples, this.props.waveformChunkSize),
            playhead: null, // null is not playing, [0 -> 1] is playing percent
            trimStart: null,
            trimEnd: null
        };

        this.redoStack = [];
        this.undoStack = [];

        this.ref = null;
    }
    componentDidMount() {
        this.audioBufferPlayer = new AudioBufferPlayer(this.props.samples, this.props.sampleRate);

        document.addEventListener('keydown', this.handleKeyPress);
    }
    componentWillReceiveProps(newProps) {
        if (newProps.waveformChunkSize !== this.props.waveformChunkSize) {
            this.setState({
                chunkLevels: computeChunkedRMS(newProps.samples, newProps.waveformChunkSize),
            });
        }
        if (newProps.soundId !== this.props.soundId) { // A different sound has been selected
            this.redoStack = [];
            this.undoStack = [];
            this.resetState(newProps.samples, newProps.sampleRate);
            this.setState({
                trimStart: null,
                trimEnd: null
            });
        }
    }
    componentWillUnmount() {
        this.audioBufferPlayer.stop();

        document.removeEventListener('keydown', this.handleKeyPress);
    }
    handleKeyPress(event) {
        if (event.target instanceof HTMLInputElement) {
            // Ignore keyboard shortcuts if a text input field is focused
            return;
        }
        if (this.props.isFullScreen) {
            // Ignore keyboard shortcuts if the stage is fullscreen mode
            return;
        }
        if (event.key === ' ') {
            event.preventDefault();
            if (this.state.playhead) {
                this.handleStopPlaying();
            } else {
                this.handlePlay();
            }
        }
        if (event.key === 'Delete' || event.key === 'Backspace') {
            event.preventDefault();
            if (event.shiftKey) {
                this.handleDeleteInverse();
            } else {
                this.handleDelete();
            }
        }
        if (event.key === 'Escape') {
            event.preventDefault();
            this.handleUpdateTrim(null, null);
        }
        if (event.metaKey || event.ctrlKey) {
            if (event.shiftKey && event.key.toLowerCase() === 'z') {
                event.preventDefault();
                if (this.redoStack.length > 0) {
                    this.handleRedo();
                }
            } else if (event.key === 'z') {
                if (this.undoStack.length > 0) {
                    event.preventDefault();
                    this.handleUndo();
                }
            } else if (event.key === 'c') {
                event.preventDefault();
                this.handleCopy();
            } else if (event.key === 'v') {
                event.preventDefault();
                this.handlePaste();
            } else if (event.key === 'a') {
                event.preventDefault();
                this.handleUpdateTrim(0, 1);
            }
        }
    }
    resetState(samples, sampleRate) {
        this.audioBufferPlayer.stop();
        this.audioBufferPlayer = new AudioBufferPlayer(samples, sampleRate);
        this.setState({
            chunkLevels: computeChunkedRMS(samples, this.props.waveformChunkSize),
            playhead: null
        });
    }
    submitNewSamples(samples, sampleRate, skipUndo) {
        return downsampleIfNeeded({ samples, sampleRate }, this.resampleBufferToRate)
            .then(({ samples: newSamples, sampleRate: newSampleRate }) =>
                WavEncoder.encode({
                    sampleRate: newSampleRate,
                    channelData: [newSamples]
                }).then(wavBuffer => {
                    if (!skipUndo) {
                        this.redoStack = [];
                        if (this.undoStack.length >= UNDO_STACK_SIZE) {
                            this.undoStack.shift(); // Drop the first element off the array
                        }
                        this.undoStack.push(this.getUndoItem());
                    }
                    this.resetState(newSamples, newSampleRate);
                    this.props.vm.updateSoundBuffer(
                        this.props.soundIndex,
                        this.audioBufferPlayer.buffer,
                        new Uint8Array(wavBuffer));
                    return true; // Edit was successful
                })
            )
            .catch(e => {
                // Encoding failed, or the sound was too large to save so edit is rejected
                log.error(`Encountered error while trying to encode sound update: ${e.message}`);
                return false; // Edit was not applied
            });
    }
    handlePlay() {
        this.audioBufferPlayer.stop();
        this.audioBufferPlayer.play(
            this.state.trimStart || 0,
            this.state.trimEnd || 1,
            this.handleUpdatePlayhead,
            this.handleStoppedPlaying);
    }
    handleStopPlaying() {
        this.audioBufferPlayer.stop();
        this.handleStoppedPlaying();
    }
    handleStoppedPlaying() {
        this.setState({ playhead: null });
    }
    handleUpdatePlayhead(playhead) {
        this.setState({ playhead });
    }
    handleChangeName(name) {
        this.props.vm.renameSound(this.props.soundIndex, name);
    }
    handleDelete() {
        const { samples, sampleRate } = this.copyCurrentBuffer();
        const sampleCount = samples.length;
        const startIndex = Math.floor(this.state.trimStart * sampleCount);
        const endIndex = Math.floor(this.state.trimEnd * sampleCount);
        const firstPart = samples.slice(0, startIndex);
        const secondPart = samples.slice(endIndex, sampleCount);
        const newLength = firstPart.length + secondPart.length;
        let newSamples;
        if (newLength === 0) {
            newSamples = new Float32Array(1);
        } else {
            newSamples = new Float32Array(newLength);
            newSamples.set(firstPart, 0);
            newSamples.set(secondPart, firstPart.length);
        }
        this.submitNewSamples(newSamples, sampleRate).then(() => {
            this.setState({
                trimStart: null,
                trimEnd: null
            });
        });
    }
    handleDeleteInverse() {
        // Delete everything outside of the trimmers
        const { samples, sampleRate } = this.copyCurrentBuffer();
        const sampleCount = samples.length;
        const startIndex = Math.floor(this.state.trimStart * sampleCount);
        const endIndex = Math.floor(this.state.trimEnd * sampleCount);
        let clippedSamples = samples.slice(startIndex, endIndex);
        if (clippedSamples.length === 0) {
            clippedSamples = new Float32Array(1);
        }
        this.submitNewSamples(clippedSamples, sampleRate).then(success => {
            if (success) {
                this.setState({
                    trimStart: null,
                    trimEnd: null
                });
            }
        });
    }
    handleUpdateTrim(trimStart, trimEnd) {
        this.setState({ trimStart, trimEnd });
        this.handleStopPlaying();
    }
    effectFactory(name) {
        return () => this.handleEffect({
            preset: name,
        });
    }
    copyCurrentBuffer() {
        // Cannot reliably use props.samples because it gets detached by Firefox
        return {
            samples: this.audioBufferPlayer.buffer.getChannelData(0),
            sampleRate: this.audioBufferPlayer.buffer.sampleRate
        };
    }
    handleEffect(options) {
        const trimStart = this.state.trimStart === null ? 0.0 : this.state.trimStart;
        const trimEnd = this.state.trimEnd === null ? 1.0 : this.state.trimEnd;

        // Offline audio context needs at least 2 samples
        if (this.audioBufferPlayer.buffer.length < 2) {
            return;
        }

        const effects = new AudioEffects(this.audioBufferPlayer.buffer, options, trimStart, trimEnd);
        effects.process((renderedBuffer, adjustedTrimStart, adjustedTrimEnd) => {
            const samples = renderedBuffer.getChannelData(0);
            const sampleRate = renderedBuffer.sampleRate;
            this.submitNewSamples(samples, sampleRate).then(success => {
                if (success) {
                    if (this.state.trimStart === null) {
                        this.handlePlay();
                    } else {
                        this.setState({ trimStart: adjustedTrimStart, trimEnd: adjustedTrimEnd }, this.handlePlay);
                    }
                }
            });
        });
    }
    tooLoud() {
        const numChunks = this.state.chunkLevels.length;
        const startIndex = this.state.trimStart === null ?
            0 : Math.floor(this.state.trimStart * numChunks);
        const endIndex = this.state.trimEnd === null ?
            numChunks - 1 : Math.ceil(this.state.trimEnd * numChunks);
        const trimChunks = this.state.chunkLevels.slice(startIndex, endIndex);
        let max = 0;
        for (const i of trimChunks) {
            if (i > max) {
                max = i;
            }
        }
        return max > MAX_RMS;
    }
    getUndoItem() {
        return {
            ...this.copyCurrentBuffer(),
            trimStart: this.state.trimStart,
            trimEnd: this.state.trimEnd
        };
    }
    handleUndo() {
        this.redoStack.push(this.getUndoItem());
        const { samples, sampleRate, trimStart, trimEnd } = this.undoStack.pop();
        if (samples) {
            return this.submitNewSamples(samples, sampleRate, true).then(success => {
                if (success) {
                    this.setState({ trimStart: trimStart, trimEnd: trimEnd }, this.handlePlay);
                }
            });
        }
    }
    handleRedo() {
        const { samples, sampleRate, trimStart, trimEnd } = this.redoStack.pop();
        if (samples) {
            this.undoStack.push(this.getUndoItem());
            return this.submitNewSamples(samples, sampleRate, true).then(success => {
                if (success) {
                    this.setState({ trimStart: trimStart, trimEnd: trimEnd }, this.handlePlay);
                }
            });
        }
    }
    handleCopy() {
        this.copy();
    }
    copy(callback) {
        const trimStart = this.state.trimStart === null ? 0.0 : this.state.trimStart;
        const trimEnd = this.state.trimEnd === null ? 1.0 : this.state.trimEnd;

        const newCopyBuffer = this.copyCurrentBuffer();
        const trimStartSamples = trimStart * newCopyBuffer.samples.length;
        const trimEndSamples = trimEnd * newCopyBuffer.samples.length;
        newCopyBuffer.samples = newCopyBuffer.samples.slice(trimStartSamples, trimEndSamples);

        this.setState({
            copyBuffer: newCopyBuffer
        }, callback);
    }
    getSelectionBuffer() {
        const trimStart = this.state.trimStart === null ? 0.0 : this.state.trimStart;
        const trimEnd = this.state.trimEnd === null ? 1.0 : this.state.trimEnd;

        const newCopyBuffer = this.copyCurrentBuffer();
        const trimStartSamples = trimStart * newCopyBuffer.samples.length;
        const trimEndSamples = trimEnd * newCopyBuffer.samples.length;
        newCopyBuffer.samples = newCopyBuffer.samples.slice(trimStartSamples, trimEndSamples);

        return newCopyBuffer;
    }
    handleCopyToNew() {
        this.copy(() => {
            encodeAndAddSoundToVM(this.props.vm, this.state.copyBuffer.samples,
                this.state.copyBuffer.sampleRate, this.props.name);
        });
    }
    resampleBufferToRate(buffer, newRate) {
        return new Promise((resolve, reject) => {
            const sampleRateRatio = newRate / buffer.sampleRate;
            const newLength = sampleRateRatio * buffer.samples.length;
            let offlineContext;
            // Try to use either OfflineAudioContext or webkitOfflineAudioContext to resample
            // The constructors will throw if trying to resample at an unsupported rate
            // (e.g. Safari/webkitOAC does not support lower than 44khz).
            try {
                if (window.OfflineAudioContext) {
                    offlineContext = new window.OfflineAudioContext(1, newLength, newRate);
                } else if (window.webkitOfflineAudioContext) {
                    offlineContext = new window.webkitOfflineAudioContext(1, newLength, newRate);
                }
            } catch {
                // If no OAC available and downsampling by 2, downsample by dropping every other sample.
                if (newRate === buffer.sampleRate / 2) {
                    return resolve(dropEveryOtherSample(buffer));
                }
                return reject(new Error('Could not resample'));
            }
            const source = offlineContext.createBufferSource();
            const audioBuffer = offlineContext.createBuffer(1, buffer.samples.length, buffer.sampleRate);
            audioBuffer.getChannelData(0).set(buffer.samples);
            source.buffer = audioBuffer;
            source.connect(offlineContext.destination);
            source.start();
            offlineContext.startRendering();
            offlineContext.oncomplete = ({ renderedBuffer }) => {
                resolve({
                    samples: renderedBuffer.getChannelData(0),
                    sampleRate: newRate
                });
            };
        });
    }
    paste() {
        // If there's no selection, paste at the end of the sound
        const { samples } = this.copyCurrentBuffer();
        if (this.state.trimStart === null) {
            const newLength = samples.length + this.state.copyBuffer.samples.length;
            const newSamples = new Float32Array(newLength);
            newSamples.set(samples, 0);
            newSamples.set(this.state.copyBuffer.samples, samples.length);
            this.submitNewSamples(newSamples, this.props.sampleRate, false).then(success => {
                if (success) {
                    this.handlePlay();
                }
            });
        } else {
            // else replace the selection with the pasted sound
            const trimStartSamples = this.state.trimStart * samples.length;
            const trimEndSamples = this.state.trimEnd * samples.length;
            const firstPart = samples.slice(0, trimStartSamples);
            const lastPart = samples.slice(trimEndSamples);
            const newLength = firstPart.length + this.state.copyBuffer.samples.length + lastPart.length;
            const newSamples = new Float32Array(newLength);
            newSamples.set(firstPart, 0);
            newSamples.set(this.state.copyBuffer.samples, firstPart.length);
            newSamples.set(lastPart, firstPart.length + this.state.copyBuffer.samples.length);

            const trimStartSeconds = trimStartSamples / this.props.sampleRate;
            const trimEndSeconds = trimStartSeconds +
                (this.state.copyBuffer.samples.length / this.state.copyBuffer.sampleRate);
            const newDurationSeconds = newSamples.length / this.state.copyBuffer.sampleRate;
            const adjustedTrimStart = trimStartSeconds / newDurationSeconds;
            const adjustedTrimEnd = trimEndSeconds / newDurationSeconds;
            this.submitNewSamples(newSamples, this.props.sampleRate, false).then(success => {
                if (success) {
                    this.setState({
                        trimStart: adjustedTrimStart,
                        trimEnd: adjustedTrimEnd
                    }, this.handlePlay);
                }
            });
        }
    }
    handlePaste() {
        if (!this.state.copyBuffer) return;
        if (this.state.copyBuffer.sampleRate === this.props.sampleRate) {
            this.paste();
        } else {
            this.resampleBufferToRate(this.state.copyBuffer, this.props.sampleRate).then(buffer => {
                this.setState({
                    copyBuffer: buffer
                }, this.paste);
            });
        }
    }
    setRef(element) {
        this.ref = element;
    }
    handleContainerClick(e) {
        // If the click is on the sound editor's div (and not any other element), delesect
        if (e.target === this.ref && this.state.trimStart !== null) {
            this.handleUpdateTrim(null, null);
        }
    }

    // TODO: This should really just render components like the other modals at some point.
    async handleModifyMenu() {
        const playURI = `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0OSIgaGVpZ2h0PSI1MiIgdmlld0JveD0iLTUgMCA0OSA0OCI+PHBhdGggZmlsbD0iI0ZGRiIgZD0iTTM1LjUwOCAxOS4zNzRjNC4yNTkgMi41NTYgNC4yNTIgNi43MDIgMCA5LjI1NEwxMi43MTIgNDIuMzA1Yy00LjI1OCAyLjU1NS03LjcxLjU5Ny03LjcxLTQuMzhWMTAuMDc3YzAtNC45NzMgMy40NTgtNi45MyA3LjcxLTQuMzh6Ii8+PC9zdmc+`;
        const stopURI = `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MiIgaGVpZ2h0PSI1MiIgdmlld0JveD0iMCAwIDUyIDUyIj48cmVjdCBmaWxsPSIjRkZGIiB3aWR0aD0iMzUiIGhlaWdodD0iMzUiIHJ4PSI0IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg4LjUgOC41KSIvPjwvc3ZnPg==`;

        const genSliderDiv = (title, params, scalar) => {
            const div = document.createElement("div");
            div.style = "margin: 0 10px 0 5px;width: 40px;display: flex;flex-direction: column;align-items: center;";

            const label = document.createElement("div");
            label.style = "text-align: center;width: 40px;font-size: 12px;font-weight: bold;";
            label.textContent = title;

            const slider = document.createElement("input");
            slider.style = "transform: rotate(270deg);height: 40px;width: 120px;margin: 45px 10px;";
            slider.type = "range";
            slider.min = params.min;
            slider.max = params.max;
            slider.step = params.step;
            slider.value = params.value;

            const input = document.createElement("input");
            input.style = "text-align: center;width: 40px;border: solid 1px gray;border-radius: 10px;";
            input.type = "number";
            input.min = params.min * scalar;
            input.max = params.max * scalar;
            input.step = params.step * scalar;
            input.value = params.value * scalar;

            div.append(label, slider, input);
            return div;
        };

        // get selected audio
        const bufferSelection = this.getSelectionBuffer();
        // for preview
        const audio = new AudioContext();
        const gainNode = audio.createGain();
        gainNode.gain.value = 1;
        gainNode.connect(audio.destination);

        // create inputs before menu so we can get the value easier
        const pitchDiv = genSliderDiv(
            "Pitch", { min: -360, max: 360, step: 1, value: 0 }, 0
        );
        const volumeDiv = genSliderDiv(
            "Volume", { min: 0, max: 2, step: 0.01, value: 1 }, 100
        );
        const pitchParts = pitchDiv.children;
        const volumeParts = volumeDiv.children;
        let menu = await window.ScratchBlocks.customPrompt(
            { title: "Modify Sound" }, { content: { width: "230px", height: "auto" } },
            [
                {
                    name: "Apply", role: "ok", callback: () => {
                        audio.close();
                        const pitch = pitchParts[1].value, volume = volumeParts[1].value;
                        const truePitch = isNaN(Number(pitch)) ? 0 : Number(pitch);
                        const trueVolume = isNaN(Number(volume)) ? 0 : Number(volume);
                        this.handleEffect({
                            pitch: truePitch * 10, volume: trueVolume
                        });
                    }
                },
                { name: "Cancel", role: "close", callback: () => audio.close() },
            ],
        );

        const modalHandler = () => {
            menu.setAttribute("style", "margin-bottom: 15px;position: relative;display: flex;justify-content: flex-end;flex-direction: row;height: calc(100% - (3.125em + 2.125em + 16px));align-items: center;");
            menu.append(pitchDiv, volumeDiv);

            const previewButton = document.createElement("button");
            previewButton.style = "border-radius: 1000px;padding: 5px;width: 45px;height: 45px;border-style: none;background: #00c3ff;";
            previewButton.innerHTML = `<img draggable="false" style="max-width: 100%;max-height: 100%" src="${playURI}">`;
            menu.append(previewButton);

            // preview functionality
            // create an audio buffer using the selection
            const properBuffer = audio.createBuffer(1, bufferSelection.samples.length, bufferSelection.sampleRate);
            properBuffer.getChannelData(0).set(bufferSelection.samples);

            let bufferSource, audioPlaying = false;
            function play() {
                bufferSource = audio.createBufferSource();
                bufferSource.connect(gainNode);
                bufferSource.buffer = properBuffer;
                bufferSource.start(0);
                bufferSource.detune.value = pitchParts[1].value * 10;
                previewButton.innerHTML = `<img draggable="false" style="max-width: 100%;max-height: 100%" src="${stopURI}">`;
                audioPlaying = true;
                bufferSource.onended = () => {
                    previewButton.firstChild.src = playURI;
                    audioPlaying = false;
                }
            }
            function stop() {
                bufferSource.stop();
                previewButton.firstChild.src = stopURI;
                audioPlaying = false;
            }
            previewButton.onclick = () => {
                if (audioPlaying) stop();
                else play();
            }

            // slider/number updates
            const pSlider = pitchParts[1];
            const pNumber = pitchParts[2];
            pSlider.onchange = (updateValue) => {
                if (updateValue !== false) pNumber.value = Number(pSlider.value);
                if (bufferSource) bufferSource.detune.value = pSlider.value * 10;
            }
            pSlider.oninput = pSlider.onchange;
            pNumber.onchange = () => {
                pSlider.value = pNumber.value;
                pSlider.onchange(false);
            };
            pNumber.oninput = pNumber.onchange;

            const vSlider = volumeParts[1];
            const vNumber = volumeParts[2];
            vSlider.onchange = (updateValue) => {
                gainNode.gain.value = vSlider.value;
                if (updateValue !== false) vNumber.value = Number(vSlider.value) * 100;
            }
            vSlider.oninput = vSlider.onchange;
            vNumber.onchange = () => {
                vSlider.value = vNumber.value / 100;
                vSlider.onchange(false);
            };
            vNumber.oninput = vNumber.onchange;
        };

        // account for weird react timing issue
        if (menu) modalHandler();
        else queueMicrotask(() => {
          menu = document.querySelector(`div[class="ReactModalPortal"] div[class*="prompt_body_"] div`);
          menu.parentNode.parentNode.parentNode.style.width = "230px";
          modalHandler();
        });
    }

    // TODO: This should really just render components like the other modals at some point.
    async handleFormatMenu() {
        const genTitle = (text) => {
            const label = document.createElement("div");
            label.style = "font-weight: 500;font-size: 14px;margin-bottom: 5px;";
            const inner = document.createElement("span");
            inner.textContent = text;
            label.appendChild(inner);
            return label;
        };
        const genCheckableLabel = (text, id, isChecked) => {
            const div = document.createElement("div");
            div.classList.add("check-outer");
            div.id = id;
            div.style = "margin-top: 3px;";
            const check = document.createElement("input");
            check.style = "margin-right: 8px;";
            check.type = "radio";
            check.checked = isChecked ?? false;
            const label = document.createElement("span");
            label.textContent = text;
            div.append(check, label);
            return div;
        };

        const sampleRates = [
            3000, 4000, 8000, 11025, 16000, 22050, 32000, 44100,
            48000, 88200, 96000, 176400, 192000, 352800, 384000,
        ];
        let selectedSampleRate = this.props.sampleRate;
        let selectedForceRate = false;
        let menu = await window.ScratchBlocks.customPrompt(
            { title: "Format Sound" }, { content: { width: "350px", height: "auto" } },
            [
                {
                    name: "Apply", role: "ok", callback: () => {
                        const edits = { sampleRate: selectedSampleRate };
                        if (selectedForceRate) edits.sampleRateEnforced = selectedSampleRate;
                        this.handleEffect(edits);
                    }
                },
                { name: "Cancel", role: "close", callback: () => {} },
            ],
        );

        const modalHandler = () => {
            menu.style.marginBottom = "15px";
            const rateTitle = genTitle("New Sample Rate:");

            const rateSelector = document.createElement("select");
            rateSelector.style = "border-radius: 5px;text-align: center;margin-left: 10px;width: 50%;";
            for (const rate of sampleRates) {
                const option = document.createElement("option");
                option.value = rate;
                option.textContent = rate;
                rateSelector.append(option);
            }
            rateSelector.selectedIndex = sampleRates.indexOf(this.props.sampleRate);
            rateSelector.onchange = () => {
                selectedSampleRate = rateSelector.value;
            };
            rateTitle.appendChild(rateSelector);

            const warningDiv = document.createElement("div");
            warningDiv.style.marginBottom = "15px";
            const warning = document.createElement("i");
            warning.textContent = "Choosing a higher sample rate than the current rate will not make the existing audio higher quality";
            warning.style = "font-size:13px;opacity:0.5;";
            warningDiv.appendChild(warning);

            const warningDiv2 = warning.cloneNode(true);
            warningDiv2.textContent = "If 'whole sound' is selected, all added audio will use the new sample rate";

            const applicatorDiv = document.createElement("div");
            applicatorDiv.append(
                genCheckableLabel("this selection", "0", true),
                genCheckableLabel("whole sound", "1", false)
            );
            applicatorDiv.addEventListener("click", (e) => {
                const div = e.target.closest(`div[class="check-outer"]`);
                if (!div) return;

                for (const checkable of Array.from(div.parentNode.children)) {
                  checkable.firstChild.checked = false;
                }
                div.firstChild.checked = true;
                selectedForceRate = div.id == "1";
                e.stopPropagation();
            });
            menu.append(rateTitle, warningDiv, genTitle("Apply to:"), applicatorDiv, warningDiv2);
        };

        // account for weird react timing issue
        if (menu) modalHandler();
        else queueMicrotask(() => {
          menu = document.querySelector(`div[class="ReactModalPortal"] div[class*="prompt_body_"] div`);
          modalHandler();
        });
    }
    render() {
        const { effectTypes } = AudioEffects;
        return (
            <SoundEditorComponent
                isStereo={this.props.isStereo}
                duration={this.props.duration}
                size={this.props.size}
                sampleRate={this.props.sampleRate}
                dataFormat={this.props.dataFormat}
                canPaste={this.state.copyBuffer !== null}
                canRedo={this.redoStack.length > 0}
                canUndo={this.undoStack.length > 0}
                chunkLevels={this.state.chunkLevels}
                name={this.props.name}
                playhead={this.state.playhead}
                setRef={this.setRef}
                tooLoud={this.tooLoud()}
                trimEnd={this.state.trimEnd}
                trimStart={this.state.trimStart}
                onChangeName={this.handleChangeName}
                onContainerClick={this.handleContainerClick}
                onCopy={this.handleCopy}
                onCopyToNew={this.handleCopyToNew}
                onDelete={this.handleDelete}
                onEcho={this.effectFactory(effectTypes.ECHO)}
                onFadeIn={this.effectFactory(effectTypes.FADEIN)}
                onFadeOut={this.effectFactory(effectTypes.FADEOUT)}
                onFaster={this.effectFactory(effectTypes.FASTER)}
                onLouder={this.effectFactory(effectTypes.LOUDER)}
                onModifySound={this.handleModifyMenu}
                onFormatSound={this.handleFormatMenu}
                onMute={this.effectFactory(effectTypes.MUTE)}
                onPaste={this.handlePaste}
                onPlay={this.handlePlay}
                onRedo={this.handleRedo}
                onReverse={this.effectFactory(effectTypes.REVERSE)}
                onRobot={this.effectFactory(effectTypes.ROBOT)}
                onLowPass={this.effectFactory(effectTypes.LOWPASS)}
                onHighPass={this.effectFactory(effectTypes.HIGHPASS)}
                onSetTrim={this.handleUpdateTrim}
                onSlower={this.effectFactory(effectTypes.SLOWER)}
                onSofter={this.effectFactory(effectTypes.SOFTER)}
                onStop={this.handleStopPlaying}
                onUndo={this.handleUndo}
            />
        );
    }
}

SoundEditor.propTypes = {
    isStereo: PropTypes.bool,
    duration: PropTypes.number,
    dataFormat: PropTypes.number,
    size: PropTypes.number,
    isFullScreen: PropTypes.bool,
    name: PropTypes.string.isRequired,
    sampleRate: PropTypes.number,
    samples: PropTypes.instanceOf(Float32Array),
    soundId: PropTypes.string,
    soundIndex: PropTypes.number,
    vm: PropTypes.instanceOf(VM).isRequired,
    waveformChunkSize: PropTypes.number,
};

const mapStateToProps = (state, { soundIndex }) => {
    const sprite = state.scratchGui.vm.editingTarget.sprite;
    // Make sure the sound index doesn't go out of range.
    const index = Math.min(sprite.sounds.length - 1, Math.max(0, soundIndex));
    const sound = sprite.sounds[index] ?? {};
    const audioBuffer = state.scratchGui.vm.getSoundBuffer(index);
    return {
        isStereo: audioBuffer?.numberOfChannels !== 1,
        duration: sound.sampleCount / sound.rate,
        size: sound.asset ? sound.asset.data.byteLength : 0,
        soundId: sound.soundId,
        dataFormat: sound.dataFormat,
        sampleRate: audioBuffer?.sampleRate ?? 3000,
        samples: audioBuffer ? audioBuffer.getChannelData(0) : new Float32Array(1),
        isFullScreen: state.scratchGui.mode.isFullScreen,
        name: sound.name,
        vm: state.scratchGui.vm,
        waveformChunkSize: state.scratchGui.addonUtil.soundEditorWaveformChunkSize,
    };
};

export default connect(
    mapStateToProps
)(SoundEditor);
