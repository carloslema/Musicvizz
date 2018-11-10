var particles;
var fillColors;
var song;
var amplitude;
var level;
var gain;

function preload() {
  song = loadSound("../../audio/uandi.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  fillColors = [
    color(206, 157, 202),
    color(233, 163, 171),
    color(7, 162, 218)
  ];
  particles = [];
  for (var i = 0; i < 200; i++) {
    particles.push(new Particle());
  }

  amplitude = new p5.Amplitude();
  song.disconnect();

  gain = new p5.Gain();
  gain.setInput(song);
  amplitude.smooth(.9);
  gain.connect();

  showControls();
  amplitude.setInput(song);

  background("#0F1D3D");
  strokeWeight(3);
  stroke("#42C1F4");

  gain.amp(1,0.5,0);
  song.play();
}

function draw() {
  level = amplitude.getLevel() * 10;
  var col;
  if (level < 3) {
    col = fillColors[2];
  } else if (level > 3 && level < 5) {
    col = fillColors[1];
  } else {
    col = fillColors[0];
  }
  background(col);
  for (var i = 0; i < particles.length; i++) {
    var particle = particles[i];
    particle.render();
    particle.update();
  }
}

function Particle() {
  this.loc = createVector(random(width), random(height));
  var velSize = random(5);
  var velAng = random(TWO_PI);
  this.vel = createVector(velSize, velSize);
  this.vertices = [];
  this.fillColor = fillColors[int(random(fillColors.length))];
}


Particle.prototype = {
  render: function() {
    noStroke();
    fill(this.fillColor);
    if (this.vertices.length < 3) {
      return;
    }
    beginShape();
    for (var i = 0; i < 3; i++) {
      var v = this.vertices[i];
      vertex(v.x, v.y);
    }
    endShape(CLOSE);
  },

  update: function() {
    var mouse = createVector(windowWidth/2, windowHeight/2);
    var acc = p5.Vector.sub(mouse, this.loc).limit(level*2);
    acc.mult(randomGaussian(1));
    acc.rotate(randomGaussian(0, PI / 3));
    this.vel.add(acc);
    this.vel.limit(20*level);
    this.loc.add(this.vel);
    this.vertices.push(p5.Vector.add(this.loc, this.vel.copy().rotate(random(TWO_PI * 2))));
    if (this.vertices.length > 3) {
      this.vertices.shift();
    }
  }
}

// resize canvas on windowResized
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(0);
}

document.getElementById("mute").onclick = function() {
  gain.amp(0,0.5,0);
  toggleMuteControl();
}

document.getElementById("unmute").onclick = function() {
  gain.amp(1,0.5,0);
  toggleUnmuteControl();
}
