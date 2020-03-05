import './styles/index.scss';
import { sketch, soundArr, clearArr } from "./scripts/sketch";
import {moveBubble, getBubbleColor} from "./scripts/bubbleMaker"

let makingBubble = false;
let bubbleSize = 25;
let marginTop = 8.0;
let currentBubble;
let currentPitchArr = [];
const arrAvg = arr => arr.reduce((a, b) => a + b, 0) / arr.length;

document.addEventListener("DOMContentLoaded", () => {
  const containerElement = document.getElementById("p5-container");
  let parent = document.getElementById("background");

  function startListening() {
    new p5(sketch, containerElement);
  }

  startListening();

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
        currentBubble.className = "bubble wiggle";
        parent.appendChild(currentBubble);
      } else if (makingBubble && soundSize > 0) {
        let newPitch = (arrAvg(soundArr) - 120) * .0042;
        currentPitchArr.push(newPitch);
        let avgPitch = arrAvg(currentPitchArr);
        let newColorReturn = getBubbleColor(avgPitch);
        currentBubble.style.backgroundColor = newColorReturn[0];
        currentBubble.style.right = newColorReturn[1];
        bubbleSize += 5;
        marginTop += .75;
        currentBubble.style.height = `${bubbleSize}px`;
        currentBubble.style.width = `${bubbleSize}px`;
        currentBubble.style.marginTop = `${marginTop}px`;
      } else if (makingBubble && soundSize < 1) {
        currentPitchArr = [];
        makingBubble = false;
        bubbleSize = 50;
        marginTop = 12.0;
        moveBubble(currentBubble, parent);
      }
      clearArr();
  }, 200);

  window.requestAnimationFrame(step);

});


