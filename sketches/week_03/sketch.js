var canvas;
function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  noFill();
  stroke(150,190,150);
  rectMode(CENTER);
}

function draw() {
  background(0, random(20,25), 0);
  translate(width/2, height/2);
  for (var x = 0; x < 1000; x += 30) {
    var angle = sin(radians(x/2-frameCount*3))*15;
    if (angle > 1) {
      strokeWeight(angle/4);
    } else {
      strokeWeight(0.3);
    }
    rotate(radians(x*angle / 300));
    rect(0, 0, x*3, x*3);
  }
}
