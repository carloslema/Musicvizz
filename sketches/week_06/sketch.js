// Define drawing variables here
var fft;
var level;

// sketch variables
var smoothing = 0;
var count = 256;
var dots = [];
var dotCount = count;

var amplitude;
var gain;
var song;

function preload() {
  song = loadSound("../../audio/idont.mp3");
}

function startClicked() {
    // hide button and show loader
    document.getElementsByClassName("button-container-p5")[0].style.visibility = "hidden";
    song.play();
  }
  
// treat trackReady as a second "setup" -- anything that should be in setup
// but should only happen once the song has been loaded should go here
// otherwise setup will fail
// ie - (amplitude should be set up here if applicable)
function setup() {
    // visual set up - not dependent on song at all
    createCanvas(windowWidth, windowHeight);

    amplitude = new p5.Amplitude();
    amplitude.smooth(0.9);
    song.disconnect();

    gain = new p5.Gain();
    gain.setInput(song);
    gain.connect();

    showControls();
    amplitude.setInput(song);

    fft = new p5.FFT(smoothing, count);
    fft.setInput(song);

    colorMode(HSB, 255);
    noStroke();

    gain.amp(1, 0.5, 0);

    // create dots
    for (var x = 0; x < dotCount; x++) {
        var dot = new Dot(x);
        dots.push(dot);
    }
}

function draw() {

    // dark gray
    background(0, 0, 20, 20);

    // flag = true -- the song has been successfully loaded
    if (song.isPlaying()) {

        level = amplitude.getLevel();
        // translate all x / y coordinates to the center of the screen
        translate(width / 2, height / 2);

        var spectrum = fft.analyze(count);

        var center = createVector(windowWidth / 2, windowHeight / 2);

        for (var x = 0; x < dotCount; x++) {
            var fftAmp = spectrum[x];
            dots[x].seek(fftAmp);
            dots[x].update();
            dots[x].display();
        }

    }
}

function Dot(index) {
    this.index = index;
    this.location = createVector(0, 0);

    var angle = map(index, 0, dotCount, 0, TWO_PI);

    this.angle = p5.Vector.fromAngle(angle);

    this.velocity = p5.Vector.random2D();
    this.acceleration = createVector(0, 0);

    this.maxforce = random(0.15, 0.20);
    this.maxspeed = random(3, 4); // dot speed

    this.r = 5; // dot radius
}

Dot.prototype.seek = function (fftAmp) {
    // angle
    var newTarget = createVector(this.angle.x, this.angle.y);
    newTarget.mult(fftAmp);

    var desired = p5.Vector.sub(newTarget, this.location);
    desired.normalize();
    desired.mult(this.maxspeed);

    // Steering = desired - velocity
    var steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxforce);

    this.acceleration.add(steer);
};

Dot.prototype.update = function () {
    // update velocity
    this.velocity.add(this.acceleration);

    // limit speed
    this.velocity.limit(this.maxspeed);
    this.location.add(this.velocity);

    // reset acceleration
    this.acceleration.mult(0);

    this.checkEdges();
};

Dot.prototype.display = function () {
    ellipse(this.location.x, this.location.y, this.r, this.r);
};

// prevent objects from flying off screen
Dot.prototype.checkEdges = function () {
    var x = this.location.x;
    var y = this.location.y;
    if (x > width || x < 0 || y > height || y < 0) {
        x = width / 2;
        y = height / 2;
    }
};

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

document.getElementById("mute").onclick = function () {
    gain.amp(0, 0.5, 0);
    toggleMuteControl();
  }
  
  document.getElementById("unmute").onclick = function () {
    gain.amp(1, 0.5, 0);
    toggleUnmuteControl();
  }
  