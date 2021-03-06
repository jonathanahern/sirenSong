import { soundArr, clearArr } from "./sketch";
import { boatTimer, boatArr, gameOverBool, startBoatAgain} from "./boats";
import { lowNote, highNote,  } from "./setup";


export const colorArr = [
    "rgb(9,81,149)",
    "rgb(76,148,75)",
    "rgb(142,214,0)",
    "rgb(199,220,15)",
    "rgb(255,225,30)"
];
let parent = null;
let frontCloud = null;
export var scoreText = "0";
let makingBubble = false;
let bubbleBuffer = true;
let emptyCount = 0;
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
        if (!makingBubble && bubbleBuffer && soundSize > 2 && !gameOverBool) {
            makingBubble = true;
            bubbleBuffer = false;
            currentBubble = document.createElement("DIV");
            let pitch = arrAvg(soundArr) - 50;
            currentPitchArr.push(pitch);
            let colorReturn = getBubbleColor(pitch);
            currentBubble.style.backgroundColor = colorReturn[0];
            splashPos = colorReturn[2];
            currentBubble.className = "bubble wiggle";
            parent.insertBefore(currentBubble, frontCloud);
            currentBubble.style.left = colorReturn[1];
        } else if (makingBubble && emptyCount < 2 && waveHeight < 800) {
            if (soundArr.length> 1) {
                let newPitch = arrAvg(soundArr) - 50 ;
                currentPitchArr.push(newPitch);
                let avgPitch = arrAvg(currentPitchArr);
                let newColorReturn = getBubbleColor(avgPitch);
                currentBubble.style.backgroundColor = newColorReturn[0];
                currentBubble.style.left = newColorReturn[1];
                splashPos = newColorReturn[2];
            }
            bubbleSize += 5;
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

export const moveBubble = (bubble, parent) => {
    var pos = 0;
    bubble.className = "bubble fall"
    function step() {
        if (pos > 400) {
            parent.removeChild(bubble);
        } else {
            pos += 4;
            window.requestAnimationFrame(step);
        }
    }
    window.requestAnimationFrame(step);
}

export const getBubbleColor = (pitch) => {

    function clamp(num, min, max) {
      return num <= min ? min : num >= max ? max : num;
    }

    let newPitch = Math.round((clamp(Math.ceil(pitch), 0, 400))/4);
    newPitch -= lowNote;
    let adjPitch = Math.round(clamp((newPitch/(highNote-lowNote)).toFixed(2), .05, .95) * 100);
    let pitchStr = adjPitch.toString() + "%";
    if (adjPitch < 20) {
        return [colorArr[0], pitchStr, adjPitch];
    } else if (adjPitch >= 20 && adjPitch < 40) {
        return [colorArr[1], pitchStr, adjPitch];
    } else if (adjPitch >= 40 && adjPitch < 60) {
        return [colorArr[2], pitchStr, adjPitch];
    } else if (adjPitch >= 60 && adjPitch < 80) {
        return [colorArr[3], pitchStr, adjPitch];
    } else {
        return [colorArr[4], pitchStr, adjPitch];
    }
}

function splash(pos, wave) {
    splashPosArr.shift();
    splashWaveArr.shift();
    let boatsToRemove = [];
    const dropSize = Math.ceil(wave / 200) + 2; 
    const adjPos = pos-4;
    for (let i = 0; i < boatArr.length; i++) {
        const boatPos = boatArr[i]["boatPos"];
        const boatSize = boatArr[i]["pointVal"]*1.5;
        if (Math.abs(adjPos - boatPos)-(boatSize+dropSize) <= 1 && boatArr[i]["health"] > 0) {
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
        ele.classList.add("sunkBoat");
        const newScore = parseInt(scoreText.innerHTML) + boatData["pointVal"];
        scoreText.innerHTML = newScore;
        if(newScore.toString().length > 1){
            scoreText.style.left = "2px";
        } else {
            scoreText.style.left = "8px";
        }
    }, 400);

    setTimeout(function () {
        boatData["floatStatus"] = false;
        ele.remove();
    }, 2200);
}

export function tryAgain() {
    scoreText.innerHTML = 0;
    scoreText.style.left = "8px";
    makingBubble = false;
    bubbleBuffer = true;
    emptyCount = 0;
    splashPosArr = [];
    splashWaveArr = [];
    startBoatAgain();
}
