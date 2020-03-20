import { soundArr, clearArr } from "./sketch";

const colorArr = [
    "rgb(9,81,149)",
    "rgb(76,148,75)",
    "rgb(142,214,0)",
    "rgb(199,220,15)",
    "rgb(255,225,30)"
];

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

export const bubbleLoop = () => {

    let parent = document.getElementById("dropHolder");

    setInterval(function () {
        let soundSize = soundArr.length;
        if (!makingBubble && soundSize > 0) {
            makingBubble = true;
            currentBubble = document.createElement("DIV");
            let pitch = (arrAvg(soundArr) - 120) * .0042;
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
            bubbleSize += 5;
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
            setTimeout(function () { splash(splashPosArr[0], splashWaveArr[0]); }, 1400);
        }
        clearArr();
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
    if (pitch < .2) {
        return [colorArr[0], "90%", 0.10];
    } else if (pitch >= .2 && pitch < .4) {
        return [colorArr[1], "70%", 0.3];
    } else if (pitch >= .4 && pitch < .6) {
        return [colorArr[2], "50%", 0.5];
    } else if (pitch >= .6 && pitch < .8) {
        return [colorArr[3], "30%", 0.69];
    } else {
        return [colorArr[4], "10%", 0.88];
    }
}

function splash(pos, wave) {
    $(".water-container").raindrops("splash", pos, wave);
    splashPosArr.shift();
    splashWaveArr.shift();
}
