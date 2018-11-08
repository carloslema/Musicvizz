var camera, tick = 0,
	scene, renderer, clock = new THREE.Clock(),
	controls, container,
	options, spawnerOptions, particleSystem;
	// var gui = new dat.GUI({ width: 350 });
var max = 0;

var startTime, currentTime;

function initializsetime() {
	startTime = new Date();
}

document.onreadystatechange = function () {
	if (document.readyState == "interactive") {
		audioClient = new AudioHelper();
		audioClient.setupAudioProcessing();
		audioClient.loadFile("../../audio/thanku.mp3")
			.then(init)
			.then(animate)
			.then(initializsetime)
			.then(() => {
				audioClient.onAudioProcess(function () {
					currentTime = new Date();
					var seconds = (currentTime - startTime) / 1000;
					controls.update();

					var frequencyData = audioClient.getFrequencyData();
					var freqAvg = audioClient.getAverage(frequencyData);
					var floatFreq = audioClient.getFrequencyDataFloat();
					if (freqAvg > max) {
						max = freqAvg;
					}
					var delta = freqAvg / 2000;
					tick += delta;
					if (tick < 0) tick = 0;

					if (delta > 0) {

						// console.log(max);
						// lifetime = 1 to 10
						// freq approx 0 to 125
						options.lifetime = freqAvg / 13;

						// size = 5 to 10
						// freq approx 0 to 125
						// options.lifetime = ;
						options.size = freqAvg / 8;

						if (seconds >= 9 && seconds <= 12) {
							// sean
							options.color = new THREE.Color( 0x05EDFF );
							
						}
						if (seconds > 13 && seconds <= 16) {
							// ricky
							options.color = new THREE.Color( 0x1464F4 );
						}
						if (seconds > 17 && seconds <= 20) {
							// pete
							options.color = new THREE.Color( 0x6666FF );
						}
						if (seconds > 21 && seconds <= 25) {
							// malcolm
							options.color = new THREE.Color( 0xFFFFFF );
						}
						if (seconds > 25) {
							// regular
							options.color = new THREE.Color( 0xAE7FAB );
						}
						console.log(options.color);


						// options.position.x = Math.sin(tick * spawnerOptions.horizontalSpeed) * 5 + (freqAvg/20);
						// options.position.y = Math.sin(tick * spawnerOptions.verticalSpeed) * 2 * (freqAvg/20);

						options.position.x = Math.sin(tick * spawnerOptions.horizontalSpeed) * 20;
						options.position.y = Math.sin(tick * spawnerOptions.verticalSpeed) * 10;
						// console.log(freqAvg);
						options.position.z = Math.sin(tick * spawnerOptions.horizontalSpeed + spawnerOptions.verticalSpeed) * 5 + (freqAvg / 20);
						for (var x = 0; x < spawnerOptions.spawnRate * delta; x++) {
							// Spawning particles is super cheap, and once you spawn them, the rest of
							// their lifecycle is handled entirely on the GPU, driven by a time uniform updated below
							particleSystem.spawnParticle(options);
						}
					}
					particleSystem.update(tick);
					render();
				});
			});
	}
}


function init() {
	container = document.getElementById('webgl');
	camera = new THREE.PerspectiveCamera(28, window.innerWidth / window.innerHeight, 1, 10000);
	camera.position.z = 60;
	scene = new THREE.Scene();
	// The GPU Particle system extends THREE.Object3D, and so you can use it
	// as you would any other scene graph component.	Particle positions will be
	// relative to the position of the particle system, but you will probably only need one
	// system for your whole scene
	particleSystem = new THREE.GPUParticleSystem({
		maxParticles: 250000
	});
	scene.add(particleSystem);
	// options passed during each spawned
	options = {
		position: new THREE.Vector3(),
		positionRandomness: .5,
		velocity: new THREE.Vector3(),
		velocityRandomness: .5,
		color: 0xAE7FAB,
		colorRandomness: .2,
		turbulence: .5,
		lifetime: 2,
		size: 11,
		sizeRandomness: 1
	};
	spawnerOptions = {
		spawnRate: 2000,
		horizontalSpeed: 1.5,
		verticalSpeed: 1.33,
		timeScale: 1
	};
	//
	// gui.add(options, "velocityRandomness", 0, 3);
	// gui.add(options, "positionRandomness", 0, 3);
	// gui.add(options, "size", 1, 20);
	// gui.add(options, "sizeRandomness", 0, 25);
	// gui.add(options, "colorRandomness", 0, 1);
	// gui.add(options, "lifetime", .1, 10);
	// gui.add(options, "turbulence", 0, 1);

	// gui.add(spawnerOptions, "spawnRate", 10, 30000);
	// gui.add(spawnerOptions, "timeScale", - 1, 1);
	// gui.add(spawnerOptions, "horizontalSpeed", 0, 10);
	// gui.add(spawnerOptions, "verticalSpeed", 0, 10);

	// gui.add(camera.position, "z", -1000, 1000);

	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);

	controls = new THREE.TrackballControls(camera, renderer.domElement);
	controls.rotateSpeed = 5.0;
	controls.zoomSpeed = 2.2;
	controls.panSpeed = 1;
	controls.dynamicDampingFactor = 0.3;

	window.addEventListener('resize', onWindowResize, false);
	document.getElementById("webgl").appendChild(renderer.domElement);
	document.getElementsByClassName("loader-container")[0].style.visibility = "hidden";
	showControls();
}
function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}
function animate() {
	requestAnimationFrame(animate);
}
function render() {
	renderer.render(scene, camera);
}
document.getElementById("mute").onclick = function() {
	toggleMuteControl();
	audioClient.toggleSound();
  }
  
  document.getElementById("unmute").onclick = function() {
	toggleUnmuteControl();
	audioClient.toggleSound();
  }
  