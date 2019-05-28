function Rocket(){

  this.pos = Math.createVector(c.width / 2, c.height / 2);
  this.vel = Math.createVector(0, 0);

  this.height = 18;
  this.heading = 0;
  this.speed = 2;
  
  this.deAcc = 0.97;
  
  this.distance = 175;

  this.outWindowWeight = 0.7;
  this.weight = 0.3;
  
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

    ctx.save();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "Red";
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, this.distance, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
    
  }

  this.repulsion = function(){

    if(Math.distance(this.pos.x, this.pos.y, mouse.x, mouse.y) <= this.distance){
      
      var angle = Math.atan2(this.pos.y - mouse.y, this.pos.x - mouse.x);

      var dsVel = {
        x: Math.cos(angle),
        y: Math.sin(angle)
      };
      dsVel.x *= this.weight;
      dsVel.y *= this.weight;

      this.vel.x += dsVel.x;var angle = Math.atan2(this.pos.y - mouse.y, this.pos.x - mouse.x);

      var dsVel = {
        x: Math.cos(angle),
        y: Math.sin(angle)
      };
      dsVel.x *= this.weight;
      dsVel.y *= this.weight;

      this.vel.x += dsVel.x;
      this.vel.y += dsVel.y;
      this.vel.y += dsVel.y;
        
    }
    
  }

  this.outWindow = function(){

    if(this.pos.x > c.width - border){

      var pos = Math.createVector(c.width - border, this.pos.y);
      var angle = Math.atan2(this.pos.y - pos.y, this.pos.x - pos.y);

      var dsVel = {
        x: Math.cos(angle),
        y: Math.sin(angle)
      };
      dsVel.x *= this.outWindowWeight;

    } else if(this.pos.x < 0 + border){

      var pos = Math.createVector(0 + border, this.pos.y);
      var angle = Math.atan2(this.pos.y - pos.y, this.pos.x - pos.x);

      var dsVel = {
        x: Math.cos(angle),
        y: Math.sin(angle)
      };
      dsVel.x *= this.outWindowWeight;

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
      dsVel.y *= this.outWindowWeight;

    } else if(this.pos.y < 0 + border){

      var pos = Math.createVector(this.pos.x, 0 + border);
      var angle = Math.atan2(this.pos.y - pos.y, this.pos.x - pos.x);

      var dsVel = {
        x: Math.cos(angle),
        y: Math.sin(angle)
      };
      dsVel.y *= this.outWindowWeight;

    }

    if(dsVel != undefined){
      this.vel.y -= dsVel.y;
    }

  }

  this.update = function(){

    this.repulsion();
    this.outWindow();

    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
    
    this.vel.x *= this.deAcc;
    this.vel.y *= this.deAcc;

  }

}
