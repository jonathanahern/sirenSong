import './styles/square.scss';
import './styles/index.scss';
import "./scripts/raindrops";
import { sketch } from "./scripts/sketch";
import { bubbleLoop } from "./scripts/bubbleMaker";

let square;

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
  setTimeout(moveSq1, 3000);
}

function moveSq1(){
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
      let obj = document.getElementById("herd-container");
      obj.classList.add("shakeNo");
      setTimeout(removeClass, 1000, obj,"shakeNo");
    }

    function removeClass(obj, str) {
      obj.classList.remove(str);
    }

  }



}