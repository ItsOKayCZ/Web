"use strict"
var c;
var ctx;
var pause = false;
var cellWidth = 100;
var cells = [];
var bombPer = 0.2;
var gameOver = false;
var won = false;

window.onload = function(){

  c = document.getElementById("canvas");
  ctx = c.getContext("2d");

  c.width = window.innerWidth;
  c.height = window.innerHeight;

  var cols = Math.floor(c.width / cellWidth);
  for(var i = 0; i < cols; i++){
  	cells[i] = [];
  }

  var rows = Math.floor(c.height / cellWidth);
  for(var i = 0; i < cols; i++){
  	for(var j = 0; j < rows; j++){
  		if(Math.randomFloat(0, 1) < bombPer){
  			cells[i][j] = new Cell(i, j, true);
  		} else {
  			cells[i][j] = new Cell(i, j, false);
  		}
  	}
  }

  c.width = cols * cellWidth + ctx.lineWidth;
  c.height = rows * cellWidth + ctx.lineWidth;

  update();

}

window.onmousedown = function(e){

	if(e.which == 1){
		for(var i = 0; i < cells.length; i++){
			for(var j = 0; j < cells[i].length; j++){
				cells[i][j].onClick({
					x: e.clientX,
					y: e.clientY,
					flag: false
				});
			}
		}
	} else if(e.which == 2){
		for(var i = 0; i < cells.length; i++){
			for(var j = 0; j < cells[i].length; j++){
				cells[i][j].onClick({
					x: e.clientX,
					y: e.clientY,
					flag: true
				});
			}
		}
	}

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

function update(){

	ctx.font = "40px Consolas";

	if(!pause){
		
		window.requestAnimationFrame(update);

		ctx.fillStyle = "#838383";
		ctx.fillRect(0, 0, c.width, c.height);

		for(var i = 0; i < cells.length; i++){
			for(var j = 0; j < cells[i].length; j++){
				cells[i][j].update();
			}
		}
		
		if(gameOver){
			lose();
			return;
		}

		var winned = true;
		for(var i = 0; i < cells.length; i++){
			for(var j = 0; j < cells[i].length; j++){
				if(!cells[i][j].bomb){
					if(!cells[i][j].clicked){
						winned = false;
						break;
					}
				}
			}
			if(!winned){
				break;
			}
		}
		
		if(winned){
			win();
		}
	}
	
}

function win(){

	ctx.save();

	ctx.globalAlpha = 0.25;

	ctx.fillStyle = "Black";
	ctx.fillRect(0, 0, c.width, c.height);

	ctx.restore();

	ctx.font = "80px Consolas";

	var str = "You won!";
	var strWidth = ctx.measureText(str).width;

	var pos = {
		x: c.width / 2 - strWidth / 2,
		y: c.height / 2
	};

	ctx.fillStyle = "White";
	ctx.fillText(str, pos.x, pos.y);

	won = true;
}

function lose(){

	ctx.save();

	ctx.globalAlpha = 0.25;

	ctx.fillStyle = "Black";
	ctx.fillRect(0, 0, c.width, c.height);

	ctx.restore();

	ctx.font = "80px Consolas";

	var str = "You lost!";
	var strWidth = ctx.measureText(str).width;

	var pos = {
		x: c.width / 2 - strWidth / 2,
		y: c.height / 2
	};

	ctx.fillStyle = "White";
	ctx.fillText(str, pos.x, pos.y);

}

function changeDif(per){

	if(confirm("This will reset your current game!\nDo you want to continue?")){
		bombPer = per;

		c = undefined;
		ctx = undefined;
		pause = false;
		cells = [];
		won = false;
		gameOver = false;

		window.onload();
	}	
}