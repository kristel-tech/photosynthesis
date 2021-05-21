let canvas = document.getElementById("audio_visual");
let ctx = canvas.getContext("2d");
const AudioContext = window.AudioContext || window.webkitAudioContext;
const globalAudioContext = new AudioContext();

//Attack & Release
let attackTime = 0.0;
let releaseTime = 0.5;
let sustain = 1;  
let attackControl = document.querySelector('#Attack');
let releaseControl = document.querySelector('#Release');

// oscillator
let oscillatorOneWaveShape = "sine";  //add eventlistener delete comment might delete whole line
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
  { name: "C", frequency: 261.63, sharpNote: false },
  { name: "C#", frequency: 277.18, sharpNote: true },
  { name: "D", frequency: 293.66, sharpNote: false },
  { name: "D#", frequency: 311.13, sharpNote: true },
  { name: "E", frequency: 329.63, sharpNote: false },
  { name: "F", frequency: 349.23, sharpNote: false },
  { name: "F#", frequency: 369.99, sharpNote: true },
  { name: "G", frequency: 392.0, sharpNote: false },
  { name: "G#", frequency: 415.3, sharpNote: true },
  { name: "A", frequency: 440.0, sharpNote: false },
  { name: "A#", frequency: 466.16, sharpNote: true },
  { name: "B", frequency: 493.88, sharpNote: true },
  // { name: "C", frequency: 523.25, sharpNote: true }
];
class Synthesizer {
  constructor(waveform,oscfreq,dechune) {

    this.analyser = globalAudioContext.createOscillator();;
    this.oscillator_one = globalAudioContext.createOscillator();
    this.analyser = globalAudioContext.createAnalyser();
    this.analyser.fftSize = 2048;
    this.data = new Uint8Array(this.analyser.frequencyBinCount);
    this.oscillator_one.type = waveform;
    this.oscillator_one.frequency.value = oscfreq;
    this.oscillator_one.detune.setValueAtTime(dechune, globalAudioContext.currentTime);
  }
  playNote(gainNode){
    this.oscillator_one.start(globalAudioContext.currentTime);
    this.analyser.getByteTimeDomainData(this.data); 
    draw(this.data);
    // this.oscillator_one.stop(globalAudioContext.currentTime + sustain);
    // gainNode.gain.linearRampToValueAtTime(0,globalAudioContext.currentTime + sustain);
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

lfoTypeSelect.addEventListener("change",function(e){
    lfoType = e.target.value;
  });

  lfoFrequencySlider.addEventListener("change",function(e){
    lfoFrequency = e.target.value;
  });

filterTypeSelect.addEventListener("change",function(e){
  filterType = e.target.value;
});

filterFrequencySlider.addEventListener("change",function(e){
  filterFrequency = e.target.value;
});


  let adsrEnvelope = globalAudioContext.createGain();
  let osc1 = globalAudioContext.createOscillator();
  let sharpKeyCounter = 0, flatKeyCounter = 0;

// requestAnimationFrame(loopingFunction);


  keys.forEach(({ name, frequency, sharpNote }) => {
    // const noteButton = document.createElement("button");
    const noteButton = document.createElement("div");
    noteButton.innerText = name;
    noteButton.className = "piano-keys";
    noteButton.classList.add("key__div");
    noteButton.classList.add(sharpNote ? "key-black__div" : "key-white__div");
    noteButton.setAttribute("style", "top: -" + (sharpNote ? (4.11 + sharpKeyCounter*8.22) : (flatKeyCounter*8.22)) + "%;");
    sharpKeyCounter += sharpNote;
    flatKeyCounter += sharpNote;
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
    
      let lfo = globalAudioContext.createOscillator();
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

  requestAnimationFrame(loopingFunction);

  function loopingFunction() {
    requestAnimationFrame(loopingFunction);
    if (osc1.analyser != null){
      osc1.analyser.getByteTimeDomainData(osc1.data);
      draw(osc1.data);
    }
}

function draw(data) {
  console.log(data.length)
    data = [...data];

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let space = canvas.width / data.length;
    let start = true;
    ctx.beginPath();
    data.forEach((value, i) => {
        if (start) {
            ctx.moveTo(i, value); //x,y
            start = !start;
        } else
            ctx.lineTo(i + 1, value + 1); //x,y
    })
    ctx.stroke();
}


  function stopOsc(){
    osc1.stop(now);
    adsrEnvelope.cancelScheduledValues(now);

  } 

// function saveConfig() {
//   // attackTime
//   // releaseTime
//   // oscillatorOneWaveShape
//   // detuneValue
//   // filterType
//   // filterFrequency
//   // lfoType
//   // lfoFrequency
//   }
 