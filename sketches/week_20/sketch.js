var audioClient, blob;
var scene, camera, renderer, clock, geometry;
var frequencyData, freqAvg = 0;

var width = window.innerWidth,
    height = window.innerHeight;

var startButton = document.getElementById('start-animate');
startButton.addEventListener('click', startClicked);

function startClicked() {
    document.getElementsByClassName("button-container")[0].style.visibility = "hidden";
    document.getElementsByClassName("loader-container")[0].style.visibility = "visible";
    beginAudioProcessing();
}

function beginAudioProcessing() {
    audioClient = new AudioHelper();
    audioClient.setupAudioProcessing();
    audioClient.loadFile("../../audio/flashinglights.mp3")
        .then(init)
        .then(() => {
            audioClient.onAudioProcess(function () {
                frequencyData = audioClient.getFrequencyData();
                freqAvg = audioClient.getAverage(frequencyData);
                blob.mesh.rotation.x += 0.001;
                blob.mesh.rotation.y += 0.001;

                blob.mesh.geometry.vertices.forEach((vertex) => {
                    const offset = blob.geometry.parameters.radius;
                    const amp = freqAvg/8;
                    const time = Date.now();
            
                    vertex.normalize();
            
                    var perlin = noise.simplex3(
                        vertex.x + (time * 0.0008),
                        vertex.y + (time * 0.0009),
                        vertex.z + (time * 0.0007),
                    );
            
                    const distance = offset + (perlin * amp);
            
                    vertex.multiplyScalar(distance);
                });

                blob.mesh.geometry.verticesNeedUpdate = true;
                blob.mesh.geometry.normalsNeedUpdate = true;
                blob.mesh.geometry.computeVertexNormals();
                blob.mesh.geometry.computeFaceNormals();
            });
        });
}

function init() {
    scene = new THREE.Scene();

    clock = new THREE.Clock();
    camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
    camera.position.z = 80;

    renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    var ambientLight = new THREE.AmbientLight(0xffffff);
    var directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(-100, 20, 30);

    camera.add(directionalLight);
    scene.add(ambientLight, camera);

    blob = new Blob(scene);
    scene.add(blob.mesh);

    animate();

    document.getElementById("webgl").appendChild(renderer.domElement);
    showControls();
    document.getElementsByClassName("loader-container")[0].style.visibility = "hidden";
}

function animate(timeStamp) {
    window.requestAnimationFrame(animate);
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

function Blob() {
    this.geometry = new THREE.IcosahedronGeometry(30, 5);
    this.material = new THREE.MeshStandardMaterial({
        color: '#FF0094',
        transparent: true,
        side: THREE.DoubleSide,
        alphaTest: 0.4,
        opacity: 1,
        roughness: 0.2,
    });
    this.alphaMap = new THREE.TextureLoader().load("texture.png");
    this.material.alphaMap = this.alphaMap;
    this.material.alphaMap.magFilter = THREE.NearestFilter;
    this.material.alphaMap.wrapT = THREE.RepeatWrapping;
    this.material.alphaMap.repeat.y = 4;
    this.mesh = new THREE.Mesh(this.geometry, this.material);
}