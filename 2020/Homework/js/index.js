let WIDTH = window.innerWidth;
let HEIGHT = window.innerHeight;

let DEBUG = false;
let EDIT = false;

const windowWidth = window.innerWidth;
const windowHeight = window.innerHeight;

let platformColor = 0x0072f2;

let app;
let player;
let platforms = [];

window.onload = () => {
    app = new PIXI.Application({
        width: WIDTH,
        height: HEIGHT,
        transparent: true,
        antialias: false,
        resolution: 1
    });

    document.body.appendChild(app.view);

    app.renderer.resize(WIDTH, HEIGHT);

    PIXI.loader.add('mainPlayer', 'img/Main character.svg')
    .add('grapler', 'img/Grapler.svg')
    .add('hook', 'img/Hook.svg')
    .load(setup);
};

function setup(){
    platforms.push(new Platform(0, windowHeight - 100, {
        width: windowWidth,
        height: 100,
        color: platformColor
    }))
    platforms.push(new Platform(200, windowHeight - 400, {
        width: 50,
        height: 50,
        color: 0xff0000
    }))
    player = new MainPlayer(20, 20);

    $(this).on('keydown', (e) => player.keyPressed(e));
    $(this).on('keyup', (e) => player.keyPressed(e));
    $(this).on('mousedown', mousePressed);
    $(this).on('mouseup', mousePressed);
    $(this).on('mousemove', mouseMove);

    app.ticker.add(delta => gameLoop(delta));
}

let mousePos = {
    x: undefined,
    y: undefined
}
function mouseMove({ originalEvent: e }){
    mousePos = {
        x: e.clientX,
        y: e.clientY
    };
}

function mousePressed(e){
    if(EDIT && e.type == 'mousedown'){
        let { originalEvent } = e;
        let platform = {
            width: 50,
            height: 50
        }
        platforms.push(new Platform(originalEvent.clientX - platform.width / 2, originalEvent.clientY - platform.height / 2, {
            width: platform.width,
            height: platform.height,
            color: 0x00ff00
        }))
    } else {
        player.mousePressed(e);
    }
}

function gameLoop(delta){
    player.update();
}

function makePoint(x, y){
    let circle = new PIXI.Graphics();
    circle.beginFill(0x000000);
    circle.drawCircle(x, y, 5);
    circle.endFill();
    app.stage.addChild(circle);
}

Math.radToDeg = (rad) => {
    return rad * (180 / Math.PI);
}

// https://stackoverflow.com/questions/9614109/how-to-calculate-an-angle-from-points
Math.getAngle = (pos1, pos2) => {
        let dx = pos1.x - pos2.x;
        let dy = pos1.y - pos2.y;

        let theta = Math.atan2(dy, dx);

        return theta;
}

// https://gist.github.com/timohausmann/5003280
Math.getDistance = (pos1, pos2) => {
    let dx = pos2.x - pos1.x;
    let dy = pos2.y - pos1.y;

    dx *= dx;
    dy *= dy;

    return Math.sqrt(dx + dy);
}