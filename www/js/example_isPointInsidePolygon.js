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

function drawPoint(p, fillStyle) {
	if (fillStyle != undefined)
		ctx.fillStyle = fillStyle;
	else
		ctx.fillStyle = "black";

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
		
		// Point:
		var point = new $13.Vector2($(h_canvas).width() / 2, $(h_canvas).height() / 2);
		if (e != undefined) {
			point.x = e.clientX;
			point.y = e.clientY;
		}

		// Polygon:
		var polygon = new $13.Polygon([ // Polígono 1
			new $13.Vector2(13, 25), // Punto
			new $13.Vector2(100, 20),
			new $13.Vector2(110, 200),
			new $13.Vector2(80, 400),
			new $13.Vector2(20, 450)
		]);

		drawPoly(polygon);

		// Check if point is inside of polygon:
		if (point.isInsideOfPolygon(polygon)) // If segments intersects...
			drawPoint(point, "red"); // Is inside.
		else
			drawPoint(point);
		
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