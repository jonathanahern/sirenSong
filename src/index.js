const containerElement = document.getElementById('p5-container');
let pitch;
let audioContext;

const sketch = (p) => {
  let x = 100;
  let y = 100;
  let mic;
  let freq = 0;

  p.setup = function () {
    // p.createCanvas(800, 400);
    p.userStartAudio();
    audioContext = p.getAudioContext();
    mic = new p5.AudioIn();
    mic.start(listening);
  };

  function listening(){
    pitch = ml5.pitchDetection(
      "./crepe",
      audioContext,
      mic.stream,
      modelLoaded
    );
  }

  function gotPitch(error, frequency) {
    if (error) {
      console.error(error);
    } else {

      var vol = mic.getLevel() * 100;
      if (frequency && vol > 0.7) {
        freq = frequency;
        console.log("Vol: " + vol.toString() + " Freq: " + freq.toString());
      }

    }
    pitch.getPitch(gotPitch);
  }

  function modelLoaded(){
    // console.log('model loaded!');
    pitch.getPitch(gotPitch);
  }


  p.draw = function () {
    // p.background(0);
    // p.fill(255);
    // p.rect(x, y, 50, 50);
    // var vol = mic.getLevel() * 100;
    // if (vol > .7){
    // // console.log(vol);
    // }
  };

};

new p5(sketch, containerElement);