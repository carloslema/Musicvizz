const burst1 = new mojs.Burst({
  radius: { 0 : 360 },
  count: 20,
  children: {
    shape: 'cross',
    stroke: 'teal',
    strokeWidth: {6 : 0},
    angle: {360 : 0},
    radius: {30 : 5},
    duration: 3000
  }
});

const burst2 = new mojs.Burst({
  radius: { 0 : 150 },
  count: 10,
  children: {
    shape: 'zigzag',
    stroke: {'magenta' : 'blue'},
    fill: 'none',
    strokeWidth: {6 : 0},
    angle: {'-360' : 0},
    radius: {30 : 5},
    opacity: {0.85 : 0},
    duration: 3000
  }
});

const burst3 = new mojs.Burst({
  radius: { 0 : 300 },
  count: 14,
  children: {
    shape: 'circle',
    stroke: {'#a9a9a9' : 'black'},
    strokeWidth: {2 : 0},
    angle: {'360' : 0},
    radius: {5 : 0},
    fill: 'none',
    duration: 3000
  }
});

const burst4 = new mojs.Burst({
  radius: { 0 : 360 },
  count: 5,
  children: {
    color: 'purple',
    angle: {'-360' : 0},
    radius: {10 : 5},
    opacity: {0.85 : 0},
    duration: 3000
  }
});

const circ = new mojs.Shape({
  radius: {0 : 200},
  fill: 'none',
  stroke: 'yellow',
  opacity: {1: 0},
  duration: 2000
});

const circ2 = new mojs.Shape({
  radius: {0 : 150},
  fill: 'none',
  stroke: 'yellow',
  opacity: {1: 0},
  duration: 2000,
  delay: 100
});

const timeline = new mojs.Timeline({
  repeat: 999
}).add(burst1).add(burst2).add(burst3).add(burst4).add(circ).add(circ2).play();
