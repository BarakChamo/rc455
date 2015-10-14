import { Actions } from 'flummox';

export default class SynthActions extends Actions {

  /*
    MIDI Actions
  */ 

  NOTE_ON(note, velocity) {
    return [note, velocity]
  }

  NOTE_OFF(d) {
    return d
  }

  CONTROL_CHANGE(target, control, value) {
    return [target, control, value]
  }


  /*
    Application Actions
  */ 

  SET_PATCH(d) {
    return d
  }

  SAVE_PATCH() {
    return true
  }

  DELETE_PATCH() {
    return true
  }

  SET_DESC(desc) {
    return desc
  }
}