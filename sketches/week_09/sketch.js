var CLIENT_ID = '69054bf89e340d3b5b2f5678d5b6650b';
var TRACK_URL = 'https://soundcloud.com/botanicalesounds/childish-gambino-redbone-slowed-chopped';

// sketch variables
var source;
var streamURL;
var flag = false;
var amplitude;

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
  amplitude = new p5.Amplitude();
  // source can be played, hide advisements/credits
  source.play();
  document.getElementById("play").style.visibility = "hidden";
  document.getElementById("inspiration").style.visibility = "hidden";
  amplitude.setInput(source);
  amplitude.smooth(0.9);
}

function setup() {
  // visual set up (not relating to song)
  canvas = createCanvas(windowWidth, windowHeight);
  background('#0F1D3D')
  strokeWeight(3);
  stroke('#42C1F4');
}

function draw() {
  // all things drawn based on music
  // flag = true --> song has been successfully loaded
  if(flag) {
  var level = amplitude.getLevel();
    background('#0F1D3D')
    translate(width/2, height/2);
    for (var i = -180; i < 180; i+=3) {
      var angle = sin(radians(-sin(radians(i*map(level*5500, 0, width, 0, 5)))*i+frameCount*2))*40;
      // console.log(mouseX);
      var x = sin(radians(i))*(50-angle/3);
      var y = cos(radians(i))*(100-angle/3);
      var x2 = sin(radians(i))*(300-angle);
      var y2 = cos(radians(i))*(300-angle);
      line(x, y, x2, y2);
    }
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
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background('#0F1D3D')
}
