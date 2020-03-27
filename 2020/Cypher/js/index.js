var cypher;
var font;

function preload(){
    font = loadFont("fonts/Sen-Regular.ttf");

    frameRate(25);
}

function setup(){
    createCanvas(windowWidth, windowHeight);

    cypher = new Cypher(font, "Welcome to cypher", 16 * 6);
}

function draw(){
    cypher.update();
}