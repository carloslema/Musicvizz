var canvas;
var angle = 0;
var angleSpeed = 0.01;

function setup() {
  canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  background(32);
  stroke(0);
  strokeWeight(3);
}

function draw() {
  background(200);
  rotateX(frameCount * 0.01);
  rotateZ(frameCount * 0.01);
  sphere(400, 200);
}
