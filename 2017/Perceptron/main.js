"use strict"
var c;
var ctx;
var pause = false;

var pointsC = 20;
var points = [];

window.onload = function(){

  c = document.getElementById("canvas");
  ctx = c.getContext("2d");

  c.height = window.innerHeight;
  c.width = c.height;

  for(var i = 0; i < pointsC; i++){
  	points[i] = new Point();
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

function update(){

	if(!pause){
		
		window.requestAnimationFrame(update);

		ctx.clearRect(0, 0, c.width, c.height);
		
		for(var i = 0; i < points.length; i++){
			points[i].update();
		}

	}
	
}
