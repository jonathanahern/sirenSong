let timer = 0;
var container = null;
var healthBar = null;
let healthTotal = 20;
export var boatArr = [];
let boatWaitTime = [16,26,30,26,34,22,42,28];
let boatSizes = [2,2,3,3,3,4,4,5];
let boatDirection = [1,-1];
let boatSpeed = [1, 2, 2,2,3,3,4];


document.addEventListener("DOMContentLoaded", () => {
  container = document.getElementById("boat-container");
  healthBar = document.getElementById("health-bar");
});

export const boatTimer = () => {
    timer += 1;
    if ( timer%boatWaitTime[0] === 0){
        let firstNum = boatWaitTime.shift() - 0;
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
    pointVal: size
  };
  boatArr.push(boatObj);
}

function moveBoats() {
    for (let i = 0; i < boatArr.length; i++) {
      const boatObj = boatArr[i];
      const boatSpeed = boatObj["speed"] * boatObj["direction"];
       if (boatObj["health"] > 0) {
         boatObj["boatEle"].style.left = `${(boatObj["boatPos"] += boatSpeed)}%`;
       }
    }

    if (boatArr[0]){
        var lastPos = boatArr[0]["boatPos"];
    }

    if (lastPos > 112 || lastPos < -12){
        healthTotal -= boatArr[0]["pointVal"];
        if (healthTotal < 1){
            healthTotal=0
        };
        healthBar.style.height = `${(healthTotal/20)*100}%`;
        boatArr[0]["boatEle"].remove();
        boatArr.shift();
    }

}