"use strict"
var c;
var ctx;
var pause = false;
var fps = 60;
var gameTimer = undefined;
var loading = false;
var debug = false;

var border = 25;

var rocket = [];
var rocketC = 20;

var food = [];
var foodC = 50;
var foodPer = 0.1;

var poison = [];
var poisonC = foodC / 2;
var poisonPer = 0.1;

window.onload = function () {

  c = document.getElementById("canvas");
  ctx = c.getContext("2d");

  c.width = window.innerWidth;
  c.height = window.innerHeight;

  for (var i = 0; i < rocketC; i++) {
    rocket[i] = new Rocket();
  }

  for (var i = 0; i < foodC; i++) {
    food.push(new Food());
  }

  for (var i = 0; i < poisonC; i++) {
    poison.push(new Poison());
  }


  (function () {

    var onEachFrame;

    if (window.requestAnimationFrame != undefined) {

      onEachFrame = function (cb) {

        var _cb = function () {
          if (!pause) {
            cb();
            window.requestAnimationFrame(_cb);
          }
        }
        _cb();

      }

    } else if (window.mozRequestAnimationFrame != undefined) {

      onEachFrame = function (cb) {

        var _cb = function () {
          if (!pause) {
            cb();
            window.mozRequestAnimationFrame(_cb);
          }
        }
        _cb();

      }

    } else {

      onEachFrame = function (cb) {

        var _cb = function () {
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

window.onkeydown = function (e) {

  if (!loading) {
    if (e.key == "Escape") {
      if (pause) {
        update();
        pause = false;
        window.onEachFrame(update);
      } else {
        pause = true;
        if (gameTimer != undefined) {
          clearInterval(gameTimer);
        }
      }
    }

    if (e.key == "Enter") {
      debug = !debug;
    }
  }

}

window.onmousedown = function (e) {

  if (!loading) {
    rocket.push(new Rocket(Math.createVector(e.clientX, e.clientY)));
  }

}

function updateAll() {

  if (Math.randomFloat(0, 1) <= foodPer) {
    food.push(new Food());
  }

  if (Math.randomFloat(0, 1) <= poisonPer) {
    poison.push(new Poison());
  }

  for (var i = 0; i < poison.length; i++) {
    poison[i].update();
  }

  for (var i = 0; i < food.length; i++) {
    food[i].update();
  }

  for (var i = 0; i < rocket.length; i++) {
    rocket[i].update();
  }

}

function renderAll() {

  ctx.fillStyle = "Black";
  ctx.fillRect(0, 0, c.width, c.height);

  ctx.strokeStyle = "White";
  ctx.strokeRect(0 + border, 0 + border, c.width - border * 2, c.height - border * 2);

  for (var i = 0; i < rocket.length; i++) {
    rocket[i].render();
  }

  for (var i = 0; i < food.length; i++) {
    food[i].render();
  }

  for (var i = 0; i < poison.length; i++) {
    poison[i].render();
  }

}
var update = (function () {

  var loops = 0;
  var fpsTicks = 1000 / fps;
  var maxFpsSkip = 10;
  var nextGameTick = Date.now();

  return function () {

    loops = 0;

    c.width = window.innerWidth;
    c.height = window.innerHeight;

    if (!pause) {

      while (Date.now() > nextGameTick && loops < maxFpsSkip) {

        // Updating
        updateAll();

        nextGameTick += fpsTicks;
        loops++;

        loading = true;

      }

      if (Date.now() < nextGameTick) {
        loading = false;
      }

    } else {

      nextGameTick = Date.now();

    }

    // Rendering
    renderAll();

  }

})();

function deleteRocket(pos) {

  for (var i = 0; i < rocket.length; i++) {
    if (rocket[i].pos.x == pos.x && rocket[i].pos.y == pos.y) {
      rocket.splice(i, 1);
      break;
    }
  }

}

function deletePoison(pos) {

  for (var i = 0; i < poison.length; i++) {
    if (poison[i].pos.x == pos.x && poison[i].pos.y == pos.y) {
      poison.splice(i, 1);
      break;
    }
  }

}

function makeRocket(dna) {
  rocket.push(new Rocket(undefined, dna))
}

function deleteFood(pos) {

  for (var i = 0; i < food.length; i++) {
    if (food[i].pos.x == pos.x && food[i].pos.y == pos.y) {
      food.splice(i, 1);
      break;
    }
  }

}
