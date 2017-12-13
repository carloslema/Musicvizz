var soundCloudClient;
var source;
var flag = false;
var amplitude;
var canvas;

function preload() {
  var url = 'https://soundcloud.com/botanicalesounds/childish-gambino-redbone-slowed-chopped';
  this.soundCloudClient = new SoundCloudHelper(url);
  this.soundCloudClient.setupAudio(trackReady);

}

function trackReady() {
  document.getElementsByClassName("loader-container")[0].style.display = "none";
  flag = true;
  amplitude = new p5.Amplitude();
  showControls();
  source.play();
  amplitude.setInput(source);
  amplitude.smooth(0.9);
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  background('#0F1D3D')
  strokeWeight(3);
  stroke('#42C1F4');
}

function draw() {
  // all things drawn based on music
  // flag = true --> song has been successfully loaded
  if(flag) {
  var level = amplitude.getLevel();
    background('#0F1D3D')
    translate(width/2, height/2);
    for (var i = -180; i < 180; i+=3) {
      var angle = sin(radians(-sin(radians(i*map(level*5500, 0, width, 0, 5)))*i+frameCount*2))*40;
      var x = sin(radians(i))*(50-angle/3);
      var y = cos(radians(i))*(100-angle/3);
      var x2 = sin(radians(i))*(300-angle);
      var y2 = cos(radians(i))*(300-angle);
      line(x, y, x2, y2);
    }
  }
}

// Helper Functions
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background('#0F1D3D')
}

document.getElementById("mute").onclick = function() {
  toggleMuteControl();
  audioClient.toggleSound();
}

document.getElementById("unmute").onclick = function() {
  toggleUnmuteControl();
  audioClient.toggleSound();
}
