var scene, camera, renderer, controls;
var width, height;

function init() {
  scene = new THREE.scene();

  width = window.innerWidth;
  height = window.innerHeight;

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(width, height);

  document.body.appendChild(renderer.domElement);

  // create and add camera
  camera = new THREE.PerspectiveCamera(40, WIDTH / HEIGHT, 0.1, 20000);
  camera.position.set(0, 45, 0);
  scene.add(camera);

  window.addEventListener('resize', function () {
    var resizedW = window.innerWidth, resizedH = window.innerHeight;
    renderer.setSize(resizedW, resizedH);
    camera.aspect = resizedW / resizedH;
    camera.updateProjectionMatrix();

});

}
