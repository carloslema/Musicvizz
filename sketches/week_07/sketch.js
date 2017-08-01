var CLIENT_ID = '69054bf89e340d3b5b2f5678d5b6650b';
var TRACK_URL = 'https://soundcloud.com/undiscoveredsounds/coldplay-ft-beyonce-hymn-for-the-weekend-ash-remix';

// audio variables
var source, streamURL;
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
var nReflections = 30;
var counter = 0;
var x = 0;
var u = 300;
var y  = 300;
var m = 10;
var h = 0;
var amplitude, beatThreshold;

function updateBrush() {
  var factor = amplitude.getLevel() * (windowWidth);
  var xOffset = 0;
  if(factor > 100) {
    xOffset = random(0, 75);
      if(factor > 200) {
        xOffset = random(100, 175);
        if(factor > 400) {
          xOffset = random(200, 275);
          if(factor > 600) {
            xOffset = random(300, 375);
          }
        }
      }
  }
  // console.log(factor);
  brush.x = factor;
  brush.y = factor;
}

var brush = {
  x: 0,
  x: 0,
  distanceFromCenter: 0,
  diameter: 30
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

function pressBrush() {
    // noFill();
    noStroke();
    fill(h, 100, 100);
    ellipse(0, 0, brush.diameter, brush.diameter);
    h = (h + 3) % 360;
}

function setup() {
  // visual set up (not relating to song)
  canvas = createCanvas(windowWidth, windowHeight);
  colorMode(HSB);
  background(0);
}

Number.prototype.roundTo = function(num) {
    var resto = this%num;
    if (resto <= (num/2)) {
        return this-resto;
    } else {
        return this+num-resto;
    }
}

function draw() {
  // all things drawn based on music
  // flag = true --> song has been successfully loaded
  if(flag) {
    counter ++;
    var level = amplitude.getLevel();

    updateBrush();

    // Get the angle and distance from draw point to center
    var x = brush.x - width / 2;
    var y = brush.y - height / 2;
    var center = createVector(0, 0);
    var position = createVector(x, y);
    var angle = atan2(position.y - center.y, position.x - center.x);
    var magnitude = center.dist(position);
    brush.distanceFromCenter = magnitude;
    brush.diameter = (1000 - brush.distanceFromCenter) / 10;

    console.log(brush.distanceFromCenter);
    // nReflections = brush.distanceFromCenter/30;
    var baseAngle = 1 / nReflections * TAU;
    push();
    translate(width / 2, height / 2);
    for (var i = 0; i < nReflections; i++) {
      // Calculate the angle of this angle
      thisAngle = i * baseAngle;
      if (i % 2 === 0) {
        thisAngle += angle;
      } else {
        thisAngle += baseAngle - angle;
      }

      // Creat the draw point
      var v = p5.Vector.fromAngle(thisAngle);
      v.mult(magnitude);
      v.add(center);

      push();
      translate(v.x, v.y);

      // Rotate
      if (i % 2 === 0) {
        rotate(thisAngle);
      } else {
        rotate(thisAngle);
      }

      // Draw
      pressBrush();

      pop();
    }

    pop();
  }
  if(counter % 300 == 0) {
    background(0);
  }
}

// resize canvas on windowResized
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(0);
}

// handle song errors
function soundError(e) {
  console.log('New error:');
  console.log('- name: ' + e.name);
  console.log('- message: ' + e.message);
  console.log('- stack: ' + e.stack);
  console.log('- failed path: ' + e.failedPath);
}
