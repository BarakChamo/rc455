export default class MidiManager {
	constructor() {
		this.inputs = {}
		this.handlers = {}

		this.detectMidi()
	}

	detectMidi() {
		try {
			navigator.requestMIDIAccess()
				.then(access => this.handleMidi(access))
				.catch(e => console.log(e))
		} catch(e) {
			console.log('No MIDI support...')
		}
	}

	handleMidi(access) {
		for ( let input of access.inputs.values() ) this.initInput(input)

		setTimeout(() => this.detectMidi(), 3000)
    }

	initInput(input) {
		if (this.inputs[input.id]) return

		this.inputs[input.id] = input
		input.open()
			.then(input => input.onmidimessage = this.onMidi.bind(this))
			.catch(e => console.log(e))
	}

	onMidi(MIDI) {
		const [type, note, velocity] = MIDI.data

		if (type >= 128 && type <= 143) return this.noteOff(note)
		if (type >= 144 && type <= 159) return this.noteOn(note, velocity)
	}

	noteOn(note, velocity) {
		for (let handler of this.handlers.ON) handler(note, velocity)
	}

	noteOff(note) {
		for (let handler of this.handlers.OFF) handler(note)
	}

	on(event, callback) {
		this.handlers[event] = this.handlers[event] || []
		this.handlers[event].push(callback)
	}
}