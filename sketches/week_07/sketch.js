var audioClient;
var scene, camera, renderer;

function startClicked() {
  // hide button and show loader
  // TODO: animate button into loader animateStart()
  document.getElementsByClassName("button-container")[0].style.visibility = "hidden";
  document.getElementsByClassName("loader-container")[0].style.visibility = "visible";
  beginAudioProcessing();
}

function animateStart() {
  // document.getElementById("start-animate").classList.add('button-animated');
}

function beginAudioProcessing() {
  audioClient = new AudioHelper();
  audioClient.setupAudioProcessing();
  audioClient.loadFile("../../audio/onemore.mp3")
    .then(init)
    .then(() => {
      audioClient.onAudioProcess(function () {
        renderer.render(scene, camera);
        var frequencyData = audioClient.getFrequencyData();
        var particleSystem = scene.getObjectByName("particleSystem");
        var freqAvg = audioClient.getAverage(frequencyData);
        var rotation = ((360 * Math.round(freqAvg)) / 140) * (Math.PI / 180);
        particleSystem.rotation.y += Math.ceil(Math.sin(rotation)) * 0.09;
        particleSystem.rotation.x += Math.ceil(Math.sin(rotation)) * 0.09;
        particleSystem.rotation.z += Math.ceil(Math.sin(rotation)) * 0.09;
      });
    });
}

// Three.js Initialization
function init() {
  this.scene = new THREE.Scene();

  // Setup camera
  var aspectRatio = window.innerWidth / window.innerHeight;
  this.camera = new THREE.PerspectiveCamera(45,
    aspectRatio,
    1,
    100
  );

  // Camera"s initial position
  this.camera.position.z = 30;
  this.camera.position.x = 0;
  this.camera.position.y = 20;
  this.camera.lookAt(new THREE.Vector3(0, 0, 0));

  // Setup particle geometry
  var particleGeo = new THREE.SphereGeometry(10, 48, 48);

  particleGeo.vertices.forEach(function (vertex) {
    vertex.x += (Math.random() - 0.5);
    vertex.y += (Math.random() - 0.5);
    vertex.z += (Math.random() - 0.5);
  });

  var particleMat = new THREE.PointsMaterial({
    color: "#9AA6BC",
    size: 0.25,
    map: new THREE.TextureLoader().load("particle.jpg"),
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  var particleSystem = new THREE.Points(
    particleGeo,
    particleMat
  );

  particleSystem.name = "particleSystem";

  scene.add(particleSystem);

  this.renderer = new THREE.WebGLRenderer();
  this.renderer.setSize(window.innerWidth, window.innerHeight);
  this.renderer.shadowMap.enabled = true;
  this.renderer.setClearColor("#1C3049");

  // show visualization and hide loader
  document.getElementById("webgl").appendChild(renderer.domElement);
  showControls();
  document.getElementsByClassName("loader-container")[0].style.visibility = "hidden";
};

document.getElementById("mute").onclick = function () {
  toggleMuteControl();
  audioClient.toggleSound();
}

document.getElementById("unmute").onclick = function () {
  toggleUnmuteControl();
  audioClient.toggleSound();
}