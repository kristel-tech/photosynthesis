
const AudioContext = window.AudioContext || window.webkitAudioContext;
const globalAudioContext = new AudioContext();
const waveforms = ["sawtooth","sine","square", "triangle"];  //add eventlistener delete comment
let attackTime = 0.2;
let releaseTime = 0.5;
let attackControl = document.querySelector('#Attack');
let releaseControl = document.querySelector('#Release');
let sustain = 1;  //add eventlistener delete comment
let oscillatorOneWaveShape = "sawtooth";  //add eventlistener delete comment might delete whole line
let detune = 0;


//CREATE FX NODES

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



// EVENT LISTENERS
  attackControl.addEventListener('input', function() {
      attackTime = Number(this.value);
  }, false);
  

  releaseControl.addEventListener('input', function() {
      releaseTime = Number(this.value);
  }, false);


  let adsrEnvelope = globalAudioContext.createGain();
  let osc1 = globalAudioContext.createOscillator();

  keys.forEach(({ name, frequency }) => {
    const noteButton = document.createElement("button");
    noteButton.innerText = name;
    noteButton.className = "key__div key-black__div";
    noteButton.addEventListener("click", () => {
      const now = globalAudioContext.currentTime;

       osc1 = globalAudioContext.createOscillator();
       adsrEnvelope = globalAudioContext.createGain();

      adsrEnvelope.gain.cancelScheduledValues(now);
      adsrEnvelope.gain.setValueAtTime(0, now);
      //attack
      adsrEnvelope.gain.linearRampToValueAtTime(1, now + attackTime);
      //release
      adsrEnvelope.gain.linearRampToValueAtTime(0, now + sustain - releaseTime);

      osc1.type = "triangle";
      osc1.frequency.value = frequency; 
     
     


      const lfo = globalAudioContext.createOscillator();
      lfo.type = 'square';
      lfo.frequency.value = 1;

      let pulseTime = 1;
      // lfo.connect(adsrEnvelope.gain.setValueAtTime(0, now));
      // lfo.start();
      // osc.stop(time + pulseTime);

      osc1.connect(adsrEnvelope).connect(globalAudioContext.destination);
      osc1.start(now);
      osc1.stop(now + 1);


    });
    document.getElementById('newKeyboard').appendChild(noteButton)
    // document.body.appendChild(noteButton);
  });

  document.getElementById('stopIt').addEventListener('click',stopOsc)

  function stopOsc(){
    osc1.stop(now);
    adsrEnvelope.cancelScheduledValues(now);

  } 