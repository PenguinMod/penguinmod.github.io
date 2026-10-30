class TelephoneEffect {
constructor(audioContext) {
this.audioContext = audioContext;
this.input = audioContext.createGain();
this.output = audioContext.createGain();

// Telephone bandwidth
this.highpass = audioContext.createBiquadFilter();
this.highpass.type = "highpass";
this.highpass.frequency.value = 300;

this.lowpass = audioContext.createBiquadFilter();
this.lowpass.type = "lowpass";
this.lowpass.frequency.value = 3400;

// Speech presence
this.presence = audioContext.createBiquadFilter();
this.presence.type = "peaking";
this.presence.frequency.value = 1800;
this.presence.Q.value = 1;
this.presence.gain.value = 4;

// Slight saturation
this.distortion = audioContext.createWaveShaper();

const curve = new Float32Array(44100);

for (let i = 0; i < 44100; i++) {
    const x = (i * 2) / 44100 - 1;
    curve[i] = Math.tanh(1.5 * x);
}

this.distortion.curve = curve;

// Wiring
this.input.connect(this.highpass);
this.highpass.connect(this.lowpass);
this.lowpass.connect(this.presence);
this.presence.connect(this.distortion);
this.distortion.connect(this.output);
}
}

export default TelephoneEffect;