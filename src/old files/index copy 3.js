const canvas = document.querySelector('.visualizer');
const mainSection = document.querySelector('.main-controls');

let audioCtx;
const canvasCtx = canvas.getContext("2d");

const pitchSamples = [];
const arrAvg = arr => Math.floor(arr.reduce((a, b) => a + b, 0) / arr.length);


if (navigator.mediaDevices.getUserMedia) {
  console.log('getUserMedia supported.');

  const constraints = { audio: true };

  let onSuccess = function (stream) {
    visualize(stream);
  }

  let onError = function (err) {
    console.log('The following error occured: ' + err);
  }

  navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);

} else {
  console.log('getUserMedia not supported on your browser!');
}

function visualize(stream) {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }

  const source = audioCtx.createMediaStreamSource(stream);
  const analyser = audioCtx.createAnalyser();
  analyser.fftSize = 2048;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  source.connect(analyser);

  draw();

  function draw() {

    WIDTH = canvas.width
    HEIGHT = canvas.height;

    requestAnimationFrame(draw);

    analyser.getByteTimeDomainData(dataArray);

    canvasCtx.fillStyle = `rgb(200, 200, 200)`;
    canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

    canvasCtx.lineWidth = 2;
    canvasCtx.strokeStyle = 'rgb(255, 0, 0)';

    canvasCtx.beginPath();

    let sliceWidth = WIDTH * 1.0 / bufferLength;
    let x = 0;
    let lastPos = 0;
    let lastItem = dataArray[0];
    let arr = []
    for (let i = 0; i < bufferLength; i++) {

      let item = dataArray[i];
      if (item > 128 && lastItem <= 128) { // we have crossed below the mid point
        const elapsedSteps = i - lastPos; // how far since the last time we did this
        lastPos = i;

        const hertz = 1 / (elapsedSteps / 44100);
        arr.push(hertz); // an array of every pitch encountered
      }
      lastItem = item;

      let v = dataArray[i] / 128.0;
      let y = v * HEIGHT / 2;

      if (i === 0) {
        canvasCtx.moveTo(x, y);
      } else {
        canvasCtx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    let averagePitch = arrAvg(arr);
    if (Number.isNaN(averagePitch)) {
      pitchSamples.unshift(0);
    } else {
      pitchSamples.unshift(averagePitch);
    }

    canvasCtx.lineTo(canvas.width, canvas.height / 2);
    canvasCtx.stroke();

  }
}

setInterval(() => {
  let newArr = pitchSamples.slice(0,45)
  console.log(arrAvg(newArr));
}, 750);

window.onresize = function () {
  canvas.width = mainSection.offsetWidth;
}

window.onresize();