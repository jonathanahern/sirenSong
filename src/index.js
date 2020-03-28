import './styles/square.scss';
import './styles/index.scss';
import "./scripts/raindrops";
import { sketch } from "./scripts/sketch";
import { bubbleLoop } from "./scripts/bubbleMaker";

document.addEventListener("DOMContentLoaded", () => {

  createEventListeners();
  
  jQuery(".water-container").raindrops({
    color: "#0bd"
  });

  bubbleLoop();

});

function startListening() {
  console.log('listen');
  const containerElement = document.getElementById("p5-container");
  new p5(sketch, containerElement);
  document.getElementById("sq1").classList.add("sq1ComeOut");
}

function createEventListeners(){

  document.getElementById("primary-sq").addEventListener("click", squareClicked);

  function squareClicked() {
    document.getElementById("primary-sq").innerHTML = "clicked";
    startListening();
  }

  window.addEventListener('resize', resizeWater);

  function resizeWater() {
    $(".water-container").raindrops("resizeCanvas");
  }
}