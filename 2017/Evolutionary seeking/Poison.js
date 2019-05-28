function Poison() {

  this.pos = Math.createVector(
    Math.randomFloat(0 + border, c.width - border),
    Math.randomFloat(0 + border, c.height - border)
  );

  this.radius = 5;

  this.diePer = 0.001;

}

Poison.prototype.update = function () {

  if (Math.randomFloat(0, 1) <= this.diePer) {
    deletePoison(this.pos);
  }

}

Poison.prototype.render = function () {

  ctx.fillStyle = "#f70202";

  ctx.beginPath();
  ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
  ctx.fill();

}
