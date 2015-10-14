import Voice from './Voice'

// Cross-browser fixes
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia
window.AudioContext    = AudioContext || webkitAudioContext

let ctx     = new AudioContext(),
    minVal  = 134

// Distortion curve helper
function distortionCurve(amount=50) {
  let k = amount,
    n_samples = 44100,
    curve = new Float32Array(n_samples),
    deg = Math.PI / 180,
    i = 0,
    x

  for ( ; i < n_samples; ++i ) {
    x = i * 2 / n_samples - 1
    curve[i] = ( 3 + k ) * x * 20 * deg / ( Math.PI + k * Math.abs(x) )
  }

  return curve
}

// Generate reverb impulse response curve
function loadImpulseResponse(amount=1){
  // Generate impulse
  var rate     = ctx.sampleRate,
      length   = rate * Math.max(amount / 20, 1), //this.seconds,
      decay    = (100 - amount), //this.decay,
      impulse  = ctx.createBuffer(2, length, rate),
      impulseL = impulse.getChannelData(0),
      impulseR = impulse.getChannelData(1)

  for (let i = 0; i < length; i++) {
    impulseL[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay)
    impulseR[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay)
  }

  return impulse
}

// Generate random white noise
function loadNoiseBuffer() {  // create a 5-second buffer of noise
    let lengthInSamples =  5 * ctx.sampleRate,
        noiseBuffer = ctx.createBuffer(1, lengthInSamples, ctx.sampleRate),
        bufferData = noiseBuffer.getChannelData(0)
    
    for (var i = 0; i < lengthInSamples; ++i) {
        bufferData[i] = (2*Math.random() - 1)  // -1 to +1
    }

    return noiseBuffer
}

// Avoid high-end feedback screams in live input
function createLPInputFilter(output) {
  let lpInputFilter = ctx.createBiquadFilter()
  lpInputFilter.connect(output)
  lpInputFilter.frequency.value = 2048

  return lpInputFilter
}

function createNoiseGate( connectTo ) {
    let inputNode = ctx.createGain(),
        rectifier = ctx.createWaveShaper(),
        ngFollower = ctx.createBiquadFilter()

    ngFollower.type = ngFollower.LOWPASS
    ngFollower.frequency.value = 10.0

    var curve = new Float32Array(65536)

    for (var i=-32768; i<32768; i++) curve[i+32768] = ((i>0)?i:-i)/32768

    rectifier.curve = curve
    rectifier.connect(ngFollower)

    let ngGate = ctx.createWaveShaper()
    ngGate.curve = generateNoiseFloorCurve(0.01)

    ngFollower.connect(ngGate)

    let gateGain = ctx.createGain()
    gateGain.gain.value = 0.0
    ngGate.connect( gateGain.gain )

    gateGain.connect( connectTo )

    inputNode.connect(rectifier)
    inputNode.connect(gateGain)
    
    return inputNode
}

// AUDIO CONTROLLER
class AudioController {
  constructor(patch) {
    // Initialize with mono
    // TODO: This does nothing right now
    this.poly = 1

    // Hold active voice instances
    this.voices = {}

    // voice settings for new voices
    this.voiceSettings = {}

    // Master amp, connected to output
    this.output = ctx.createGain()
    this.input = ctx.createGain()

    // Initialize an analyser
    this.analyser = ctx.createAnalyser()
    this.analyser.smoothingTimeConstant = 0.95
    this.analysisData = new Uint8Array(this.analyser.frequencyBinCount)
    this.output.connect(this.analyser)
    
    // Filter
    this.FLT = ctx.createBiquadFilter()
    this.FLT.type = 'highpass'
    this.FLT.frequency.value = 0
    this.FLT.Q.value = 1

    // Distortion
    this.DIST = ctx.createWaveShaper()
    this.DIST.curve = distortionCurve(0)
    this.DIST.setCurve = function(amount){
      this.DIST.curve        = amount ? distortionCurve(amount) : null
      this.output.gain.value = amount ? 2.5 : 1
    }.bind(this)

    // Reverb
    this.RVRB = ctx.createConvolver()
    this.RVRB.buffer = loadImpulseResponse(1)

    // Set reverb mix
    this.RVRB.mixReverb  = function(value){
        this.RVRBD.gain.value = ( 1.0 - value )
        this.RVRBW.gain.value = value
    }.bind(this)


    // Set reverb duration
    this.RVRB.setReverb  = function(value){
      this.RVRB.buffer = loadImpulseResponse(value)
    }.bind(this)

    // Connect dry signal to reverb to create fully wet signal
    this.DIST.connect(this.RVRB)

    // Reverb Wet/Dry split
    this.RVRBD = ctx.createGain()
    this.RVRBW = ctx.createGain()

    // LFO
    this.LFO = ctx.createOscillator()
    this.LFOAMPGAIN = ctx.createGain()
    this.LFOFLTGAIN = ctx.createGain()
    
    this.LFO.frequency.value = 2.0
    this.LFOAMPGAIN.gain.value = 0.2
    this.LFOFLTGAIN.gain.value = 0.2


    /* Vocoder */ 

    this.VCDR = {
      enableVocoder: v => v && this.initVocoder(),
      gain: 1.0,
      modulator: ctx.createGain(),
      carrier:   ctx.createGain()
    }


    /* Connections */

    // Run output through LFO modulation
    this.LFO.connect(this.LFOAMPGAIN)
    this.LFO.connect(this.LFOFLTGAIN)

    this.LFOAMPGAIN.connect(this.output.gain)
    this.LFOFLTGAIN.connect(this.FLT.frequency)

    // Input to filter
    this.input.connect(this.FLT)

    // Filter to distortion
    this.FLT.connect(this.DIST)

    // Distortion to Reverb (wet and dry)
    this.DIST.connect(this.RVRBD)
    this.RVRB.connect(this.RVRBW)    

    // Reverb to Output
    this.RVRBD.connect(this.output)
    this.RVRBW.connect(this.output)

    // Output to destination
    // this.output.gain.value = 2
    this.output.connect(ctx.destination)


    /* Start! */ 

    // Start the LFO
    this.LFO.start(ctx.currentTime)
  }

  noteOn(note, velocity) {
    // ignore exsiting notes
    if ( this.voices[note] ) return

    this.voices[note] = new Voice(ctx, this.patch.voice, this.input)
    this.voices[note].start(this.noteToFreq(note))
  }

  noteOff(note) {
    this.voices[note].stop()
    delete this.voices[note]
  }

  noteToFreq(d) {
    // https://en.wikipedia.org/wiki/MIDI_Tuning_Standard
    return Math.pow( 2, (( d - 69 ) / 12) ) * 440
  }

  velocityToGain(v) {

  }

  setPatch(patch){
    this.patch = patch

    // Apply global configuration
    this.applyPatch(patch.global)

    // Apply voice configuration
    for (let voice in this.voices) this.voices[voice].applyPatch(patch.voice)
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

      if (typeof schema[pList[len-1]] === 'function') {
        schema[pList[len-1]](patch[part][param])
      } else {
        schema[pList[len-1]] = patch[part][param]
      }
    }
  }

  analyse() {
    this.analyser.getByteTimeDomainData(this.analysisData)
    return this.analysisData
  }
  
  zeroCrossing() {
    let i = 0,
        l = this.analyser.frequencyBinCount,
        last_zero = -1,
        t

    // advance until we're zero or negative
    while ( ( i < l ) && ( this.analysisData[i] > 128 ) ) i++

    // Check for buffer overflow
    if (i >= l) return 0

    // advance until we're above minVal, keeping track of last zero.
    while (( i < l ) && ( ( t = this.analysisData[i] ) < minVal ) ) {
      if (t >= 128) {
        if (last_zero === -1) last_zero = i
      } else {
        last_zero = -1
      }

      i++
    }

    // we may have jumped over minVal in one sample.
    if (last_zero === -1) last_zero = i

    // We didn't find any positive zero crossings
    if (i === l) return 0

    // The first sample might be a zero.  If so, return it.
    if (last_zero === 0) return 0

    return last_zero
  }

  initVocoder() {
    // Give up if can't get user audio
    if (!navigator.getUserMedia) return

    // Try to get user media
    navigator.getUserMedia({
      "audio": {
        "mandatory": {
          "googEchoCancellation": "false",
          "googAutoGainControl": "false",
          "googNoiseSuppression": "false",
          "googHighpassFilter": "false"
        },
        "optional": []
      },
    }, stream => this.gotVocoderInput(stream), e => console.warn(e))
  }

  gotVocoderInput(stream) {
    this._vocoding = true

    // Create an AudioNode from the stream
    this.inputSource = ctx.createMediaStreamSource(stream)

    // Create modulator gain node
    this.modulator = ctx.createGain()
    this.modulator.gain.value = this.VCDR.gain

    // Connect modulator to vocoder modulator input
    this.modulator.connect( this.VCDR.modulator )

    // make sure the source is mono - some sources will be left-side only
    monoSource = convertToMono( this.inputSource )

    //create a noise gate
    monoSource.connect(
      createLPInputFilter(
        createNoiseGate(this.modulator)
      )
    )

  }
}

// Export singleton
export default new AudioController()