function Circle() {

  this.pos = Math.createVector(c.width / 2, c.height / 2);

  this.radius = 264;

}

Circle.prototype.render = function () {

  ctx.strokeStyle = "White";

  ctx.beginPath();
  ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
  ctx.stroke();

}
