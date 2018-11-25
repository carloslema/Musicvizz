var nTiles = 15;
var nFrames = 128;
var phase = 0.0;
var phaseInc = 1.0 / nFrames;
var song;
var amplitude;
var level;
var gain;

function preload() {
	song = loadSound("../../audio/arctic.mp3");
}

// Draw sine wave
function drawWave(w, freq, amp, phase) {
	push();
	beginShape();
	for (var x = -w / 2.0; x < w / 2.0 + 1; x++) {
		vertex(x, sin(x / w * TAU * freq + phase) * amp);
	}
	endShape();
	pop();
}

function startClicked() {
	document.getElementsByClassName("button-container-p5")[0].style.visibility = "hidden";
	song.play();
}

function setup() {
	createCanvas(windowWidth, windowHeight);
	noFill();
	seed = random(10000);
	amplitude = new p5.Amplitude();
	song.disconnect();

	gain = new p5.Gain();
	gain.setInput(song);
	gain.connect();

	showControls();
	amplitude.setInput(song);
	amplitude.smooth(.9);

	gain.amp(1, 0.5, 0);
}

function draw() {
	if (song.isPlaying()) {
		level = amplitude.getLevel();
		background(16, 16, 16);
		resetMatrix();
		randomSeed(seed);
		noiseSeed(seed);

		var w = windowWidth / nTiles;
		var amp = w;
		var nInc = 25;

		// Create border
		var thisWidth = windowWidth;
		var thisHeight = windowWidth;
		var thisScale = thisWidth / windowWidth;
		var t = (windowWidth - thisWidth) / 2.0;
		var sw = w / 2.0 * thisScale;
		translate(t + sw, t + sw);

		for (var y = 0; y < nTiles; y++) {
			var yPos = y / nTiles * thisHeight;
			for (var x = 0; x < nTiles; x++) {
				push();
				var n = noise(x * nInc, (y + 1000) * nInc);  // Add noise to phase offset
				var xPos = x / nTiles * thisWidth;

				// Move to where sine will be drawn on screen
				translate(xPos, yPos);

				// Rotate half of the sines
				if (random() < 0.5) {
					rotate(HALF_PI);
				}

				// Reverse direction for half of the sines
				var thisPhase = phase;
				if (random() < 0.5) {
					thisPhase = 1.0 - thisPhase;
				}

				stroke(255);

				// Select frequency / period of sine
				// var freq = pow(2, 3) + pow(level * 10, random(3));
				// var freq = 30;
				// var freq = level * 10;
				var freq = pow(level * 10, random(2));
				// var freq = pow(level, random(5));

				// Draw the wave
				drawWave(w * (level), freq, amp * n * thisScale * 0.5, n * TAU + thisPhase * TAU);
				// drawWave(w * 0.5, freq, amp * n * thisScale * 0.5, n * TAU + thisPhase * TAU);

				pop();
			}
		}

		// Update phasor
		phase += phaseInc;
	}
}