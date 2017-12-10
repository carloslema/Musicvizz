var audioClient;
var scene, camera, renderer, clock;
var controls;
var bgColors;
var lastRange;
document.onreadystatechange = function () {
  if (document.readyState == "interactive") {
    audioClient = new AudioHelper();
    audioClient.setupAudioProcessing();
    audioClient.loadFile("../../audio/miley_we_cant_stop.mp3")
    .then(init)
    .then(()=>{
      audioClient.onAudioProcess(function () {
        renderer.render(scene, camera);

        var boxGrid = scene.getObjectByName('boxGrid');
        var timeElapsed = clock.getElapsedTime();
        var frequencyData = audioClient.getFrequencyData();
        var freqAvg = audioClient.getAverage(frequencyData);
        lastRange = freqAvg;
  

        // loop through each children in grid and animate y position
        // index available in forEach = each box samples diff portion of sin curve
        boxGrid.children.forEach(function(child, index) {
          // child.scale.y = Math.sin(timeElapsed); // values in between -1 and 1

          // make it go faster by multiplying  timeElapsed by value

          // child.scale.y = (Math.sin(timeElapsed) + 1) / 2; // values in between 0 and 1

          // child.scale.y = (Math.sin(freqAvg/10 + index) + 1) / 2 + 0.001; // so that it's never 0

// console.log(Math.ceil(freqAvg/10));



          child.scale.y = Math.abs(Math.cos(freqAvg/10));

          // update position y so that they remain on top of plane geometry
          child.position.y = child.scale.y;
        });


        //       var randomColor = "#000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);});
        //
        // renderer.setClearColor(randomColor);
      });
    });
  }
};

function init() {
  this.scene = new THREE.Scene();

  bgColors = [
    '#9F8AD6',
    '#F7488D',
    '#F0B7DC',
    '#65D3F8',
    '#F6BD9E',
    '#DB8ED6'
  ];

  var directionalLight = getDirectionalLight(1);
  var boxGrid = getBoxGrid(40, 5);
  boxGrid.name = 'boxGrid';

  var helper = new THREE.CameraHelper(directionalLight.shadow.camera);
  var ambientLight = getAmbientLight(2);

  directionalLight.intensity = 2;

  // shadows on side of object
  directionalLight.position.x = 13;
  directionalLight.position.y = 10;
  directionalLight.position.z = 10;

  scene.add(directionalLight);
  scene.add(boxGrid);
  scene.add(helper);
  scene.add(ambientLight);

  var gui = new dat.GUI();
  gui.add(directionalLight, 'intensity', 0, 10);
  gui.add(directionalLight.position, 'y', 0, 20);
  gui.add(directionalLight.position, 'x', 0, 20);
  gui.add(directionalLight.position, 'z', 0, 20);

  this.camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth/window.innerHeight,
    1,
    1000
  );

  camera.position.x = 1;
  camera.position.y = 2;
  camera.position.z = 5;
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  gui.add(camera.position, 'x', 0, 100);
  gui.add(camera.position, 'y', 0, 100);
  gui.add(camera.position, 'z', 0, 100);

  gui.add(camera.rotation, 'x', 0, Math.PI * 2);
  gui.add(camera.rotation, 'y', 0, Math.PI * 2);
  gui.add(camera.rotation, 'z', 0, Math.PI * 2);

  this.renderer = new THREE.WebGLRenderer();
  renderer.shadowMap.enabled = true;
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById('webgl').appendChild(renderer.domElement);

  this.controls = new THREE.OrbitControls(camera, renderer.domElement);
};

function getBox(w, h, d) {
  var geometry = new THREE.BoxGeometry(w, h, d);
  var material = new THREE.MeshPhongMaterial({
    color: 'rgb(120, 120, 120)'
  });
  var mesh = new THREE.Mesh(
    geometry,
    material
  );
  mesh.castShadow = true;

  return mesh;
}

function getBoxGrid(amount, separationMultiplier) {
  var group = new THREE.Group();

  for (var i=0; i<amount; i++) {
    var obj = getBox(1, 1, 1);
    obj.position.x = i * separationMultiplier;
    obj.position.y = obj.geometry.parameters.height/2;
    group.add(obj);
    for (var j=1; j<amount; j++) {
      var obj = getBox(1, 1, 1);
      obj.position.x = i * separationMultiplier;
      obj.position.y = obj.geometry.parameters.height/2;
      obj.position.z = j * separationMultiplier;
      group.add(obj);
    }
  }

  group.position.x = -(separationMultiplier * (amount-1))/2;
  group.position.z = -(separationMultiplier * (amount-1))/2;

  return group;
}

function getPointLight(intensity) {
  var light = new THREE.PointLight(0xffffff, intensity);
  light.castShadow = true;

  return light;
}

function getSpotLight(intensity) {
  var light = new THREE.SpotLight(0xffffff, intensity);
  light.castShadow = true;

  light.shadow.bias = 0.001;

  light.shadow.mapSize.width = 2048;
  light.shadow.mapSize.height = 2048;

  return light;
}

function getDirectionalLight(intensity) {
  var light = new THREE.DirectionalLight(0xffffff, intensity);
  light.castShadow = true;

  // default = -5 and 5
  light.shadow.camera.left = -10;
  light.shadow.camera.bottom = -10;
  light.shadow.camera.right = 10;
  light.shadow.camera.top = 10;

  return light;
}

function getAmbientLight(intensity) {
  var light = new THREE.AmbientLight('#F7488D', intensity);
  light.name = 'ambient-light';
  return light;
}
