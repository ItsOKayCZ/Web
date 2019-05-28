function Triangle() {

  this.pos = Math.createVector(c.width / 2, c.height / 2);

  this.height = this.originHeight = 18;
  this.heightSpeed = 2;

  this.growing = true;

  this.heading = Math.radians(180);
  this.headingSpeed = Math.radians(2.95);

  this.points = [
    Math.createVector(this.pos.x - this.height, this.pos.y + this.height),
    Math.createVector(this.pos.x + this.height, this.pos.y + this.height),
    Math.createVector(this.pos.x, this.pos.y - this.height)
  ];
  this.anglePoints = [];

}

Triangle.prototype.render = function () {

  ctx.strokeStyle = "White";
  ctx.beginPath();
  for (var i = 0; i < this.anglePoints.length; i++) {

    if (i == 0) {
      ctx.moveTo(this.anglePoints[i].x, this.anglePoints[i].y);
    } else {
      ctx.lineTo(this.anglePoints[i].x, this.anglePoints[i].y);
    }

  }
  ctx.stroke();

}

Triangle.prototype.updateAnglePoints = function () {

  for (var i = 0; i <= this.points.length; i++) {

    if (i + 1 <= this.points.length) {

      var angle = Math.atan2(this.pos.y - this.points[i].y, this.pos.x - this.points[i].x) + this.heading;
      var dist = this.height;


      this.anglePoints[i] = Math.createVector(this.pos.x + Math.cos(angle) * dist, this.pos.y + Math.sin(angle) * dist);

    } else {
      this.anglePoints[i] = this.anglePoints[0];
    }

  }

}

Triangle.prototype.updatePoints = function () {

  this.points = [
    Math.createVector(this.pos.x - this.height, this.pos.y + this.height),
    Math.createVector(this.pos.x + this.height, this.pos.y + this.height),
    Math.createVector(this.pos.x, this.pos.y - this.height)
  ];

}

Triangle.prototype.update = function () {

  this.updatePoints();
  this.updateAnglePoints();

  if (this.height >= circle.radius) {
    this.growing = false;
  } else if (this.height <= this.originHeight) {
    this.growing = true;
  }

  if (this.growing) {
    this.heading += this.headingSpeed;
    this.height += this.heightSpeed;
  } else {
    this.heading -= this.headingSpeed;
    this.height -= this.heightSpeed;
  }
}
