var visualizer;

document.onreadystatechange = function () {
  if (document.readyState == "interactive") {
    visualizer = new AudioVisualizer();
    visualizer.setupAudioProcessing();
    visualizer.loadFile("../../audio/magic_coldplay.mp3", init);
  }
}

// Three.js Initialization
function init() {
  var scene = new THREE.Scene();

  // Setup camera
  var aspectRatio = window.innerWidth / window.innerHeight;
  var camera = new THREE.PerspectiveCamera(45,
    aspectRatio,
    1,
    100
  );

  // Camera's initial position
  camera.position.z = 30;
  camera.position.x = 0;
  camera.position.y = 20;
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  // Setup particle geometry
  var particleGeo = new THREE.SphereGeometry(10, 64, 64);
  particleGeo.vertices.forEach(function(vertex) {
    vertex.x += (Math.random() - 0.5);
    vertex.y += (Math.random() - 0.5);
    vertex.z += (Math.random() - 0.5);
  });

  var particleMat = new THREE.PointsMaterial({
    color: '#9aa6bc',
    size: 0.25,
    map: new THREE.TextureLoader().load('particle.jpg'),
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  var particleSystem = new THREE.Points(
    particleGeo,
    particleMat
  );
  particleSystem.name = 'particleSystem';

  scene.add(particleSystem);

  var renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.setClearColor('#1c3049');

  var controls = new THREE.OrbitControls( camera, renderer.domElement );

  document.getElementById('webgl').appendChild(renderer.domElement);

  update(renderer, scene, camera, controls);
}

function update(renderer, scene, camera, controls) {
  controls.update();
  renderer.render(scene, camera);

  var frequencyData = this.visualizer.getFrequencyData();
  // frequencyData.forEach(function(byte) {
  // 	console.log(byte);
  // });


  var particleSystem = scene.getObjectByName('particleSystem');
  particleSystem.rotation.y += 0.005;

  requestAnimationFrame(function() {
    update(renderer, scene, camera, controls);
  });
}
