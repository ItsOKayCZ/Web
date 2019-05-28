function Partical(pos, color, c, deAcc, size, groupIndex, per){

  this.per = per;

  this.groupIndex = groupIndex;

  this.deAcc = deAcc;
  this.gravity = 0.03;
  this.gravVel = 0;

  this.pos = Math.createVector(pos.x, pos.y);
  this.color = color;

  var deg = 360 / particalsC;
  var dir = deg * c;

  this.height = 10;
  this.width = 10;
  
  this.size = size;

  this.speed = 5;
  this.vel = Math.createVector(
    Math.cos(Math.radians(dir)) * this.speed,
    Math.sin(Math.radians(dir)) * this.speed
  );

  this.render = function(){
    
    ctx.save();

    ctx.globalAlpha = this.size;

    ctx.fillStyle = this.color;
    ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height);

    ctx.restore();

  }

  this.outOfBounds = function(){

    if(this.pos.y >= window.innerHeight){

      deletePartical(this);
      return;
    }

  }

  this.update = function(){

    this.outOfBounds();

    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;

    this.vel.x *= this.deAcc;
    this.vel.y *= this.deAcc;

    this.vel.y += this.gravVel;
    this.gravVel += this.gravity;

  }

}

var particalsCMin = 10;
var particalsCMax = 20;
var particalsC = Math.randomInt(particalsCMin, particalsCMax);
function makeParticals(rocket){
  
  var pos = Math.createVector(rocket.pos.x, rocket.pos.y);
  var color = rocket.color;
  var size = rocket.size;
  var per = rocket.per;

  var min = 0.9;
  var max = 0.98;
  var deAcc = Math.randomFloat(min, max);

  var p = [];
  for(var i = 0; i < particalsC; i++){
    p.push(new Partical(pos, color, i, deAcc, size, particals.length, per));
  }

  particals.push(p);
}

function deletePartical(p){

  var groupIndex = p.groupIndex;

  if(particals[groupIndex] != undefined){

    for(var i = 0; i < particals[groupIndex].length; i++){
      
      var p1 = particals[groupIndex][i];
  
      if(p.pos.x == p1.pos.x && p.pos.y == p1.pos.y){
        particals[groupIndex].splice(i, 1);      
      }
      
    }

  }

}