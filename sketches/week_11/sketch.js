var SEPARATION = 80, AMOUNTX = 50, AMOUNTY = 50;
var camera, scene, renderer;
var container;
var particles, count = 0;
var mouseX = 0, mouseY = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

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
	audioClient.loadFile("../../audio/dunno.mp3")
		.then(init)
		.then(animate)
		.then(() => {
			audioClient.onAudioProcess(function () {

				var time = Date.now() * 0.005;

				var frequencyData = audioClient.getFrequencyData();
				var freqAvg = audioClient.getAverage(frequencyData);
				var floatFreq = audioClient.getFrequencyDataFloat();


				camera.lookAt(scene.position);
				var positions = particles.geometry.attributes.position.array;
				var scales = particles.geometry.attributes.scale.array;
				var i = 0, j = 0;

				for (var ix = 0; ix < AMOUNTX; ix++) {
					for (var iy = 0; iy < AMOUNTY; iy++) {
						positions[i + 1] = (Math.sin((ix + count) * 0.3) * 50) +
							(Math.sin((iy + count) * 0.5) * 50);

						scales[j] = (Math.sin((ix + count) * 0.3) + 1) * 8 +
							(Math.sin((iy + count) * 0.5) + 1) * 8;
						i += 3;
						j++;
					}
				}

				particles.geometry.attributes.position.needsUpdate = true;
				particles.geometry.attributes.scale.needsUpdate = true;
				renderer.render(scene, camera);

				count += (freqAvg * 0.005);

			});
		});
}

function init() {
	camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
	camera.position.y = 1000;
	camera.position.z = 750;
	camera.position.x = 0;
	scene = new THREE.Scene();
	// var gui = new dat.GUI();

	// gui.add(camera.position, 'x', -1000, 1000).step(1);
	// gui.add(camera.position, 'y', -1000, 1000).step(1);
	// gui.add(camera.position, 'z', -1000, 1000).step(1);

	var numParticles = AMOUNTX * AMOUNTY;

	var positions = new Float32Array(numParticles * 3);
	var scales = new Float32Array(numParticles);

	var i = 0, j = 0;
	for (var ix = 0; ix < AMOUNTX; ix++) {
		for (var iy = 0; iy < AMOUNTY; iy++) {
			positions[i] = ix * SEPARATION - ((AMOUNTX * SEPARATION) / 2); // x
			positions[i + 1] = 0; // y
			positions[i + 2] = iy * SEPARATION - ((AMOUNTY * SEPARATION) / 2); // z
			scales[j] = 1;
			i += 3;
			j++;
		}
	}
	var geometry = new THREE.BufferGeometry();
	geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
	geometry.addAttribute('scale', new THREE.BufferAttribute(scales, 1));
	var material = new THREE.ShaderMaterial({
		uniforms: {
			// color: { value: new THREE.Color(0xD39CA1) },
			color: { value: new THREE.Color(0xffffff) },
		},
		vertexShader: document.getElementById('vertexshader').textContent,
		fragmentShader: document.getElementById('fragmentshader').textContent
	});

	particles = new THREE.Points(geometry, material);
	scene.add(particles);

	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	// document.addEventListener('mousemove', onDocumentMouseMove, false);
	// document.addEventListener('touchstart', onDocumentTouchStart, false);
	// document.addEventListener('touchmove', onDocumentTouchMove, false);
	// window.addEventListener('resize', onWindowResize, false);

	// show visualization and hide loader
	document.getElementById("webgl").appendChild(renderer.domElement);
	showControls();
	document.getElementsByClassName("loader-container")[0].style.visibility = "hidden";
}

document.getElementById("mute").onclick = function () {
	toggleMuteControl();
	audioClient.toggleSound();
}

document.getElementById("unmute").onclick = function () {
	toggleUnmuteControl();
	audioClient.toggleSound();
}


// function onDocumentMouseMove(event) {
// 	mouseX = event.clientX - windowHalfX;
// 	mouseY = event.clientY - windowHalfY;
// }
// function onDocumentTouchStart(event) {
// 	if (event.touches.length === 1) {
// 		event.preventDefault();
// 		mouseX = event.touches[0].pageX - windowHalfX;
// 		mouseY = event.touches[0].pageY - windowHalfY;
// 	}
// }
// function onDocumentTouchMove(event) {
// 	if (event.touches.length === 1) {
// 		event.preventDefault();
// 		mouseX = event.touches[0].pageX - windowHalfX;
// 		mouseY = event.touches[0].pageY - windowHalfY;
// 	}
// }

function onWindowResize() {
	windowHalfX = window.innerWidth / 2;
	windowHalfY = window.innerHeight / 2;
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
	requestAnimationFrame(animate);
}