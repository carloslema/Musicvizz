var song;
var amplitude;
var level;

function preload() {
  song = loadSound('../../audio/gone.mp3');
}

function setup() {
  background(255);
  createCanvas(windowWidth, windowHeight);
  noStroke();
  amplitude = new p5.Amplitude();
  showControls();
  song.play();
  amplitude.setInput(song);
  amplitude.smooth(.9);
}

var t = 0;
var speed = 0.03;
var colors = [[170, 193, 199], [142, 192, 193], [135, 202, 216], [150, 201, 192], [140, 160, 152]];

function draw() {
  level = amplitude.getLevel();

  var color = generateColor(level);
  fill(color[0], color[1], color[2], 10);
  rect(0, 0, windowWidth, windowHeight);

  var n = 100;
  var radius = map(sin(t), -1, 1, 30, windowWidth/5);
  var angleSteps = TWO_PI / n;
  var levelFactor = level * 1000;
  fill(255);
  for (var i = 0; i < n; i++) {
    var angle = t + angleSteps * i;
    var hue = map(sin(angle/2), -1, 1, 0, 125);
    fill(hue, 210, 210);
    var x = width / 2 + sin(angle) * radius;
    var y = height / 2 + cos(angle) * radius;
    ellipse(x, y, level * 1000, level * 1000);
  }
  t += speed;
}

// resize canvas on windowResized
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

//todo make this not terrible
function generateColor(level) {
  var factor = level * 100;
  var color;
  if (factor < 3) {
    color = colors[0];
  } else if (factor > 3 && factor <= 8) {
    color = colors[1];
  } else if (factor > 8 && factor <= 11) {
    color = colors[2];
  } else if (factor > 11 && factor <= 14) {
    color = colors[3];
  } else if (factor > 14) {
    color = colors[4];
  }
  return color;
}

document.getElementById("mute").onclick = function() {
  toggleMuteControl();
  audioClient.toggleSound();
}

document.getElementById("unmute").onclick = function() {
  toggleUnmuteControl();
  audioClient.toggleSound();
}
