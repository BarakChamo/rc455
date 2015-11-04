// Base Voice class
export default class Voice {
  constructor(context, patch, output) {
    this.ctx   = context
    this.patch = patch

    /* OSC */ 
    this.OSC1 = context.createOscillator()
    this.OSC1.type = 'square'
    this.OSC1.detune.value = 0

    this.OSC2 = context.createOscillator()
    this.OSC2.type = 'square'
    this.OSC2.detune.value = 0

    this.OSC3 = context.createOscillator()
    this.OSC3.type = 'square'
    this.OSC3.detune.value = 0

    /* AMP */ 
    this.AMP1 = context.createGain()
    this.AMP1.gain.value = 1.0

    this.AMP2 = context.createGain()
    this.AMP2.gain.value = 1.0

    this.AMP3 = context.createGain()
    this.AMP3.gain.value = 1.0

    /* ADSR */
    this.ENV = {
      attack: 0,
      decay: 0,
      sustain: 0,
      release: 0
    }

    /* Global Voice Gain */ 
    this.vca = context.createGain()
    this.vca.gain.value = 1/3

    /* connections */
    // Connect OSC to AMP
    this.OSC1.connect(this.AMP1)
    this.OSC2.connect(this.AMP2)
    this.OSC3.connect(this.AMP3)

    // Connect AMP to VCA
    this.AMP1.connect(this.vca)
    this.AMP2.connect(this.vca)
    this.AMP3.connect(this.vca)

    // Connect VCA to output
    this.vca.connect(output)

    // Apply initial patch
    this.applyPatch(this.patch)
  }

  start(freq, gain) {
    // Set frequency
    this.OSC1.frequency.value = freq
    this.OSC2.frequency.value = freq
    this.OSC3.frequency.value = freq

    // Start oscillators at 0 gain
    this.OSC1.start(this.ctx.currentTime)
    this.OSC2.start(this.ctx.currentTime)
    this.OSC3.start(this.ctx.currentTime)

    // Silence oscillator gain
    this.vca.gain.setValueAtTime(0, this.ctx.currentTime)

    // ATTACK
    this.vca.gain.linearRampToValueAtTime(1/3, this.ctx.currentTime + this.ENV.attack)

    // SUSTAIN
    this.vca.gain.linearRampToValueAtTime(1/3 * this.ENV.decay, this.ctx.currentTime + this.ENV.attack + this.ENV.sustain)
  }

  stop() {
    // Clear previous envelope values
    this.vca.gain.cancelScheduledValues(this.ctx.currentTime)

    // RELEASE
    this.vca.gain.linearRampToValueAtTime(0, this.ctx.currentTime + this.ENV.release)

    // Terminate after release
    setTimeout(function(){
      // Stop all oscillators
      this.vca.gain.value = 0.0
      this.OSC1.stop(0)
      this.OSC2.stop(0)
      this.OSC3.stop(0)

      /* disconnection */ 
      this.OSC1.disconnect(this.AMP1)
      this.OSC2.disconnect(this.AMP2)
      this.OSC3.disconnect(this.AMP3)
      this.AMP1.disconnect(this.vca)
      this.AMP2.disconnect(this.vca)
      this.AMP3.disconnect(this.vca)      
    }.bind(this), this.ENV.release * 1000)
  }

  applyPatch(patch) {
    for (let part in patch) for (let param in patch[part]) {
      let   schema = this[part]
      const pList  = param.split('.'),
            len    = pList.length

      // Apply values to nested keys
      for(let i = 0; i < len-1; i++) {
          const elem = pList[i]
          if( !schema[elem] ) schema[elem] = {}
          schema = schema[elem]
      }

      schema[pList[len-1]] = patch[part][param]
    }
  }
}