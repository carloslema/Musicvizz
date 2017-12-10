var canvas;
var filterFreq, filterRes;
var source;
var fft;
var flag = false;
var url = 'https://soundcloud.com/mount-dreams/home-ft-anatomy';
var soundCloudClient = new SoundCloudHelper(url);

function preload() {
  this.soundCloudClient.setupAudio(trackReady);
  var lightTexture = loadImage('light_texture.png');
  var darkTexture = loadImage('dark_texture.png');
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
