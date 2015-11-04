require("styles/desktop.scss");

// // Constants
// console.log('WOOT');

// // Global context class
// var contextClass = (window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.oAudioContext || window.msAudioContext);

// if (contextClass) {
//   var context = new contextClass();
// } else {
//   console.log('Shucks... No Synth for you buddy...');
// }

// // create Oscillator node
// var oscillator = context.createOscillator();

// oscillator.type = 'square';
// oscillator.frequency.value = 3000; // value in hertz
// oscillator.start();



// // // Create the source.
// var source = context.createBufferSource();

// // // Create the gain node.
// var gain = context.createGain();

// // // Connect source to filter, filter to destination.
// source.connect(gain);
// oscillator.connect(gain);
// gain.connect(context.destination);

// // create web audio api context
// var audioCtx = new AudioContext;