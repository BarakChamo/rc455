import { Store } from 'flummox';

export default class SynthStore extends Store {

  constructor(flux) {
    super()

    /*
      Event Registration
    */ 

    const synthActionIds = flux.getActionIds('synth')

    this.register(synthActionIds.NOTE_ON,  this.handleNoteOn)
    this.register(synthActionIds.NOTE_OFF, this.handleNoteOff)


    /*
      State definition
    */ 

    this.state = {
      tempo: 128 
    }
  }


  /*
    Action handlers
  */ 

  handleNoteOn(d) {
    console.log('NOTE ON', d)
  }

  handleNoteOff(d) {
    console.log('NOTE OFF', d)
  }
}