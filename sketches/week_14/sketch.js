var canvas;
var song;
var amplitude;
var flag = true;
var gain;
var base1;
var v0, or, newZ0;
var angl, angl0, anX, anY;

function preload() {
    song = loadSound("../../audio/brokenroots.mp3", soundReady);
}


function soundReady() {
    document.getElementsByClassName("button-container-p5")[0].style.visibility = "visible";
}

function setup() {
    canvas = createCanvas(windowWidth, windowHeight, WEBGL);
    amplitude = new p5.Amplitude();

    // variable setup
    angl = 0;
    or = createVector(0, 0, 0);
    angl0 = 0.8;
    anX = 1.5;
    anY = 0;

    song.disconnect();

    gain = new p5.Gain();
    gain.setInput(song);
    gain.connect();

    background(39, 39, 35);

    showControls();
    amplitude.setInput(song);

    gain.amp(1, 0.5, 0);

}

function startClicked() {
    // hide button and show loader
    document.getElementsByClassName("button-container-p5")[0].style.visibility = "hidden";
    song.play();
  }

function draw() {
    if (song.isPlaying()) {
        background(39, 39, 35);
        var level = amplitude.getLevel() * 10;

        ang = frameCount * 0.006;
        rotateX(anX);
        rotateY(anY);

        anY += level / 1000;
        anX += level / 1000;

        v0 = createVector(80, 0, 0);
        newZ0 = createVector(0, 1, 1);
        base1 = new Base(newZ0, v0);
        pointLight(196, 197, 181, 0, 0, -2000);
        directionalLight(252, 251, 250, -1, -1, 0);
        pointLight(196, 197, 181, 0, 0, 1000);

        // console.log(level);

        for (var i = 0; i < 15; i++) {
            base1.origine = createVector(level * 10 * cos(i * TWO_PI / 12), level * 10 * sin(i * TWO_PI / 12), 0);
            base1.dessine(level);
            rotateY(PI / 2 + ang);
            rotateX(ang);
            rotateZ(ang);
        }
    }
}

function mouseDragged() {
    anY += (mouseX - pmouseX) / 100;
    anX += (-mouseY + pmouseY) / 100;
}

function Base(axez, vorig) {
    var az = axez.copy();
    az.normalize();
    this.z = createVector(az.x, az.y, az.z);
    this.y = (createVector(-az.y, az.x, 0)).normalize();
    this.x = (createVector((az.x) * (az.z), (az.y) * (az.z), -sq(az.x) - sq(az.y))).normalize();
    this.origin = vorig;
}

Base.prototype.translator = function () {
    translate(this.origin.x, this.origin.y, this.origin.z);
}

Base.prototype.rotator = function () {
    var ax = (this.z).copy();
    ax.normalize();
    rotateZ(atan2(ax.y, ax.x));
    rotateY(acos(ax.z));
}

Base.prototype.tournerZ = function (agl) {
    rotateZ(agl);
}

Base.prototype.coordDans = function (ve0) {
    // vec0 is a vector in the base b0
    // vec1 is the column of the coords of vec0 in the new base b1
    var vec1 = createVector();
    var vect0 = p5.Vector.sub(ve0, this.origin);
    vec1.x = p5.Vector.dot(this.x, vect0);
    vec1.y = p5.Vector.dot(this.y, vect0);
    vec1.z = p5.Vector.dot(this.z, vect0);
    return vec1;
}

Base.prototype.dessine = function (levelFactor) {
    push();
    this.translator();
    this.rotator();
    this.tournerZ(angl);
    torus(100, (levelFactor * 0.1) * 30 + 7 * cos(ang * 2), 40, 40);
    pop();
}

// resize canvas on windowResized
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

document.getElementById("mute").onclick = function () {
    gain.amp(0, 0.5, 0);
    toggleMuteControl();

}

document.getElementById("unmute").onclick = function () {
    gain.amp(1, 0.5, 0);
    toggleUnmuteControl();
}
