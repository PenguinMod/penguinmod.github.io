class DistortionEffect {
    constructor(audioContext, startSeconds, endSeconds) {
        this.input = audioContext.createGain();
        this.output = audioContext.createGain();
        const dry = audioContext.createGain();
        const wet = audioContext.createGain();
        const shaper = audioContext.createWaveShaper();
        const curveSize = 44100;
        const curve = new Float32Array(curveSize);
        const amount = 20;

        for (let i = 0; i < curveSize; i++) {
            const normalizedIndex = i / curveSize;
            const doubledIndex = normalizedIndex * 2;
            const x = doubledIndex - 1;
            const numerator = (1 + amount) * x;
            const denominator = 1 + (amount * Math.abs(x));
            curve[i] = numerator / denominator;
        }

        shaper.curve = curve;
        shaper.oversample = '4x';

        const ramp = Math.min(0.01, (endSeconds - startSeconds) / 2);
        const rampStart = Math.max(0, startSeconds - ramp);
        dry.gain.setValueAtTime(1, 0);
        dry.gain.setValueAtTime(1, rampStart);
        dry.gain.linearRampToValueAtTime(0, startSeconds);
        wet.gain.setValueAtTime(0, 0);
        wet.gain.setValueAtTime(0, rampStart);
        wet.gain.linearRampToValueAtTime(1, startSeconds);
        dry.gain.setValueAtTime(0, endSeconds);
        dry.gain.linearRampToValueAtTime(1, endSeconds + ramp);
        wet.gain.setValueAtTime(1, endSeconds);
        wet.gain.linearRampToValueAtTime(0, endSeconds + ramp);

        this.input.connect(dry);
        dry.connect(this.output);
        this.input.connect(shaper);
        shaper.connect(wet);
        wet.connect(this.output);
    }
}

export default DistortionEffect;
