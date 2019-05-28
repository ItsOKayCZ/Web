function Rocket(){
  
  this.pos = Math.createVector(c.width / 2, c.height / 2);
  this.vel = Math.createVector(0, 0);
  
  this.height = 18;
  
  this.speed = 2;
  this.deAcc = 0.99;
  
  this.weight = 0.3;
  
}
  
Rocket.prototype.update = function(){
  
  this.attract();
  
  this.pos.add(this.vel);
  
  this.vel.mult(this.deAcc);
  
}

Rocket.prototype.attract = function(){
  
  var angle = Math.atan2(this.pos.y - mouse.y, this.pos.x - mouse.x);
  
  var dsVel = Math.createVector(Math.cos(angle), Math.sin(angle));
  dsVel.mult(this.speed);
  dsVel.mult(this.weight);
  
  this.vel.sub(dsVel);
}

Rocket.prototype.render = function(){
  
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