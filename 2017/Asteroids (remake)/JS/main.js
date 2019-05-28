"use strict"
var c;
var ctx;
var pause = false;
var fps = 60;
var gameTimer = undefined;
var loading = false;

var allGameOver = false;

var player;

var ast = [];

var scoreMan;
var roundMan;

const minHeight = 500;
const minWidth = 500;

window.onload = function(){

  c = document.getElementById("canvas");
  ctx = c.getContext("2d");

  c.width = window.innerWidth;
  c.height = window.innerHeight;

  player = new Player("White", 0);
  scoreMan = new ScoreManager();
  roundMan = new RoundManager();



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
          gameTimer = setInterval(cb, 1000 / fps);
        }
        _cb();

      }

    }

    window.onEachFrame = onEachFrame;
  })();
  window.onEachFrame(update);

}

window.onkeyup = function(e){

  if(e.code == "ArrowUp" || e.code == "Space" || e.code == "ArrowLeft" || e.code == "ArrowRight" || e.code == "ArrowDown"){
    if(player != undefined){
      if(!loading){
        player.updateDir(e.code, false);
      }
    }
  }

}

window.onkeydown = function(e){

  if(e.code == "ArrowUp" || e.code == "Space" || e.code == "ArrowLeft" || e.code == "ArrowRight" || e.code == "ArrowDown"){
    if(player != undefined){
      if(!loading){
        player.updateDir(e.code, true);
      }
    }
  }

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

  roundMan.update();
  player.update();

  for(var i = 0; i < player.lasers.length; i++){
    player.lasers[i].update();
  }

  for(var i = 0; i < ast.length; i++){
    ast[i].update();
  }

  scoreMan.update();

}
function renderAll(){

  player.render();
  for(var i = 0; i < player.lasers.length; i++){
    player.lasers[i].render();
  }

  for(var i = 0; i < ast.length; i++){
    ast[i].render();
  }

  scoreMan.render();
  roundMan.render();

}
var update = (function(){

  var loops = 0;
  var fpsTicks = 1000 / fps;
  var maxFpsSkip = 100;
  var nextGameTick = Date.now();

  return function(){

    loops = 0;

    c.width = window.innerWidth;
    c.height = window.innerHeight;

    if(c.width < minWidth){
      c.width = minWidth;
    }
    if(c.height < minHeight){
      c.height = minHeight;
    }

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
    ctx.fillStyle = "Black";
    ctx.fillRect(0, 0, c.width, c.height);
    renderAll();

  }

})();

/***
 *    $$$$$$$\  $$\
 *    $$  __$$\ $$ |
 *    $$ |  $$ |$$ | $$$$$$\  $$\   $$\  $$$$$$\   $$$$$$\
 *    $$$$$$$  |$$ | \____$$\ $$ |  $$ |$$  __$$\ $$  __$$\
 *    $$  ____/ $$ | $$$$$$$ |$$ |  $$ |$$$$$$$$ |$$ |  \__|
 *    $$ |      $$ |$$  __$$ |$$ |  $$ |$$   ____|$$ |
 *    $$ |      $$ |\$$$$$$$ |\$$$$$$$ |\$$$$$$$\ $$ |
 *    \__|      \__| \_______| \____$$ | \_______|\__|
 *                            $$\   $$ |
 *                            \$$$$$$  |
 *                             \______/
 */

var minimalDistance = 200;

/**
 * @method Making the laser
 */
function makeLaser(id){
  player.lasers.push(new Laser(player.pos, player.heading, player.height, player.lasers.length, id));
}

/**
 * @method Changing the isShooting variable
 */
function changeIsShooting(){
  player.isShooting = false;
}

function findPlayerArray(pos){
  for(var i = 0; i < player.length; i++){
    if(pos.x == player[i].pos.x && pos.y == player[i].pos.y){
      return i;
    }
  }
}

/**
 * @method Respawns the player
 */
function resetPlayer(respawn/*, pos*/){

  // var index = findPlayerArray(pos);
  var done = false;

  // for(var i = 0; i < ast.length; i++){
  //
  //   if(Math.distance(player[index].pos.x, player[index].pos.y, ast[i].pos.x, ast[i].pos.y) <= minimalDistance){
  //
  //     player[index].crashed = false;
  //     player[index].pos = Math.createVector(respawn.pos.x, respawn.pos.y);
  //     player[index].vel = Math.createVector(respawn.vel.x, respawn.vel.y);
  //     player[index].heading = respawn.heading;
  //     player[index].lasers = [];
  //     player[index].respawn.lifeFrame = false;
  //     player[index].curAlpha = 1;
  //     player[index].needRespawn = false;
  //     player[index].respawn.curLaserC = 0;
  //     player[index].shooting = false;
  //     player[index].shootingDelayB = false;
  //     player[index].shootingDelayFrame = 0;
  //     done = true;
  //     break;
  //   }
  //
  // }

  for(var i = 0; i < ast.length; i++){

    if(Math.distance(respawn.pos.x, respawn.pos.y, ast[i].pos.x, ast[i].pos.y) <= minimalDistance){

      player.needRespawn = true;

      done = true;
    }

  }

  if(!done){

    player.crashed = false;
    player.pos = Math.createVector(respawn.pos.x, respawn.pos.y);
    player.vel = Math.createVector(respawn.vel.x, respawn.vel.y);
    player.heading = respawn.heading;
    player.lasers = [];
    player.respawn.lifeFrame = 0;
    player.respawn.curLaserC = 0;
    player.shooting = false;
    player.curAlpha = 1;
    player.needRespawn = false;
    player.shootingDelayB = false;
    player.shootingDelayFrame = 0;

  }

}

/***
 *    $$\
 *    $$ |
 *    $$ |      $$$$$$\   $$$$$$$\  $$$$$$\   $$$$$$\
 *    $$ |      \____$$\ $$  _____|$$  __$$\ $$  __$$\
 *    $$ |      $$$$$$$ |\$$$$$$\  $$$$$$$$ |$$ |  \__|
 *    $$ |     $$  __$$ | \____$$\ $$   ____|$$ |
 *    $$$$$$$$\\$$$$$$$ |$$$$$$$  |\$$$$$$$\ $$ |
 *    \________|\_______|\_______/  \_______|\__|
 */

/**
 * @method Removes the laser from the lasers array
 */
function deleteLaser(id){
  player.lasers.splice(id, 1);
  for(var i = 0; i < player.lasers.length; i++){
    player.lasers[i].updateId(id);
  }
}


/***
 *     $$$$$$\              $$\                                   $$\       $$\
 *    $$  __$$\             $$ |                                  \__|      $$ |
 *    $$ /  $$ | $$$$$$$\ $$$$$$\    $$$$$$\   $$$$$$\   $$$$$$\  $$\  $$$$$$$ |
 *    $$$$$$$$ |$$  _____|\_$$  _|  $$  __$$\ $$  __$$\ $$  __$$\ $$ |$$  __$$ |
 *    $$  __$$ |\$$$$$$\    $$ |    $$$$$$$$ |$$ |  \__|$$ /  $$ |$$ |$$ /  $$ |
 *    $$ |  $$ | \____$$\   $$ |$$\ $$   ____|$$ |      $$ |  $$ |$$ |$$ |  $$ |
 *    $$ |  $$ |$$$$$$$  |  \$$$$  |\$$$$$$$\ $$ |      \$$$$$$  |$$ |\$$$$$$$ |
 *    \__|  \__|\_______/    \____/  \_______|\__|       \______/ \__| \_______|
 */

var minRadius = 15;

/**
 * @method gets the index of the asteroid in the array
 * @return {Number} i Index
 */
function getAsteroid(pos){
  for(var i = 0; i < ast.length; i++){
    if(ast[i].pos.x == pos.x && ast[i].pos.y == pos.y){
      return i;
    }
  }
}

/**
 * @method Removes ths asteroid from the ast array
 */
function deleteAsteroid(i){
  ast.splice(i, 1);
}

/**
 * @method Makes asteroids and adds it to the ast array
 */
function makeAsteroid(pos){

  var index = getAsteroid(pos);
  var minRadi = ast[index].minRadius;
  var maxRadi = ast[index].maxRadius;
  deleteAsteroid(index);

  var off = 0.75
  var off1 = 0.5;
  var temp = [];

  var times = Math.randomFloat(0, 1) <= 0.3 ? 3 : 2;

  for(var i = 0; i < times; i++){

    var maxR = Math.randomFloat(minRadi, maxRadi * off);
    var minR = Math.randomFloat(minRadius * off1, minRadi);
    if(minR > minRadius){
      temp.push(new Asteroid(pos, minR, maxR));
    }

  }

  for(var i = 0; i < temp.length; i++){
    ast.push(temp[i]);
  }

}
