var renderer, scene, camera, stats;
var particleSystem, uniforms, geometry;
var particles = 100000;
var previousFreq = 0;
var floatFreq = [];
var rebound = true;

document.onreadystatechange = function () {
    if (document.readyState == "interactive") {
        audioClient = new AudioHelper();
        audioClient.setupAudioProcessing();
        audioClient.loadFile("../../audio/lovely.mp3")
            .then(init)
            .then(animate)
            .then(() => {
                audioClient.onAudioProcess(function () {

                    var frequencyData = audioClient.getFrequencyData();
                    var freqAvg = audioClient.getAverage(frequencyData);
                    floatFreq = audioClient.getFrequencyDataFloat();

                    var time = Date.now() * 0.005;

                    var sizes = geometry.attributes.size.array;
                    for (var i = 0; i < particles; i++) {
                        sizes[i] = 10 * (1 + Math.sin(0.1 * i + time));
                        // console.log(floatFreq[i]);
                    }

                    //upper : 230
                    // lower : -115

                    if (camera.position.z < -115) {
                        rebound = !rebound;
                    }

                    if (camera.position.z > 245) {
                        rebound = !rebound;
                    }

                    if (rebound) {
                        camera.position.z -= (freqAvg * 0.01);
                        particleSystem.rotation.z += (0.0001 * freqAvg);
                        // camera.position.x -= (freqAvg*0.001);
                        // camera.position.y -= (freqAvg*0.001);
                    } else {
                        camera.position.z += (freqAvg * 0.01);
                        particleSystem.rotation.z -= (0.0001 * freqAvg);
                        // camera.position.x += (freqAvg*0.001);
                        // camera.position.y += (freqAvg*0.001);
                    }

                    geometry.attributes.size.needsUpdate = true;
                    renderer.render(scene, camera);

                });
            });
    }
}
function init() {
    // var gui = new dat.GUI();

    camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 240;

    // gui.add(camera.position, 'x', -1000, 1000).step(5);
    // gui.add(camera.position, 'y', -1000, 1000).step(5);
    // gui.add(camera.position, 'z', -1000, 1000).step(1);

    scene = new THREE.Scene();
    uniforms = {
        texture: { value: new THREE.TextureLoader().load("spark1.png") }
    };
    var shaderMaterial = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: document.getElementById('vertexshader').textContent,
        fragmentShader: document.getElementById('fragmentshader').textContent,
        blending: THREE.AdditiveBlending,
        depthTest: false,
        transparent: true,
        vertexColors: true
    });
    var radius = 200;
    geometry = new THREE.BufferGeometry();
    var positions = [];
    var colors = [];
    var sizes = [];
    var color = new THREE.Color();
    for (var i = 0; i < particles; i++) {
        positions.push((Math.random() * 2 - 1) * radius);
        positions.push((Math.random() * 2 - 1) * radius);
        positions.push((Math.random() * 2 - 1) * radius);
        color.setHSL(i / particles, 1.0, 0.5);
        colors.push(color.r, color.g, color.b);
        sizes.push(20);
    }
    geometry.addAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.addAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geometry.addAttribute('size', new THREE.Float32BufferAttribute(sizes, 1).setDynamic(true));
    particleSystem = new THREE.Points(geometry, shaderMaterial);
    scene.add(particleSystem);

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    var container = document.getElementById("webgl");
    container.appendChild(renderer.domElement);

    window.addEventListener('resize', onWindowResize, false);
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
document.getElementById("mute").onclick = function () {
    toggleMuteControl();
    audioClient.toggleSound();
}

document.getElementById("unmute").onclick = function () {
    toggleUnmuteControl();
    audioClient.toggleSound();
}