function Player(){

    this.pos = {
        x: 0,
        y: 0
    };

    this.goingDir = {
        down: false,
        up: false,
        right: false,
        left: false 
    };

    this.speed = 3;

    this.width = this.height = 75; 

    this.update = function(){

        this.updatePos();
        this.render();

    }

    this.updatePos = function(){

        var cHeight = this.pos.y + this.height;
        var cWidth = this.pos.x + this.width;

        if(this.pos.y + cHeight >= c.height){

            this.pos.y -= this.speed;
            
            this.goingDir.up = true;
            this.goingDir.down = false;

        } else if(this.pos.y <= 0){

            this.pos.y += this.speed;

            this.goingDir.down = true;
            this.goingDir.up = false;

        } else if(this.goingDir.up){

            this.pos.y -= this.speed;

        } else if(this.goingDir.down){

            this.pos.y += this.speed;

        }

        if(this.pos.x + cWidth >= c.width){

            this.pos.x -= this.speed;
            
            this.goingDir.left = true;
            this.goingDir.right = false;

        } else if(this.pos.x <= 0){

            this.pos.x += this.speed;

            this.goingDir.right = true;
            this.goingDir.left = false;

        } else if(this.goingDir.left){

            this.pos.x -= this.speed;

        } else if(this.goingDir.right){

            this.pos.x += this.speed;

        }
     
    }

    this.render = function(){

        ctx.fillStyle = "White";
        ctx.fillRect(this.pos.x, this.pos.y, this.pos.x + this.width, this.pos.y + this.height);
        
    }

}