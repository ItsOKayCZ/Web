function Rocket(per){

  this.per = per;

  this.height = 40;
  this.width = 12;

  var minSize = 0.4;
  var maxSize = 1;
  this.size = Math.randomFloat(minSize, maxSize);

  this.height *= this.size;
  this.width *= this.size;

  this.border = 100
  this.pos = Math.createVector(
    Math.randomFloat(0 + this.width + this.border, c.width - this.width - this.border),
    c.height
  );

  this.deAcc = 0.95;
  
  var minVel = 15 * this.per;
  var maxVel = 42 * this.per;
  this.vel = Math.createVector(
    0, 
    -Math.randomFloat(minVel, maxVel)
  );

  this.minVel = Math.randomFloat(0.75, 2.5);

  var colors = ["White", "Yellow", "Red", "Orange", "#2d892d"];
  this.color = colors[Math.randomInt(0, colors.length - 1)];

  this.render = function(){

    ctx.save();

    ctx.globalAlpha = this.size;

    ctx.fillStyle = this.color;
    ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height);

    ctx.restore();

    // ctx.strokeStyle = "White";

    // ctx.beginPath();
    // ctx.moveTo(0 + this.border, c.height);
    // ctx.lineTo(0 + this.border, 0);
    // ctx.stroke();

    // ctx.beginPath();
    // ctx.moveTo(c.width - this.border, c.height);
    // ctx.lineTo(c.width - this.border, 0);
    // ctx.stroke();

  }

  this.update = function(){

    if(Math.abs(this.vel.y) < this.minVel){

      deleteRocket(this);

    } else {

      this.pos.x += this.vel.x;
      this.pos.y += this.vel.y;
  
      this.vel.x *= this.deAcc;
      this.vel.y *= this.deAcc;

    }

  }

}

function makeRocket(per){

  var minC = 3;
  var maxC = 5;
  var c = Math.randomInt(minC, maxC);

  for(var i = 0; i < c; i++){
    rockets.push(new Rocket(per));
  }

}

function deleteRocket(rocket){

  makeParticals(rocket);
  rockets.splice(findRocket(rocket), 1);

}

function findRocket(rocket){

  for(var i = 0; i < rockets.length; i++){
    var r = rockets[i];

    if(r.pos.x == rocket.pos.x && r.pos.y == rocket.pos.y){
      return i;
    }
  }

  return -1;
}