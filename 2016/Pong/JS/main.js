var c,
    players = [],
    ball,
    isAI = false,
    ctx;

window.onload = function(){

    c = document.getElementById("canvas");
    ctx = c.getContext("2d");
    
    c.width = 700;
    c.height = 600;

    ball = new Ball(new Player().height);

    while(true){

        var cPlayers = parseInt(prompt("How many players: [1-2]"));

        if(cPlayers == 1){

            players[0] = new Player();
            players[0].pos.x = 10;
            players[0].pos.y = c.height / 2 - (players[0].height / 2);
            players[0].side = "Left";
            
            players[1] = new AIPlayer();
            players[1].pos.x = c.width - 10 - players[1].width;
            players[1].pos.y = c.height / 2 - (players[1].height / 2);
            
            isAI = true;
            break;

        } else if(cPlayers == 2){

            players[0] = new Player();
            players[0].pos.x = 10;
            players[0].pos.y = c.height / 2 - (players[0].height / 2);
            players[0].side = "Left";

            players[1] = new Player();
            players[1].pos.x = c.width - 10 - players[1].width;
            players[1].pos.y = c.height / 2 - (players[1].height / 2);
            players[1].side = "Right";

            break;

        }

    }

    update();
};

window.onkeydown = function(e){

    if(players[1] == undefined || isAI){

        if(e.code == "ArrowUp" || e.code == "ArrowDown"){

            players[0].updateDir(e.code, true);

        }
        
    } else {

        if(e.code == "KeyW"){

            players[0].updateDir("ArrowUp", true);

        } else if(e.code == "KeyS"){

            players[0].updateDir("ArrowDown", true);

        } else if(e.code == "ArrowDown" || e.code == "ArrowUp"){

            players[1].updateDir(e.code, true);
                
        }

    }

};

window.onkeyup = function(e){

    if(players[1] == undefined || isAI){

        if(e.code == "ArrowUp" || e.code == "ArrowDown"){

            players[0].updateDir(e.code, false);

        }
        
    } else {

        if(e.code == "KeyW"){

            players[0].updateDir("ArrowUp", false);

        } else if(e.code == "KeyS"){

            players[0].updateDir("ArrowDown", false);

        } else if(e.code == "ArrowDown" || e.code == "ArrowUp"){

            players[1].updateDir(e.code, false);
                
        }

    }

};

function update(){

    ctx.fillStyle = "Black";
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.fillStyle = "White";
    ctx.fillRect(c.width / 2 - 0.5, 0, 1, c.height);

    window.requestAnimationFrame(update);

    for(var i = 0; i < players.length; i++){

        players[i].update();

    }

    ball.update();

}