let n2p = n        => `${Math.round(n*100)}%`,
    f2n = (n, p=0) => n.toFixed(p)

export default {
  LFO: {
    'frequency.value': v => `LFO rate: ${f2n(v, 2)}`
  },

  LFOAMPGAIN: {
    'gain.value': v => `LFO AMP amount: ${n2p(v)}`
  },

  LFOFLTGAIN: {
    'gain.value': v => `LFO FILTER amount: ${f2n(v)}Hz`
  },

  OSC1: {
    'type': v => `OSC1 type: ${v}`,
    'detune.value': v => `OSC1 detune: ${f2n(v)} cents`
  },

  AMP1: {
    'gain.value': v => `OSC1 AMP: ${n2p(v)}`
  },

  OSC2: {
    'type': v => `OSC2 type: ${v}`,
    'detune.value': v => `OSC2 detune: ${f2n(v)} cents`
  },

  AMP2: {
    'gain.value': v => `OSC2 AMP: ${n2p(v)}`
  },

  OSC3: {
   'type': v => `OSC3 type: ${v}`,
    'detune.value': v => `OSC3 detune: ${f2n(v)} cents`
  },

  AMP3: {
    'gain.value': v => `OSC3 AMP: ${n2p(v)}`
  },

  ENV: {
  'attack': v => `ENV attack: ${f2n(v,2)}s`,
  'sustain': v => `ENV sustain: ${f2n(v,2)}s`,
  'decay': v => `ENV decay: ${n2p(v)}`,
  'release': v => `ENV release: ${f2n(v,2)}s`
  },

  FLT: {
    'frequency.value': v => `FLT cutoff: ${f2n(v)}Hz`,
    'Q.value': v => `FLT resonance: ${v}db`,
    'type': v => `FLT mode: ${v}`
  },

  DIST: {
    'enableCurve': v => `DISTORTION: ${v ? 'ON' : 'OFF'}`,
    'setCurve': v => `DISTORTION amount: ${v}`
  },

  RVRB: {
    'setReverb': v => `REVERB response: ${v}`,
    'mixReverb': v => `REVERB mix: ${n2p(v)}`
  },

  VCDR: {
    'enableVocoder': v => `VOCODER: ${v ? 'ON' : 'OFF'}`,
    'filter.gain.value': v => `Fricative mix: ${n2p(v)}`
  }
}