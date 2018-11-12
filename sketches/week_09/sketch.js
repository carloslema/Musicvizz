var audioClient;
var scene, camera, renderer, clock, geometry;

var width = window.innerWidth,
  height = window.innerHeight;

var point = new THREE.Vector2(0.8, 0.5);

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
  audioClient.loadFile("../../audio/drive.mp3")
    .then(init)
    .then(() => {
      audioClient.onAudioProcess(function () {
        var frequencyData = audioClient.getFrequencyData();
        var freqAvg = audioClient.getAverage(frequencyData);
        TweenMax.to(point, 0.8, {
          y: (freqAvg * 10 / height),
          x: (freqAvg * 10 / width),
          ease: Power1.easeOut
        });
      });
    });
}

function init() {
  this.scene = new THREE.Scene();
  this.clock = new THREE.Clock();

  this.camera = new THREE.PerspectiveCamera(100, width / height, 0.1, 10000);
  this.camera.position.set(0, 0, 300);

  var hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x0C056D, 0.6);
  scene.add(hemisphereLight);

  var light = new THREE.DirectionalLight(0x590D82, 0.5);
  light.position.set(200, 300, 400);
  scene.add(light);

  var light2 = light.clone();
  light2.position.set(-200, 300, 400);
  scene.add(light2);

  this.geometry = new THREE.IcosahedronGeometry(200, 5);
  for (var i = 0; i < geometry.vertices.length; i++) {
    var vector = geometry.vertices[i];
    vector._o = vector.clone();
  }
  var material = new THREE.MeshPhongMaterial({
    emissive: 0xF6C7F1,
    emissiveIntensity: 0.4,
    shininess: 0
  });
  var shape = new THREE.Mesh(geometry, material);
  scene.add(shape);

  this.renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
  renderer.setSize(width, height);
  renderer.setClearColor(0xF6C7F1);

  // show visualization and hide loader
  document.getElementById("webgl").appendChild(renderer.domElement);
  showControls();
  document.getElementsByClassName("loader-container")[0].style.visibility = "hidden";

  requestAnimationFrame(render);
}

function updateVertices(time) {
  for (var i = 0; i < geometry.vertices.length; i++) {
    var vector = geometry.vertices[i];
    vector.copy(vector._o);
    var perlin = noise.simplex3(
      (vector.x * 0.006) + (time * 0.0002),
      (vector.y * 0.006) + (time * 0.0003),
      (vector.z * 0.006)
    );
    var ratio = ((perlin * 0.4 * (point.y + 0.1)) + 0.8);
    vector.multiplyScalar(ratio);
  }
  geometry.verticesNeedUpdate = true;
}

function render(time) {
  requestAnimationFrame(render);
  updateVertices(time);
  renderer.render(scene, camera);
}

document.getElementById("mute").onclick = function () {
  toggleMuteControl();
  audioClient.toggleSound();
}

document.getElementById("unmute").onclick = function () {
  toggleUnmuteControl();
  audioClient.toggleSound();
}
