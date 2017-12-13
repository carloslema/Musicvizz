var canvas;
var filterFreq, filterRes;
var source;
var fft;

function preload() {
  song = loadSound('../../audio/home.mp3');
  var lightTexture = loadImage('light_texture.png');
  var darkTexture = loadImage('dark_texture.png');
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight, WEBGL);

  fft = new p5.FFT();
  fft.setInput(source);

  source.play();
}

function draw() {
  var spectrum = fft.analyze();
}

// resize canvas on windowResized
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
