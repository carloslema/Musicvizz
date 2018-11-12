var camera, scene, renderer;
var mesh;
var materialShader;


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
				var frequencyData = audioClient.getFrequencyData();
				var freqAvg = audioClient.getAverage(frequencyData);
				var floatFreq = audioClient.getFrequencyDataFloat();
				if (materialShader) {
					var test = (performance.now() / 500);
					materialShader.uniforms.audioFreq.value = test;
					mesh.rotation.y += freqAvg / 10000;
				}
				renderer.render(scene, camera);
            });
        });
}


function init() {
	camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000);
	camera.position.z = 2000;
	camera.position.y = 2500;
	scene = new THREE.Scene();
	var material = new THREE.MeshNormalMaterial();
	// var gui = new dat.GUI();
	// gui.addFolder('Camera Position');
	// gui.add(camera.position, 'x', -2000, 2000);
	// gui.add(camera.position, 'y', -2000, 2000);
	// gui.add(camera.position, 'z', -2000, 2000);
	// gui.addFolder('Camera Rotation');
	// gui.add(camera.rotation, 'x', - Math.PI, Math.PI);
	// gui.add(camera.rotation, 'y', - Math.PI, Math.PI);
	// gui.add(camera.rotation, 'z', - Math.PI, Math.PI);
	material.onBeforeCompile = function (shader) {
		shader.uniforms.audioFreq = { value: 0 };
		shader.uniforms.factor = { value: 0 };
		shader.vertexShader = 'uniform float audioFreq;\n' + 'uniform float factor;\n' + shader.vertexShader;
		shader.vertexShader = shader.vertexShader.replace(
			'#include <begin_vertex>',
			[
				'float theta = sin( audioFreq + position.y ) / 9.0;',
				'float c = cos( theta );',
				'float s = sin( theta );',
				'mat3 m = mat3( c, 0, s, 0, 1, 0, -s, 0, c );',
				// 'mat3 m = mat3(0, 1, 0, -s, 0, c, c, 0, s);',
				'vec3 transformed = vec3( position ) * m;',
				'vNormal = vNormal * m;'
			].join('\n')
		);
		materialShader = shader;
	};
	var loader = new THREE.GLTFLoader();
	loader.load('head.glb', function (gltf) {
		mesh = new THREE.Mesh(gltf.scene.children[0].geometry, material);
		mesh.position.y = -1100;
		mesh.rotation.x = -0.75;
		mesh.position.z = 1600;
		mesh.rotation.x = -0.80;
		// gui.addFolder('Mesh Position');
		// gui.add(mesh.position, 'x', -4000, 5000).step(1);
		// gui.add(mesh.position, 'y', -4000, 5000).step(1);
		// gui.add(mesh.position, 'z', -4000, 5000).step(1);
		// gui.addFolder('Mesh Rotation');
		// gui.add(mesh.rotation, 'x', - Math.PI, Math.PI);
		// gui.add(mesh.rotation, 'y', - Math.PI, Math.PI);
		// gui.add(mesh.rotation, 'z', - Math.PI, Math.PI);
		// gui.addFolder('Mesh Scale');
		// gui.add(mesh.scale, 'x', - Math.PI * 100, Math.PI * 100);
		// gui.add(mesh.scale, 'y', - Math.PI * 100, Math.PI * 100);
		// gui.add(mesh.scale, 'z', - Math.PI * 100, Math.PI * 100);
		mesh.scale.setScalar(100);
		scene.add(mesh);
	});

	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	
    // show visualization and hide loader
    document.getElementById("webgl").appendChild(renderer.domElement);
    showControls();
    document.getElementsByClassName("loader-container")[0].style.visibility = "hidden";
}

function onWindowResize() {
	var width = window.innerWidth;
	var height = window.innerHeight;
	camera.aspect = width / height;
	camera.updateProjectionMatrix();
	renderer.setSize(width, height);
}

function animate() {
	requestAnimationFrame(animate);
}

document.getElementById("mute").onclick = function() {
	toggleMuteControl();
	audioClient.toggleSound();
  }
  
  document.getElementById("unmute").onclick = function() {
	toggleUnmuteControl();
	audioClient.toggleSound();
  }
  