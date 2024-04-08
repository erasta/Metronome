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
    // Round method thathis.timeIntervalt takes care of running the callback and adjusting the time
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

const volDrums=document.getElementById('volDrums');
const volDrone=document.getElementById('volDrone');

let bpm = 108;
let isRunning = false;
let speedup=0;
let exer=false;
let exerCount=0;

let TS=1;
let TScount=0;
let TS_note=2; // 2 = quarter  3= dotted quarter  1 = eighth  4 = half






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

volDrums.addEventListener('input', () => {

    for(var i in drums) {
        drums[i].volume=volDrums.value
    }
});

volDrone.addEventListener('input', () => {
    for(var i in drones) {
        drones[i].volume=volDrone.value
    }
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
    metronome.timeInterval = 60000 / (bpm * TS_note) * timeSignatures[TS][1];
}

function validateTempo() {
    colorBpm(bpm);
    if (bpm <= 20) { return };
    if (bpm >= 280) { return };
}

function playClick() {
    //click2.currentTime = 0;
    //click2.play();
  


    let d=timeSignatures[TS][2][TScount];
    if (d!=0) {
        drums[d].currentTime=0;
        drums[d].play();
    }
    d=timeSignatures[TS][3][TScount];
    if (d!=0) {
        drums[d].currentTime=0;
        drums[d].play();
    }
    

    TScount+=1;
    if (TScount==timeSignatures[TS][0]) { TScount=0;} ;

    
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
            bpm+=2;
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

    for(let i=0;i<12;i++) {
        if (i!=n) 
            document.getElementById('d'+i.toString()).style.background = "#478566";
        else 
            document.getElementById('d'+i.toString()).style.background = "#ff656c";

    }


}

function TSN(x) {
    TS_note=x;
    updateMetronome();
    for(let i=1;i<=4;i++) {
        if (i!=x) 
            document.getElementById('v'+i.toString()).style.background = "#294766";
        else 
            document.getElementById('v'+i.toString()).style.background = "#ff656c";

    }
    document.getElementById('qqqq').src="notes\\VW"+TS_note.toString()+".png";
    
}


function setTS(x) {
    TS=x;
    TScount=0;
    updateMetronome();
    for(let i=0;i<=22;i++) {
        if (i!=x) 
            document.getElementById('ts'+i.toString()).style.background = "#b3c4d6";
        else 
            document.getElementById('ts'+i.toString()).style.background = "#ff656c"; 
        //"#"; bcd

    }
}

function bp(x,play=true) {
    bpm=x;
    speedup=0;
    exer=false;
    validateTempo();
    updateMetronome();
    if ((!isRunning)&&(play)) {
        metronome.start();
        isRunning = true;
        startStopBtn.textContent = 'STOP';
    }
    
}

function colorBpm(x) {
    for(let i=0;i<24;i++) {
        if (x==bpmList[i]) 
            document.getElementById('b'+i.toString()).style.background = "#ff656c";
        else
            document.getElementById('b'+i.toString()).style.background = "#476685";
        
    }
}

function stopDrone() {
    for (let i = 0; i < drones.length; i++) {
        drones[i].pause();
        drones[i].currentTime = 0;
    }
    for(let i=0;i<12;i++) {
        document.getElementById('d'+i.toString()).style.background = "#478566";
        document.getElementById('d'+i.toString()).style.backgroundhover = "#000";
    }
}
        
    
function speedup1(x) {
    speedup=x;
    exer=false;
}

function exercise() {
    exer=true;
    exerCount=8;
    speedup=0;
   
}

bpmList=[60,72,80,84,88,92,96,100,104,108,112,116,120,124,128,132,136,144,160,176,192,200,208,216]
const timeSignatures=[ 
    // len,div (1=eights 2=quarters) ,array1, array2
    [4,1,[1,0,2,0],[4,4,4,4]],                  //0
    [2,2,[1,2],[0,0]],                          //1
    [6,1,[1,0,2,0,3,0],[4,4,4,4,4,4]],          //2
    [3,2,[1,2,3],[0,0,0]],                      //3
    [8,1,[1,0,3,0,2,0,3,0],[4,4,4,4,4,4,4,4]],  //4
    [4,2,[1,3,2,3],[0,0,0,0]],                  //5  
    [6,1,[1,0,0,2,0,0],[4,4,4,4,4,4]],          //6
    [2,3,[1,2],[0,0]],                          //7
    [8,1,[1,0,0,2,0,0,3,0],[4,4,4,4,4,4,4,4]],  //8
    [8,1,[1,0,0,2,0,0,3,0],[0,0,0,0,0,0,0,0]],  //9
    [9,1,[1,0,0,2,0,0,3,0,0],[4,4,4,4,4,4,4,4,4]],      //10
    [3,3,[1,2,3],[0,0,0]],                           //11
    [7,1,[1,0,3,0,2,0,3],[4,4,4,4,4,4,4]],      //12
    [7,1,[1,0,3,0,2,0,3],[0,0,0,0,0,0,0]],                   //13
    [7,1,[1,0,3,2,0,3,0],[4,4,4,4,4,4,4]],      //14
    [7,1,[1,0,3,2,0,3,0],[0,0,0,0,0,0,0]],      //15
    [11,1,[1,0,3,0,2,0,3,2,0,3,0],[4,4,4,4,4,4,4,4,4,4,4]],     //16
    [11,1,[1,0,3,0,2,0,3,2,0,3,0],[0,0,0,0,0,0,0,0,0,0,0]],                          //17
    [15,1,[1,0,3,0,2,0,3,0,2,0,3,2,0,3,0],[4,4,4,4,4,4,4,4,4,4,4,4,4,4,4]],   //18
    [15,1,[1,0,3,0,2,0,3,0,2,0,3,2,0,3,0],[4,0,4,0,4,0,4,0,4,0,4,4,0,4,0]],   //19
    [9,1,[1,0,2,0,3,0,2,0,3],[4,4,4,4,4,4,4,4,4]],      //20
    [9,1,[1,0,2,0,3,0,2,0,3],[0,0,0,0,0,0,0,0,0]],                       //21
    [1,2,[1],[0]],                                       //22

]


const metronome = new Timer1(playClick, 60000 / bpm, { immediate: true });
const drums = [new Audio('drums\\0.mp3'),new Audio('drums\\1.mp3'),new Audio('drums\\2.mp3'),new Audio('drums\\3.mp3'),new Audio('drums\\4.mp3')]
const drones = [new Audio('drones\\C.mp3'),new Audio('drones\\Cis.mp3'),new Audio('drones\\D.mp3'),new Audio('drones\\Dis.mp3'),
    new Audio('drones\\E.mp3'),new Audio('drones\\F.mp3'),new Audio('drones\\Fis.mp3'),new Audio('drones\\G.mp3'),
    new Audio('drones\\Gis.mp3'),new Audio('drones\\A.mp3'),new Audio('drones\\B.mp3'),new Audio('drones\\H.mp3')];

setTS(5);
TSN(2);
bp(108,false);