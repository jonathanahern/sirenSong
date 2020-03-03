const canvas = document.querySelector('.visualizer');
const mainSection = document.querySelector('.main-controls');
let model_url = "https://github.com/ml5js/ml5-data-and-models/tree/master/models/pitch-detection/crepe/";
let pitch;

let audioCtx;
const canvasCtx = canvas.getContext("2d");


if (navigator.mediaDevices.getUserMedia) {
  console.log('getUserMedia supported.');

  const constraints = { audio: true };

  let onSuccess = function(stream) {
    visualize(stream);
  }

  let onError = function(err) {
    console.log('The following error occured: ' + err);
  }

  navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);

} else {
   console.log('getUserMedia not supported on your browser!');
}

function visualize(stream) {
  if(!audioCtx) {
    audioCtx = new AudioContext();
  }
  console.log(ml5.version);
  const source = audioCtx.createMediaStreamSource(stream);
  const analyser = audioCtx.createAnalyser();
  analyser.fftSize = 2048;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  source.connect(analyser);


  const pitch = ml5.pitchDetection(
    model_url,
    audioCtx,
    MicStream,
    modelLoaded
  );

  function modelLoaded() {
    console.log("Model Loaded!");
  }

  // const arrAvg = arr => arr.reduce((a, b) => a + b, 0) / arr.length;

  const oscillator = audioCtx.createOscillator();
  oscillator.type = 'square';
  oscillator.frequency.value = 440;
  oscillator.start();

  function displayNumber(id, value) {
    const meter = document.getElementById(id + '-level');
    const text = document.getElementById(id + '-level-text');
    text.textContent = value.toFixed(2);
    meter.value = isFinite(value) ? value : meter.min;
  }

  const sampleBuffer = new Float32Array(analyser.fftSize);

  
  draw();

  function draw() {

    // let val = arrAvg(dataArray);

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

    for(let i = 0; i < bufferLength; i++) {

      let v = dataArray[i] / 128.0;
      let y = v * HEIGHT/2;

      if(i === 0) {
        canvasCtx.moveTo(x, y);
      } else {
        canvasCtx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    canvasCtx.lineTo(canvas.width, canvas.height/2);
    canvasCtx.stroke();


    // gain1.gain.value = 0.5 * (1 + Math.sin(Date.now() / 4e2));

    analyser.getFloatTimeDomainData(sampleBuffer);

    // Compute average power over the interval.
    let sumOfSquares = 0;
    for (let i = 0; i < sampleBuffer.length; i++) {
      sumOfSquares += sampleBuffer[i] ** 2;
    }


    const avgPowerDecibels = 10 * Math.log10(sumOfSquares / sampleBuffer.length);

    // Compute peak instantaneous power over the interval.
    let peakInstantaneousPower = 0;
    for (let i = 0; i < sampleBuffer.length; i++) {
      const power = sampleBuffer[i] ** 2;
      peakInstantaneousPower = Math.max(power, peakInstantaneousPower);
    }
    const peakInstantaneousPowerDecibels = 10 * Math.log10(peakInstantaneousPower);

    // Note that you should then add or subtract as appropriate to
    // get the _reference level_ suitable for your application.

    // Display value.
    displayNumber('avg', avgPowerDecibels);

  }
}

window.onresize = function() {
  canvas.width = mainSection.offsetWidth;
}

window.onresize();