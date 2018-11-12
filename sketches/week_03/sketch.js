var audioClient;
var scene, camera, renderer, clock;
var controls;
var colors;
var pinkDirectionalLight, blueDirectionalLight, ambientLight;
var count = 0;
var switchDirection, rotationZ = true;
var frameCount = 0;

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
  audioClient.loadFile("../../audio/miley_we_cant_stop.mp3")
    .then(init)
    .then(() => {
      audioClient.onAudioProcess(function () {

        renderer.render(scene, camera);
        frameCount++;
        var boxGrid = scene.getObjectByName("boxGrid");
        var timeElapsed = clock.getElapsedTime();
        var frequencyData = audioClient.getFrequencyData();
        var freqAvg = audioClient.getAverage(frequencyData);

        var lowerBound = 2;
        var upperBound = 100;
        var increment = 1;
        if (camera.position.y < lowerBound || camera.position.y > upperBound) {
          switchDirection = !switchDirection;
        }
        if (switchDirection) {
          camera.position.y -= increment;
          camera.rotation.y -= 0.01;
          camera.rotation.x -= 0.01;
        } else {
          camera.position.y += increment;
          camera.rotation.y += 0.01;
          camera.rotation.x += 0.01;
        }

        var rotationBound = Math.PI / 2;
        var incrementZ = 0.02;
        if (freqAvg > 80) {
          rotationZ = !rotationZ;
          if (freqAvg > 85) {
            var temp = ["#9F8AD6", "#F7488D", "#F0B7DC", "#F6BD9E", "#DB8ED6", "#000000"];
            var col = temp[Math.floor(Math.random() * temp.length)];
            renderer.setClearColor(col);
          }
        }
        if (rotationZ) {
          camera.rotation.z -= incrementZ;
        } else {
          camera.rotation.z += incrementZ;
        }

        var h = count * 0.01 % 1;
        var s = 0.2;
        var l = 0.5;
        ambientLight.color.setHSL(h, s, l);

        boxGrid.children.forEach(function (child, index) {
          var k = 0;
          var scale = (frequencyData[k] + audioClient.boost) / 10;
          child.scale.y = (scale < 1 ? 1 : scale);
          k += (k < frequencyData.length ? 1 : 0);
        });

      });
    });
}

function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function init() {
  this.scene = new THREE.Scene();
  this.clock = new THREE.Clock();

  colors = {
    "purple": "#9F8AD6",
    "bright_pink": "#F7488D",
    "light_pink": "#F0B7DC",
    "blue": "#65D3F8",
    "orange": "#F6BD9E",
    "pink": "#DB8ED6"
  };

  pinkDirectionalLight = getDirectionalLight(1, colors.pink);
  blueDirectionalLight = getDirectionalLight(2, colors.blue);

  var boxGrid = getBoxGrid(40, 5);
  boxGrid.name = "boxGrid";

  // var helper = new THREE.CameraHelper(pinkDirectionalLight.shadow.camera);
  ambientLight = getAmbientLight(2, colors.bright_pink);

  // shadows on side of object
  pinkDirectionalLight.position.x = 13;
  pinkDirectionalLight.position.y = 10;
  pinkDirectionalLight.position.z = 10;

  blueDirectionalLight.position.x = 30;
  blueDirectionalLight.position.y = 10;
  blueDirectionalLight.position.z = 20;

  scene.add(pinkDirectionalLight);
  scene.add(blueDirectionalLight);
  scene.add(boxGrid);
  // scene.add(helper);
  scene.add(ambientLight);

  this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);

  camera.position.x = 0;
  camera.position.y = 100;
  camera.position.z = 0;
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  this.renderer = new THREE.WebGLRenderer();
  renderer.shadowMap.enabled = true;
  renderer.setSize(window.innerWidth, window.innerHeight);

  this.controls = new THREE.OrbitControls(camera, renderer.domElement);

  // show visualization and hide loader
  document.getElementById("webgl").appendChild(renderer.domElement);
  showControls();
  document.getElementsByClassName("loader-container")[0].style.visibility = "hidden";
};

function getBox(w, h, d, col) {
  var geometry = new THREE.BoxGeometry(w, h, d);
  var material = new THREE.MeshPhongMaterial({
    color: col
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
  for (var i = 0; i < amount; i++) {
    var col = i % 2 == 0 ? colors.pink : colors.bright_pink;
    var obj = getBox(1, 1, 1, col);
    obj.position.x = i * separationMultiplier;
    obj.position.y = obj.geometry.parameters.height / 2;
    group.add(obj);
    for (var j = 1; j < amount; j++) {
      var col = j % 2 == 0 ? colors.pink : colors.bright_pink;
      var obj = getBox(1, 1, 1, col);
      obj.position.x = i * separationMultiplier;
      obj.position.y = obj.geometry.parameters.height / 2;
      obj.position.z = j * separationMultiplier;
      group.add(obj);
    }
  }
  group.position.x = -(separationMultiplier * (amount - 1)) / 2;
  group.position.z = -(separationMultiplier * (amount - 1)) / 2;
  return group;
}

function getPointLight(intensity, color) {
  var light = new THREE.PointLight(color, intensity);
  light.castShadow = true;
  return light;
}

function getSpotLight(intensity, color) {
  var light = new THREE.SpotLight(color, intensity);
  light.castShadow = true;
  light.shadow.bias = 0.001;
  light.shadow.mapSize.width = 2048;
  light.shadow.mapSize.height = 2048;
  return light;
}

function getDirectionalLight(intensity, color) {
  var light = new THREE.DirectionalLight(color, intensity);
  light.castShadow = true;
  light.shadow.camera.left = -10;
  light.shadow.camera.bottom = -10;
  light.shadow.camera.right = 10;
  light.shadow.camera.top = 10;
  return light;
}

function getAmbientLight(intensity, color) {
  var light = new THREE.AmbientLight(color, intensity);
  light.name = "ambient-light";
  return light;
}

document.getElementById("mute").onclick = function () {
  toggleMuteControl();
  audioClient.toggleSound();
}

document.getElementById("unmute").onclick = function () {
  toggleUnmuteControl();
  audioClient.toggleSound();
}
