'use strict'



/*-------------------------------------------------------------------------------------------------+
| GLOBAL FUNCTIONS                                                                                 |
+-------------------------------------------------------------------------------------------------*/
function drawPoly(poly) {
	ctx.beginPath();
	ctx.moveTo(poly.points[0].x, poly.points[0].y);
	for (var i = 1; i < poly.points.length; i++) { // Itera puntos de un polígono
		ctx.lineTo(poly.points[i].x, poly.points[i].y);
	}
	ctx.closePath();
	ctx.stroke();
}

function drawLine(p1, p2) {
	ctx.beginPath();
	ctx.moveTo(p1.x, p1.y);
	ctx.lineTo(p2.x, p2.y);
	ctx.stroke();
}

function drawPoint(p) {
	ctx.beginPath();
	ctx.moveTo(p.x, p.y);
	ctx.arc(p.x, p.y, 3, 0, 2 * Math.PI, false);
	ctx.closePath();
	ctx.fill();
}
function drawPoints(points) {
	for (var i in points) { // Itera points
		drawPoint(points[i]);
	}
}

function drawPolys(polys) {
	for (var i in polys) { // Itera polys
		drawPoly(polys[i]);
	}
}



/*-------------------------------------------------------------------------------------------------+
| GLOBAL VARIABLES                                                                                 |
+-------------------------------------------------------------------------------------------------*/
var ctx;



/*-------------------------------------------------------------------------------------------------+
| MAIN                                                                                             |
+-------------------------------------------------------------------------------------------------*/
$(window).load(function () {
	var h_canvas = document.getElementById("canvas");
	ctx = h_canvas.getContext("2d");

	var draw = function (e) {
		ctx.clearRect(0, 0, h_canvas.width, h_canvas.height);
		
		// Segments:
		var s1 = new $13.Segment(
			new $13.Vector2(10, 113),
			new $13.Vector2(131, 10)
		);
		var s2 = new $13.Segment(
			new $13.Vector2(5, 10),
			new $13.Vector2(100, 130)
		);

		drawLine(s1.p1, s1.p2);
		drawLine(s2.p1, s2.p2);

		// Calc intersection:
		var intersection = s1.intersectionWithSegment(s2);
		if (intersection != null) // If segments intersects...
			drawPoint(intersection); // Draws the intersecton point.
	};

	var resize = function () {
		ctx.canvas.width = $(window).width();
		ctx.canvas.height = $(window).height();
		draw();
	};

	$(window).resize(resize);
	$(window).mousemove(draw);
	
	resize();
	draw();
});