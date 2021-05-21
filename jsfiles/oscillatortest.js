
const AudioContext = window.AudioContext || window.webkitAudioContext;
const globalAudioContext = new AudioContext();

//Attack & Release
let attackTime = 0.0;
let releaseTime = 0.5;
let sustain = 1;  
let attackControl = document.querySelector('#Attack');
let releaseControl = document.querySelector('#Release');

// oscillator
let oscillatorOneWaveShape = "sawtooth";  //add eventlistener delete comment might delete whole line
let oscillatorOneWaveShapeSelect = document.querySelector('#oscillatorWaveform');
let detuneValue = 0; //slider range 0 - 100 steps:1
let detuneValueSlider = document.querySelector('#detuneSlider');

// filter
let filterType = "highpass"; //select box options: "highpass", "lowpass", "bandpass"
let filterTypeSelect = document.querySelector('#filterWaveform');
let filterFrequencySlider = document.querySelector('#filterfrequencySLider'); //slier, range from 0 - 1000 steps:1
let filterFrequency = 400; //slier, range from 0 - 1000 steps:1

// lfo
let lfoType = "sine";
let lfoTypeSelect = document.querySelector('#lfoWaveform');
let lfoFrequency = 0; //slider range 0 - 200hz step: 1hz
let lfoFrequencySlider = document.querySelector('#lfofrequencySLider'); 

const keys = [
  { name: "C", frequency: 261.63 },
  { name: "C#", frequency: 277.18 },
  { name: "D", frequency: 293.66 },
  { name: "D#", frequency: 311.13 },
  { name: "E", frequency: 329.63 },
  { name: "F", frequency: 349.23 },
  { name: "F#", frequency: 369.99 },
  { name: "G", frequency: 392.0 },
  { name: "G#", frequency: 415.3 },
  { name: "A", frequency: 440.0 },
  { name: "A#", frequency: 466.16 },
  { name: "B", frequency: 493.88 },
  { name: "C", frequency: 523.25 },
];
class Synthesizer {
  constructor(waveform,oscfreq,dechune) {
    this.oscillator_one = globalAudioContext.createOscillator();
    this.oscillator_one.type = waveform;
    this.oscillator_one.frequency.value = oscfreq;
    this.oscillator_one.detune.setValueAtTime(dechune, globalAudioContext.currentTime);
  }
  playNote(gainNode){
    this.oscillator_one.start(globalAudioContext.currentTime);
    this.oscillator_one.stop(globalAudioContext.currentTime + sustain);
    gainNode.gain.linearRampToValueAtTime(0,globalAudioContext.currentTime + sustain);
  }
  stopNote(gainNode){
    this.oscillator_one.stop(globalAudioContext.currentTime + sustain);
    gainNode.gain.cancelScheduledValues(globalAudioContext.currentTime);
  }
}

// EVENT LISTENERS////////////////////
  attackControl.addEventListener('input', function() {
      attackTime = Number(this.value);
  }, false);
  
  releaseControl.addEventListener('input', function() {
      releaseTime = Number(this.value);
  }, false);

  oscillatorOneWaveShapeSelect.addEventListener("change", function(e){
    oscillatorOneWaveShape = e.target.value;
  });

  detuneValueSlider.addEventListener("change", function(e){
    detuneValue = e.target.value;
  });


  let adsrEnvelope = globalAudioContext.createGain();
  let osc1 = globalAudioContext.createOscillator();

  keys.forEach(({ name, frequency }) => {
    const noteButton = document.createElement("button");
    noteButton.innerText = name;
    noteButton.className = "piano-keys";
    noteButton.addEventListener("click", () => {
      const now = globalAudioContext.currentTime;

       osc1 = new Synthesizer(oscillatorOneWaveShape,frequency,detuneValue);
       adsrEnvelope = globalAudioContext.createGain();

      adsrEnvelope.gain.cancelScheduledValues(now);
      adsrEnvelope.gain.setValueAtTime(0, now);
      //attack
      adsrEnvelope.gain.linearRampToValueAtTime(1, now + attackTime);
      //release
      adsrEnvelope.gain.linearRampToValueAtTime(0, now + sustain - releaseTime);

      let filter = globalAudioContext.createBiquadFilter();
      filter.type = filterType;
      filter.frequency.value = filterFrequency;
     
      const lfo = globalAudioContext.createOscillator();
      lfo.type = lfoType;
      lfo.frequency.value = lfoFrequency;

      lfo.connect(adsrEnvelope.gain);
      lfo.start();

      osc1.oscillator_one.connect(adsrEnvelope).connect(filter).connect(globalAudioContext.destination);
      osc1.playNote(adsrEnvelope);
      // osc1.stopNote(adsrEnvelope);
    });
    document.getElementById('newKeyboard').appendChild(noteButton)
    // document.body.appendChild(noteButton);
  });

  document.getElementById('stopIt').addEventListener('click',stopOsc)

  function stopOsc(){
    osc1.stop(now);
    adsrEnvelope.cancelScheduledValues(now);

  } 

  function loadConfig(){
    //change values for all parameters on screen

  }