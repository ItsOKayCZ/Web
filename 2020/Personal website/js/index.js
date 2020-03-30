var font;
var parameters = [];
var message = "Welcome";
function preload(){
    font = loadFont("fonts/Sen-Bold.ttf");

    if(location.pathname.indexOf("projects.html") != -1){
        message = "Projects";
    }

    parameters.push([font, message, 16 * 6, 255, 0]);
    parameters.push([font, message, 16 * 6, 255, 0]);
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
function setup(){
    var parent = document.getElementById("header");
    var canvas = createCanvas(windowWidth, parent.clientHeight);
    canvas.style("display", "block");
    canvas.parent("canvas-holder");

    index = floor(random(features.length));
    feature = new features[index](parameters[index]);

    frameRate(frameRates[index]);
}

function draw(){
    feature.update();
}

function windowResized(){
    resizeCanvas(windowWidth, document.getElementById("canvas-holder").clientHeight);
}