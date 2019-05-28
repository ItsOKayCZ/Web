"use strict"
var c;
var ctx;
var cellWidth = 200;
var cells = [];
var pause = false;

window.onkeydown = function(e){

  if(e.code == "Escape"){
    if(pause){
      pause = false;
      update();
    } else {
      pause = true;
    }
  }

}

window.onload = function(){

  c = document.getElementById("canvas");
  ctx = c.getContext("2d");

  c.width = window.innerWidth;
  c.height = window.innerHeight;

  cols = Math.floor(c.width / cellWidth);
  for(var i = 0; i < cols; i++){
    cells[i] = [];
  }

  rows = Math.floor(c.height / cellWidth);
  for(var i = 0; i < cols; i++){
    for(var j = 0; j < rows; j++){
      cells[i][j] = new Cell(i, j);
    }
  }

  c.width = cols * cellWidth;
  c.height = rows * cellWidth;

  start = cells[0][0];
  end = cells[cols - 1][rows - 1];

  openSet[0] = start;
  openSet[0].h = calcH(start.coor, end.coor);

  for(var i = 0; i < rocketsC; i++){
    rockets[i] = new Rocket();
  }

  generateMaze();
  update();

}

function update(){

  if(!pause){

    window.requestAnimationFrame(update);

    ctx.fillStyle = "Black";
    ctx.fillRect(0, 0, c.width, c.height);

    for(var i = 0; i < cols; i++){
      for(var j = 0; j < rows; j++){
        cells[i][j].update();
      }
    }

    if(pfDone){
      ctx.fillStyle = "#7dffb4";
      ctx.beginPath();
      ctx.arc(end.pos.x + cellWidth / 2, end.pos.y + cellWidth / 2, 20, 0, Math.PI * 2);
      ctx.fill();
    }

    if(!mazeLoaded){
      generateMaze();
    } else if(!pfDone){
      current = undefined;
      findPath();
    } else {
      drawPath();

      lifeC++;

      for(var i = 0; i < rockets.length; i++){

        if(!rockets[i].crashed && !rockets[i].finished){
          break;
        }

        if(i + 1 == rockets.length){
          lifeC = lifeLen;
        }
      }

      if(lifeC >= lifeLen){

        for(var i = 0; i < rockets.length; i++){
          rockets[i].calcFit();
        }
        // console.clear();
        // for(var i = 0; i < rockets.length; i++){
        //   console.log("Fitness ID " + i + ": " + rockets[i].fit);
        // }
        // console.log("Max fit: " + maxFit);
        // debugger;
        rocketsCopy = rockets.slice();
        for(var i = 0; i < rockets.length; i++){
          chooseParents();
        }

        lifeC = 0;
        maxFit = 0;
        nextGenC = 0;

      }

      for(var i = 0; i < rockets.length; i++){
        rockets[i].update();
      }

    }

  }

}
