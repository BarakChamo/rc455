import { Store } from 'flummox';

/*
  Keyboard controller

  Flow of key play events:
    - Key up/down event triggered by user
    - Unique keys are sent to chord generator
    - chords are sent to the arrpegiator
    - keys are set on the exposed state
*/ 

// Note key mapping
const noteKeys = [
  65, // A -> C
  87, // W -> C#
  83, // S -> D
  69, // E -> D#
  68, // D -> E
  70, // F -> F
  84, // T -> F#
  71, // G -> G
  89, // Y -> G#
  72, // H -> A
  85, // U -> A#
  74, // J -> B
  75, // K -> C
  79, // O -> C#
  76, // L -> D
  80, // P -> D#
  186,// ; -> E
  222,// F -> F
  221,// T -> F#
  220,// G -> G
]

export default class KeyboardStore extends Store {

  constructor(flux) {
    super()

    /*
      Internal inter-props
    */ 

    // "actually" pressed key
    this._keys = {}


    /*
      State definition
    */ 

    // Set Initial State
    this.state = {
      // Keys pressed
      keys: {},

      // Arpegiator mode
      arp:  {
        on: false
      },

      // Chord mode
      chord: {
        on: false
      }
    }

    /*
      Event Registration
    */ 

    // Get actions
    const keyboardActionIds = flux.getActionIds('keyboard')

    // Reigster handlers
    this.register(keyboardActionIds.KEY_UP,       this.handleKeyUp)
    this.register(keyboardActionIds.KEY_DOWN,     this.handleKeyDown)
    this.register(keyboardActionIds.PITCH_CHANGE, this.handlePitch)

    // Bind global key strokes
    document.addEventListener('keydown', e => (e.keyCode || e.which) && this.handleKeyDown(noteKeys.indexOf(e.keyCode || e.which)) )
    document.addEventListener('keyup',   e => (e.keyCode || e.which) && this.handleKeyUp(noteKeys.indexOf(e.keyCode || e.which)) )
  }


  /*
    Action handlers
  */ 

  // Handle key press
  handleKeyDown(key, velocity = 127) {
    // TODO:
    // Same key can only be pressed once?
    // This is different between this._keys and this.state.keys
    // Explicit or implicit presses...
    if (this.state.keys[key]) return

    // Set new key
    this._keys[key] = velocity

    // Generate chords
    this.processPitch()
  }

  // Handle key release
  handleKeyUp(key) {
    // Remove released key
    delete this._keys[key]

    // Generate chords
    this.processPitch()
  }

  // Handle pitch settings
  handlePitch() {

  }

  // Handle chord genrator settings
  handleChord() {

  }

  // Handle arpegiator settings
  handleArp() {

  }


  /*
    Internal handlers
  */ 

  processPitch() {
    this.processChord()
  }

  processChord() {
    if (this.state.chord.on) {
      // TODO
    }

    this.processArp()
  }

  processArp() {
    if (this.state.arp.on) {
      // TODO
    }

    this.setKeys()    
  }

  // Set derived key presses
  setKeys() {
    this.setState({
      keys: this._keys
    })
  }

  getKeys() {
    // return playing keys
    return Object.keys(this.state.keys)
  }

}