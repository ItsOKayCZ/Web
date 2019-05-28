"use strict"
var c = document.getElementById("canvas");
var ctx = c.getContext("2d");

var fps = 50;

c.width = window.innerWidth;
c.height = window.innerHeight;

function Player(index, color){

  this.color = color;
  this.index = index;

  this.offset = 200;
  this.height = 50;

  if(this.index == 0){
    this.pos = Math.createVector(0 + this.offset, c.height / 4 - this.height / 2);
  } else {
    this.pos = Math.createVector(0 + this.offset, c.height - c.height / 4 - this.height / 2);
  }

  this.velX = 1;

  this.render = function(interPol){

    ctx.fillStyle = this.color;
    if(interPol != undefined){
      ctx.fillRect(this.pos.x + this.velX * interPol, this.pos.y, this.height, this.height);
    } else {
      ctx.fillRect(this.pos.x, this.pos.y, this.height, this.height);
    }

  }

  this.update = function(){

    if(this.pos.x + this.height > c.width - this.offset - this.height){
      this.velX = -this.velX;
    } else if(this.pos.x < 0 + this.offset){
      this.velX = -this.velX;
    }

    this.pos.x += this.velX;
  }

}
var player = [
  new Player(0, "Red"),
  new Player(1, "Yellow")
];

var update1 = function(){

  player[1].update();
  player[1].render();

  window.requestAnimationFrame(update1);

}

var update = (function(){

  var loops = 0;
  var fpsTicks = 1000 / fps;
  var maxFpsSkip = 10;
  var nextGameTick = Date.now();

  return function(){

    loops = 0;

    while(Date.now() > nextGameTick && loops < maxFpsSkip){
      player[0].update();
      nextGameTick += fpsTicks;
      loops++;
    }

    ctx.clearRect(0, 0, c.width, c.height);
    if(!loops){
      for(var i = 0; i < player.length; i++){
        player[0].render((nextGameTick - Date.now()) / fpsTicks);
      }
    } else {
      player[0].render(0);
    }
  }

})();

(function(){

  var onEachFrame;
  if(window.requestAnimationFrame != undefined){

    onEachFrame = function(cb){

      var _cb = function(){
        cb();
        window.requestAnimationFrame(_cb);
      }
      _cb();

    }

  } else if(window.mozRequestAnimationFrame != undefined){

    onEachFrame = function(cb){

      var _cb = function(){
        cb();
        window.mozRequestAnimationFrame(_cb);
      }
      _cb();

    }

  } else {

    onEachFrame = function(cb){

      var _cb = function(){
        setInterval(cb, 1000 / fps);
      }

      _cb();
    }

  }

  window.onEachFrame = onEachFrame;
})();
window.onEachFrame(update);
update1();
