var mute = bodymovin.loadAnimation({
  container: document.getElementById('unmute'),
  renderer: 'svg',
  loop: false,
  autoplay: false,
  path: '../../css/mute.json'
});

var next = bodymovin.loadAnimation({
  container: document.getElementById('next'),
  renderer: 'svg',
  loop: false,
  autoplay: false,
  path: '../../css/next.json'
});

var prev = bodymovin.loadAnimation({
  container: document.getElementById('prev'),
  renderer: 'svg',
  loop: false,
  autoplay: false,
  path: '../../css/prev.json'
});

function nextMouseDown() {
  next.playSegments([
    [0, 20]
  ], true);
}

function prevMouseDown() {
  prev.playSegments([
    [0, 20]
  ], true);
}

function nextMouseUp(num) {
  next.playSegments([
    [20, 39]
  ], true);
  window.location.replace("http://wklymotion.com/sketches/week_" + num + "/index.html");
}

function prevMouseUp(num) {
  prev.playSegments([
    [20, 39]
  ], true);
  window.location.replace("http://wklymotion.com/sketches/week_" + num + "/index.html");
}

function toggleMuteControl() {
  document.getElementById("mute").style.display = "none";
  mute.playSegments([
    [0, 30]
  ], true);
}

function toggleUnmuteControl() {
  document.getElementById("mute").style.display = "inline";
  mute.playSegments([
    [30, 0]
  ], true);
}

function showControls() {
  var controls = document.getElementsByClassName("control");
  [].forEach.call(controls, function (control) {
    control.style.visibility = "visible";
  });
}
