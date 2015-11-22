# [RC-455](http://barakchamo.github.io/rc455)
###### *RC-455* is a WebAudio synthesizer inspired by the legendary [Moog Voyager](https://en.wikipedia.org/wiki/Minimoog_Voyager).
<a href='http://www.recurse.com' title='Made with love at the Recurse Center'><img src='https://cloud.githubusercontent.com/assets/2883345/11325206/336ea5f4-9150-11e5-9e90-d86ad31993d8.png' height='20px'/></a>
<br/>


This is a 25-key, 3-oscillator additive synthesizer. It features:
* Key-mapped control with keyboard and MIDI(!) support.
* 5 octave transposition range.
* Unlimited polyphony.
* Envelope dynamics control.
* High- and Low-pass filtering.
* LFO-controlled amp and filters.
* Effect unit with distortion and reverb.
* Persistant custom patch storage.
* Waveform Ossiloscope visualizer
* Vocoder! (what?!?)

### Using RC-455

###### How to play
To play the synth you can:

1. Click or tap the keys, you can drag around to play multiple notes in sequence.
2. Press the middle-row of keys on your keyboard (`A` to `'`), you can see the mappings on the keys.
3. If you're using Chrome and plug in a MIDI keyboard, the synth will pick it up and you can play MIDI in the browser!
4. To transpose the octave range up or down, press `-` and `+`.
5. If you enable `Arpeggio`, hold multiple keys down and they will play in sequence.


###### How to create sounds
You can create custom synth sounds by messing around with the synth knobs:
* Customize the waveforms, pitch detune, and amplitude of each oscillator.
* Adjust the volume envelope of the master output.
* Filter low or high frequencies with the `low-pass` and `high-pass` filters.
* Destroy the sound with digital distortion.
* Add volume with convolution reverb.

###### How to be Daft Punk!
Here's how to use the vocoder and be awesome:
* Enable by vocoder by toggling the `on/off` switch.
* Allow the synth to access microphone.
* Play the keys (you won't hear anything).
* Sing into your mic (OMG it's autotune in the browser!!!).

###### How to save presets
If you created a sound you like you can save them locally (it goes to `localStorage`).
Press `✦` to save a preset, `<` & `>` to toggle between saved ones and `X` to delete.


##### Mentions
*RC-455* is built using [React](https://github.com/facebook/react) & [Flummox](https://github.com/acdlite/flummox) and inspired by [umbrUI](https://github.com/simurai/umbrUI) and [WebAudio Vocoder](https://github.com/cwilso/vocoder)
