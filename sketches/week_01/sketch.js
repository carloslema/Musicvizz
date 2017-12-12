var dots = [], post, target, vel, spring, speed;
var animate = false, open = false, canvas;

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.touchStarted(flip);
  background(0, 206, 209);
  noStroke();

  translate(windowWidth/2, windowHeight/2);

  pos = new p5.Vector(0,0),
  target = new p5.Vector(0,0),
  vel = new p5.Vector(0,0),
  spring= 0.70,
  speed = 0.1;

  var maxDots = 10;
  var startHue = 55;

  for (var i = 0; i < maxDots; i++) {
    var offsetAngle = (2*PI)/maxDots;
    var angle = offsetAngle;
    var radius = 200;

    target = new p5.Vector(radius*sin(angle*i),radius*cos(angle*i));

    var dot = new Dot(pos.x, pos.y, target, startHue+(i*6));
    dots.push(dot);
    dot.render();
  }

}

function draw() {
  if(animate) {
    fill(0, 206, 209, 125);
    translate(windowWidth/2, windowHeight/2);
    rect(-windowWidth/2,-windowHeight/2, windowWidth, windowHeight);

    for(var i =0; i < dots.length; i ++) {
      var p = dots[i];

      if (open) {
        target.set(0,0);
      } else {
        target.set(p.target.x, p.target.y);
      }

      pos.set(p.posX, p.posY);
      vel.set(p.velX, p.velY);
      vel.mult(spring);

      var diff = p5.Vector.sub(target, pos);
      diff.mult(speed);
      vel.add(diff);
      pos.add(vel);

      p.posX = pos.x;
      p.posY = pos.y;

      p.velX = vel.x;
      p.velY = vel.y;

      p.render();
    }
  }
}

function flip() {
  if (!animate) {
    animate = true;
  } else {
    if (!open) {
      open = true;

    } else if (open) {
      open = false;
    }
  }
}

function Dot(posx, posy,t,h) {
  this.posX = posx;
  this.posY = posy;

  this.target = new p5.Vector(0,0,0);
  this.target.set(t);
  this.velX = 0;
  this.velY = 0;
  this.size = 100;
  this.hue = h;

  this.render = function() {
    fill(129, 126, 253);
    ellipse(this.posX, this.posY, this.size,this.size);
  }
}
