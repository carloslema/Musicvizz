var CLIENT_ID = '69054bf89e340d3b5b2f5678d5b6650b';
var TRACK_URL = '';

// sketch variables
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

    // DEBUG: Uncomment to print the stream URL
    // console.log("Stream Url: " + streamUrl + '\n');

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

// anything that should be in setup but should
// only happen once the song has been loaded
function trackReady() {
  // song has loaded, set flag
  flag = true;
  // source can be played
}

function setup() {
  // visual set up (not relating to song)
}

function draw() {
  // all things drawn based on music
  // flag = true --> song has been successfully loaded
  if(flag) {
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
}

function keyPressed() {
  if (key == ' ') {
    toggleSong();
  }
}

// pause / play soundcloud song
function toggleSong() {
  if(flag) {
    if(source.isPlaying()) {
      // pause
      source.pause();
      document.getElementById("guide").style.visibility = "visible";

    } else {
      // play
      source.play();
      document.getElementById("guide").style.visibility = "hidden";
    }
  }
}
