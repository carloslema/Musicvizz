var camera, scene, renderer;
var geometry, material, mesh;
var meshes = [];

function init() {
	renderer = new THREE.CanvasRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild(renderer.domElement);

	camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.position.z = 2000;

	scene = new THREE.Scene();
	geometry = new THREE.SphereGeometry( 150, 10,10 );

	material = new THREE.MeshBasicMaterial( { color: 0xFF1493, wireframe: true, wireframeLinewidth: 3} );
	mesh = new THREE.Mesh( geometry, material );

	scene.add(mesh);
}

function generateGrid() {
	var numXAxis = window.innerWidth / geometry.radius;
	console.log(numXAxis);
	var numYAxis = window.innerHeight / geometry.radius;
	console.log(numYAxis);
}

function animate() {

	requestAnimationFrame( animate );
	mesh.rotation.x = Date.now() * 0.0002;
	mesh.rotation.y = Date.now() * 0.001;
	renderer.render( scene, camera );
	var numXAxis = window.innerWidth / geometry.radius;
	console.log(numXAxis);
	var numYAxis = window.innerHeight / geometry.radius;
	console.log(numYAxis);
}

function createDoubleGrid() {
	var numXAxis = window.innerWidth / geometry.radius;
}

init();
animate();
