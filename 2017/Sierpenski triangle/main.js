"use strict"
var c;
var ctx;
var pause = false;

var cells = [];
var cellHeight = 10;

var cur = [0, 0];
var done = false;

window.onload = function(){

  c = document.getElementById("canvas");
  ctx = c.getContext("2d");

  c.width = window.innerWidth;
  c.height = window.innerHeight;

  var cols = Math.floor(c.width / cellHeight);
  var rows = Math.floor(c.height / cellHeight);
  for(var i = 0; i < cols; i++){
    cells[i] = [];
    for(var j = 0; j < rows; j++){
      cells[i][j] = new Cell(i, j);
    }
  }

  update();

}

window.onkeydown = function(e){

  if(e.key == "Escape"){
		if(pause){
			pause = false;
      update();
		} else {
			pause = true;
		}
	}

}

function updateAll(){
  
  if(!done){

    cells[cur[0]][cur[1]].update();

  }

}
function renderAll(){

  if(!done){

    cells[cur[0]][cur[1]].render();

    cur[0]++;
    if(cur[0] > cells.length - 1){
      cur[1]++;
      cur[0] = 0;
    }

    if(cur[1] > cells[cur[0]].length - 1){
      done = true;
    }

  }

}
var update = function(){

  if(!pause){

    updateAll();
    renderAll();

    window.requestAnimationFrame(update);

  }

};
