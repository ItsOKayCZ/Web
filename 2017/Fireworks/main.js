"use strict"
var c;
var ctx;
var pause = false;
var fps = 60;
var gameTimer = undefined;
var loading = false;

var rockets = [];
var rocketsC = 2;

var rocketSpawn = 40;
var rocketSpawnFrame = 0;

var particals = [];

var text = {
  str: "Happy New Year",
  font: "newYear",
  color: "White",
  size: 120,
};

const defaultHeight = 1045;
var globalPer;

window.onload = function () {

  c = document.getElementById("canvas");
  ctx = c.getContext("2d");

  c.width = window.innerWidth;
  c.height = window.innerHeight;

  globalPer = c.height / defaultHeight;

  text.size = text.size * globalPer;

  for (var i = 0; i < rocketsC; i++) {
    rockets[i] = new Rocket(globalPer);
  }

  update();

}

function updateAll() {

  if (rocketSpawnFrame >= rocketSpawn) {
    makeRocket();

    rocketSpawnFrame = 0;
  } else {
    rocketSpawnFrame++;
  }

  // Rocket
  for (var i = 0; i < rockets.length; i++) {
    rockets[i].update();
  }

  // Partical
  for (var i = 0; i < particals.length; i++) {

    if (particals[i] != undefined) {

      for (var j = 0; j < particals[i].length; j++) {
        particals[i][j].update();
      }

    }

  }

  for (var i = 0; i < particals.length; i++) {
    if (particals[i].length == 0) {
      particals.splice(i, 1);
    }
  }

}
function renderAll() {

  ctx.fillStyle = "Black";
  ctx.fillRect(0, 0, c.width, c.height);

  for (var i = 0; i < rockets.length; i++) {
    rockets[i].render();
  }

  for (var i = 0; i < particals.length; i++) {
    for (var j = 0; j < particals[i].length; j++) {
      particals[i][j].render();
    }
  }

  renderText();  

}

function update() {

  if (window.innerWidth > 530) {
    c.width = window.innerWidth;
  }
  c.height = window.innerHeight;

  globalPer = c.height / defaultHeight;

  if (rocketSpawnFrame >= rocketSpawn) {
    makeRocket(globalPer);

    rocketSpawnFrame = 0;
  } else {
    rocketSpawnFrame++;
  }

  ctx.fillStyle = "Black";
  ctx.fillRect(0, 0, c.width, c.height);

  updateAll();
  renderAll();

  window.requestAnimationFrame(update);

}

function renderText() {

  ctx.font = text.size.toString() + "px " + text.font;

  ctx.fillStyle = text.color;
  var width = ctx.measureText(text.str).width / 2;

  ctx.fillText(text.str, c.width / 2 - width, c.height / 2);

}