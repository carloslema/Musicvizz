var song;
var amplitude;
var level;

var rectRotate = true;
var level;

// Beat Variables
var beatHoldFrames = 30;
var beatThreshold = 0.14; // amplitude level that will trigger a beat
var beatCutoff = 0;
var beatDecayRate = 0.98;
var framesSinceLastBeat = 0;

var solidBackground;

function preload() {
  song = loadSound('../../audio/astrovan.mp3');
}

function setup() {
  background('#fadc8d');
  solidBackground = color('#fadc8d');
  createCanvas(windowWidth, windowHeight);

  amplitude = new p5.Amplitude();
  song.play();
  amplitude.setInput(song);
  amplitude.smooth(.9);
}


function draw() {
    background(solidBackground);
    level = amplitude.getLevel();
    detectBeat(level);
}

function detectBeat(level) {
    if (level  > beatCutoff && level > beatThreshold){
        onBeat();
        beatCutoff = level * 1.2;
        framesSinceLastBeat = 0;
    } else{
        if (framesSinceLastBeat <= beatHoldFrames){
            framesSinceLastBeat ++;
        }
        else {
            beatCutoff *= beatDecayRate;
            beatCutoff = Math.max(beatCutoff, beatThreshold);
        }
    }
}

function onBeat() {
  solidBackground = color( random(100, 255), random(100, 255), random(100, 255) );
}


// resize canvas on windowResized
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
