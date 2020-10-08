import './styles/square.scss';
import './styles/index.scss';
import "./scripts/raindrops";
import { sketch } from "./scripts/sketch";
import { bubbleLoop } from "./scripts/bubbleMaker";

let square;
let goalNote=5;

document.addEventListener("DOMContentLoaded", () => {

  square = document.getElementById("primary-sq");
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
  setTimeout(moveSq, 3000);
}

function moveSq(){
  square.innerHTML = "";
  square.classList.remove("initialPos");
  square.classList.add("riseUp");
  setTimeout(startFloating, 5000);
}

function startFloating(){
  console.log("float");
  square.classList.remove("riseUp");
  square.classList.add("float");
}

function addABoat(){
  const container = document.getElementById("boat-container");
  let boat = document.createElement("img");
  boat.src = "/src/images/boat.png";
  boat.style.width = "100px";
  // newPulse.className = "new-pulse";
  container.appendChild(boat);
}

function createEventListeners(){

  document.getElementById("primary-sq").addEventListener("click", squareClicked);

  function squareClicked() {
    square.removeEventListener("click", squareClicked);
    square.innerHTML = "LOADING";
    startListening();
  }
// -------------------- //
  window.addEventListener('resize', resizeWater);

  function resizeWater() {
    $(".water-container").raindrops("resizeCanvas");
  }
// -------------------- //

  document.addEventListener('keypress', logKey);

  function logKey(e) {

    let keyVal = e.code.toString();
    if (keyVal==="KeyN"){
      addABoat();
      // let element = document.getElementById("herd-container");
      // element.classList.add("shakeNo");
      // setTimeout(removeClass, 1000, element,"shakeNo");
    } else if (keyVal === "KeyY"){
      let parent = document.getElementById("inner-container");
      let sq = document.getElementById("primary-sq");
      let newPulse = document.createElement("DIV");
      newPulse.className = "new-pulse";
      sq.appendChild(newPulse);
      // let element = document.getElementById("herd-container");
      // let innerElement = document.getElementById("inner-container");
      // element.classList.add("jumpYes");
      // innerElement.classList.add("jumpYesRotate");
      // setTimeout(removeClass, 3500, element, "jumpYes");
      // setTimeout(removeClass, 2000, innerElement, "jumpYesRotate");
    }

    function removeClass(element, str) {
      element.classList.remove(str);
    }

  }



}

export function hitWater(pos){
  if (goalNote === pos) {
    let element = document.getElementById("herd-container");
    let innerElement = document.getElementById("inner-container");
    element.classList.add("jumpYes");
    innerElement.classList.add("jumpYesRotate");
    setTimeout(removeClass, 3500, element, "jumpYes");
    setTimeout(removeClass, 2000, innerElement, "jumpYesRotate");
  } else {
    let element = document.getElementById("herd-container");
    element.classList.add("shakeNo");
    setTimeout(removeClass, 1000, element, "shakeNo");
  }

  function removeClass(element, str) {
    element.classList.remove(str);
  }

}

function pulse (color) {

  let sq = document.getElementById("primary-sq");
  console.log (sq.offsetTop);

}