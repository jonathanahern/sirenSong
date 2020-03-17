import './styles/square.scss';
import './styles/index.scss';
import "./scripts/raindrops";
import { sketch, soundArr, clearArr } from "./scripts/sketch";
import {moveBubble, getBubbleColor} from "./scripts/bubbleMaker";

let makingBubble = false;
let bubbleSize = 25;
let marginTop = 10.0;
let waveHeight = 100;
let currentBubble;
let currentPitchArr = [];
let splashPos = 0;
let splashPosArr = [];
let splashWaveArr = [];
const arrAvg = arr => arr.reduce((a, b) => a + b, 0) / arr.length;

document.addEventListener("DOMContentLoaded", () => {

  console.log('DOM fully loaded and parsed');
  createEventListeners();
  const containerElement = document.getElementById("p5-container");
  let parent = document.getElementById("dropHolder");

  function startListening() {
    console.log('listen');
    new p5(sketch, containerElement);
  }

  startListening();

  jQuery(".water-container").raindrops({
    color: "#0bd"
  });

  function splash(pos, wave) {
    $(".water-container").raindrops("splash", pos, wave);
    splashPosArr.shift();
    splashWaveArr.shift();
  }

  setInterval(function () {
      let soundSize = soundArr.length;
      if (!makingBubble && soundSize > 0) {
        makingBubble = true;
        currentBubble = document.createElement("DIV");
        let pitch = (arrAvg(soundArr)-120) * .0042;
        currentPitchArr.push(pitch);
        let colorReturn = getBubbleColor(pitch);
        currentBubble.style.backgroundColor = colorReturn[0];
        currentBubble.style.right = colorReturn[1];
        splashPos = colorReturn[2];
        currentBubble.className = "bubble wiggle";
        parent.appendChild(currentBubble);
      } else if (makingBubble && soundSize > 0 && waveHeight < 800) {
        let newPitch = (arrAvg(soundArr) - 120) * .0042;
        currentPitchArr.push(newPitch);
        let avgPitch = arrAvg(currentPitchArr);
        let newColorReturn = getBubbleColor(avgPitch);
        currentBubble.style.backgroundColor = newColorReturn[0];
        currentBubble.style.right = newColorReturn[1];
        splashPos = newColorReturn[2];
        bubbleSize += 3;
        marginTop += .75;
        waveHeight += 25;
        currentBubble.style.height = `${bubbleSize}px`;
        currentBubble.style.width = `${bubbleSize}px`;
        currentBubble.style.marginTop = `${marginTop}px`;
      } else if ((makingBubble && soundSize < 1) || waveHeight >= 775) {
        currentPitchArr = [];
        makingBubble = false;
        bubbleSize = 25;
        marginTop = 10.0;
        moveBubble(currentBubble, parent);
        splashPosArr.push(splashPos);
        splashWaveArr.push(waveHeight);
        waveHeight = 100;
        setTimeout(function () { splash(splashPosArr[0], splashWaveArr[0]); },1400);
      }
      clearArr();
  }, 200);

});

function createEventListeners(){

  document.getElementById("primary-sq").addEventListener("click", startDate);

  function startDate() {
    document.getElementById("primary-sq").innerHTML = "clicked";
  }
}