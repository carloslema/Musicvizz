tool.minDistance = 40;
tool.maxDistance = 100;
tool.distance
var drawPath;

tool.onMouseDown = function(event) {
	drawPath = new Path();
	drawPath.fillColor = new Color({ hue: Math.random() * 360, saturation: 1, brightness: 1 });
	drawPath.add(event.point);
}

tool.onMouseDrag = function(event) {
	var step = event.delta;
	step.angle += 100;
	var top = event.middlePoint + step;
	var bottom = event.middlePoint - step;
	drawPath.add(top);
	drawPath.insert(0, bottom);
	drawPath.smooth();
}

tool.onMouseUp = function(event) {
	drawPath.add(event.point);
	drawPath.closed = true;
	drawPath.smooth();
}
