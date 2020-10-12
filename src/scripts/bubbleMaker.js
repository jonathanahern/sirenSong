import { soundArr, clearArr } from "./sketch";
import { boatTimer, boatArr } from "./boats";
import { hitWater } from "../index";

const colorArr = [
    "rgb(9,81,149)",
    "rgb(76,148,75)",
    "rgb(142,214,0)",
    "rgb(199,220,15)",
    "rgb(255,225,30)"
];
let parent = null;
let frontCloud = null;
let scoreText = null;
let makingBubble = false;
let bubbleBuffer = true;
let emptyCount = 0;
let splashSize = 25;
let bubbleSize = 25;
let marginTop = 35.0;
let waveHeight = 100;
let currentBubble;
let currentPitchArr = [];
let splashPos = 0;
let splashPosArr = [];
let splashWaveArr = [];
const arrAvg = arr => arr.reduce((a, b) => a + b, 0) / arr.length;

document.addEventListener("DOMContentLoaded", () => {
  parent = document.getElementById("dropHolder");
  frontCloud = document.getElementById("cloudFront");
  scoreText = document.getElementById("sailor-score-text");
});

export const bubbleLoop = () => {

    setInterval(function () {
        let soundSize = soundArr.length;
        if (soundSize < 2){
            emptyCount +=1;
        } else {
            emptyCount = 0;
        }
        if (!makingBubble && bubbleBuffer && soundSize > 2) {
            makingBubble = true;
            bubbleBuffer = false;
            currentBubble = document.createElement("DIV");
            let pitch = (arrAvg(soundArr) - 120) * .0042;
            currentPitchArr.push(pitch);
            let colorReturn = getBubbleColor(pitch);
            currentBubble.style.backgroundColor = colorReturn[0];
            splashPos = colorReturn[2];
            currentBubble.className = "bubble wiggle";
            parent.insertBefore(currentBubble, frontCloud);
            currentBubble.style.left = colorReturn[1];
        } else if (makingBubble && emptyCount < 2 && waveHeight < 800) {
            if (soundArr.length> 1) {
                let newPitch = (arrAvg(soundArr) - 120) * 0.0042;
                currentPitchArr.push(newPitch);
                let avgPitch = arrAvg(currentPitchArr);
                let newColorReturn = getBubbleColor(avgPitch);
                currentBubble.style.backgroundColor = newColorReturn[0];
                currentBubble.style.left = newColorReturn[1];
                splashPos = newColorReturn[2];
            }
            bubbleSize += 3;
            marginTop += 3;
            waveHeight += 25;
            currentBubble.style.height = `${bubbleSize}px`;
            currentBubble.style.width = `${bubbleSize}px`;
            currentBubble.style.marginTop = `${marginTop}px`;
        } else if ((makingBubble && emptyCount > 1) || waveHeight >= 775) {
            setTimeout(function () {
                splash(splashPosArr[0], splashWaveArr[0]);
                bubbleBuffer = true;
            }, 1350);
            currentPitchArr = [];
            makingBubble = false;
            splashSize = bubbleSize;
            bubbleSize = 25;
            marginTop = 35;
            moveBubble(currentBubble, parent);
            splashPosArr.push(splashPos);
            splashWaveArr.push(waveHeight);
            waveHeight = 100;
            emptyCount = 0;
        }
        clearArr();
        boatTimer();
    }, 400);

};

const moveBubble = (bubble, parent) => {
    var pos = 0;
    bubble.className = "bubble fall"
    function step() {
        if (pos > 400) {
            parent.removeChild(bubble);
        } else {
            pos += 4;
            // bubble.style.top = pos + "px";
            window.requestAnimationFrame(step);
        }
    }
    window.requestAnimationFrame(step);
}

const getBubbleColor = (pitch) => {
    function clamp(num, min, max) {
      return num <= min ? min : num >= max ? max : num;
    }

    let newPitch = Math.round(clamp(pitch.toFixed(2), .05, .95) * 100);
    let pitchStr = newPitch.toString() + "%";
    if (pitch < .2) {
        return [colorArr[0], pitchStr, newPitch];
    } else if (pitch >= .2 && pitch < .4) {
        return [colorArr[1], pitchStr, newPitch];
    } else if (pitch >= .4 && pitch < .6) {
        return [colorArr[2], pitchStr, newPitch];
    } else if (pitch >= .6 && pitch < .8) {
        return [colorArr[3], pitchStr, newPitch];
    } else {
        return [colorArr[4], pitchStr, newPitch];
    }
}

function splash(pos, wave) {
    // console.log("pos",pos);
    // console.log("Wave",wave);
    splashPosArr.shift();
    splashWaveArr.shift();
    let boatsToRemove = [];
    const dropSize = Math.ceil(wave / 200) + 1; 
    const adjPos = pos-4;
    for (let i = 0; i < boatArr.length; i++) {
        const boatPos = boatArr[i]["boatPos"];
        const boatSize = boatArr[i]["pointVal"]*1.25;
        if (Math.abs(adjPos - boatPos)-(boatSize+dropSize) <= 2 && boatArr[i]["health"] > 0) {
          boatsToRemove.push(i);
          hitBoat(boatArr[i], wave);
        }   
    }

    if(boatsToRemove.length < 1){
        $(".water-container").raindrops("splash", pos, wave);
    } 

}

function hitBoat(boatData, wave){
    let ele = boatData["boatEle"];
    let health = boatData["health"];
    const dropSize = Math.ceil(wave/200)+1;
    let sailorContainer = ele.getElementsByClassName("sailor-container")[0];
    let iterationCount = (dropSize > health) ? health : dropSize;
    const pointVal = boatData["pointVal"];
    let startVal = (health < pointVal) ? (pointVal-health) : 0;
    
    for (let i = 0; i < iterationCount; i++) {
        sailorContainer.childNodes[i + startVal].firstChild.classList.add(`dead-sailor`);
    }
    let newHealth = health - dropSize;
    if (newHealth < 0) {
        newHealth = 0;
    }
    boatData["health"] = newHealth;
    if (newHealth === 0) {
        sinkBoat(boatData);
    }
}

function sinkBoat(boatData) {
  let ele = boatData["boatEle"];
  
    setTimeout(function () {
        ele.className = "boat-part-holder sunkBoat";
        const newScore = parseInt(scoreText.innerHTML) + boatData["pointVal"];
        scoreText.innerHTML = newScore;
        if(newScore.toString().length > 1){
            scoreText.style.left = "5px";
        }
    }, 400);

    setTimeout(function () {
        ele.remove();
    }, 2200);
}
