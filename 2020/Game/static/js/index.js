var socket;
var player;
function main(){
    socket = io();

    console.log('Opening scanner');
    window.open(`${location.origin}/scanner`, 'Scanner', 'left=0,top=0,width=500,height=500');

    player = new Player(10, 10);

    let type = 'WebGL';
    if(!PIXI.utils.isWebGLSupported()){
        type = 'canvas';
    }

    PIXI.utils.sayHello(type);
}

window.onload = main;