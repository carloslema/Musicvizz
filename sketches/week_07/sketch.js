var visualizer;
var scene, camera, renderer;
var controls;
var flip = 0;
document.onreadystatechange = function () {
  if (document.readyState == "interactive") {
    visualizer = new AudioHelper();
    visualizer.setupAudioProcessing();
    visualizer.loadFile("../../audio/magic_coldplay.mp3")
    .then(init)
    .then(()=>{
      visualizer.onAudioProcess(function () {
        renderer.render(scene, camera);
        controls.update();

        var frequencyData = visualizer.getFrequencyData();
        var particleSystem = scene.getObjectByName('particleSystem');
        var freqAvg = visualizer.getAverage(frequencyData);

        var rotation = ((360 * Math.round(freqAvg)) / 140) * (Math.PI / 180);
        particleSystem.rotation.y += Math.ceil(Math.sin(rotation)) * 0.09;
        particleSystem.rotation.x += Math.ceil(Math.sin(rotation)) * 0.09;
        particleSystem.rotation.z += Math.ceil(Math.sin(rotation)) * 0.09;
      });
    });
  }
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

  // Camera's initial position
  this.camera.position.z = 30;
  this.camera.position.x = 0;
  this.camera.position.y = 20;
  this.camera.lookAt(new THREE.Vector3(0, 0, 0));

  // Setup particle geometry
  var particleGeo = new THREE.SphereGeometry(10, 48, 48);
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

  this.renderer = new THREE.WebGLRenderer();
  this.renderer.setSize(window.innerWidth, window.innerHeight);
  this.renderer.shadowMap.enabled = true;
  this.renderer.setClearColor('#1c3049');

  controls = new THREE.OrbitControls( camera, renderer.domElement );

  document.getElementById('webgl').appendChild(renderer.domElement);
};
