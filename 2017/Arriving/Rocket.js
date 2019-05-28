function Rocket() {

  this.pos = Math.createVector(c.width / 2, c.height / 2);
  this.vel = Math.createVector(0, 0);

  this.height = 18;

  this.heading = 0;

  this.dist = 100;
  this.minDist = 5;

  this.weight = 0.2;
  this.speed = 2;
  this.deAcc = 0.98;
}

Rocket.prototype.render = function () {

  ctx.strokeStyle = "White";

  ctx.save();

  ctx.translate(this.pos.x, this.pos.y);
  ctx.rotate(Math.atan2(this.vel.y, this.vel.x) + Math.radians(90));

  ctx.beginPath();
  ctx.moveTo(0 - this.height, 0 + this.height);
  ctx.lineTo(0 + this.height, 0 + this.height);
  ctx.lineTo(0, 0 - this.height);
  ctx.lineTo(0 - this.height, 0 + this.height);
  ctx.stroke();

  ctx.restore();

}

Rocket.prototype.arrive = function () {

  if (point != undefined) {

    if (Math.distance(this.pos.x, this.pos.y, point.x, point.y) > this.minDist) {

      var angle = Math.atan2(this.pos.y - point.y, this.pos.x - point.x);

      var dsVel = Math.createVector(Math.cos(angle), Math.sin(angle));

      var distance = Math.distance(this.pos.x, this.pos.y, point.x, point.y);
      if (distance <= this.dist) {

        var speed = Math.normalize(distance, 0, this.dist, 0, this.speed);
        dsVel.mult(speed);

      } else {
        dsVel.mult(this.speed);
      }

      dsVel.mult(this.weight);

      this.vel.sub(dsVel);

    }

  }

}

Rocket.prototype.update = function () {

  this.arrive();

  this.pos.add(this.vel);

  this.vel.mult(this.deAcc);

}
