'use strict'



var BMath = {
	epsilon: 1,

	Vector2: null,
	Segment: null,
	Polygon: null,



	hypotenuse: function (c1, c2) {
		return Math.sqrt(Math.pow(c1, 2) + Math.pow(c2, 2));
	},

	minXY: function (points) {
		var min = points[0];
		for (var i = 1, l = points.length; i < l; i++) {
			if (min.x > points[i].x) min.x = points[i].x;
			if (min.y > points[i].y) min.y = points[i].y;
		}
		return min;
	},

	maxXY: function (points) {
		var max = points[0];
		for (var i = 1, l = points.length; i < l; i++) {
			if (max.x < points[i].x) max.x = points[i].x;
			if (max.y < points[i].y) max.y = points[i].y;
		}
		return max;
	},

	distanceBetween2Points: function (p1, p2) {
		p1 = {
			x: Math.abs(p2.x - p1.x),
			y: Math.abs(p2.y - p1.y),
		}
		return Math.sqrt(Math.pow(p1.x, 2) + Math.pow(p1.y, 2));
	},

	toAngleFrom0To360: function (a) {
		if (a >= 0) return ReducePositiveAngle(a);
		return 360 - ReducePositiveAngle(Mathf.Abs(a));
	},

	vectorAngle: function (/*Vector2*/ v) {
		var a;
		if (!(v.x != 0 && v.y == 0)) {
			if (v.x == 0) {
				if (v.y > 0)
					a = 90;
				else a = -90;
			}
			else
				a = Mathf.Rad2Deg * Mathf.Atan(v.y / v.x);
			a = ToAngleFrom0To360(a);
		}
		else
			a = NullAngle;

		return a;
	}
};



BMath.Vector2 = function (x, y) {
	this.x = x;
	this.y = y;
};
BMath.Vector2.prototype.module = function () {
	return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
};
BMath.Vector2.prototype.distanceToPoint = function (/*Vector2*/ p) {
	return BMath.hypotenuse(Math.abs(p.x - this.x), Math.abs(p.y - this.y));
};
BMath.Vector2.prototype.isInsideOfPolygon = function (/*Polygon*/ poly) {
	var maxXY = poly.maxXY(),
		p = new BMath.Vector2(maxXY.x + BMath.epsilon, maxXY.y + BMath.epsilon),
		s1 = new BMath.Segment(this, p),

		intersections = [];
	
	for (var i = 0, l = poly.points.length, s2 = null, inter; i < l; i++) {
		s2 = poly.getSegment(i);
		inter = s1.intersectionWithSegment(s2);
		if (inter != null && !inter.isInArrayOfPoints(intersections)) {
			intersections.push(inter);
		}
	}

	return intersections.length % 2 != 0;
};
BMath.Vector2.prototype.isInArrayOfPoints = function (points) {
	for (var i = 0, l = points.length; i < l; i++) {
		if (this.x == points[i].x && this.y == points[i].y) {
			return true;
		}
	}
	return false;
};



BMath.Segment = function (/*Vector2*/ p1, /*Vector2*/ p2) {
	this.p1 = p1;
	this.p2 = p2;
	this.v = new BMath.Vector2(p2.x - p1.x, p2.y - p1.y);
	
	this.m = 0;
	if (this.v.x == 0)
		this.m = 0;
	else
		this.m = this.v.y / this.v.x;

	this.c = this.v.x * this.p1.y - this.v.y * this.p1.x;
};
BMath.Segment.prototype.a = function () {
	return this.v.y;
};
BMath.Segment.prototype.b = function () {
	return -this.v.x;
};
BMath.Segment.prototype.gradient = function () {
	return (this.p2.y - this.p1.y) / (this.p2.x - this.p1.x);
};
BMath.Segment.prototype.long = function () {
	return this.p1.distanceToPoint(this.p2);
};
BMath.Segment.prototype.perpendicularGradient = function () {
	return this.v.y / this.v.x;
};
BMath.Segment.prototype.perpendicularVector = function () {
	return new BMath.Vector2(-this.v.y, this.v.x);
};
BMath.Segment.prototype.intersectionWithRect = function (/*Segment*/ s) {
	var v = this.v,
		a = this.a(),
		b = this.b(),
		c = this.c,

		v2 = s.v,
		a2 = s.a(),
		b2 = s.b(),
		c2 = s.c,
	
		intersection = null,
	
		det = a * b2 - b * a2;
		
	if (det != 0) {
		intersection = new BMath.Vector2(0, 0);
		intersection.x = (b2 * (-c) - b * (-c2)) / det;
		intersection.y = (a * (-c2) - a2 * (-c)) / det;
	}

	return intersection;
};
BMath.Segment.prototype.intersectionWithSegment = function (/*Segment*/ s) {
	var intersection = this.intersectionWithRect(s);
	if (
		intersection != null &&
		(
			(this.p1.x <= intersection.x && intersection.x <= this.p2.x) ||
			(this.p2.x <= intersection.x && intersection.x <= this.p1.x)
		) &&
		(
			(this.p1.y <= intersection.y && intersection.y <= this.p2.y) ||
			(this.p2.y <= intersection.y && intersection.y <= this.p1.y)
		) &&
		(
			(s.p1.x <= intersection.x && intersection.x <= s.p2.x) ||
			(s.p2.x <= intersection.x && intersection.x <= s.p1.x)
		) &&
		(
			(s.p1.y <= intersection.y && intersection.y <= s.p2.y) ||
			(s.p2.y <= intersection.y && intersection.y <= s.p1.y)
		)
	)
		return intersection;

	return null;
};
BMath.Segment.prototype.intersectionsWithPolygon = function (poly) {
	var intersections = [];
	var inter;
	for (var i in poly) {
		inter = this.intersectionWithSegment(poly.getSegment(i));
		if (inter != null)
			intersections.push(inter);
	}
	return intersections;
}
BMath.Segment.prototype.closestPointTo = function (/*Vector2*/ p) {
	var v2 = this.perpendicularVector(),
		a2 = v2.y,
		b2 = -v2.x,

		closest = new Vector2(),

		det = this.a*b2 - this.b*a2;
	
	if (det != 0) {
		var c2 = v2.x*p.y - v2.y*p.x;
		closest.x = (b2*(-this.c) - this.b*(-c2)) / det;
		closest.y = (this.a*(-c2) - a2*(-this.c)) / det;
	}

	if (!(
		Math.min(this.p1.x, this.p2.x) <= closest.x &&
		Math.max(this.p1.x, this.p2.x) >= closest.x &&
		Math.min(this.p1.y, this.p2.y) <= closest.y &&
		Math.max(this.p1.y, this.p2.y) >= closest.y
	)) {
		if (p.distanceToPoint(this.p1) < p.distanceToPoint(this.p2))
			closest = this.p1;
		else
			closest = this.p2;
	}

	return closest;
};



BMath.Polygon = function (/*Vector2*/ points) {
	this.points = points;
};
BMath.Polygon.prototype.minXY = function () {
	var min = new BMath.Vector2(this.points[0].x, this.points[0].y);
	for (var i = 1, l = this.points.length; i < l; i++) {
		if (min.x > this.points[i].x) min.x = this.points[i].x;
		if (min.y > this.points[i].y) min.y = this.points[i].y;
	}
	return min;
};
BMath.Polygon.prototype.maxXY = function () {
	var max = new BMath.Vector2(this.points[0].x, this.points[0].y);
	for (var i = 1, l = this.points.length; i < l; i++) {
		if (max.x < this.points[i].x) max.x = this.points[i].x;
		if (max.y < this.points[i].y) max.y = this.points[i].y;
	}
	return max;
};
BMath.Polygon.prototype.getSegment = function (i) {
	if (i < this.points.length-1)
		return new BMath.Segment(this.points[i], this.points[i+1]);
	
	return new BMath.Segment(this.points[this.points.length-1], this.points[0]);
};
BMath.Polygon.prototype.intersectionsWithPolygon = function (/*Polygon*/ poly) {
	var intersections = [];
	for (
		var i = 0, j, seg, inter,
			lp1 = this.points.length, // Current poly's length
			lp2 = poly.points.length; // poly's length
		i < lp1;
		i++
	) {
		seg = this.getSegment(i);
		for (j = 0; j < lp2; j++) {
			inter = seg.intersectionWithSegment(poly.getSegment(j));
			if (inter != null)
				intersections.push(inter);
		}
	}
	return intersections;
};
BMath.Polygon.prototype.center = function () {
	var maxXY = this.maxXY(),
		minXY = this.minXY();

	return new BMath.Vector2(
		minXY.x + (maxXY.x - minXY.x) / 2,
		minXY.y + (maxXY.y - minXY.y) / 2
	);
};
BMath.Polygon.prototype.pointsInsideOfPolygon = function (/*Plygon*/poly) {
	var points = [];
	for (var i = 0, l = this.points.length; i < l; i++) {
		if (this.points[i].isInsideOfPolygon(poly))
			points.push(this.points[i]);
	}
	return points;
};



var $13 = BMath;