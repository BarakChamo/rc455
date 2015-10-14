import { Store } from 'flummox'
import   audio   from 'controllers/Audio'
import   patch   from 'config/patches/default.json'
import   desc    from 'config/descriptors'


export default class SynthStore extends Store {

  constructor(flux) {
    super()

    /*
      Event Registration
    */ 

    const synthActionIds = flux.getActionIds('synth')

    this.register(synthActionIds.CONTROL_CHANGE, this.handleControlChange)

    /*
      State definition
    */ 

    this.state = {
      // Global tempo (effects LFO, ARP, ENV, AUTOPLAY...)
      tempo: 128,
      
      // Active notes
      notes: [],

      // Synth patch preset
      patch: patch,

      // Latest control change description
      desc: ''
    }

    // Set default patch to audio manager
    audio.setPatch(this.state.patch)
  }


  /*
    Action handlers
  */ 

  handleControlChange(params) {
    const [target, control, value] = params
    
    // Update state value (test for global or voice)
    this.state.patch[this.state.patch.voice.hasOwnProperty(target) ? 'voice' : 'global'][target][control] = value

    // Update audio manager
    audio.setPatch(this.state.patch)

    // Update latest control change decription
    this.state.desc = desc[target][control](value)

    // Set state
    this.setState(this.state)
  }
}