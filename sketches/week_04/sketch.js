var amplitude;
var canvas;
var gain;
var song;

function preload() {
  song = loadSound("../../audio/redbone.mp3");
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);

  amplitude = new p5.Amplitude();
  amplitude.smooth(0.9);
  song.disconnect();

  gain = new p5.Gain();
  gain.setInput(song);
  gain.connect();

  showControls();
  amplitude.setInput(song);

  background("#0F1D3D");
  strokeWeight(3);
  stroke("#42C1F4");

  gain.amp(1, 0.5, 0);
}

function startClicked() {
  // hide button and show loader
  document.getElementsByClassName("button-container")[0].style.visibility = "hidden";
  song.play();
}

function draw() {
  if (song.isPlaying()) {
    var level = amplitude.getLevel();
    background("#0F1D3D")
    translate(width / 2, height / 2);
    for (var i = -180; i < 180; i += 3) {
      var angle = sin(radians(-sin(radians(i * map(level * 5500, 0, width, 0, 5))) * i + frameCount * 2)) * 40;
      var x = sin(radians(i)) * (50 - angle / 3);
      var y = cos(radians(i)) * (100 - angle / 3);
      var x2 = sin(radians(i)) * (300 - angle);
      var y2 = cos(radians(i)) * (300 - angle);
      line(x, y, x2, y2);
    }
  }
}

// Helper Functions
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background("#0F1D3D")
}

document.getElementById("mute").onclick = function () {
  gain.amp(0, 0.5, 0);
  toggleMuteControl();
}

document.getElementById("unmute").onclick = function () {
  gain.amp(1, 0.5, 0);
  toggleUnmuteControl();
}
