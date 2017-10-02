var audioClient;
var scene, camera, renderer, clock;
var controls;
var bgColors;
var lastRange;
document.onreadystatechange = function () {
  if (document.readyState == "interactive") {
    audioClient = new AudioHelper();
    audioClient.setupAudioProcessing();
    audioClient.loadFile("../../audio/ocean_eyes.mp3")
    .then(init)
    .then(()=>{
      audioClient.onAudioProcess(function () {
        renderer.render(scene, camera);
      });
    });
  }
};

function init() {
}
