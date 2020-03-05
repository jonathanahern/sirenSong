import ml5 from "ml5";

export var soundArr = []

export const clearArr = () => { 
  soundArr = [];
}

export const sketch = (p) => {
  let mic;
  let freq = 0;
  let pitch;
  let audioContext;


  p.setup = function () {
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
        soundArr.push(freq)
      }

    }
    pitch.getPitch(gotPitch);
  }

  function modelLoaded(){
    pitch.getPitch(gotPitch);
  }


  p.draw = function () {
  };

};
