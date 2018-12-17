var audioClient;
var controls, world, emitter, texture;
var frequencyData = [0];
var freqAvg = 0;
var delta = 0;
var min = 100;
var max = -100;

function startClicked() {
  document.getElementsByClassName("button-container")[0].style.visibility = "hidden";
  document.getElementsByClassName("button-container")[0].style.display = "none";
  document.getElementsByClassName("loader-container")[0].style.visibility = "visible";
  beginAudioProcessing();
}

world = tQuery.createWorld().boilerplate().start();
world.tRenderer().setClearColorHex(0x193631, world.tRenderer().getClearAlpha());

texture = THREE.ImageUtils.loadTexture("green.jpg");
emitter = Fireworks.createEmitter({ nParticles: 5 })
  .effectsStackBuilder()
  .spawnerSteadyRate(10)
  .position(Fireworks.createShapeSphere(0, 0, 0, 2))
  .velocity(Fireworks.createShapePoint(0, 0, 0))
  .createEffect('scale', {
    birthScale: 0.1,
    mulScale: 0.87
  }).onBirth(function (particle, deltaTime) {
    var object3d = particle.get('threejsObject3D').object3d;
    object3d.scale.set(this.opts.birthScale, this.opts.birthScale, this.opts.birthScale);
  }).onUpdate(function (particle, deltaTime) {
    var object3d = particle.get('threejsObject3D').object3d;
    var newScale;
    if(freqAvg < 20 || freqAvg > 80) {
      newScale = 0.8;
    } else {
      newScale = freqAvg.map(20, 80, 0.7, 1.5);
    }
    newScale = Math.round(newScale * 10) / 10
    object3d.scale.multiplyScalar(newScale);
    console.log("scale" + newScale);
    console.log("avg" + freqAvg);
    delta = deltaTime;
  }).back()
  .friction(0.85)
  .lifeTime(2, 4)
  .randomVelocityDrift(Fireworks.createVector(0.2, 0.2, 0.2))
  .renderToThreejsObject3D({
    container: world,
    create: function () {
      return new THREE.Sprite({
        map: texture,
        useScreenCoordinates: false,
        color: 0xFFFFFF,
        blending: THREE.AdditiveBlending,
      });
    }
  })
  .back()
  .start();

world.loop().hook(function (delta, now) {
  emitter.update(delta).render();
});

function beginAudioProcessing() {
  audioClient = new AudioHelper();
  audioClient.setupAudioProcessing();
  audioClient.loadFile("../../audio/yeb.mp3")
    .then(init)
    .then(() => {
      audioClient.onAudioProcess(function () {
        frequencyData = audioClient.getFrequencyData();
        freqAvg = audioClient.getAverage(frequencyData);
      });
    });
}

// https://gist.github.com/xposedbones/75ebaef3c10060a3ee3b246166caab56
Number.prototype.map = function (in_min, in_max, out_min, out_max) {
  return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

function init() {
  showControls();
  document.getElementsByClassName("loader-container")[0].style.visibility = "hidden";
  document.getElementsByClassName("loader-container")[0].style.display = "none";
};

document.getElementById("mute").onclick = function () {
  toggleMuteControl();
  audioClient.toggleSound();
}

document.getElementById("unmute").onclick = function () {
  toggleUnmuteControl();
  audioClient.toggleSound();
}
