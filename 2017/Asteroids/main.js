"use strict";
var c,
    ctx,
    maxAst = 5,
    round = 1,
    pause = false,
    players = [],
    lasers = [],
    asts = [];

/**
 * Calls the function when the page (window) is loaded
 */
window.onload = function(){
    
    c = document.getElementById("canvas");
    ctx = c.getContext("2d");

    c.width = window.innerWidth;
    c.height = window.innerHeight;

    while(true){

        var cPlayers = parseInt(prompt("How many players: [1-2]"));

        if(cPlayers == 1){

            players[0] = new Player(0);
            break;

        } else if(cPlayers == 2){

            var pColor = prompt("Color for player 1: (Hex colors work)");

            players[0] = new Player(0);
            players[0].color = pColor;
            
            pColor = prompt("Color for player 2: (Hex colors work)");

            players[1] = new Player(1);
            players[1].color = pColor;

            break;
        }

    }

    for(var i = 0; i < maxAst * round; i++){
        asts[i] = new Asteroid();
    }

    update();
}

/**
 * Calls the function when a key is pressed
 */
window.onkeydown = function(e){
    if(e.code == "Escape"){
        if(pause == true){
            pause = false;
            update();
        } else if(pause == false){
            pause = true;
        }
    }
    if(e.code == "ArrowUp" || e.code == "ArrowLeft" || e.code == "ArrowRight"){
        players[0].updateDir(e.code, true);
    } else if(e.code == "ArrowDown"){
        players[0].setShooting(true);
    } else if(players[1] != undefined){
        if(e.code == "KeyS"){
            players[1].setShooting(true);
        } else if(e.code == "KeyW"){
            players[1].updateDir("ArrowUp", true);
        } else if(e.code == "KeyA"){
            players[1].updateDir("ArrowLeft", true);
        } else if(e.code == "KeyD"){
            players[1].updateDir("ArrowRight", true);
        }
    }
}

/**
 * Calls the function when a key is released
 */
window.onkeyup = function(e){
    if(e.code == "ArrowUp" || e.code == "ArrowLeft" || e.code == "ArrowRight"){
        players[0].updateDir(e.code, false);
    } else if(e.code == "ArrowDown"){
        players[0].setShooting(false);
    } else if(players[1] != undefined){
        if(e.code == "KeyS"){
            players[1].setShooting(false);
        } else if(e.code == "KeyW"){
            players[1].updateDir("ArrowUp", false);
        } else if(e.code == "KeyA"){
            players[1].updateDir("ArrowLeft", false);
        } else if(e.code == "KeyD"){
            players[1].updateDir("ArrowRight", false);
        }
    }
}

/**
 * Game loop
 */
function update(){

    if(!pause){

        if(asts.length == 0){

            round++;

            for(var i = 0; i < maxAst * round; i++){

                asts[i] = new Asteroid();

            }

            if(players.length == 2){
                
                for(var i = 0; i < players.length; i++){

                    if(players[i].isDead){

                        if(i == 0){

                            var color = players[i].color;
                            var score = players[i].score;
                            players.splice(i, 1);
                            players[1] = players[0];
                            players[0] = new Player(i);
                            players[0].color = color;
                            players[0].score = score;

                        } else {

                            var color = players[i].color;
                            var score = players[i].score;
                            players.splice(i, 1);
                            players[i] = new Player(i);
                            players[i].color = color;
                            players[i].score = score;
                        }

                    }

                }

            }

        }

        if(c.width != window.innerWidth){
            c.width = window.innerWidth;
        }

        if(c.height != window.innerHeight){
            c.height = window.innerHeight;
        }

        window.requestAnimationFrame(update);

        ctx.fillStyle = "Black";
        ctx.fillRect(0, 0, c.width, c.height);
        
        for(var i = 0; i < players.length; i++){
            players[i].update();
        }

        for(var i = 0; i < asts.length; i++){
            asts[i].update();
        }

        for(var i = 0; i < lasers.length; i++){
            lasers[i].update();
        }

    } else {
        ctx.fillStyle = "White";
        ctx.font = "30px Consolas";
        var sizeText = ctx.measureText("Paused!").width;
        ctx.fillText("Paused!", c.width / 2 - (sizeText / 2), c.height / 2 - (30 / 2));
    }

}

/**
 * Returns a object that returns a dir (???)
 */
function getDirAngle(direction){
    return {x: Math.cos(direction * Math.PI / 180), y: Math.sin(direction * Math.PI / 180)};
}

/**
 * Generates a (random) number
 */
function random(min, max){
    return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * Calcs the distance
 */
function dist(a, b){
    return b - a;
}