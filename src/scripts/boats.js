import { gameOver } from "./setup";

let timer = 0;
var container = null;
var healthBar = null;
let healthTotal = 20;
export var boatArr = [];
let boatWaitTimeConst = [10,18,28,20,24,12,32,20];
let boatWaitTime = [10,18,28,20,24,12,28,20];
let boatSizes = [2,2,3,3,3,4,4,5];
let boatDirection = [1,-1];
let boatSpeed = [2,3,3,4];
export var gameOverBool = false;

document.addEventListener("DOMContentLoaded", () => {
  container = document.getElementById("boat-container");
  healthBar = document.getElementById("health-bar");
});

export const boatTimer = () => {
    timer += 1;
    if ( timer%boatWaitTime[0] === 0 && !gameOverBool){
        let firstNum = boatWaitTime.shift() - 2;
        if (firstNum < 5) {
            firstNum = 5;
        }
        boatWaitTime.push(firstNum);
        timer = 0;
        let tempBoatSize = boatSizes[Math.floor(Math.random() * boatSizes.length)];
        let tempBoatDirection = boatDirection[Math.floor(Math.random() * boatDirection.length)];
        let tempBoatSpeed = boatSpeed[Math.floor(Math.random() * boatSpeed.length)];
        addABoat(tempBoatSize, tempBoatDirection, tempBoatSpeed);
    }
        moveBoats();

};

function addABoat(size, direction, boatSpeed) {
  let boatPartHolder = document.createElement("div");
  boatPartHolder.className = "boat-part-holder";

  let sail = document.createElement("img");
  sail.src = "/src/images/sail.png";
  sail.className = `sail-${size}`;
  if (direction > 0) {
    sail.style.transform = "scaleX(-1)";
  }
  boatPartHolder.append(sail);

  let bottom = document.createElement("img");
  bottom.src = "/src/images/boatBottom.png";
  bottom.className = `boat-${size}`;
  boatPartHolder.append(bottom);

  let sailorContainer = document.createElement("div");
  sailorContainer.className = `sailor-container cont-size-${size}`;
  boatPartHolder.append(sailorContainer);

  for (let i = 0; i < size; i++) {
    let oneSailorContainer = document.createElement("div");
    oneSailorContainer.className = `sailor-ind-container ind-size-${size}`;
    sailorContainer.append(oneSailorContainer);

    let sailor = document.createElement("img");
    sailor.src = "/src/images/sailor.png";
    oneSailorContainer.append(sailor);
  }

  container.appendChild(boatPartHolder);
  let posStr = "";
  let posNum = 0;
  if (direction > 0) {
    posStr = "-11%";
    posNum = -11;
  } else {
    posStr = "111%";
    posNum = 111;
  }

  boatPartHolder.style.left = posStr;
  let boatObj = {
    boatEle: boatPartHolder,
    boatPos: posNum,
    health: size,
    direction: direction,
    speed: boatSpeed,
    pointVal: size,
    floatStatus: true,
  };
  boatArr.push(boatObj);
}

function moveBoats() {
    for (let i = 0; i < boatArr.length; i++) {
      const boatObj = boatArr[i];
      const boatSpeed = boatObj["speed"] * boatObj["direction"];
      const newBoatPos = boatObj["boatPos"] += boatSpeed;
      if (boatObj["health"] > 0) {
        boatObj["boatEle"].style.left = `${newBoatPos}%`;
        if (newBoatPos > 112 || newBoatPos < -12){
          boatGotAway(boatObj);
        }
      }
      
    }
    if (boatArr[0]){
      if (!boatArr[0]["floatStatus"]){
        boatArr[0]["boatEle"].remove();
        boatArr.shift();
      } else if (boatArr[0]["pointVal"]===10){
        boatArr[0]["boatEle"].remove();
        boatArr.shift();
      }

    }

}

function boatGotAway(boatObj){
  healthTotal -= boatObj["pointVal"];
  boatObj["health"] = 0;
  if (healthTotal < 1){
      healthTotal=0
      gameOverBool = true;
      gameOver();
  };
  healthBar.style.height = `${(healthTotal/20)*100}%`;
  boatObj["boatEle"].remove();
  boatObj["pointVal"] = 10;
}

export function startBoatAgain(){
  healthTotal = 20;
  healthBar.style.height = `${(healthTotal/20)*100}%`;
  gameOverBool = false;
  boatWaitTime = boatWaitTimeConst.slice();
}