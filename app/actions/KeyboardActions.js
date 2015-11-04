import { Actions } from 'flummox';

export default class KeyboardActions extends Actions {
  
  /*
    Keyboard Event Actions
  */ 

  KEY_UP(key) {
    return key
  }

  KEY_DOWN(key) {
    return key
  }

  PITCH_CHANGE(pitch) {
    return pitch
  }

  SET_ARP_MODE(target, control, mode) {
    // this.synthActions.SET_DESC(`Arpeggiator: ${ this.state.arp.on ? 'ON' : 'OFF' }`)

    return mode
  }

  SET_ARP_RATE(target, control, rate) {
    return rate
  }
}