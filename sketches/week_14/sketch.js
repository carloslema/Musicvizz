var canvas;
var angle = 0;
var angleSpeed = 0.01;
var song;
var amplitude;
var torusGroup = [];
var flag = true;
var gain;

function preload() {
  song = loadSound('../../audio/dancing_in_dark.mp3');
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  amplitude = new p5.Amplitude();

  song.disconnect();

  gain = new p5.Gain();
  gain.setInput(song);
  gain.connect();

  showControls();
  amplitude.setInput(song);

  background(5);

  gain.amp(1,0.5,0);
  song.play();

}

function draw() {
  if (song.isPlaying()) {
    camera(0, 0, sin(frameCount * 0.01) * (windowHeight/2));
    background(0);
    var level = amplitude.getLevel() * 10;

    for(var x = 0; x < 7; x++) {
      rotateX(frameCount * 0.01);
      rotateZ(frameCount * 0.01);
      translate(Math.floor(x * level * 2), Math.floor(x * level * 2), -level);
      torus(150, 25, 50, 50);
    }
  }
}

// resize canvas on windowResized
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

document.getElementById("mute").onclick = function() {
  gain.amp(0,0.5,0);
  toggleMuteControl();

}

document.getElementById("unmute").onclick = function() {
  gain.amp(1,0.5,0);
  toggleUnmuteControl();
}
