let timer = 0;
var container = null;
let boatArr = [];
let boatWaitTime = [20,42,35,28,60,20,50,70];


document.addEventListener("DOMContentLoaded", () => {
  container = document.getElementById("boat-container");
});

export const boatTimer = () => {
    timer += 1;
    if ( timer%boatWaitTime[0] === 0){
        let firstNum = boatWaitTime.shift();
        boatWaitTime.push(firstNum);
        timer = 0;
        addABoat();
    }
        moveBoats();

};

function addABoat() {
  let boat = document.createElement("img");
  boat.src = "/src/images/boat.png";
  boat.style.width = "100px";
  boat.className = "boat";
  boat.style.left = "-20%";
  container.appendChild(boat);
  let boatObj = {"boatEle": boat, "boatPos": -20};
  boatArr.push(boatObj);
}

function moveBoats() {
  boatArr.forEach(boatObj => {
      boatObj["boatEle"].style.left = `${boatObj["boatPos"]+=1}%`;
  });
  if (boatArr[0]){
    var lastPos = boatArr[0]["boatPos"];
  }
  if (lastPos > 110){
      boatArr[0]["boatEle"].remove();
      boatArr.shift();
  }
}

