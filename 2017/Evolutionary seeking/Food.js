function Food(posX, posY) {

  if (posX == undefined) {
    this.pos = Math.createVector(
      Math.randomFloat(0 + border, c.width - border),
      Math.randomFloat(0 + border, c.height - border)
    );
  } else {
    this.pos = Math.createVector(posX, posY);
  }

  this.radius = 5;

  this.diePer = 0.001;

}

Food.prototype.update = function () {

  if (Math.randomFloat(0, 1) <= this.diePer) {
    deleteFood(this.pos);
  }

}

Food.prototype.render = function () {

  ctx.fillStyle = "#16f702";

  ctx.beginPath();
  ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
  ctx.fill();

}
