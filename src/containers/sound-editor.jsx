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

    handleModifyMenu() {
        // get selected audio
        const bufferSelection = this.getSelectionBuffer();
        // for preview
        const audio = new AudioContext();
        const gainNode = audio.createGain();
        gainNode.gain.value = 1;
        gainNode.connect(audio.destination);
        // create inputs before menu so we can get the value easier
        const pitch = document.createElement("input");
        const volume = document.createElement("input");
        const menu = this.displayPopup("Modify Sound", 200, 280, "Apply", "Cancel", () => {
            // accepted
            audio.close();
            const truePitch = isNaN(Number(pitch.value)) ? 0 : Number(pitch.value);
            const trueVolume = isNaN(Number(volume.value)) ? 0 : Number(volume.value);
            this.handleEffect({
                pitch: truePitch * 10,
                volume: trueVolume
            });
        }, () => {
            // denied
            audio.close();
            // we dont need to do anything else
        });
        menu.textarea.style = "position: relative;display: flex;justify-content: flex-end;flex-direction: row;height: calc(100% - (3.125em + 2.125em + 16px));align-items: center;";
        // set pitch stuff
        pitch.type = "range";
        pitch.classList.add(confirmStyles.verticalSlider);
        pitch.style = "position: absolute;left: -40px;top: 80px;";
        pitch.value = 0;
        pitch.min = -360;
        pitch.max = 360;
        pitch.step = 1;
        // set volume stuff
        volume.type = "range";
        volume.classList.add(confirmStyles.verticalSlider);
        volume.style = "position: absolute;left: 0px;top: 80px;";
        volume.value = 1;
        volume.min = 0;
        volume.max = 2;
        volume.step = 0.01;
        menu.textarea.append(pitch);
        menu.textarea.append(volume);
        const labelPitch = document.createElement("p");
        const labelVolume = document.createElement("p");
        labelPitch.style = "text-align: center;width: 35px;font-size: 12px;position: absolute;left: 7.5px;top: 3.5px;";
        labelVolume.style = "text-align: center;width: 35px;font-size: 12px;position: absolute;left: 47.5px;top: 3.5px;";
        labelPitch.innerHTML = "Pitch";
        labelVolume.innerHTML = "Volume";
        menu.textarea.append(labelPitch);
        menu.textarea.append(labelVolume);
        const valuePitch = document.createElement("input");
        const valueVolume = document.createElement("input");
        valuePitch.style = "text-align: center;width: 35px;font-size: 12px;position: absolute;left: 4px;top: 152.5px;";
        valueVolume.style = "text-align: center;width: 35px;font-size: 12px;position: absolute;left: 44px;top: 152.5px;";
        valuePitch.value = 0;
        valueVolume.value = 100;
        valuePitch.min = -360;
        valuePitch.max = 360;
        valuePitch.step = 1;
        valueVolume.min = 0;
        valueVolume.max = 200;
        valueVolume.step = 1;
        valuePitch.type = "number";
        valueVolume.type = "number";
        menu.textarea.append(valuePitch);
        menu.textarea.append(valueVolume);
        const previewButton = document.createElement("button");
        previewButton.style = "font-weight: bold;color: white;border-radius: 1000px;width: 46px;margin-right: 28px;height: 46px;border-style: none;background: #00c3ff;";
        previewButton.innerHTML = "Play";
        menu.textarea.append(previewButton);
        // playing audio
        // create an audio buffer using the selection
        const properBuffer = audio.createBuffer(1, bufferSelection.samples.length, bufferSelection.sampleRate);
        properBuffer.getChannelData(0).set(bufferSelection.samples);
        // button functionality
        let bufferSource;
        let audioPlaying = false;
        function play() {
            bufferSource = audio.createBufferSource();
            bufferSource.connect(gainNode);
            bufferSource.buffer = properBuffer;
            bufferSource.start(0);
            bufferSource.detune.value = pitch.value * 10;
            previewButton.innerHTML = "Stop";
            audioPlaying = true;
            bufferSource.onended = () => {
                previewButton.innerHTML = "Play";
                audioPlaying = false;
            }
        }
        function stop() {
            bufferSource.stop();
            previewButton.innerHTML = "Play";
            audioPlaying = false;
        }
        previewButton.onclick = () => {
            if (audioPlaying) {
                return stop();
            }
            play();
        }
        // updates
        pitch.onchange = (updateValue) => {
            if (updateValue !== false) {
                valuePitch.value = Number(pitch.value);
            };
            if (!bufferSource) return;
            bufferSource.detune.value = pitch.value * 10;
        }
        pitch.oninput = pitch.onchange;
        volume.onchange = (updateValue) => {
            gainNode.gain.value = volume.value;
            if (updateValue === false) return;
            valueVolume.value = Number(volume.value) * 100;
        }
        volume.oninput = volume.onchange;
        // value changes
        valuePitch.onchange = () => {
            pitch.value = valuePitch.value;
            pitch.onchange(false);
        };
        valuePitch.oninput = valuePitch.onchange;
        valueVolume.onchange = () => {
            volume.value = valueVolume.value / 100;
            volume.onchange(false);
        };
        valueVolume.oninput = valueVolume.onchange;
    }
    handleFormatMenu() {
        const sampleRates = [
            3000, 4000, 8000, 11025, 16000, 22050, 32000, 44100,
            48000, 88200, 96000, 176400, 192000, 352800, 384000,
        ];
        let selectedSampleRate = this.props.sampleRate;
        let selectedForceRate = false;
        const menu = this.displayPopup("Format Sound", 580, 300, "Apply", "Cancel", () => {
            // accepted
            const edits = {
                sampleRate: selectedSampleRate,
            };
            if (selectedForceRate) {
                edits.sampleRateEnforced = selectedSampleRate;
            }
            this.handleEffect(edits);
        });

        menu.textarea.style = "padding:8px;";

        const labelSampleRate = document.createElement("p");
        labelSampleRate.innerHTML = "Sample Rate";
        labelSampleRate.style = "font-size:14px;";
        menu.textarea.append(labelSampleRate);
        const inputSampleRate = document.createElement("select");
        inputSampleRate.style = "width:50%;"
        menu.textarea.append(inputSampleRate);
        for (const rate of sampleRates) {
            const option = document.createElement("option");
            option.value = rate;
            option.innerHTML = `${rate}`;
            inputSampleRate.append(option);
        }
        inputSampleRate.selectedIndex = sampleRates.indexOf(this.props.sampleRate);
        const labelSampleRateWarning = document.createElement("p");
        labelSampleRateWarning.innerHTML = "Choosing a higher sample rate than the current rate will not make the existing audio higher quality.";
        labelSampleRateWarning.style = "font-size:13px;opacity:0.5;";
        menu.textarea.append(labelSampleRateWarning);
        inputSampleRate.onchange = () => {
            selectedSampleRate = inputSampleRate.value;
        };

        const labelResampleAudio = document.createElement("label");
        labelResampleAudio.innerHTML = "Enforce New Sample Rate";
        menu.textarea.append(labelResampleAudio);
        const inputResampleAudio = document.createElement("input");
        inputResampleAudio.type = "checkbox";
        inputResampleAudio.style = "margin-right:8px;";
        labelResampleAudio.prepend(inputResampleAudio);
        const labelResampleAudioWarning = document.createElement("p");
        labelResampleAudioWarning.innerHTML = "This changes the properties of the entire sound, "
            + "making lower sample rates use less file size. "
            + "However, audio added to this sound will only be able to use the new sample rate.";
        labelResampleAudioWarning.style = "font-size:13px;opacity:0.5;";
        menu.textarea.append(labelResampleAudioWarning);

        const warning = document.createElement("p");
        warning.innerHTML = "Applying these changes will cause the entire sound to change, not just the selected area.";
        warning.style = "font-size:14px;";
        warning.style.display = "none";
        menu.textarea.append(warning);

        inputResampleAudio.onchange = () => {
            selectedForceRate = inputResampleAudio.checked;
            if (selectedForceRate) {
                warning.style.display = "";
            } else {
                warning.style.display = "none";
            }
        };
    }

    // TODO: use actual scratch-gui menus instead of this
    displayPopup(title, width, height, okname, denyname, accepted, cancelled) {
        const div = document.createElement("div");
        document.body.append(div);
        div.classList.add(confirmStyles.base);
        const box = document.createElement("div");
        div.append(box);
        box.classList.add(confirmStyles.promptBox);
        box.style.width = `${width}px`;
        box.style.height = `${height}px`;
        const header = document.createElement("div");
        box.append(header);
        header.classList.add(confirmStyles.header);
        header.innerText = title;
        const textarea = document.createElement("div");
        box.append(textarea);
        const buttonRow = document.createElement("div");
        box.append(buttonRow);
        buttonRow.classList.add(confirmStyles.buttonRow);
        const deny = document.createElement("button");
        buttonRow.append(deny);
        deny.classList.add(confirmStyles.promptButton);
        deny.classList.add(confirmStyles.deny);
        deny.innerHTML = denyname ? denyname : "Cancel";
        const accept = document.createElement("button");
        buttonRow.append(accept);
        accept.classList.add(confirmStyles.promptButton);
        accept.classList.add(confirmStyles.accept);
        accept.innerHTML = okname ? okname : "OK";
        accept.onclick = () => {
            div.remove();
            if (accepted) accepted();
        }
        deny.onclick = () => {
            div.remove();
            if (cancelled) cancelled();
        }
        return {
            popup: div,
            container: box,
            header: header,
            buttonRow: buttonRow,
            textarea: textarea,
            cancel: deny,
            ok: accept
        }
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
    const index = soundIndex < sprite.sounds.length ? soundIndex : sprite.sounds.length - 1;
    const sound = state.scratchGui.vm.editingTarget.sprite.sounds[index];
    const audioBuffer = state.scratchGui.vm.getSoundBuffer(index);
    return {
        isStereo: audioBuffer.numberOfChannels !== 1,
        duration: sound.sampleCount / sound.rate,
        size: sound.asset ? sound.asset.data.byteLength : 0,
        soundId: sound.soundId,
        dataFormat: sound.dataFormat,
        sampleRate: audioBuffer.sampleRate,
        samples: audioBuffer.getChannelData(0),
        isFullScreen: state.scratchGui.mode.isFullScreen,
        name: sound.name,
        vm: state.scratchGui.vm,
        waveformChunkSize: state.scratchGui.addonUtil.soundEditorWaveformChunkSize,
    };
};

export default connect(
    mapStateToProps
)(SoundEditor);
