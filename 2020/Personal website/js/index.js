var font;
var parameters = [];
var message = "Welcome";
var offset = 0;
var padding = 100;
var ratio = 6;
function preload(){
    font = loadFont("fonts/Sen-Bold.ttf");

    if(location.pathname.indexOf("projects.html") != -1){
        message = "Projects";
		offset = windowWidth / 45 * -1;
		ratio = 10;
    }
}

var features = [
    Cypher,
    Particles
];
var frameRates = [
    25,
];

var index = -1;

var feature;
var parent;
function setup(){
    parent = document.getElementById("header");
	var fontSize = windowWidth / ratio;

	// Font, Text, Font size, Foreground color, Background color, padding Y, offset
    parameters.push([font, message, fontSize, 255, 0, padding, offset]);
    parameters.push([font, message, fontSize, 255, 0, padding, offset]);

	index = floor(random(features.length));
	feature = new features[index](parameters[index]);
	var height = feature.getHeight();
	
	var canvas = createCanvas(windowWidth, height + padding);
    canvas.style("display", "block");
    canvas.parent("canvas-holder");

    frameRate(frameRates[index]);
}

function draw(){
    feature.update();
}

function windowResized(){
	var fontSize = windowWidth / ratio;
	if(message == "Projects"){
		offset = windowWidth / 30 * -1;
	}

	feature.updateSize(fontSize, padding, offset);
    resizeCanvas(windowWidth, feature.getHeight() + padding);

	redraw();
}
