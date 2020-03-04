import './styles/index.scss';
import sketch from "./scripts/sketch";
import {moveBubble} from "./scripts/bubbleMaker"

document.addEventListener("DOMContentLoaded", () => {
  const containerElement = document.getElementById("p5-container");

  function startListening() {
    new p5(sketch, containerElement);
  }

  startListening();

  let bubble = document.createElement("DIV");
  bubble.className="bubble";
  let parent = document.getElementById("background");
  parent.appendChild(bubble);
  moveBubble(bubble, parent);
  
});


