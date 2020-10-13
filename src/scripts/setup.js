import { startListening } from "../index";
import { soundArr, clearArr } from "./sketch";
import { colorArr, moveBubble, bubbleLoop } from "./bubbleMaker";

const welcome = "Welcome to Siren Song. Click below to access the microphone";
const lowSound = "Great! Now give us your lowest guttural bellow";
const highSound = "Not bad! How about the highest angelic note you can muster";
const readyString = "Okay Siren, sink those sailors and don't let too many get away!"

var text = null;
var parent = null;
var frontCloud = null;
var buttonHolder = null;
var setupLoopInterval = null;
let makingBubble=false;
let phase = 1;
let currentBubble;
let currentPitchArr = [];
let splashPos = 0;
export var lowNote = 0;
export var highNote = 100;
let done = false;
const arrAvg = arr => arr.reduce((a, b) => a + b, 0) / arr.length;

document.addEventListener("DOMContentLoaded", () => {
  text = document.getElementById("module-text");
  parent = document.getElementById("dropHolder");
  frontCloud = document.getElementById("cloudFront");
  buttonHolder = document.getElementById("button-holder");

  text.innerHTML = welcome;

  document.getElementById("button-holder").onclick = function addMic() {
    if (phase === 1){
      lowListenMode();
      startListening();
      setupLoop();
    } else if (phase === 2) {
      buttonHolder.classList.add("hidden");
      lowNote = splashPos;
      done = true;
      currentPitchArr = [];
    } else if (phase === 3){
      if (lowNote < highNote){
        highNote = splashPos;
        done = true;
        currentPitchArr = [];
      }
    } else if (phase === 4){
      startGame();
    }
  }

});

function lowListenMode(){
  phase = 2;
  text.innerHTML = lowSound;
  let doneEle = document.createElement("h1");
  doneEle.innerHTML = "DONE";
  doneEle.className = "button-text";
  buttonHolder.innerHTML = "";
  buttonHolder.append(doneEle);
  buttonHolder.classList.add("hidden");
}

function highListenMode(){
  phase = 3;
  text.innerHTML = highSound;
  buttonHolder.classList.add("hidden");
}

function readyMode(){
  phase = 4;
  text.innerHTML = readyString;
  let readyEle = document.createElement("h1");
  readyEle.innerHTML = "READY";
  readyEle.className = "button-text";
  buttonHolder.innerHTML = "";
  buttonHolder.append(readyEle);
  buttonHolder.style.paddingLeft = "0px";
}

function startGame(){
  document.getElementById("module-icon").innerHTML = "";
  clearInterval(setupLoopInterval);
  document.getElementById("health-bar-container").classList.remove("hidden");
  document.getElementById("sailor-score").classList.remove("hidden");
  bubbleLoop();
}

function setupLoop() {

    setupLoopInterval = setInterval(function () {
        let soundSize = soundArr.length;
        if (!makingBubble && soundSize >= 2) {
            buttonHolder.classList.remove("hidden");
            done = false;
            makingBubble = true;
            currentBubble = document.createElement("DIV");
            let pitch = (arrAvg(soundArr))-50;
            currentPitchArr.push(pitch);
            let colorReturn = getBubbleSetup(pitch);
            currentBubble.style.backgroundColor = colorReturn[0];
            splashPos = colorReturn[2];
            currentBubble.className = "bubble wiggle";
            currentBubble.style.left = "50%";
            currentBubble.style.width = "50px";
            currentBubble.style.height = "50px";
            currentBubble.style.marginTop = "-60px";
            parent.insertBefore(currentBubble, frontCloud);
        } else if (makingBubble && !done) {
            if (soundArr.length> 1) {
                let newPitch = (arrAvg(soundArr));
                currentPitchArr.push(newPitch);
                if (currentPitchArr.length > 6){
                  currentPitchArr.shift();
                }
                let avgPitch = arrAvg(currentPitchArr)-50;
                let newColorReturn = getBubbleSetup(avgPitch);
                currentBubble.style.marginTop = "60px";
                currentBubble.style.backgroundColor = newColorReturn[0];
                currentBubble.style.left = newColorReturn[1];
                splashPos = newColorReturn[2];
            }
        } else if (done && makingBubble){
          setTimeout(function () {
            $(".water-container").raindrops("splash", splashPos, 500);
            if (phase===2){
              highListenMode();
            } else if (phase === 3){
              readyMode();
            }
          }, 1350);
           
            makingBubble = false;
            moveBubble(currentBubble, parent);
        }
        clearArr();
    }, 400);

};

function getBubbleSetup(pitch) {
  
    function clamp(num, min, max) {
      return num <= min ? min : num >= max ? max : num;
    }

    let newPitch = Math.round((clamp(Math.ceil(pitch), 0, 400))/4);
    let pitchStr = newPitch.toString() + "%";
    if (newPitch < 20) {
        return [colorArr[0], pitchStr, newPitch];
    } else if (newPitch >= 20 && newPitch < 40) {
        return [colorArr[1], pitchStr, newPitch];
    } else if (newPitch >= 40 && newPitch < 60) {
        return [colorArr[2], pitchStr, newPitch];
    } else if (newPitch >= 60 && newPitch < 80) {
        return [colorArr[3], pitchStr, newPitch];
    } else {
        return [colorArr[4], pitchStr, newPitch];
    }
}

export function gameOver(){
  console.log("game over");
}