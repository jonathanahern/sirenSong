export const moveBubble = (bubble, parent) => {
    var pos = 0;
    var id = setInterval(frame, 5);
    function frame() {
        if (pos == 500) {
            clearInterval(id);
            parent.removeChild(bubble);
        } else {
            pos++;
            bubble.style.top = pos + "px";
        }
    }
}
