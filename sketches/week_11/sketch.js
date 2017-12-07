var song;
var amplitude;
var level;

var rectRotate = true;

var lightBlue = '#92ccfa';
var red = '#f08986';
var purple = '#b688f8';
var green = '#a1fbb1';
var orange = '#fadc8d';

var colors = [
  lightBlue,
  red,
  purple,
  green,
  orange
];

// Beat Variables
var beatHoldFrames = 30;
var beatThreshold = 0.14; // amplitude level that will trigger a beat
var beatCutoff = 0;
var beatDecayRate = 0.98;
var framesSinceLastBeat = 0;

function preload() {
  song = loadSound('../../audio/astrovan.mp3');
}

function setup() {
  background('#fadc8d');
  createCanvas(windowWidth, windowHeight);
  createShape(lightBlue);

  amplitude = new p5.Amplitude();
  song.play();
  amplitude.setInput(song);
  amplitude.smooth(.9);
}


function draw() {
    level = amplitude.getLevel();
    // detectBeat(level);
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
}

// custom shapes
function createShape(col) {
  beginShape();
  fill(col);
  vertex(0, 80); //
  bezierVertex(430, 360, 200, 170, 130, 310);
  endShape(CLOSE);
}

function ss(col) {
  beginShape();
    vertex(269, 146);  //
    bezierVertex(430, 360, 219, 245, 235, 185);
  endShape(CLOSE);
}



// resize canvas on windowResized
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
