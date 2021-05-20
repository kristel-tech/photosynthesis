
const context = new AudioContext();
let startButton = document.getElementById("btnPlay");
let stopButton = document.getElementById("btnStop");
let pressedKey = document.getElementById("keypressed");
var oscillator1;
var oscillator2;
var oscillator3;




function playNote(noteFrequency){
    console.log(noteFrequency);
    oscillator1 = context.createOscillator();
    oscillator2 = context.createOscillator();
    oscillator3 = context.createOscillator();
    
    gainNode1 = context.createGain();
    gainNode2 = context.createGain();
    gainNode3 = context.createGain();
    
    
    oscillator1.type = "sawtooth";
    oscillator1.frequency.value = noteFrequency; 
    oscillator1.connect(context.destination);
    gainNode1.connect(context.destination);
    gainNode2.gain.value = 0.5; 
    
    oscillator2.type = "square"; 
    oscillator2.frequency.value = 444; 
    oscillator2.connect(gainNode2); 
    gainNode2.connect(context.destination); 
    gainNode2.gain.value = 0.3; 
     
    
    oscillator3.type = "triangle"; 
    oscillator3.frequency.value = 50;
    oscillator3.connect(gainNode3); 
    gainNode3.connect(context.destination); 
    gainNode3.gain.value = 0.4;       
    oscillator1.start(0);
    oscillator1.stop(0.2);   
}

function noteOn() {
    console.log("on");
    oscillator1.start(0); 
    // oscillator2.start(1);
    // oscillator3.start(1); 
}


function noteOff() {
    console.log("off");
    oscillator1.stop(1); 
    // oscillator2.stop();
    // oscillator3.stop(); 
}

/////////////////////

// ADSR CLASS





// stopButton.addEventListener("mouseup", function (e) {
//     noteOff();
// });

// document.addEventListener("keydown", function(e){
//     console.log(e);
//     switch (e.key) {
//          case 81: // Q
//             noteOn();
//          break;
//          case 87: // W
//             noteOff();
//          break;
//     }
// });

// document.addEventListener('keydown', makesound);
startButton.addEventListener('click',makesound)
stopButton.addEventListener('click',makesound)

// document.addEventListener('keyup', stopMakingSound);



function makesound(e) {
    // console.log(e.target.dataset.note); 
    var freq = e.target.dataset.frequency;
    var note = e.target.dataset.note;
    switch (note) {
                 case 'A4': // Q
                    playNote(freq);
                 break;
                 case 'C4': // W
                    playNote(freq);
                 break;
            }
  pressedKey.innerHTML = e.key;
}

function stopMakingSound(e){
pressedKey.innerHTML = e.key;
}
