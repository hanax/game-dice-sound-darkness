var input;
var amplitude;
var lastNote = null;
var circles;
var curCircle;
var diff;
var PITCH_DIFF_LIMIT = 10;
var MIN_DIFF = 10;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
  mic = new p5.AudioIn();
  mic.start();
  amplitude = new p5.Amplitude();
  amplitude.setInput(mic);
  // reduce frame rate
  frameRate(20);

  diff = 0;
  circles = new Circles();
}

function draw() {
  background(0);

  drawCircleCurrent();
  circles.display();
}

function drawCircleCurrent() {
  colorMode(HSB, 100);
  noStroke();
  var curPitch = noteFromPitch(pitch);
  var curNote = curPitch % 12;
  var curColor = Math.min(Math.max(0, map(curPitch, 50, 90, 0, 100)), 100);
  fill(color(curColor, 100, 100));

  var size = map(amplitude.getLevel(), 0, 0.3, 50, 300);
  ellipse(windowWidth/2, windowHeight/2, size, size);

  if (amplitude.getLevel() > 0.002 && Math.abs(curNote - lastNote) < 3) {
    diff += Math.min(20, size / 10);
  } else {
    diff = MIN_DIFF;
  }
  if (diff >= size) {
    diff = MIN_DIFF;
    lastNote = null;
    circles.add(
      createVector(windowWidth * Math.random(), windowHeight * Math.random()),
      curColor,
      size
    );
  } else {
    fill(color(0));
    ellipse(windowWidth/2, windowHeight/2, size - diff, size - diff);
    lastNote = curNote;
  }
}

function Circles() {
  this.circles = [];
}

Circles.prototype.add = function(position, hue, size) {
  this.circles.push(new Circle(position, hue, size));
};

Circles.prototype.display = function() {
  for (var i = 0; i < this.circles.length; i++) {
    this.circles[i].display();
  }
};

function Circle(position, hue, size) {
  this.position = createVector(position.x, position.y);
  this.hue = hue;
  this.size = size;
}

Circle.prototype.display = function() {
  noStroke();
  colorMode(HSB);
  c = color(this.hue, 100, 100, 50);
  fill(c);
  ellipse(this.position.x, this.position.y, this.size, this.size);
};

$(document).ready(function() {
  toggleLiveInput();
  window.pitch = pitch;
  window.noteFromPitch = noteFromPitch;
  $('#btn-save').click(function() {
    saveCanvas(canvas,'demo','jpg');
  });
});
