import { Flummox } from 'flummox';

import SynthActions from './actions/SynthActions';
import SynthStore from './stores/SynthStore';

import KeyboardActions from './actions/KeyboardActions';
import KeyboardStore from './stores/KeyboardStore';

import AudioActions from './actions/AudioActions';
import AudioStore from './stores/AudioStore';

export default class Flux extends Flummox {
  constructor() {
    super();

    /*
      Initialize Action Creators
    */ 

    this.createActions('synth', SynthActions);
    this.createActions('keyboard', KeyboardActions);


    /*
      Initialize Stores
    */ 

    this.createStore('synth', SynthStore, this);
    this.createStore('keyboard', KeyboardStore, this);
  }
}