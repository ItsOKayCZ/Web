"use strict"
var c;
var ctx;
var pause = false;
var fps = 60;
var gameTimer = undefined;
var loading = false;

var mouse;

var rocket;

window.onload = function(){

  c = document.getElementById("canvas");
  ctx = c.getContext("2d");

  c.width = window.innerWidth;
  c.height = window.innerHeight;

  mouse = Math.createVector(c.width / 2, c.height);
  
  rocket = new Rocket();

  (function(){

    var onEachFrame;

    if(window.requestAnimationFrame != undefined){

      onEachFrame = function(cb){

        var _cb = function(){
          if(!pause){
            cb();
            window.requestAnimationFrame(_cb);
          }
        }
        _cb();

      }

    } else if(window.mozRequestAnimationFrame != undefined){

      onEachFrame = function(cb){

        var _cb = function(){
          if(!pause){
            cb();
            window.mozRequestAnimationFrame(_cb);
          }
        }
        _cb();

      }

    } else {

      onEachFrame = function(cb){

        var _cb = function(){
          cb();
          gameTimer = setInterval(update, 1000 / fps);
        }
        _cb();

      }

    }

    window.onEachFrame = onEachFrame;
  })();
  window.onEachFrame(update);

}

window.onmousemove = function(e){
  
  mouse = Math.createVector(e.clientX, e.clientY);
  
}

window.onkeydown = function(e){

  if(!loading){
    if(e.key == "Escape"){
  		if(pause){
        update();
  			pause = false;
        window.onEachFrame(update);
  		} else {
  			pause = true;
        if(gameTimer != undefined){
          clearInterval(gameTimer);
        }
  		}
  	}
  }

}

function updateAll(){

  rocket.update();
  
}
function renderAll(){

  ctx.fillStyle = "Black";
  ctx.fillRect(0, 0, c.width, c.height);
  
  rocket.render();

}
var update = (function(){

  var loops = 0;
  var fpsTicks = 1000 / fps;
  var maxFpsSkip = 10;
  var nextGameTick = Date.now();

  return function(){

    loops = 0;

    c.width = window.innerWidth;
    c.height = window.innerHeight;

    if(!pause){

      while(Date.now() > nextGameTick && loops < maxFpsSkip){

        // Updating
        updateAll();

        nextGameTick += fpsTicks;
        loops++;

        loading = true;

      }

      if(Date.now() < nextGameTick){
        loading = false;
      }

    } else {

      nextGameTick = Date.now();

    }

    // Rendering
    renderAll();

  }

})();
