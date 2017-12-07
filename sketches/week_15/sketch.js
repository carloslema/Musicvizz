var canvas;
var lightTexture, darkTexture;
var filterFreq, filterRes;
var soundCloudClient;
var source;
var fft;
var flag = false;

function preload() {
  var url = 'https://soundcloud.com/mount-dreams/home-ft-anatomy';
  this.soundCloudClient = new SoundCloudHelper(url);
  this.soundCloudClient.setupAudio(trackReady);
  lightTexture = loadImage('light_texture.png');
  darkTexture = loadImage('dark_texture.png');
}

function trackReady() {
  flag = true;
  source.play();
  fft.setInput(source)
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  fft = new p5.FFT();
}

function draw() {
  if (flag)  {
    var spectrum = fft.analyze();
  }
}

// resize canvas on windowResized
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
