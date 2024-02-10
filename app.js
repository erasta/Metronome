function Timer1(callback, timeInterval, options) {
    this.timeInterval = timeInterval;
    
    // Add method to start timer
    this.start = () => {
      // Set the expected time. The moment in time we start the timer plus whatever the time interval is. 
      this.expected = Date.now() + this.timeInterval;
      // Start the timeout and save the id in a property, so we can cancel it later
      this.theTimeout = null;
      
      if (options.immediate) {
        callback();
      } 
      
      this.timeout = setTimeout(this.round, this.timeInterval);
      console.log('Timer Started');
    }
    // Add method to stop timer
    this.stop = () => {
  
      clearTimeout(this.timeout);
      console.log('Timer Stopped');
    }
    // Round method that takes care of running the callback and adjusting the time
    this.round = () => {
      //console.log('timeout', this.timeout);
      // The drift will be the current moment in time for this round minus the expected time..
      let drift = Date.now() - this.expected;
      // Run error callback if drift is greater than time interval, and if the callback is provided
      if (drift > this.timeInterval) {
        // If error callback is provided
        if (options.errorCallback) {
          options.errorCallback();
        }
      }
      callback();
      // Increment expected time by time interval for every round after running the callback function.
      this.expected += this.timeInterval;
      //console.log('Drift:', drift);
      //console.log('Next round time interval:', this.timeInterval - drift);
      // Run timeout again and set the timeInterval of the next iteration to the original time interval minus the drift.
      this.timeout = setTimeout(this.round, this.timeInterval - drift);
    }
  }

const tempoDisplay = document.querySelector('.tempo');

const decreaseTempoBtn = document.querySelector('.decrease-tempo');
const increaseTempoBtn = document.querySelector('.increase-tempo');
const tempoSlider = document.querySelector('.slider');
const startStopBtn = document.querySelector('.start-stop');

const click2 =  new Audio('click2.mp3');




let bpm = 150;
let isRunning = false;
let speedup=0;
let exer=false;
let exerCount=0;
let exerNext=4;


decreaseTempoBtn.addEventListener('click', () => {
    if (bpm <= 20) { return };
    bpm--;
    speedup=0;
    validateTempo();
    updateMetronome();
    
});
increaseTempoBtn.addEventListener('click', () => {
    if (bpm >= 280) { return };
    bpm++;
    speedup=0;
    exer=false;
    validateTempo();
    updateMetronome();
});

tempoSlider.addEventListener('input', () => {
    bpm = tempoSlider.value;
    speedup=0;
    exer=false;
    validateTempo();
    updateMetronome();
});

startStopBtn.addEventListener('click', () => {
    if (!isRunning) {
        speedup=0;
        exer=false;
        metronome.start();
        isRunning = true;
        startStopBtn.textContent = 'STOP';
        
    } else {
        metronome.stop();
        speedup=0;
        exer=false;
        isRunning = false;
        startStopBtn.textContent = 'START';
        
    }
});

function updateMetronome() {
    tempoDisplay.textContent = bpm;
    tempoSlider.value = bpm;
    metronome.timeInterval = 60000 / bpm;
}

function validateTempo() {
    if (bpm <= 20) { return };
    if (bpm >= 280) { return };
}

function playClick() {
    click2.play();
    click2.currentTime = 0;
    if (speedup!=0) {
        if (bpm>=280) {return};
        if (bpm<=20) {return};
        bpm+=speedup;
        validateTempo();
        updateMetronome();
    }
    if (exer) {
        if (bpm>=280) {return};
        if (bpm<=20) {return};
        if (exerCount<=0) {
            exerCount=8;
            bpm+=exerNext;
            exerNext=2-exerNext;
            validateTempo();
            updateMetronome();
        }
            
        exerCount--;


    }
}

function playDrone(n) {
    stopDrone();
    drones[n].loop=true;
    drones[n].play();
    //drones.currentTime = 0;
}

function bp(x) {
    bpm=x;
    speedup=0;
    exer=false;
    validateTempo();
    updateMetronome();
    if (!isRunning) {
        metronome.start();
        isRunning = true;
        startStopBtn.textContent = 'STOP';
    }
}

function stopDrone() {
    for (let i = 0; i < drones.length; i++) {
        drones[i].pause();
        drones[i].currentTime = 0;
    }
}
    
function speedup1(x) {
    speedup=x;
}

function exercise() {
    exer=true;
    exerCount=8;
    exerNext=4;
}

const metronome = new Timer1(playClick, 60000 / bpm, { immediate: true });
const drones = [new Audio('drones\\C.mp3'),new Audio('drones\\Cis.mp3'),new Audio('drones\\D.mp3'),new Audio('drones\\Dis.mp3'),new Audio('drones\\E.mp3'),new Audio('drones\\F2.mp3'),new Audio('drones\\Fis.mp3'),new Audio('drones\\G.mp3'),new Audio('drones\\Gis.mp3'),new Audio('drones\\A.mp3'),new Audio('drones\\B.mp3'),new Audio('drones\\H.mp3')];