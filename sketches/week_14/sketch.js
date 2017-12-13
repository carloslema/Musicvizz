var canvas;
var angle = 0;
var angleSpeed = 0.01;
var song;
var amplitude;
var torusGroup = [];
var flag = true;

function preload() {
  song = loadSound('../../audio/dancing_in_dark.mp3');
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  amplitude = new p5.Amplitude();
  showControls();
  song.play();
  amplitude.setInput(song);
  background(5);
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
  toggleMuteControl();
  audioClient.toggleSound();
}

document.getElementById("unmute").onclick = function() {
  toggleUnmuteControl();
  audioClient.toggleSound();
}
