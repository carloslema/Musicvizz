var backgroundColors = ['#A5363E', '#B39EAA', '#251C1A', '#AE6563',
    '#F0C2D2', '#BD3352', '#443A4F', '#FBF3FB',
    '#9A98A2', '#F5D4B8', '#ECA1CA', '#A34A64',
    '#F8E0F1', '#F4A8B5', '#B43667', '#640D32'];

// Sketch variables
var amplitude;
var solidBackground = backgroundColors[0];

var song;
var amplitude;
var gain;

// rectangle variables
var rectRotate = true;
var rectMin = 25;
var rectOffset = 20;
var numRects = 20;

// Beat Variables
var beatHoldFrames = 30;

// amplitude level that will trigger a beat
var beatThreshold = 0.14;

var beatCutoff = 0;
var beatDecayRate = 0.98;
var framesSinceLastBeat = 0;

function preload() {
    song = loadSound("../../audio/elhae.mp3");
}

function startClicked() {
    document.getElementsByClassName("button-container-p5")[0].style.visibility = "hidden";
    song.play();
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    noStroke();
    rectMode(CENTER);

    amplitude = new p5.Amplitude();
    song.disconnect();

    gain = new p5.Gain();
    gain.setInput(song);
    gain.connect();

    showControls();
    amplitude.setInput(song);

    amplitude.smooth(0.9);

    gain.amp(1, 0.5, 0);
}

function draw() {
    if (song.isPlaying()) {

        background(solidBackground);

        var level = amplitude.getLevel();
        detectBeat(level);

        // distort the rectangle based based on the amp
        var distortDiam = map(level, 0, 1, 0, 1200);
        var w = rectMin;
        var h = rectMin;

        // distortion direction shifts each beat
        if (rectRotate) {
            var rotation = PI / 2;
        } else {
            var rotation = PI / 3;
        }
        // rotate the drawing coordinates to rectCenter position
        var rectCenter = createVector(width / 3, height / 2);

        push();

        //draw the rectangles
        for (var i = 0; i < numRects; i++) {
            var x = rectCenter.x + rectOffset * i;
            var y = rectCenter.y + distortDiam / 2;
            // rotate around the center of this rectangle
            translate(x, y);
            rotate(rotation);
            rect(0, 0, rectMin, rectMin + distortDiam);
        }
        pop();
    }
}

// handle song errors
function soundError(e) {
    console.log('New error:');
    console.log('- name: ' + e.name);
    console.log('- message: ' + e.message);
    console.log('- stack: ' + e.stack);
    console.log('- failed path: ' + e.failedPath);
}
function detectBeat(level) {
    if (level > beatCutoff && level > beatThreshold) {
        onBeat();
        beatCutoff = level * 1.2;
        framesSinceLastBeat = 0;
    } else {
        if (framesSinceLastBeat <= beatHoldFrames) {
            framesSinceLastBeat++;
        }
        else {
            beatCutoff *= beatDecayRate;
            beatCutoff = Math.max(beatCutoff, beatThreshold);
        }
    }
}

// sketch helper functions
function onBeat() {
    var col = backgroundColors[Math.floor(Math.random() * backgroundColors.length)];
    solidBackground = color(col);
    rectRotate = !rectRotate;
}

document.getElementById("mute").onclick = function() {
    gain.amp(0,0.5,0);
    toggleMuteControl();
  
  }
  
  document.getElementById("unmute").onclick = function() {
    gain.amp(1,0.5,0);
    toggleUnmuteControl();
  }
  