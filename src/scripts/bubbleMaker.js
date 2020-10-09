import { soundArr, clearArr } from "./sketch";
import { boatTimer } from "./boats";
import { hitWater } from "../index";

const colorArr = [
    "rgb(9,81,149)",
    "rgb(76,148,75)",
    "rgb(142,214,0)",
    "rgb(199,220,15)",
    "rgb(255,225,30)"
];

let makingBubble = false;
let bubbleSize = 25;
let marginTop = 47.0;
let waveHeight = 100;
let currentBubble;
let currentPitchArr = [];
let splashPos = 0;
let splashPosArr = [];
let splashWaveArr = [];
const arrAvg = arr => arr.reduce((a, b) => a + b, 0) / arr.length;

export const bubbleLoop = () => {

    let parent = document.getElementById("dropHolder");

    setInterval(function () {
        let soundSize = soundArr.length;
        if (!makingBubble && soundSize > 3) {
            makingBubble = true;
            currentBubble = document.createElement("DIV");
            let pitch = (arrAvg(soundArr) - 120) * .0042;
            currentPitchArr.push(pitch);
            let colorReturn = getBubbleColor(pitch);
            currentBubble.style.backgroundColor = colorReturn[0];
            splashPos = colorReturn[2];
            currentBubble.className = "bubble wiggle";
            parent.appendChild(currentBubble);
            currentBubble.style.left = colorReturn[1];
        } else if (makingBubble && soundSize > 3 && waveHeight < 800) {
            let newPitch = (arrAvg(soundArr) - 120) * .0042;
            currentPitchArr.push(newPitch);
            let avgPitch = arrAvg(currentPitchArr);
            let newColorReturn = getBubbleColor(avgPitch);
            currentBubble.style.backgroundColor = newColorReturn[0];
            currentBubble.style.left = newColorReturn[1];
            splashPos = newColorReturn[2];
            bubbleSize += 5;
            marginTop += .75;
            waveHeight += 25;
            currentBubble.style.height = `${bubbleSize}px`;
            currentBubble.style.width = `${bubbleSize}px`;
            currentBubble.style.marginTop = `${marginTop}px`;
        } else if ((makingBubble && soundSize < 3) || waveHeight >= 775) {
            currentPitchArr = [];
            makingBubble = false;
            bubbleSize = 25;
            marginTop = 47.0;
            moveBubble(currentBubble, parent);
            splashPosArr.push(splashPos);
            splashWaveArr.push(waveHeight);
            waveHeight = 100;
            setTimeout(function () { splash(splashPosArr[0], splashWaveArr[0]); }, 1350);
        }
        clearArr();
        boatTimer();
    }, 200);

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

    let newPitch = Math.round(clamp(pitch.toFixed(2), 0, 1) * 93);
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
    $(".water-container").raindrops("splash", pos, wave);
    splashPosArr.shift();
    splashWaveArr.shift();
    if (pos >= 0 && pos < .15) {
        hitWater(1);
    } else if (pos >= .15 && pos < .35) {
        hitWater(2);
    } else if (pos >= .35 && pos < .55) {
        hitWater(3);
    } else if (pos >= .55 && pos < .75) {
        hitWater(4);
    } else if (pos >= .75){
        hitWater(5);
    }
}
