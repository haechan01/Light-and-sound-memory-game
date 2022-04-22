// global constants

const cluePauseTime = 333; //how long to pause in between clues
const nextClueWaitTime = 1000; //how long to wait before starting playback of the clue sequence

//Global Variables
var progress = 0; 
var gamePlaying = false;
var volume = 0.5;
var tonePlaying = false;
var guessCounter = 0;
var clueHoldTime = 1000; //how long to hold each clue's light/sound
var rdPattern =Array.from({length: 8}, () => Math.floor(Math.random() * 6)+1);

function startGame(){
    //initialize game variables
    progress = 0;
    gamePlaying = true;
    // swap the Start and Stop buttons
    document.getElementById("startBtn").classList.add("hidden");
    document.getElementById("stopBtn").classList.remove("hidden");
    playRandomClue();

}
function playRandomClue(){
  guessCounter = 0;
  clueHoldTime = 1000;
  let delay = nextClueWaitTime; //set delay to initial wait time
  rdPattern =Array.from({length: 8}, () => Math.floor(Math.random() * 6)+1);
  for(let i=0;i<=progress;i++){ // for each clue that is revealed so far
    console.log("play single clue: " + rdPattern[i] + " in " + delay + "ms")
    setTimeout(playSingleClue,delay,rdPattern[i]) // set a timeout to play that clue
    clueHoldTime -=100
    delay += clueHoldTime;
    delay += cluePauseTime;
  }
}

function stopGame(){
    //end the game
    gamePlaying = false;
    // swap the Start and Stop buttons
    document.getElementById("startBtn").classList.remove("hidden");
    document.getElementById("stopBtn").classList.add("hidden");

}

// Sound Synthesis Functions
const freqMap = {
  1: 261.6,
  2: 329.6,
  3: 392,
  4: 466.2,
  5: 510,
  6: 580
}
function playTone(btn,len){ 
  o.frequency.value = freqMap[btn]
  g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
  context.resume()
  tonePlaying = true
  setTimeout(function(){
    stopTone()
  },len)
}
function startTone(btn){
  if(!tonePlaying){
    context.resume()
    o.frequency.value = freqMap[btn]
    g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
    context.resume()
    tonePlaying = true
  }
}
function stopTone(){
  g.gain.setTargetAtTime(0,context.currentTime + 0.05,0.025)
  tonePlaying = false
}

// Page Initialization
// Init Sound Synthesizer
var AudioContext = window.AudioContext || window.webkitAudioContext 
var context = new AudioContext()
var o = context.createOscillator()
var g = context.createGain()
g.connect(context.destination)
g.gain.setValueAtTime(0,context.currentTime)
o.connect(g)
o.start(0)

function lightButton(btn){
  document.getElementById("button"+btn).classList.add("lit")
}
function clearButton(btn){
  document.getElementById("button"+btn).classList.remove("lit")
}

function playSingleClue(btn){
  if(gamePlaying){
    lightButton(btn);
    playTone(btn,clueHoldTime);
    setTimeout(clearButton,clueHoldTime,btn);
  }
}

function playClueSequence(){
  guessCounter = 0;
  clueHoldTime = 1000;
  let delay = nextClueWaitTime; //set delay to initial wait time
  for(let i=0;i<=progress;i++){ // for each clue that is revealed so far
    console.log("play single clue: " + rdPattern[i] + " in " + delay + "ms")
    setTimeout(playSingleClue,delay,rdPattern[i]) // set a timeout to play that clue
    clueHoldTime -=100
    delay += clueHoldTime;
    delay += cluePauseTime;
  }
}

function loseGame(){
  stopGame();
  alert("Game Over. You lost.");
}

function winGame(){
  stopGame();
  alert("Game Over. You won!");
}

function guess(btn){
  console.log("user guessed: " + btn);
  if(!gamePlaying){
    return;
  }
  
  // add game logic here
  if (btn==rdPattern[guessCounter]){
    if (guessCounter == progress){
      if (progress == rdPattern.length -1){
        winGame();
      } else{
        progress++;
        playRandomClue();
      }
    }else{
      guessCounter++;
    }
  } else{
    loseGame();
  }
}
