function Player(){

    this.height = 100;
    this.width = 15;
    this.speed = 3;
    this.side = undefined;

    this.pos = {
        x: undefined,
        y: undefined
    };

    this.dirs = {
        up: false,
        down: false
    };

    this.render = function(){

        ctx.fillStyle = "White";
        ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height);

    };

    this.updateDir = function(direction, statement){

        if(direction == "ArrowUp"){

            this.dirs.up = statement;

        } else if(direction == "ArrowDown"){

            this.dirs.down = statement;

        }

    };

    this.updatePos = function(){

        if(this.dirs.up){

            this.pos.y -= this.speed;
            
        }

        if(this.dirs.down){

            this.pos.y += this.speed;

        }

        if(this.pos.y <= 0){

            this.pos.y = 0;

        } else if(this.pos.y + this.height >= c.height){

            this.pos.y = c.height - this.height;

        }

    };

    this.update = function(){

        this.updatePos();
        this.render();

    };

}