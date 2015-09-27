import { Actions } from 'flummox';

export default class SynthActions extends Actions {

  /*
    MIDI Actions
  */ 

  NOTE_ON(d) {
    return d;
  }

  NOTE_OFF(d) {
    return d;
  }

  CONTROL_CHANGE(d) {
    return d;
  }


  /*
    Application Actions
  */ 

  SET_PATCH(d) {

  }

  SAVE_PATCH(d) {

  }
}