var mute = bodymovin.loadAnimation({
  container: document.getElementById('unmute'),
  renderer: 'svg',
  loop: false,
  autoplay: false,
  path: '../../css/mute.json'
});

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
    console.log("control: " + control);
    control.style.visibility = "visible";
  });
}
