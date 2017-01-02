var items = [];
var speed = 0.15;
var spring = 0.1;
var numDots;
var canvas;
var position, target, velocity, radius;
var animate = false, expanded = false;

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  // canvas.touchStarted(clicked);

  background(0, 206, 209);
  noStroke();

  // position spring in middle
  translate(width/2, height/2);

  position = new p5.Vector(0,0);
  target = new p5.Vector(0,0);
  velocity = new p5.Vector(0,0);

  numDots = 7;

  layItems();
}

function draw() {
  if(animate) {
    fill(0, 206, 209);

    // center spring
    translate(width/2, height/2);
    rect(-windowWidth/2,-windowHeight/2, windowWidth, windowHeight);

    for(var x = 0; x < items.length; x++) {
      // console.log("items count " + items.length);
      var item = items[x];
      if (expanded) {
        target.set(0,0);
      } else {
        target.set(item.target.x, item.target.y);
      }

      position.set(item.posX, item.posY);
      velocity.set(item.velocityX, item.velocityY);
      velocity.mult(spring);

      var difference = p5.Vector.sub(target, position);
      // console.log("speed " + speed);
      difference.mult(speed);
      velocity.add(difference);
      position.add(velocity);

      item.posX = position.x;
      item.posY = position.y;
      item.velocityX = velocity.x;
      item.velocityY = velocity.y;

      item.render();
    }
  }
}

function keyPressed() {
  if(keyCode != BACKSPACE && keyCode != DELETE){
    if(!animate) {
      // now animating
      animate = true;
    } else {
      if(!expanded) {
        expanded = true;
      } else if (expanded) {
        // spring opened
        expanded = false;
        layItems();
      }
    }
  }
}

function layItems() {
  for(var x = 0; x < numDots; x++) {
    // angle between dots
    var angle = (2*PI)/numDots;
    radius = random(100,200);

    target = new p5.Vector(radius*cos(angle*x), radius*sin(angle*x));

    var r = random(0, 100);
    var rand = random(200, 255);
    var item = new Item(position.x, position.y, target, rand);
    items.push(item);
    item.render();
  }
}

// Spring Item
function Item(positionX, positionY, t, hue) {
  this.posX = positionX;
  this.posY = positionY;

  this.target = new p5.Vector(0,0,0);
  this.target.set(t);

  this.velocityX = 0;
  this.velocityY = 0;

  this.size = random(20,80);

  this.hue = hue;

  this.render = function() {
    fill(130, 130, hue);
    ellipse(this.posX, this.posY, this.size, this.size)
  }
}
