import { Store } from 'flummox';

export default class KeyboardStore extends Store {

  constructor(flux) {
    super()

    // Get actions
    const AudioActionIds = flux.getActionIds('audio')

    // Reigster handlers
    // this.register(keyboardActionIds.KEY_DOWN, this.handleKeyDown);

    // Set Initial State
    this.state = {
      keys: {}
    }
  }
}