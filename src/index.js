import './styles/square.scss';
import './styles/index.scss';
import "./scripts/raindrops";
import "./scripts/setup";
import { sketch } from "./scripts/sketch";


document.addEventListener("DOMContentLoaded", () => {

  createEventListeners();
  
  jQuery(".water-container").raindrops({
    color: "#98CAEF"
  });


});

export function startListening() {
  const containerElement = document.getElementById("p5-container");
  new p5(sketch, containerElement);
}



function createEventListeners(){


  window.addEventListener('resize', resizeWater);

  function resizeWater() {
    $(".water-container").raindrops("resizeCanvas");
  }

}


