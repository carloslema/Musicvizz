const polygon = new mojs.Shape({
  shape:        'polygon',
  points:       5,
  stroke:       '#A8CABA',
  scale:        { 1 : 1.5 },
  angle:        { 0 : 360 },
  fill:         { '#721e5f' : '#a5efce' },
  radius:       25,

  duration:     1500,
  delay:        100,
  speed: 1.5,
  isYoyo:       true, // whether or not tweens back and forth
  repeat:       999
}).play();
