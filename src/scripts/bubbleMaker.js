const colorArr = [
    "rgb(9,81,149)",
    "rgb(76,148,75)",
    "rgb(142,214,0)",
    "rgb(199,220,15)",
    "rgb(255,225,30)"
];

export const moveBubble = (bubble, parent) => {
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

export const getBubbleColor = (pitch) => {
    if (pitch < .2) {
        return [colorArr[0], "90%"];
    } else if (pitch >= .2 && pitch < .4) {
        return [colorArr[1], "70%"];
    } else if (pitch >= .4 && pitch < .6) {
        return [colorArr[2], "50%"];
    } else if (pitch >= .6 && pitch < .8) {
        return [colorArr[3], "30%"];
    } else {
        return [colorArr[4], "10%"];
    }
}
