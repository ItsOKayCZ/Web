"use strict"

/*
##################
# GLOBAL VARIABLES
##################
 */

// The canvas
var c;
// The context of the canvas
var ctx;
// The minimum width of the canvas
var cLimit = 600;
// Rockets on the screen
var rocketsC = 100;
// The array to store the rockets
var rockets = [];
// The length of 1 generation
var lifeLen = 400;
// The current frame
var lifeC = 0;
// The target
var target;
// If the game is paused
var pause = false;
// The highest fitness
var maxFit = 0;
// Percentage of mutation
var mutPer = 0.01;
// Counting how many childs were created
var nextGenC = 0;
// Copy of the rockets array
var rocketsCopy;
// The obstacles
var obs = [];
// Counts the number of generations from the beginning
var generationCount = 0;

/*
###########
# FUNCTIONS
###########
 */

/**
 * When the window loads
 */
window.onload = function(restart){

  c = document.getElementById("canvas");
  ctx = c.getContext("2d");

  c.width = window.innerWidth;
  c.height = window.innerHeight;

  target = new Target();

  for(var i = 0; i < rocketsC; i++){
    rockets[i] = new Rocket();
  }

  if(restart != true){
    update();
  }

}

/**
 * When a key is pressed and held
 */
window.onkeydown = function(e){

  if(e.key == "Escape"){
    if(!pause){
      pause = true;
      console.log("Pause");
    } else {
      pause = false;
      console.log("Play");
    }
  }

}

/**
 * When the mouse moves
 */
window.onmousemove = function(e){

  if(!pause){

    if(obs[0] != undefined){

      if(obs[obs.length - 1].pressed){

        obs[obs.length - 1].height = e.clientY - obs[obs.length - 1].pos.y;
        obs[obs.length - 1].width = e.clientX - obs[obs.length - 1].pos.x;

      }

    }

  }

}

/**
 * When the mouse is released
 */
window.onmouseup = function(e){

  if(!pause){
    obs[obs.length - 1].pressed = false;
  }

}

/**
 * Resets the program
 */
function reset(countR){

  c = undefined;
  ctx = undefined;
  pause = false;
  obs = [];
  rockets = [];
  generationCount = 0;
  lifeC = 0;
  rocketsC = countR;
  window.onload(true);

}

/**
 * When the mouse is pressed but not released
 */
window.onmousedown = function(e){

  var pos = Math.createVector(e.clientX, e.clientY);

  if((pos.x > c.width - 75)
  && (pos.y < 0 + 75)){

    pause = true;
    while(true){
      var hRockets = prompt("How many rockets: [2 - Infinity]");
      if(parseInt(hRockets) >= 2){
        reset(hRockets);
        break;
      } else if(hRockets == null){
        pause = false;
        break;
      } else if(parseInt(hRockets) <= 1 || isNaN(parseInt(hRockets))){
        alert("Invalid!");
      }
    }

  } else if((pos.x > c.width - 100 * 2)
   && (pos.x < c.width - 100)
   && (pos.y < 0 + 100)){

     pause = true;
     alert("Click and drag the mouse (or touch the screen) to create an obstacle.\nEsc (Escape) will pause.");
     pause = false;

  } else if(!pause){
    obs[obs.length] = new Obstacle(e.clientX, e.clientY);
    obs[obs.length - 1].pressed = true;
  }

}

window.addEventListener("touchend", function(e){
  window.onmouseup();
});

/**
 * When a phone user moves the finger on the display
 */
window.addEventListener("touchmove", function(e){
  window.onmousemove({
    clientX: e.targetTouches[0].clientX,
    clientY: e.targetTouches[0].clientY
  });
});

/**
 * When a phone user touches the display
 */
window.addEventListener("touchstart", function(e){
  window.onmousedown({
    clientX: e.targetTouches[0].clientX,
    clientY: e.targetTouches[0].clientY
  });
});

/**
 * The main function (game loop)
 */
function update(){

  if(!pause){

    lifeC++;

    if(lifeC >= lifeLen){
      for(var i = 0; i < rockets.length; i++){
        rockets[i].calcFit();
      }
      rocketsCopy = rockets.slice();
      for(var i = 0; i < rockets.length; i++){
        chooseParents();
      }
      lifeC = 0;
      nextGenC = 0;
      maxFit = 0;
      generationCount++;
      console.clear();
    }

    if(c.width <= cLimit){

      c.width = cLimit;

    }

    ctx.fillStyle = "Black";
    ctx.fillRect(0, 0, c.width, c.height);

    target.update();

    for(var i = 0; i < rockets.length; i++){
      rockets[i].update();
    }

    for(var i = 0; i < obs.length; i++){
      obs[i].update();
    }

    renderText();

  }

  window.requestAnimationFrame(update);

}

/**
 * Renders the text (the current frame - lifeC, the generation)
 */
function renderText(){

  ctx.font = "30px Consolas";

  ctx.fillStyle = "#64fbff";
  ctx.strokeStyle = "Black";
  ctx.fillText(lifeC, 25, 0 + 50);
  ctx.strokeText(lifeC, 25, 0 + 50);

  ctx.fillText("Generation: " + generationCount.toString(), 200, 0 + 50);
  ctx.strokeText("Generation: " + generationCount.toString(), 200, 0 + 50);

  ctx.save();
  ctx.globalAlpha = 0.8;
  ctx.font = "10px Consolas";
  var str1 = "Change the number";
  var str2 = "of rockets";
  var str1Width = ctx.measureText(str1).width;
  var str2Width = ctx.measureText(str2).width;
  ctx.fillStyle = "White";
  ctx.fillRect(c.width, 0, -100, 100);
  ctx.fillStyle = "#2b892d";
  ctx.fillText(str1, c.width - 75 - (str1Width / 2) + 25, 0 + 75 / 1.5);
  ctx.fillText(str2, c.width - 75 - (str2Width / 2) + 25, 0 + 75 / 1.25);
  ctx.restore();

  ctx.save();
  ctx.globalAlpha = 0.8;
  ctx.font = "10px Consolas";
  var str = "Help!";
  var strWidth = ctx.measureText(str).width;
  ctx.fillStyle = "#a3a2a2";
  ctx.fillRect(c.width - 100, 0, -100, 100);
  ctx.fillStyle = "#42dd45";
  ctx.fillText(str, c.width - (75 * 2) - (strWidth / 2), 0 + 75 / 1.5);
  ctx.restore();

}

/**
 * Mutates the genes
 */
function mutation(genes){

  for(var i = 0; i <= lifeLen; i++){

    if(Math.randomFloat(0, 1) < mutPer){

      var deg = Math.radians(Math.randomFloat(0, 360));
      var force = Math.randomFloat(rockets[nextGenC].minForce, rockets[nextGenC].maxForce);

      genes[i] = {
        x: Math.cos(deg) * force,
        y: Math.sin(deg) * force
      };

    }

  }

  return genes;

}

/**
 * Makes the child
 * @param  {Object} parentA 1. parent
 * @param  {Object} parentB 2. parent
 */
function crossOver(parA, parB){

  var breakPoint = Math.randomInt(0, rockets.length - 1);
  var genes = [];

  for(var i = 0; i <= lifeLen; i++){

    if(i < breakPoint){
      genes[i] = {
        x: rocketsCopy[parA].genes[i].x,
        y: rocketsCopy[parA].genes[i].y
      };
    } else {
      genes[i] = {
        x: rocketsCopy[parB].genes[i].x,
        y: rocketsCopy[parB].genes[i].y
      };
    }

  }

  genes = mutation(genes);
  rockets[nextGenC] = new Rocket(genes);
  nextGenC++;
}

/**
 * Makes the next generation
 */
function chooseParents(){

  var done = false;
  var parentADone = false;
  var parentBDone = false;
  while(!done){

    if(!parentADone){
      var parA = Math.randomInt(0, rocketsCopy.length - 1);
    }

    if(!parentBDone){
      var parB = Math.randomInt(0, rocketsCopy.length - 1);
    }

    if(Math.randomFloat(0, maxFit) <= rocketsCopy[parA].fit && !parentADone){
      parentADone = true;
    }

    if(Math.randomFloat(0, maxFit) <= rocketsCopy[parB].fit && !parentBDone){
      parentBDone = true;
    }

    if(parA == parB){
      parentADone = parentBDone = false;
    }

    if(parentADone && parentBDone){
      done = true;
    }

  }

  crossOver(parA, parB);
}
