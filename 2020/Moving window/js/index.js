setInterval(logWindowMovement, 1);

var screen = {
	x: window.screenX,
	y: window.screenY
}
function logWindowMovement(){
	if(window.screenX != screen.x || window.screenY != screen.y){
		console.log('Window moved');
		screen.x = window.screenX;
		screen.y = window.screenY;

		document.getElementsByTagName('body')[0].style.backgroundColor = `rgb(${screen.x}, ${screen.y}, ${screen.x - screen.y})`
	}
}

