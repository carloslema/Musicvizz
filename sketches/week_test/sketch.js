var audioClient;
var scene, camera, renderer, clock, controls;
var controls;
var proton, emitter;
var camera, scene, renderer, stats, clock, controls;
var rate = 0;
var point = new THREE.Vector2(0.8, 0.5);
function startClicked() {
  document.getElementsByClassName("button-container")[0].style.visibility = "hidden";
  document.getElementsByClassName("loader-container")[0].style.visibility = "visible";
  beginAudioProcessing();
}

function beginAudioProcessing() {
  audioClient = new AudioHelper();
  audioClient.setupAudioProcessing();
  audioClient.loadFile("../../audio/1950.mp3")
    .then(init)
    .then(() => {
      audioClient.onAudioProcess(function () {
        var frequencyData = audioClient.getFrequencyData();
        var freqAvg = audioClient.getAverage(frequencyData);

        emitter.addBehaviour(new Proton.Rotate(freqAvg, freqAvg));
        emitter.addBehaviour(new Proton.Scale(1, freqAvg*0.1));
        emitter.addBehaviour(new Proton.Alpha(1, 0, Infinity, Proton.easeInQuart));

        emitter.addInitialize(new Proton.Life(2, 4));
        emitter.addInitialize(new Proton.Radius(100));

        // emitter.addInitialize(new Proton.Velocity(freqAvg*2, new Proton.Vector3D(0, 1, 1), 180));

        // emitter.p.x += freqAvg*0.1;
        // emitter.p.y += freqAvg*0.01;

        // console.log("x: " + emitter.p.x);
        // console.log("y: " + emitter.p.y);
      
        proton.update();
        renderer.render(scene, camera);
        camera.lookAt(scene.position);

        rate += 0.02;
        // console.log("freq" + freqAvg);
        camera.position.x = Math.sin(rate) + (freqAvg*10);
        camera.position.z = Math.cos(rate) + (freqAvg*10);
      });
    });
}

function init() {
  // SCENE
  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.z = 500;

  scene = new THREE.Scene();

  clock = new THREE.Clock();

  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor("#1B3DAE");

  // LIGHTS
  var ambientLight = new THREE.AmbientLight(0x101010);
  scene.add(ambientLight);
  var pointLight = new THREE.PointLight(0xffffff, 2, 1000, 1);
  pointLight.position.set(0, 200, 200);
  scene.add(pointLight);

  document.getElementById("webgl").appendChild(renderer.domElement);
  document.getElementsByClassName("loader-container")[0].style.visibility = "hidden";
  showControls();

  // PROTON
  initProton();
};

function initProton() {
  proton = new Proton();
  proton.addEmitter(createEmitter());
  proton.addRender(new Proton.SpriteRender(scene));
}

function createSprite() {
  var map = new THREE.TextureLoader().load("../week_07/particle.jpg");
  var material = new THREE.SpriteMaterial({
    map: map,
    color: 0xFD0B0B,
    blending: THREE.AdditiveBlending,
    fog: true
  });
  return new THREE.Sprite(material);
}

function createEmitter() {
  emitter = new Proton.Emitter();
  emitter.rate = new Proton.Rate(new Proton.Span(5, 10), new Proton.Span(.1, .25));
  emitter.addInitialize(new Proton.Mass(1));
  // emitter.addInitialize(new Proton.Radius(100));
  // emitter.addInitialize(new Proton.Life(2, 4));
  emitter.addInitialize(new Proton.Body(createSprite()));
  emitter.addInitialize(new Proton.Position(new Proton.BoxZone(100)));
  emitter.addInitialize(new Proton.Velocity(250, new Proton.Vector3D(0, 1, 1), 180));

  // //emitter.addBehaviour(new Proton.RandomDrift(30, 30, 30, .05));
  // emitter.addBehaviour(new Proton.Rotate("random", "random"));
  // emitter.addBehaviour(new Proton.Scale(1, 0.5));
  // emitter.addBehaviour(new Proton.Alpha(1, 0, Infinity, Proton.easeInQuart));

  emitter.addBehaviour(new Proton.Color(0xFD0B0B, 0xFFE347, Infinity, Proton.easeOutQuart));
  emitter.p.x = 0;
  emitter.p.y = 0;
  emitter.emit();
  return emitter;
}


document.getElementById("mute").onclick = function () {
  toggleMuteControl();
  audioClient.toggleSound();
}

document.getElementById("unmute").onclick = function () {
  toggleUnmuteControl();
  audioClient.toggleSound();
}
