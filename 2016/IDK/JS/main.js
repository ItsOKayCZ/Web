var c,
    player,
    pause = true,
    ctx;

window.onload = function(){
 
    c = document.getElementById("canvas");
    ctx = c.getContext("2d");
    player = new Player();

    c.width = window.innerWidth;
    c.height = window.innerHeight;

    update();
};

window.onkeydown = function(e){

    if(e.code == "Escape"){

        pause = !pause;
        update();

    }

};

function update(){

    if(pause){

        window.requestAnimationFrame(update);

        ctx.fillStyle = "Black";
        ctx.fillRect(0, 0, c.width, c.height);

        player.update();

    }

}