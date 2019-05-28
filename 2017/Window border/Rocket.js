function Rocket(){

  this.speed = 2;

  this.pos = Math.createVector(c.width / 2, c.height / 2);
  var dir = Math.randomFloat(0, Math.radians(360));
  this.vel = {
    x: Math.cos(dir) * this.speed,
    y: Math.sin(dir) * this.speed
  };

  this.height = 18;
  
  this.heading = 0;

  this.weight = 0.05;
  
  this.render = function(){

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

  this.outWindow = function(){

    if(this.pos.x > c.width - border){

      var pos = Math.createVector(c.width - border, this.pos.y);
      var angle = Math.atan2(this.pos.y - pos.y, this.pos.x - pos.x);

      var dsVel = {
        x: Math.cos(angle),
        y: Math.sin(angle)
      };
      dsVel.x *= this.weight;
      
    } else if(this.pos.x < 0 + border){

      var pos = Math.createVector(0 + border, this.pos.y);
      var angle = Math.atan2(this.pos.y - pos.y, this.pos.x - pos.x);

      var dsVel = {
        x: Math.cos(angle),
        y: Math.sin(angle)
      };
      dsVel.x *= this.weight;

    }

    if(dsVel != undefined){
      this.vel.x -= dsVel.x;

      dsVel = undefined;
    }

    if(this.pos.y > c.height - border){

      var pos = Math.createVector(this.pos.x, c.height - border);
      var angle = Math.atan2(this.pos.y - pos.y, this.pos.x - pos.x);

      var dsVel = {
        x: Math.cos(angle),
        y: Math.sin(angle)
      };
      dsVel.y *= this.weight;

    } else if(this.pos.y < 0 + border){

      var pos = Math.createVector(this.pos.x, 0 + border);
      var angle = Math.atan2(this.pos.y - pos.y, this.pos.x - this.pos.x);

      var dsVel = {
        x: Math.cos(angle),
        y: Math.sin(angle)
      };
      dsVel.y *= this.weight;
      
    }

    if(dsVel != undefined){
      this.vel.y -= dsVel.y;
    }

  }

  this.update = function(){

    this.outWindow();

    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;

  }

}
