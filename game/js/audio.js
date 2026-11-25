// Sizzle & Serve — tiny synthesised sounds: no audio files, only WebAudio.
// Every effect is a short oscillator or noise burst, started on a user gesture.
export function createSfx() {
  let ctx = null;
  function audio() {
    if (ctx) return ctx;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return null;
    ctx = new AudioContext();
    return ctx;
  }
  function tone(freq, seconds, type = 'sine', gain = 0.12, slideTo = null) {
    const ac = audio();
    if (!ac) return;
    const osc = ac.createOscillator();
    const g = ac.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ac.currentTime);
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, ac.currentTime + seconds);
    g.gain.setValueAtTime(gain, ac.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + seconds);
    osc.connect(g);
    g.connect(ac.destination);
    osc.start();
    osc.stop(ac.currentTime + seconds);
  }
  function noise(seconds, gain = 0.08) {
    const ac = audio();
    if (!ac) return;
    const buffer = ac.createBuffer(1, ac.sampleRate * seconds, ac.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i += 1) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
    const src = ac.createBufferSource();
    src.buffer = buffer;
    const g = ac.createGain();
    g.gain.setValueAtTime(gain, ac.currentTime);
    src.connect(g);
    g.connect(ac.destination);
    src.start();
  }
  return {
    play(name) {
      try {
        if (name === 'pop') tone(520, 0.08, 'triangle', 0.1, 760);
        else if (name === 'chop') noise(0.06, 0.12);
        else if (name === 'start') tone(300, 0.12, 'sine', 0.08, 420);
        else if (name === 'ding') tone(880, 0.25, 'sine', 0.1, 1320);
        else if (name === 'serve') {
          tone(660, 0.12, 'triangle', 0.12);
          setTimeout(() => tone(990, 0.2, 'triangle', 0.12), 90);
        } else if (name === 'error') tone(180, 0.18, 'sawtooth', 0.07, 120);
        else if (name === 'expire') tone(220, 0.4, 'sawtooth', 0.08, 110);
      } catch (err) {
        /* A browser without audio still plays fine. */
      }
    },
  };
}
