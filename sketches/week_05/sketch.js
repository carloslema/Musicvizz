var audioClient;
var scene, camera, renderer, clock;

document.onreadystatechange = function () {
  if (document.readyState == "interactive") {
		audioClient = new AudioHelper();
		audioClient.setupAudioProcessing();
		audioClient.loadFile("../../audio/uandi.mp3")
		.then(init)
    .then(()=>{
      audioClient.onAudioProcess(function () {
        renderer.render(scene, camera);

				var elapsedTime = clock.getElapsedTime();
				// console.log("elapsed time: " + elapsedTime);
				var plane = scene.getObjectByName("plane-1");
				var planeGeo = plane.geometry;

				var frequencyData = audioClient.getFrequencyData();
				var freqAvg = audioClient.getAverage(frequencyData);
				planeGeo.vertices.forEach(function(vertex, index) {
					// every vertex samples diff math sin curve with index
					vertex.z += Math.sin(elapsedTime + index * 0.1) * (freqAvg * 0.0005);

				});
				planeGeo.verticesNeedUpdate = true;
      });
    });
  }
};

function init() {
	this.scene = new THREE.Scene();
	this.clock = new THREE.Clock();

	// initialize objects
	var planeMaterial = getMaterial("rgb(175, 175, 175)");
	var plane = getPlane(planeMaterial, 50, 60);

	plane.name = "plane-1";

	// manipulate objects
	plane.rotation.x = Math.PI/1.7;
	plane.rotation.z = Math.PI/4;

	// add objects to the scene
	scene.add(plane);

	this.camera = new THREE.PerspectiveCamera(
		45, // field of view
		window.innerWidth / window.innerHeight, // aspect ratio
		1, // near clipping plane
		1000 // far clipping plane
	);
	camera.position.z = 35;
	camera.position.x = 0;
	camera.position.y = 5;
	camera.lookAt(new THREE.Vector3(0, 0, 0));

	this.renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.shadowMap.enabled = true;
	document.getElementById("webgl").appendChild(renderer.domElement);
  document.getElementsByClassName("loader-container")[0].style.visibility = "hidden";
  showControls();
};

function getPlane(material, size, segments) {
	var geometry = new THREE.PlaneGeometry(size, size, segments, segments);
	material.side = THREE.DoubleSide;
	var obj = new THREE.Mesh(geometry, material);
	obj.receiveShadow = true;
	obj.castShadow = true;

	return obj;
}

function getMaterial(color) {
	var selectedMaterial;
	var materialOptions = {
		color: color === undefined ? "rgb(255, 255, 255)" : color,
		wireframe: true,
	};
	selectedMaterial = new THREE.MeshBasicMaterial(materialOptions);
	return selectedMaterial;
}


document.getElementById("mute").onclick = function() {
  toggleMuteControl();
  audioClient.toggleSound();
}

document.getElementById("unmute").onclick = function() {
  toggleUnmuteControl();
  audioClient.toggleSound();
}
