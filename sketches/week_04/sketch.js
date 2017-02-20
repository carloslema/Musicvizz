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

  for (var i = 0; i < 1000; i+=30) {
    var angle = sin(radians(i/2-frameCount*3))*15;
    if (angle > 1) {
      strokeWeight(angle/4);
    } else {
      strokeWeight(0.3);
    }
    rotate(radians(i*angle/300));
    rect(0, 0, i*3, i*3);
  }
}
