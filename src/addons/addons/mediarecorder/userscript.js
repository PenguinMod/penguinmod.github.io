import downloadBlob from "../../libraries/common/cs/download-blob.js";

export default async ({ addon, console, msg }) => {
    let recordElem;
    let isRecording = false;
    let isWaitingForFlag = false;
    let waitingForFlagFunc = null;
    let abortController = null;
    let stopSignFunc = null;
    let recordBuffer = [];
    let recorder;
    let timeout;
    const isMp4CodecSupported = false;
    // const isMp4CodecSupported = MediaRecorder.isTypeSupported('video/webm;codecs=h264');
    while (true) {
        const elem = await addon.tab.waitForElement('div[class*="menu-bar_file-group"] > div:last-child:not(.sa-record)', {
            markAsSeen: true,
            reduxEvents: ["scratch-gui/mode/SET_PLAYER", "fontsLoaded/SET_FONTS_LOADED", "scratch-gui/locales/SELECT_LOCALE"],
        });
        const getOptions = () => {
            const { backdrop, container, content, closeButton, remove } = addon.tab.createModal(msg("option-title"), {
                isOpen: true,
                useEditorClasses: true,
            });
            container.classList.add("mediaRecorderPopup");
            content.classList.add("mediaRecorderPopupContent");
            
            content.appendChild(
                Object.assign(document.createElement("p"), {
                    textContent: msg("record-description"),
                    className: "recordOptionDescription",
                })
            );
            
            // Seconds
            const recordOptionSeconds = document.createElement("p");
            const recordOptionSecondsInput = Object.assign(document.createElement("input"), {
                type: "number",
                min: 1,
                defaultValue: 300,
                id: "recordOptionSecondsInput",
                className: addon.tab.scratchClass("prompt_variable-name-text-input"),
            });
            const recordOptionSecondsLabel = Object.assign(document.createElement("label"), {
                htmlFor: "recordOptionSecondsInput",
                textContent: msg("record-duration"),
            });
            recordOptionSeconds.appendChild(recordOptionSecondsLabel);
            recordOptionSeconds.appendChild(recordOptionSecondsInput);
            content.appendChild(recordOptionSeconds);
            
            // Delay
            const recordOptionDelay = document.createElement("p");
            const recordOptionDelayInput = Object.assign(document.createElement("input"), {
                type: "number",
                min: 0,
                defaultValue: 0,
                id: "recordOptionDelayInput",
                className: addon.tab.scratchClass("prompt_variable-name-text-input"),
            });
            const recordOptionDelayLabel = Object.assign(document.createElement("label"), {
                htmlFor: "recordOptionDelayInput",
                textContent: msg("start-delay"),
            });
            recordOptionDelay.appendChild(recordOptionDelayLabel);
            recordOptionDelay.appendChild(recordOptionDelayInput);
            content.appendChild(recordOptionDelay);
            
            // Audio
            const recordOptionAudio = Object.assign(document.createElement("p"), {
                className: "mediaRecorderPopupOption",
            });
            const recordOptionAudioInput = Object.assign(document.createElement("input"), {
                type: "checkbox",
                defaultChecked: true,
                id: "recordOptionAudioInput",
            });
            const recordOptionAudioLabel = Object.assign(document.createElement("label"), {
                htmlFor: "recordOptionAudioInput",
                textContent: msg("record-audio"),
                title: msg("record-audio-description"),
            });
            recordOptionAudio.appendChild(recordOptionAudioInput);
            recordOptionAudio.appendChild(recordOptionAudioLabel);
            content.appendChild(recordOptionAudio);
            
            // Mic
            const recordOptionMic = Object.assign(document.createElement("p"), {
                className: "mediaRecorderPopupOption",
            });
            const recordOptionMicInput = Object.assign(document.createElement("input"), {
                type: "checkbox",
                defaultChecked: false,
                id: "recordOptionMicInput",
            });
            const recordOptionMicLabel = Object.assign(document.createElement("label"), {
                htmlFor: "recordOptionMicInput",
                textContent: msg("record-mic"),
            });
            recordOptionMic.appendChild(recordOptionMicInput);
            recordOptionMic.appendChild(recordOptionMicLabel);
            content.appendChild(recordOptionMic);
            
            // Green flag
            const recordOptionFlag = Object.assign(document.createElement("p"), {
                className: "mediaRecorderPopupOption",
            });
            const recordOptionFlagInput = Object.assign(document.createElement("input"), {
                type: "checkbox",
                defaultChecked: true,
                id: "recordOptionFlagInput",
            });
            const recordOptionFlagLabel = Object.assign(document.createElement("label"), {
                htmlFor: "recordOptionFlagInput",
                textContent: msg("record-after-flag"),
            });
            recordOptionFlag.appendChild(recordOptionFlagInput);
            recordOptionFlag.appendChild(recordOptionFlagLabel);
            content.appendChild(recordOptionFlag);
            
            // Stop sign
            const recordOptionStop = Object.assign(document.createElement("p"), {
                className: "mediaRecorderPopupOption",
            });
            const recordOptionStopInput = Object.assign(document.createElement("input"), {
                type: "checkbox",
                defaultChecked: true,
                id: "recordOptionStopInput",
            });
            const recordOptionStopLabel = Object.assign(document.createElement("label"), {
                htmlFor: "recordOptionStopInput",
                textContent: msg("record-until-stop"),
            });
            recordOptionFlagInput.addEventListener("change", () => {
                const disabled = (recordOptionStopInput.disabled = !recordOptionFlagInput.checked);
                if (disabled) {
                    recordOptionStopLabel.title = msg("record-until-stop-disabled", {
                        afterFlagOption: msg("record-after-flag"),
                    });
                }
            });
            recordOptionStop.appendChild(recordOptionStopInput);
            recordOptionStop.appendChild(recordOptionStopLabel);
            content.appendChild(recordOptionStop);
            
            // Record screen
            const recordOptionScreen = Object.assign(document.createElement("p"), {
                className: "mediaRecorderPopupOption",
            });
            const recordOptionScreenInput = Object.assign(document.createElement("input"), {
                type: "checkbox",
                defaultChecked: false,
                id: "recordOptionScreen",
            });
            const recordOptionScreenLabel = Object.assign(document.createElement("label"), {
                htmlFor: "recordOptionScreen",
                textContent: 'Record the entire screen',
            });
            recordOptionScreen.appendChild(recordOptionScreenInput);
            recordOptionScreen.appendChild(recordOptionScreenLabel);
            content.appendChild(recordOptionScreen);
            recordOptionScreenInput.disabled = true;
            if ('mediaDevices' in navigator && typeof navigator.mediaDevices.getDisplayMedia === 'function') {
                recordOptionScreenInput.disabled = false;
            }
            
            let resolvePromise = null;
            const optionPromise = new Promise((resolve) => {
                resolvePromise = resolve;
            });
            let handleOptionClose = null;
            
            backdrop.addEventListener("click", () => handleOptionClose(null));
            closeButton.addEventListener("click", () => handleOptionClose(null));
            
            handleOptionClose = (value) => {
                resolvePromise(value);
                remove();
            };
            
            const buttonRow = Object.assign(document.createElement("div"), {
                className: addon.tab.scratchClass("prompt_button-row", { others: "mediaRecorderPopupButtons" }),
            });
            const cancelButton = Object.assign(document.createElement("button"), {
                textContent: msg("cancel"),
            });
            cancelButton.addEventListener("click", () => handleOptionClose(null), { once: true });
            buttonRow.appendChild(cancelButton);
            const startButton = Object.assign(document.createElement("button"), {
                textContent: msg("start"),
                className: addon.tab.scratchClass("prompt_ok-button"),
            });
            startButton.addEventListener(
                "click",
                () =>
                    handleOptionClose({
                    secs: Number(recordOptionSecondsInput.value),
                    delay: Number(recordOptionDelayInput.value),
                    audioEnabled: recordOptionAudioInput.checked,
                    micEnabled: recordOptionMicInput.checked,
                    waitUntilFlag: recordOptionFlagInput.checked,
                    useStopSign: !recordOptionStopInput.disabled && recordOptionStopInput.checked,
                    recordWholeScreen: recordOptionScreenInput.checked,
                }),
                { once: true }
            );
            buttonRow.appendChild(startButton);
            content.appendChild(buttonRow);
            
            return optionPromise;
        };
        const disposeRecorder = () => {
            isRecording = false;
            recordElem.textContent = msg("record");
            recordElem.title = "";
            recorder = null;
            recordBuffer = [];
            clearTimeout(timeout);
            timeout = 0;
            if (stopSignFunc) {
                addon.tab.traps.vm.runtime.off("PROJECT_STOP_ALL", stopSignFunc);
                stopSignFunc = null;
            }
        };
        const stopRecording = (force) => {
            if (isWaitingForFlag) {
                addon.tab.traps.vm.runtime.off("PROJECT_START", waitingForFlagFunc);
                isWaitingForFlag = false;
                waitingForFlagFunc = null;
                abortController.abort();
                abortController = null;
                disposeRecorder();
                return;
            }
            if (!isRecording || !recorder || recorder.state === "inactive") return;
            if (force) {
                disposeRecorder();
            } else {
                recorder.onstop = () => {
                    const blob = new Blob(recordBuffer, {
                        type: isMp4CodecSupported ?
                        "video/mp4"
                        : "video/webm"
                    });
                    downloadBlob(isMp4CodecSupported ? "video.mp4" : "video.webm", blob);
                    disposeRecorder();
                };
                recorder.stop();
            }
        };
        const startRecording = async (opts) => {
            // Timer
            const secs = Math.max(1, opts.secs);
            
            // Initialize MediaRecorder
            recordBuffer = [];
            isRecording = true;
            const vm = addon.tab.traps.vm;
            let micStream;
            if (opts.micEnabled) {
                // Show permission dialog before green flag is clicked
                try {
                    micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
                } catch (e) {
                    if (e.name !== "NotAllowedError" && e.name !== "NotFoundError") throw e;
                    opts.micEnabled = false;
                }
            }
            let screenRecordingStream;
            if (opts.recordWholeScreen) {
                // Show permission dialog before green flag is clicked
                try {
                    screenRecordingStream = await navigator.mediaDevices.getDisplayMedia({
                        audio: opts.audioEnabled,
                        video: { mediaSource: "screen" }
                    });
                } catch (e) {
                    console.warn('An error occurred trying to record the whole screen', e);
                    opts.recordWholeScreen = false;
                }
            }
            if (opts.waitUntilFlag) {
                isWaitingForFlag = true;
                Object.assign(recordElem, {
                    textContent: msg("click-flag"),
                    title: msg("click-flag-description"),
                });
                abortController = new AbortController();
                try {
                    await Promise.race([
                        new Promise((resolve) => {
                            waitingForFlagFunc = () => resolve();
                            vm.runtime.once("PROJECT_START", waitingForFlagFunc);
                        }),
                        new Promise((_, reject) => {
                            abortController.signal.addEventListener("abort", () => reject("aborted"), { once: true });
                        }),
                    ]);
                } catch (e) {
                    if (e.message === "aborted") return;
                    throw e;
                }
            }
            isWaitingForFlag = false;
            waitingForFlagFunc = abortController = null;
            const stream = new MediaStream();
            if (opts.recordWholeScreen && screenRecordingStream) {
                stream.addTrack(screenRecordingStream.getVideoTracks()[0]);
                try {
                    stream.addTrack(screenRecordingStream.getAudioTracks()[0]);
                } catch (e) {
                    console.warn('Cannot add screen recording\'s audio', e);
                }
            } else {
                const videoStream = vm.runtime.renderer.canvas.captureStream();
                stream.addTrack(videoStream.getVideoTracks()[0]);
            }
            
            const ctx = new AudioContext();
            const dest = ctx.createMediaStreamDestination();
            if (opts.audioEnabled) {
                const mediaStreamDestination = vm.runtime.audioEngine.audioContext.createMediaStreamDestination();
                vm.runtime.audioEngine.inputNode.connect(mediaStreamDestination);
                const audioSource = ctx.createMediaStreamSource(mediaStreamDestination.stream);
                audioSource.connect(dest);
                // literally any other extension
                for (const audioData of vm.runtime._extensionAudioObjects.values()) {
                    if (audioData.audioContext && audioData.gainNode) {
                        const mediaStreamDestination = audioData.audioContext.createMediaStreamDestination();
                        audioData.gainNode.connect(mediaStreamDestination);
                        const audioSource = ctx.createMediaStreamSource(mediaStreamDestination.stream);
                        audioSource.connect(dest);
                    }
                }
            }
            if (opts.micEnabled) {
                const micSource = ctx.createMediaStreamSource(micStream);
                micSource.connect(dest);
            }
            if (opts.audioEnabled || opts.micEnabled) {
                stream.addTrack(dest.stream.getAudioTracks()[0]);
            }
            try {
                recorder = new MediaRecorder(stream, { mimeType: "video/webm;codecs=vp9" });
            } catch (err) {
                console.error('Could not make a transparency compatable video', err);
                recorder = new MediaRecorder(stream, { mimeType:
                    isMp4CodecSupported ?
                    "video/webm;codecs=h264"
                    : "video/webm"
                });
            }
            recorder.ondataavailable = (e) => {
                recordBuffer.push(e.data);
            };
            recorder.onerror = (e) => {
                console.warn("Recorder error:", e.error);
                stopRecording(true);
            };
            timeout = setTimeout(() => stopRecording(false), secs * 1000);
            if (opts.useStopSign) {
                stopSignFunc = () => stopRecording();
                vm.runtime.once("PROJECT_STOP_ALL", stopSignFunc);
            }
            
            // Delay
            const delay = opts.delay || 0;
            const roundedDelay = Math.floor(delay);
            for (let index = 0; index < roundedDelay; index++) {
                recordElem.textContent = msg("starting-in", { secs: roundedDelay - index });
                await new Promise((resolve) => setTimeout(resolve, 975));
            }
            setTimeout(() => {
                recordElem.textContent = msg("stop");
                
                recorder.start(1000);
            }, (delay - roundedDelay) * 1000);
        };
        if (!recordElem) {
            recordElem = Object.assign(document.createElement("div"), {
                className: "sa-record " + elem.className,
                textContent: msg("record"),
            });
            recordElem.addEventListener("click", async () => {
                if (isRecording) {
                    stopRecording();
                } else {
                    const opts = await getOptions();
                    if (!opts) {
                        console.log("Canceled");
                        return;
                    }
                    startRecording(opts);
                }
            });
        }
        elem.parentElement.appendChild(recordElem);
    }
};
