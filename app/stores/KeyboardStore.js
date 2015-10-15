import { Store } from 'flummox';
import   audio   from 'controllers/Audio'
import   MIDI    from 'controllers/MIDI'

let midi = new MIDI()

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

const midiBase = 48 // C3 - root note in root transposition

export default class KeyboardStore extends Store {

  constructor(flux) {
    super()

    const self = this

    /*
      Internal inter-props
    */ 

    // "actually" pressed key
    this._keys = {}

    // Arp index
    this._ai = 0
    this._arp = []

    /*
      State definition
    */ 

    // Set Initial State
    this.state = {
      transposition: 0,

      // Keys pressed
      keys: {},

      // Arpeggiator mode
      arp:  {
        on: false,
        mode: 'OFF',
        rate: 250
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

    // Other store actions
    this.synthActions = flux.getActions('synth')

    // Reigster handlers
    this.register(keyboardActionIds.KEY_UP,       this.handleKeyUp)
    this.register(keyboardActionIds.KEY_DOWN,     this.handleKeyDown)
    this.register(keyboardActionIds.PITCH_CHANGE, this.handlePitch)
    this.register(keyboardActionIds.SET_ARP_MODE, this.setArpMode)
    this.register(keyboardActionIds.SET_ARP_RATE, this.setArpRate)

    // Bind global key strokes
    document.addEventListener('keydown', e => (e.keyCode || e.which) && this.handleKeyDown(noteKeys.indexOf(e.keyCode || e.which)) )
    document.addEventListener('keyup',   e => (e.keyCode || e.which) && this.handleKeyUp(noteKeys.indexOf(e.keyCode   || e.which)) )

    // Bind to MIDI (OMG!!! MIDI in the browser! WTF!)
    midi.on('ON', (note, velocity) => this.handleKeyDown(note, velocity, true) )
    midi.on('OFF', note            => this.handleKeyUp(note, true) )

    
    /*
      Initialize Arp
    */

    function arpeggiate(){
      // Make sure arp is in range
      self._ai = self._ai % self._arp.length || 0

      if(self.state.arp.on) {
        if (self._arp.length) {
          self.setKeys({
            [self._arp[self._ai]]: self._keys[[self._arp[self._ai]]]
          })

          // Make sure arp is in range
          self._ai = (self._ai + self.state.arp.mode) % self._arp.length || 0
        } else {
          self.setKeys({})
        }
      }


      setTimeout(arpeggiate, self.state.arp.rate)
    }

    arpeggiate()
  }


  /*
    Action handlers
  */ 

  // Handle key press
  handleKeyDown(key, velocity = 127, midi=false) {
    // Exit if not a mapped key
    if (key < 0) return

    const k = midi ? key : key + midiBase + 12 * this.state.transposition

    // TODO:
    // Same key can only be pressed once?
    // This is different between this._keys and this.state.keys
    // Explicit or implicit presses...
    if (this.state.keys[k]) return

    // Set new key
    this._keys[k] = velocity

    // Generate chords
    this.processArp()
  }

  // Handle key release
  handleKeyUp(key, midi=false) {
    // Exit if not a mapped key
    if (key < 0) return

    const k = midi ? key : key + midiBase + 12 * this.state.transposition

    // Remove released key
    delete this._keys[k]

    // Generate chords
    this.processArp()
  }

  // Handle pitch settings
  handlePitch(dir) {
    const transposition = Math.min(Math.max(this.state.transposition + dir, -2), 2)

    this._keys = transposition === this.state.transposition ? this.state.keys : {}

    this.setState({
      transposition: transposition
    })

    this.setKeys({})

  }

  // Handle chord genrator settings
  handleChord() {

  }

  // Handle Arpeggiator settings
  setArpMode(mode) {
    this.state.arp.on = ( mode !== 'OFF' )
    this.state.arp.mode = mode
    this.setState(this.state)
  }

  setArpRate(rate) {
    this.state.arp.rate = rate
    this.setState(this.state)
  }


  /*
    Internal handlers
  */ 

  processArp() {
    if (!this.state.arp.on){
      return this.setKeys(this._keys)
    }

    this._arp = Object.keys(this._keys)
  }

  // Set derived key presses
  setKeys(newKeys) {
    let oldNotes = Object.keys(this.state.keys).map( k => +k ),
        newNotes = Object.keys(newKeys).map( k => +k )

    for (let note of _.difference(oldNotes, newNotes)) audio.noteOff( note )
    for (let note of _.difference(newNotes, oldNotes)) audio.noteOn(  note, newKeys[note])

    // Set keys on Keyboard store (new object so we have 1-step history)
    this.setState({
      keys: _.extend({}, newKeys)
    })
  }

  getKeys() {
    // return playing keys
    return Object.keys(this.state.keys)
  }

}