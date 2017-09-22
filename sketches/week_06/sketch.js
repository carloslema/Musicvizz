var canvas;
var angle = 0;
var angleSpeed = 0.01;
var song;
var amplitude;
var torusGroup = [];

function preload() {
  song = loadSound('../../audio/dancing_in_dark.mp3');
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  amplitude = new p5.Amplitude();
  song.play();
  amplitude.setInput(song);
  amplitude.smooth(5);
  background(5);
}

function draw() {
  camera(0, 0, sin(frameCount * 0.01) * (windowHeight/2));
  background(0);
  var level = amplitude.getLevel() * 10;
  console.log(level);
  console.log("frame count" + frameCount);

  for(var x = 0; x < 7; x++) {
    rotateX(frameCount * 0.01);
    rotateZ(frameCount * 0.01);
    translate(Math.floor(x * level * 2), Math.floor(x * level * 2), -level);
    torus(150, 25, 50, 50);
  }
}

// resize canvas on windowResized
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
