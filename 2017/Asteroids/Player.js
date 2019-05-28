function Player(index){

    /**
     * Position
     */
    if(index == 0){
        this.pos = {
            x: c.width - c.width / 4,
            y: 0 + c.height / 4 
        };
    } else {
        this.pos = {
            x: c.width / 2 / 2,
            y: c.height / 2 / 2
        };
    }
    
    /**
     * Adds to position
     */
    this.vel = {
        x: 0,
        y: 0
    };

    this.index = index;

    /**
     * overlapping info
     */
    this.over = {
        right: false,
        left: false,
        down: false,
        up: false
    };

    /**
     * Height of triangle
     */
    this.height = 25;

    /**
     * Score, Lives
     */
    this.playerString = "Player " + (this.index + 1);
    this.sizePlayerString = ctx.measureText(this.playerString).width;
    this.score = 0;
    this.lives = 3;
    this.scoreStreak = 0;
    this.added = false;

    this.maxRespawn = 150;
    this.respawn = 0;

    this.alp = 1;

    this.isDead = false;
    this.crashed = false;
    this.gameOver = false;
    this.resetInfo = {
        pos: {
            x: this.pos.x,
            y: this.pos.y    
        },
        vel: {
            x: this.vel.x,
            y: this.vel.y
        },
        heading: 90
    };

    /**
     * Angles
     */
    this.heading = 90;
    this.rotationSpeed = 3.5;

    /**
     * Shooting info
     */
    this.isShooting = false;
    this.maxFrameShooting = 100;
    this.curFrameShooting = this.maxFrameShooting;
    
    this.maxShots = 3;

    /**
     * Color (When 2P)
     */
    this.color = "White";

    /**
     * Speed, acceleration, etc.
     */
    this.acc = 0.1;
    this.deAcc = 0.99;
    
    /**
     * Direction
     */
    this.force = {
        x: 0,
        y: 0
    };
    
    /**
     * Force when inertia
     */
    this.preForce = {
        x: 0,
        y: 0
    };

    /**
     * Where is the players going
     */
    this.dirs = {
        up: false,
        right: false,
        left: false
    };

    /**
     * Points (tops)
     */
    this.points = {
        x: 0 + this.height,
        y: 0 - this.height
    };
    
    /**
     * Sets the boolean isShooting to true if the player is shooting
     */
    this.setShooting = function(b){
        this.isShooting = b;
    }

    /**
     * Updating the direction of ship
     */
    this.updateDir = function(direction, b){

        if(direction == "ArrowUp"){

            this.dirs.up = b;

        } else if(direction == "ArrowLeft"){

            this.dirs.left = b;

        } else if(direction == "ArrowRight"){

            this.dirs.right = b;

        }

    }

    /**
     * Updating position
     */
    this.updatePos = function(){

        this.overLapping();
        this.collision()

        if(this.dirs.up){

            this.force = getDirAngle(this.heading);
            this.force.x *= this.acc;
            this.force.y *= this.acc;
        
            this.vel.x += this.force.x;
            this.vel.y += this.force.y;

        }
        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;
        
        this.vel.x *= this.deAcc;
        this.vel.y *= this.deAcc;

        if(this.dirs.left){
            this.heading -= this.rotationSpeed;
        }

        if(this.dirs.right){
            this.heading += this.rotationSpeed;
        }

    }

    /**
     * If the ship is overlapping the screen/canvas
     */
    this.overLapping = function(){

        if(this.pos.x - this.height <= 0){
            
            this.renderOpt(c.width + this.pos.x, this.pos.y);

            this.over.left = true;

            if(c.width + this.pos.x + this.height <= c.width){

                this.pos.x = c.width + this.pos.x;

                this.over.left = false;

            }

        } else if(this.pos.x + this.height >= c.width){
            
            this.renderOpt(this.pos.x - c.width, this.pos.y);

            this.over.right = true;

            if(this.pos.x - c.width + this.height >= 0){

                this.pos.x = this.pos.x - c.width;

                this.over.right = false;

            }

        }

        if(this.pos.y - this.height <= 0){

            this.renderOpt(this.pos.x, c.height + this.pos.y);

            this.over.up = true;

            if(c.height + this.pos.y + this.height <= c.height){

                this.pos.y = c.height + this.pos.y;

                this.over.up = false;

            }

        } else if(this.pos.y + this.height >= c.height){
              
            this.renderOpt(this.pos.x, this.pos.y - c.height);

            this.over.down = true;

            if(this.pos.y - c.height + this.height >= 0){

                this.pos.y = this.pos.y - c.height;

                this.over.down = false;

            }

        }

        if(this.over.left && this.over.down){
            this.renderOpt(c.width + this.pos.x, this.pos.y - c.height);
        } else if(this.over.left && this.over.up){
            this.renderOpt(c.width + this.pos.x, c.height + this.pos.y);
        } else if(this.over.right && this.over.down){
            this.renderOpt(this.pos.x - c.width, this.pos.y - c.height);
        } else if(this.over.right && this.over.up){
            this.renderOpt(this.pos.x - c.width, c.height + this.pos.y);
        }

    }

    /**
     * Render the ship to the screen/canvas with position passed
     */
    this.renderOpt = function(posX, posY){

        ctx.save();

        ctx.translate(posX, posY);
        ctx.rotate((this.heading + 90) * Math.PI / 180);

        ctx.beginPath();
        ctx.moveTo(0 - this.height, 0 + this.height);
        ctx.lineTo(0 + this.height, 0 + this.height);
        ctx.lineTo(0, 0 - this.height);
        ctx.lineTo(0 - this.height, 0 + this.height);

        ctx.strokeStyle = this.color;
        ctx.stroke();

        ctx.restore();

    }

    /**
     * Renders the ship to the screen/canvas
     */
    this.render = function(){
        
        ctx.save();

        ctx.translate(this.pos.x, this.pos.y);
        ctx.rotate((this.heading + 90) * Math.PI / 180);

        ctx.beginPath();
        ctx.moveTo(0 - this.height, 0 + this.height);
        ctx.lineTo(0 + this.height, 0 + this.height);
        ctx.lineTo(0, 0 - this.height);
        ctx.lineTo(0 - this.height, 0 + this.height);

        ctx.strokeStyle = this.color;
        ctx.stroke();

        ctx.restore();

    }

    /**
     * Spawns the bullet/laser
     */
    this.spawnBullet = function(){

        if(this.curFrameShooting >= this.maxFrameShooting && this.isShooting){

            var nextPos = {
                x: this.pos.x + getDirAngle(this.heading).x * this.height,
                y: this.pos.y + getDirAngle(this.heading).y * this.height
            };

            lasers[lasers.length] = new Laser(this.heading, nextPos, this.color, 3, this.index);
            this.curFrameShooting = 0;
        } else {
            this.curFrameShooting++;
        }

    }   

    /**
     * Renders and updates the scores to the screen/canvas
     */
    this.updateScore = function(){
        
        if(this.scoreStreak % 200 == 0 && this.scoreStreak != 0){

            if(!this.added){
                this.lives++;
                this.added = true;
            }

        } else {

            this.added = false;
            
        }

        ctx.font = "20px Consolas";
        ctx.fillStyle = this.color;
        ctx.strokeStyle = "Black";
        ctx.lineWidth = 0.05;

        if(this.index == 1){
            ctx.fillText("Lives: " + this.lives, (c.width / 4) - (this.sizePlayerString / 2) - 150, 30);
            ctx.fillText("Score: " + this.score, (c.width / 4) - (this.sizePlayerString / 2) - 150, 30 * 2);

            ctx.strokeText("Lives: " + this.lives, (c.width / 4) - (this.sizePlayerString / 2) - 150, 30);
            ctx.strokeText("Score: " + this.score, (c.width / 4) - (this.sizePlayerString / 2) - 150, 30 * 2);
            if(this.isDead){
                ctx.fillText("Dead", (c.width / 4) - (this.sizePlayerString / 2) - 150, 30 * 3);
                ctx.strokeText("Dead", (c.width / 4) - (this.sizePlayerString / 2) - 150, 30 * 3);
            }
        } else {
            ctx.fillText("Lives: " + this.lives, (c.width - c.width / 4) - (this.sizePlayerString / 2), 30);
            ctx.fillText("Score: " + this.score, (c.width - c.width / 4) - (this.sizePlayerString / 2), 30 * 2);

            ctx.strokeText("Lives: " + this.lives, (c.width - c.width / 4) - (this.sizePlayerString / 2), 30);
            ctx.strokeText("Score: " + this.score, (c.width - c.width / 4) - (this.sizePlayerString / 2), 30 * 2);
            if(this.isDead){
                ctx.fillText("Dead", (c.width - c.width / 4) - (this.sizePlayerString / 2), 30 * 3);
                ctx.strokeText("Dead", (c.width - c.width / 4) - (this.sizePlayerString / 2), 30 * 3);
            }
        }

        if(this.gameOver){
            var sizeGameOver = ctx.measureText("Game over!").width;
            ctx.fillStyle = "White";
            ctx.fillText("Game over!", c.width / 2 - (sizeGameOver / 2), c.height / 2 - (20 / 2));
            ctx.strokeText("Game over!", c.width / 2 - (sizeGameOver / 2), c.height / 2 - (20 / 2));
        }

        ctx.lineWidth = 1;

    }

    /**
     * On collision with the asteroid
     */ 
    this.collision = function(){

        for(var i = 0; i < asts.length; i++){

            if(asts[i].checkCollision(this.pos, this.height)){
                this.crashed = true;
            }

        }

    }

    /**
     * When crashed with asteroid
     */
    this.renderCrash = function(){

        ctx.save();

        ctx.translate(this.pos.x, this.pos.y);
        ctx.rotate((this.heading + 90) * Math.PI / 180);

        ctx.globalAlpha = this.alp;

        ctx.beginPath();
        ctx.arc(0, 0, this.respawn, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();

        ctx.restore();

    }

    /**
     * Resets the player
     */
    this.reset = function(){
        
        this.alp -= 0.025;

        if(this.alp <= 0){
            this.alp = 0;
        }

        this.renderCrash();
        
        if(this.respawn == 0){
            this.lives--;
            if(this.lives == 0){
                this.isDead = true;
                
                if(players.length == 2){

                    if(players[0].isDead && players[1].isDead){

                        this.gameOver = true;
                    }

                } else {

                    this.gameOver = true;

                }
                
            }
        }

        if(this.respawn > this.maxRespawn && !this.isDead){
            
            this.respawn = 0;
            this.crashed = false;
            this.scoreStreak = 0;
            this.added = false;
            
            this.pos.x = this.resetInfo.pos.x;
            this.pos.y = this.resetInfo.pos.y;

            this.vel.x = this.resetInfo.vel.x;
            this.vel.y = this.resetInfo.vel.y;

            this.heading = this.resetInfo.heading;

            if(this.collision()){
                this.respawn = 1;
            } else {
                this.score -= 5;
                this.alp = 1;
            }

        } else {
            this.respawn++;
        }

    }

    /**
     * Main update function
     */
    this.update = function(){   

        if(!this.isDead){
            this.spawnBullet();
        }
        
        this.updateScore();
        
        if(!this.crashed){
            this.render();
            this.updatePos();    
        } else if(!this.isDead){
            this.reset();
        }
        
    }

}