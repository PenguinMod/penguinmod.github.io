import EchoEffect from './effects/echo-effect.js';
import RobotEffect from './effects/robot-effect.js';
import VolumeEffect from './effects/volume-effect.js';
import FadeEffect from './effects/fade-effect.js';
import MuteEffect from './effects/mute-effect.js';
import LowPassEffect from './effects/lowpass-effect.js';
import HighPassEffect from './effects/highpass-effect.js';
import AlienEffect from './effects/alien-effect.js';
import DistortionEffect from './effects/distortion-effect.js';
import TelephoneEffect from './effects/telephone-effect.js';

const effectTypes = {
    ROBOT: 'robot',
    REVERSE: 'reverse',
    LOUDER: 'higher',
    SOFTER: 'lower',
    FASTER: 'faster',
    SLOWER: 'slower',
    ECHO: 'echo',
    FADEIN: 'fade in',
    FADEOUT: 'fade out',
    MUTE: 'mute',
    LOWPASS: 'low pass',
    HIGHPASS: 'high pass',
    ALIEN: 'alien',
    DISTORTION: 'distortion',
    TELEPHONE: 'telephone'
};

const centsToFrequency = (cents) => {
    return Math.round(1000000 * Math.pow(2, (cents / 100 / 12))) / 1000000;
}

class AudioEffects {
    static get effectTypes () {
        return effectTypes;
    }
    constructor (buffer, options, trimStart, trimEnd) {
        this.trimStartSeconds = (trimStart * buffer.length) / buffer.sampleRate;
        this.trimEndSeconds = (trimEnd * buffer.length) / buffer.sampleRate;
        this.adjustedTrimStartSeconds = this.trimStartSeconds;
        this.adjustedTrimEndSeconds = this.trimEndSeconds;

        // Some effects will modify the playback rate and/or number of samples.
        // Need to precompute those values to create the offline audio context.
        const pitchRatio = Math.pow(2, 4 / 12); // A major third
        let sampleCount = buffer.length;
        const affectedSampleCount = Math.floor((this.trimEndSeconds - this.trimStartSeconds) *
            buffer.sampleRate);
        let adjustedAffectedSampleCount = affectedSampleCount;
        const unaffectedSampleCount = sampleCount - affectedSampleCount;

        // These affect the sampleCount
        this.playbackRate = 1;
        switch (options.preset) {
            case effectTypes.ECHO:
                sampleCount = Math.max(sampleCount,
                    Math.floor((this.trimEndSeconds + EchoEffect.TAIL_SECONDS) * buffer.sampleRate));
                break;
            case effectTypes.FASTER:
                this.playbackRate = pitchRatio;
                adjustedAffectedSampleCount = Math.floor(affectedSampleCount / this.playbackRate);
                sampleCount = unaffectedSampleCount + adjustedAffectedSampleCount;
                break;
            case effectTypes.SLOWER:
                this.playbackRate = 1 / pitchRatio;
                adjustedAffectedSampleCount = Math.floor(affectedSampleCount / this.playbackRate);
                sampleCount = unaffectedSampleCount + adjustedAffectedSampleCount;
                break;
            default:
                if (Object.prototype.hasOwnProperty.call(options, "pitch")) {
                    this.playbackRate = centsToFrequency(options.pitch);
                    adjustedAffectedSampleCount = Math.floor(affectedSampleCount / this.playbackRate);
                    sampleCount = unaffectedSampleCount + adjustedAffectedSampleCount;
                }
                break;
        }

        const durationSeconds = sampleCount / buffer.sampleRate;
        this.adjustedTrimEndSeconds = this.trimStartSeconds +
            (adjustedAffectedSampleCount / buffer.sampleRate);
        this.adjustedTrimStart = this.adjustedTrimStartSeconds / durationSeconds;
        this.adjustedTrimEnd = this.adjustedTrimEndSeconds / durationSeconds;

        let audioContextSampleRate = buffer.sampleRate;
        let audioContextSampleCount = sampleCount;
        if (Object.prototype.hasOwnProperty.call(options, "sampleRateEnforced")) {
            const newSampleRate = options.sampleRateEnforced;
            audioContextSampleRate = newSampleRate;
            audioContextSampleCount = Math.floor((sampleCount / buffer.sampleRate) * newSampleRate);
        }
        if (window.OfflineAudioContext) {
            this.audioContext = new window.OfflineAudioContext(1, audioContextSampleCount, audioContextSampleRate);
        } else {
            // Need to use webkitOfflineAudioContext, which doesn't support all sample rates.
            // Resample by adjusting sample count to make room and set offline context to desired sample rate.
            const sampleScale = 44100 / audioContextSampleRate;
            this.audioContext = new window.webkitOfflineAudioContext(1, sampleScale * audioContextSampleCount, 44100);
        }

        // All effects not seen below use the original buffer because it is not modified.
        this.buffer = buffer;

        // For the reverse effect we need to manually reverse the data into a new audio buffer
        // to prevent overwriting the original, so that the undo stack works correctly.
        // Doing buffer.reverse() would mutate the original data.
        if (options.preset === effectTypes.REVERSE) {
            const buffer = this.buffer;
            const originalBufferData = buffer.getChannelData(0);
            const newBuffer = this.audioContext.createBuffer(1, buffer.length, buffer.sampleRate);
            const newBufferData = newBuffer.getChannelData(0);
            const bufferLength = buffer.length;

            const startSamples = Math.floor(this.trimStartSeconds * buffer.sampleRate);
            const endSamples = Math.floor(this.trimEndSeconds * buffer.sampleRate);
            let counter = 0;
            for (let i = 0; i < bufferLength; i++) {
                if (i >= startSamples && i < endSamples) {
                    newBufferData[i] = originalBufferData[endSamples - counter - 1];
                    counter++;
                } else {
                    newBufferData[i] = originalBufferData[i];
                }
            }
            this.buffer = newBuffer;
        }
        if (Object.prototype.hasOwnProperty.call(options, "sampleRate")) {
            // We can't overwrite the original buffer so we make a clone.
            const buffer = this.buffer;
            const originalBufferData = buffer.getChannelData(0);
            const newBuffer = this.audioContext.createBuffer(1, buffer.length, buffer.sampleRate);
            const newBufferData = newBuffer.getChannelData(0);
            const bufferLength = buffer.length;

            // Our clone from earlier also needs to keep the original buffer's sample rate, so we need to make yet another buffer.
            const sampleRateBuffer = this.makeSampleRateBuffer(buffer, durationSeconds, options.sampleRate);
            const sampleRateBufferData = sampleRateBuffer.getChannelData(0);

            const startSamples = Math.floor(this.trimStartSeconds * buffer.sampleRate);
            const endSamples = Math.floor(this.trimEndSeconds * buffer.sampleRate);
            for (let i = 0; i < bufferLength; i++) {
                if (i >= startSamples && i < endSamples) {
                    // We need to convert sampleRate back to the current buffer's sampleRate
                    const sampleRateModifiedIndex = i * (sampleRateBuffer.sampleRate / buffer.sampleRate);
                    const lowerIndex = Math.floor(sampleRateModifiedIndex);
                    const upperIndex = Math.min(lowerIndex + 1, sampleRateBuffer.length - 1);
                    const interpolation = sampleRateModifiedIndex - lowerIndex;

                    const sample =
                        sampleRateBufferData[lowerIndex] * (1 - interpolation) +
                        sampleRateBufferData[upperIndex] * interpolation;
                    // This works without Number.isFinite but it breaks the waveform preview SVG because sample can be NaN
                    newBufferData[i] = Number.isFinite(sample) ? sample : 0;
                } else {
                    newBufferData[i] = originalBufferData[i];
                }
            }
            this.buffer = newBuffer;
        }

        this.source = this.audioContext.createBufferSource();
        this.source.buffer = this.buffer;
        this.options = options;
    }
    makeSampleRateBuffer(buffer, durationSeconds, newSampleRate) {
        const originalBufferData = buffer.getChannelData(0);
        const newBufferLength = Math.floor(durationSeconds * newSampleRate);
        const newBuffer = this.audioContext.createBuffer(1, newBufferLength, newSampleRate);
        const newBufferData = newBuffer.getChannelData(0);
        const bufferLength = buffer.length;

        // this does work with just bufferLength but causes cut-off when newSampleRate is larger than the current sample rate
        for (let i = 0; i < newBufferLength; i++) {
            const originalIndex = i * (buffer.sampleRate / newSampleRate);
            const lowerIndex = Math.floor(originalIndex);
            const upperIndex = Math.min(lowerIndex + 1, bufferLength - 1);
            const interpolation = originalIndex - lowerIndex;

            const sample =
                originalBufferData[lowerIndex] * (1 - interpolation) +
                originalBufferData[upperIndex] * interpolation;
            newBufferData[i] = sample;
        }

        return newBuffer;
    }
    process (done) {
        // Some effects need to use more nodes and must expose an input and output
        let input;
        let output;
        switch (this.options.preset) {
            case effectTypes.FASTER:
            case effectTypes.SLOWER:
                this.source.playbackRate.setValueAtTime(this.playbackRate, this.adjustedTrimStartSeconds);
                this.source.playbackRate.setValueAtTime(1.0, this.adjustedTrimEndSeconds);
                break;
            case effectTypes.LOUDER:
                ({input, output} = new VolumeEffect(this.audioContext, 1.25,
                    this.adjustedTrimStartSeconds, this.adjustedTrimEndSeconds));
                break;
            case effectTypes.SOFTER:
                ({input, output} = new VolumeEffect(this.audioContext, 0.75,
                    this.adjustedTrimStartSeconds, this.adjustedTrimEndSeconds));
                break;
            case effectTypes.ECHO:
                ({input, output} = new EchoEffect(this.audioContext,
                    this.adjustedTrimStartSeconds, this.adjustedTrimEndSeconds));
                break;
            case effectTypes.ROBOT:
                ({input, output} = new RobotEffect(this.audioContext,
                    this.adjustedTrimStartSeconds, this.adjustedTrimEndSeconds));
                break;
            case effectTypes.LOWPASS:
                ({input, output} = new LowPassEffect(this.audioContext,
                    this.adjustedTrimStartSeconds, this.adjustedTrimEndSeconds));
                break;
            case effectTypes.HIGHPASS:
                ({input, output} = new HighPassEffect(this.audioContext,
                    this.adjustedTrimStartSeconds, this.adjustedTrimEndSeconds));
                break;
            case effectTypes.FADEIN:
                ({input, output} = new FadeEffect(this.audioContext, true,
                    this.adjustedTrimStartSeconds, this.adjustedTrimEndSeconds));
                break;
            case effectTypes.FADEOUT:
                ({input, output} = new FadeEffect(this.audioContext, false,
                    this.adjustedTrimStartSeconds, this.adjustedTrimEndSeconds));
                break;
            case effectTypes.MUTE:
                ({input, output} = new MuteEffect(this.audioContext,
                    this.adjustedTrimStartSeconds, this.adjustedTrimEndSeconds));
                break;
            case effectTypes.ALIEN:
                ({input, output} = new AlienEffect(this.audioContext,
                    this.adjustedTrimStartSeconds, this.adjustedTrimEndSeconds));
                break;
            case effectTypes.DISTORTION:
                ({input, output} = new DistortionEffect(this.audioContext,
                    this.adjustedTrimStartSeconds, this.adjustedTrimEndSeconds));
                break;
            case effectTypes.TELEPHONE:
                ({input, output} = new TelephoneEffect(this.audioContext,
                    this.adjustedTrimStartSeconds, this.adjustedTrimEndSeconds));
                break;
            default:
                if (Object.prototype.hasOwnProperty.call(this.options, "pitch")) {
                    this.source.playbackRate.setValueAtTime(this.playbackRate, this.adjustedTrimStartSeconds);
                    this.source.playbackRate.setValueAtTime(1.0, this.adjustedTrimEndSeconds);
                }
                if (Object.prototype.hasOwnProperty.call(this.options, "volume")) {
                    ({input, output} = new VolumeEffect(this.audioContext, this.options.volume,
                        this.adjustedTrimStartSeconds, this.adjustedTrimEndSeconds));
                }
                break;
        }

        if (input && output) {
            this.source.connect(input);
            output.connect(this.audioContext.destination);
        } else {
            // No effects nodes are needed, wire directly to the output
            this.source.connect(this.audioContext.destination);
        }

        this.source.start();

        this.audioContext.startRendering();
        this.audioContext.oncomplete = ({renderedBuffer}) => {
            done(renderedBuffer, this.adjustedTrimStart, this.adjustedTrimEnd);
        };
    }
}

export default AudioEffects;
