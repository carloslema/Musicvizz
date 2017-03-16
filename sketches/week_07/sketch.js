var CLIENT_ID = '69054bf89e340d3b5b2f5678d5b6650b';
var TRACK_URL = 'https://soundcloud.com/undiscoveredsounds/coldplay-ft-beyonce-hymn-for-the-weekend-ash-remix';

// audio variables
var source;
var streamURL;
var flag = false;

function preload() {
  // Initialize Soundcloud API
  SC.initialize({
    client_id: CLIENT_ID
  });
  SC.resolve(TRACK_URL).then(function(track){
    // promise resolves with JSON
    // get stream Url from JSON
    streamUrl = track.stream_url + '?client_id=' + CLIENT_ID;

    // loadSound function
    // @param streamUrl: url of the song to load
    // @param trackReady: callback function that executes when streamUrl
    // successfully loads into source
    // @param soundError: this executes if streamUrl wasn't loaded successfully
    source = this.loadSound(streamUrl, trackReady, soundError);

    // DEBUG: Uncomment to print what the source is that you loaded (should be stream JSON)
    // console.log("source current: " + JSON.stringify(source));

  }).catch(function(error){
    // Error in network request
    console.log("Error getting track JSON: " + error + '\n');
  });
}

// sketch variables
var canvas;
var numReflections = 24;
var x = 0;
var u = 250;
var y  = 250;
var s = 16;
var m = 10;
var splatter = 0;
var h = 0;
var amplitude;
var beatThreshold;

var brush = {
  'x': 0,
  'y': 0,
  'distanceFromCenter': 0,
}


// anything that should be in setup but should
// only happen once the song has been loaded
function trackReady() {
  // song has loaded, set flag
  flag = true;
  amplitude = new p5.Amplitude();
  source.play();
  document.getElementById("play7").style.visibility = "hidden";
  document.getElementById("inspiration7").style.visibility = "hidden";
  amplitude.setInput(source);
  amplitude.smooth(0.9);
}

function setup() {
  // visual set up (not relating to song)
  canvas = createCanvas(windowWidth, windowHeight);
  colorMode(HSB);
  background(0);
}

function draw() {
  // all things drawn based on music
  // flag = true --> song has been successfully loaded
  if(flag) {
    var level = amplitude.getLevel();
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

// Helper Functions

// resize canvas on windowResized
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(0);
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
        else{
            beatCutoff *= beatDecayRate;
            beatCutoff = Math.max(beatCutoff, beatThreshold);
        }
    }
}

// sketch helper functions
function onBeat() {
    // solidBackground = color( random(100, 255), random(100, 255), random(100, 255) );
    // rectRotate = !rectRotate;
}
