"use strict";
var c;
var ctx;
var texts = [];
var spamC = 100;
var backgroundColor = "#b5baf6";
var isSpammed = false;
var isTextChanged = false;

window.onload = function(){

  c = document.getElementById("canvas");
  ctx = c.getContext("2d");

  c.width = window.innerWidth;
  c.height = window.innerHeight;

  texts[0] = new Text();

  update();

}

window.onmousemove = function(e){

  for(var i = texts.length - 1; i >= 0; i--){

    if(isTextChanged){
      break;
    }

    texts[i].checkPos({
      x: e.clientX,
      y: e.clientY
    });

  }

  isTextChanged = false;

}

window.onmousedown = function(e){

  for(var i = texts.length - 1; i >= 0; i--){

    if(isTextChanged){
      break;
    }

    texts[i].checkClick({
      x: e.clientX,
      y: e.clientY
    });

  }

  isTextChanged = false;

}

function update(){

  c.width = window.innerWidth;
  c.height = window.innerHeight;

  window.requestAnimationFrame(update);

  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, c.width, c.height);

  for(var i = 0; i < texts.length; i++){
    texts[i].update();
  }

}

// Generates a random int
// @param {Number} min Minimum
// @param {Number} max Maximum
Math.randomInt = function(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
