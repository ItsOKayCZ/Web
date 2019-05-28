function Ball(pHeight){

    this.radius = 15;
    this.acc = 1.00000005;

    this.scores = {
        p1: 0,
        p2: 0
    };

    this.vel = {
        x: 3,
        y: 3
    };

    this.parts = pHeight / 4;
    this.part = {
        first: 5,
        second: 3
    };

    this.pos = {
        x: c.width / 2,
        y: c.height / 2
    };

    this.dirs = {
        left: true,
        right: false,
        down: false,
        up: false
    };

    this.resetVelInfo = {
        x: this.vel.x,
        y: this.vel.y
    };

    this.render = function(){

        ctx.fillStyle = "White";
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
        ctx.fill();

    };

    this.updateScore = function(){

        ctx.font = "35px Arial";

        ctx.fillStyle = "White";
        ctx.fillText(this.scores.p1, 100, 100);
        
        ctx.fillStyle = "White";
        ctx.fillText(this.scores.p2, c.width - 100, 100);
    
    };

    this.reset = function(pWon){

        this.vel = this.resetVelInfo;
        
        if(pWon == "p1"){

            this.dirs.right = true;
            this.dirs.left = this.dirs.down = this.dirs.up = false;

        } else if(pWon == "p2"){

            this.dirs.left = true;
            this.dirs.right = this.dirs.down = this.dirs.up = false;
            
        }

        this.pos.x = c.width / 2;
        this.pos.y = c.height / 2;

    };

    this.updatePos = function(){
        
        if(this.pos.x - this.radius <= 0){

            this.scores.p2++;
            this.reset("p2");

        } else if(this.pos.x + this.radius >= c.width){

            this.scores.p1++;
            this.reset("p1");

        } else if(this.dirs.left){

            this.pos.x -= this.vel.x;

        } else if(this.dirs.right){

            this.pos.x += this.vel.x;

        }

        if(this.pos.y - this.radius <= 0){

            this.pos.y += this.vel.y;
            this.dirs.down = true;
            this.dirs.up = false;

        } else if(this.pos.y + this.radius >= c.height){

            this.pos.y -= this.vel.y;
            this.dirs.up = true;
            this.dirs.down = false;

        } else if(this.dirs.up){

            this.pos.y -= this.vel.y;

        } else if(this.dirs.down){

            this.pos.y += this.vel.y;

        }

        this.checkCollision();

    };

    this.pickDir = function(){

        if(!this.dirs.down && !this.dirs.up){

            if(Math.floor(Math.random() * (2 - 1 + 1)) + 1 == 1){

                this.dirs.down = true;
                this.dirs.up = false;

            } else {

                this.dirs.up = true;
                this.dirs.down = false;

            }

        }
        
    };

    this.checkCollision = function(){
        
        //player.pos.x >= this.pos.x - this.radius - player.width
            
        //this.pos.y >= player.pos.y && this.pos.y <= player.pos.y + player.height

        if(this.dirs.right && players[1] != undefined){

            if(players[1].pos.x <= this.pos.x + this.radius){

                this.pickDir();

                if((this.pos.y >= players[1].pos.y && this.pos.y <= players[1].pos.y + this.parts) || 
                    (this.pos.y >= players[1].pos.y + players[1].height - this.parts && this.pos.y <= players[1].pos.y + players[1].height)){

                    this.vel.y = this.part.first;
                    this.pos.x -= this.vel.x;
                    this.dirs.right = false;
                    this.dirs.left = true;

                } else if((this.pos.y >= players[1].pos.y && this.pos.y <= players[1].pos.y + this.parts * 2) || 
                (this.pos.y >= players[1].pos.y + players[1].height - this.parts * 2 && this.pos.y <= players[1].pos.y + players[1].height)){

                    this.vel.y = this.part.second;
                    this.pos.x -= this.vel.x;
                    this.dirs.right = false;
                    this.dirs.left = true;

                }

                this.vel.x *= this.acc;
            }
            
        }
        
        if(this.dirs.left){

            if(players[0].pos.x >= this.pos.x - this.radius - players[0].width){

                if(this.pos.y >= players[0].pos.y && this.pos.y <= players[0].pos.y + players[0].height){

                    this.pickDir();

                    if((this.pos.y >= players[0].pos.y && this.pos.y <= players[0].pos.y + this.parts) || 
                    (this.pos.y >= players[0].pos.y + players[0].height - this.parts && this.pos.y <= players[0].pos.y + players[0].height)){

                        this.vel.y = this.part.first;
                        this.pos.x += this.vel.x;
                        this.dirs.left = false;
                        this.dirs.right = true;

                    } else if((this.pos.y >= players[0].pos.y && this.pos.y <= players[0].pos.y + this.parts * 2) || 
                    (this.pos.y >= players[0].pos.y + players[0].height - this.parts * 2 && this.pos.y <= players[0].pos.y + players[0].height)){

                        this.vel.y = this.part.second;
                        this.pos.x += this.vel.x;
                        this.dirs.left = false;
                        this.dirs.right = true;

                    }

                    // this.pos.x += this.vel.x;
                    // this.dirs.left = false;
                    // this.dirs.right = true;

                }

                this.vel.x *= this.acc;
            }

        }

    };

    this.update = function(){

        this.updatePos();
        this.render();
        this.updateScore();

    };

}