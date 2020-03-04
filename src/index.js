import './styles/index.scss';
import sketch from "./scripts/sketch";

document.addEventListener("DOMContentLoaded", () => {
  const containerElement = document.getElementById("p5-container");

  function startListening() {
    new p5(sketch, containerElement);
  }

  startListening();

  // window.onload = function() {
  //   Particles.init({
  //     selector: ".background"
  //   });
  // };


});


