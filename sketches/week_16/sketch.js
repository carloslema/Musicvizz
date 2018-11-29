/**
 *  Re-group the FFT into more meaningful values by 
 *  splitting into one-third-octave bands,
 *  and by smoothing each point with its neighbors.
 *  
 *  Plot over time.
 */
var song;
var amplitude;
var level;
var gain;
var colors;

var source, fft;

// windowHeight of fft == windowHeight/divisions
var divisions = 4;
var cnv;
var speed = 10;

function preload() {
  song = loadSound("../../audio/runaway.mp3");
}

function startClicked() {
  document.getElementsByClassName("button-container-p5")[0].style.visibility = "hidden";
  song.play();
  // fft.setInput(song);
}

function setup() {
  // background(220, 220, 220);
  // background("#462F4E");
  background("#CCC6FF");

  cnv = createCanvas(windowWidth, windowHeight);
  noFill();
  // stroke(100, 255, 222);
  stroke(255);

  amplitude = new p5.Amplitude();
  song.disconnect();

  gain = new p5.Gain();
  gain.setInput(song);
  gain.connect();

  showControls();

  amplitude.setInput(song);
  amplitude.smooth(.9);

  fft = new p5.FFT(0.9, 1024);

  gain.amp(1, 0.5, 0);
  // colors = ['#1623CF', '#66F5FF', '#9002F5', '#FE01EA', '#FF0178'];
  // colors = ['#E6B831', '#8C2B55'];
  // colors = ['#E6B831'];
  colors = ['#6AA399'];
}

function draw() {
  if (song.isPlaying()) {
    level = amplitude.getLevel()*20;
    var h = windowHeight / divisions;
    var spectrum = fft.analyze();
    var newBuffer = [];

    var scaledSpectrum = splitOctaves(spectrum, 12);
    var len = scaledSpectrum.length;

    // var col = colors[Math.floor(Math.random() * colors.length)];
    // stroke(col);
    stroke(255);
    strokeWeight(level);

    // background(200, 200, 200, 1);
    // background(70, 47, 78);
    // background("#462F4E");
    background("#CCC6FF");
    // background("#FFF882")
    // copy before clearing the background
    copy(cnv, 0, 0, windowWidth, windowHeight, 0, level, windowWidth, windowHeight);

    // draw shape
    beginShape();

    // one at the far corner
    curveVertex(0, h);

    for (var i = 0; i < len; i++) {
      var point = smoothPoint(scaledSpectrum, i, 2);
      var x = map(i, 0, len - 1, 0, windowWidth);
      var y = map(point, 0, 255, h, 0);
      curveVertex(x, y);
    }

    // one last point at the end
    curveVertex(windowWidth, h);

    endShape();
  }
}


/**
 *  Divides an fft array into octaves with each
 *  divided by three, or by a specified "slicesPerOctave".
 *  
 *  There are 10 octaves in the range 20 - 20,000 Hz,
 *  so this will result in 10 * slicesPerOctave + 1
 *
 *  @method splitOctaves
 *  @param {Array} spectrum Array of fft.analyze() values
 *  @param {Number} [slicesPerOctave] defaults to thirds
 *  @return {Array} scaledSpectrum array of the spectrum reorganized by division
 *                                 of octaves
 */
function splitOctaves(spectrum, slicesPerOctave) {
  var scaledSpectrum = [];
  var len = spectrum.length;

  // default to thirds
  var n = slicesPerOctave || 3;
  var nthRootOfTwo = Math.pow(2, 1 / n);

  // the last N bins get their own 
  var lowestBin = slicesPerOctave;

  var binIndex = len - 1;
  var i = binIndex;

  while (i > lowestBin) {
    var nextBinIndex = round(binIndex / nthRootOfTwo);
    if (nextBinIndex === 1) return;
    var total = 0;
    var numBins = 0;
    // add up all of the values for the frequencies
    for (i = binIndex; i > nextBinIndex; i--) {
      total += spectrum[i];
      numBins++;
    }
    // divide total sum by number of bins
    var energy = total / numBins;
    scaledSpectrum.push(energy);
    // keep the loop going
    binIndex = nextBinIndex;
  }

  // add the lowest bins at the end
  for (var j = i; j > 0; j--) {
    scaledSpectrum.push(spectrum[j]);
  }

  // reverse so that array has same order as original array (low to high frequencies)
  scaledSpectrum.reverse();

  return scaledSpectrum;
}


// average a point in an array with its neighbors
function smoothPoint(spectrum, index, numberOfNeighbors) {

  // default to 2 neighbors on either side
  var neighbors = numberOfNeighbors || 2;
  var len = spectrum.length;

  var val = 0;

  // start below the index
  var indexMinusNeighbors = index - neighbors;
  var smoothedPoints = 0;

  for (var i = indexMinusNeighbors; i < (index + neighbors) && i < len; i++) {
    // if there is a point at spectrum[i], tally it
    if (typeof (spectrum[i]) !== 'undefined') {
      val += spectrum[i];
      smoothedPoints++;
    }
  }

  val = val / smoothedPoints;

  return val;
}