var font;
function preload(){
    font = loadFont("fonts/Sen-Bold.ttf");
}

var particles = [];
var msg = "Welcome";
var fontSize = 192;
function setup(){
    createCanvas(windowWidth, windowHeight);
    textFont(font);
    
    var offset = font.textBounds(msg, 0, 0, fontSize).w / 2;
    var points = font.textToPoints(msg, width / 2 - offset, height / 2, fontSize);

    for(var i = 0; i < points.length; i++){
        particles.push(new Particle(points[i].x, points[i].y));
    }
}

function draw(){
    background(255);

    for(var i = 0; i < particles.length; i++){

        particles[i].update();

    }
}