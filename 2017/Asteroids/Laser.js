function Laser(heading, pos, color, cShots, pIndex){
    
    this.pos = {};
    this.pos.x = pos.x;
    this.pos.y = pos.y;

    this.pIndex = pIndex;

    this.color = players[this.pIndex].color;

    this.heading = heading;
    this.force = getDirAngle(this.heading);

    this.speed = 3;
    this.radius = 3;
    this.color = color;

    this.maxFrame = 150;
    this.curFrame = 0;

    this.cShots = cShots - 1;
    this.maxFrameShots = 13;
    this.curFrameShots = 0;

    this.space = this.radius + 20;

    /**
     * Updates the position of the bullet
     */
    this.updatePos = function(){

        this.overLapping();
        if(!this.collision()){
           
            if(this.curFrame < this.maxFrame){
                this.pos.x += this.force.x * this.speed;
                this.pos.y += this.force.y * this.speed;
                this.curFrame++;
            } else {
                
                this.removeBullet();

            }
       
        } else {
        
            this.removeBullet();

        }

    }

    /**
     * When laser hits the asteroid
     */
    this.onCollision = function(i){

        var r = asts[i].radius / 2;
            var aPos = asts[i].pos;

            this.removeBullet();
            this.removeAst(i);
            this.addScore();

            if(r > 10){
            
                for(var i = 0; i < 2; i++){
                    
                    asts[asts.length] = new Asteroid(r, aPos.x, aPos.y);
                    
                }
            
            } else if(r > 20){

                for(var i = 0; i < random(2, 6); i++){
                    
                    asts[asts.length] = new Asteroid(r, aPos.x, aPos.y);
                    
                }

            }
        
    }

    /**
     * Check if the laser hits the asteroid
     */
    this.collision = function(){

        for(var i = 0; i < asts.length; i++){

            if(asts[i].checkCollision(this.pos, this.radius)){
                this.onCollision(i);
            }
            
        }

        return false;

    }

    /**
     * Destroys asteroid
     */
    this.removeAst = function(index){
        asts.splice(index, 1);
    }

    /**
     * Adds score to player
     */
    this.addScore = function(){

        players[this.pIndex].score += 5;

        players[this.pIndex].scoreStreak += 5;

    }

    /**
     * Destroys bullet
     */
    this.removeBullet = function(){

        for(var i = 0; i < lasers.length; i++){

            if(lasers[i].pos.x == this.pos.x){
                lasers.splice(i, 1);
                break;
            }

        }

    }

    /**
     * Spawn 3 bullets
     */
    this.spawnNextBullet = function(){

        if(this.cShots != 0){
            
            if(this.curFrameShots >= this.maxFrameShots){
                
                var nextPos = {
                    x: players[this.pIndex].pos.x + getDirAngle(players[this.pIndex].heading).x * this.space,
                    y: players[this.pIndex].pos.y + getDirAngle(players[this.pIndex].heading).y * this.space
                };

                lasers[lasers.length] = new Laser(players[this.pIndex].heading, nextPos, this.color, this.cShots, this.pIndex);
                
                this.curFrameShots = 0;
                this.cShots = 0;

            } else {

                this.curFrameShots++;

            }

        }

    }

    /**
     * If object is overlapping
     */
    this.overLapping = function(){
        
        if(this.pos.x - this.radius <= 0){

            this.renderOpt(this.pos.x + c.width, this.pos.y);

            if(this.pos.x + c.width + this.radius <= c.width){

                this.pos.x = this.pos.x + c.width;

            }

        }

        if(this.pos.x + this.radius >= c.width){

            this.renderOpt(this.pos.x - c.width, this.pos.y);

            if(this.pos.x - c.width - this.radius >= 0){

                this.pos.x = this.pos.x - c.width;

            }

        }

        if(this.pos.y - this.radius <= 0){

            this.renderOpt(this.pos.x, this.pos.y + c.height);

            if(this.pos.y + c.height + this.radius <= c.height){

                this.pos.y = this.pos.y + c.height;

            }

        }

        if(this.pos.y + this.radius >= c.height){

            this.renderOpt(this.pos.x, c.height - this.pos.y);

            if(this.pos.y - c.height - this.radius >= 0){

                this.pos.y = this.pos.y - c.height;

            }

        }

    }

    /**
     * Render the bullet to the screen/canvas with optional pos
     */
    this.renderOpt = function(xPos, yPos){

        ctx.beginPath();
        ctx.arc(xPos, yPos, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();

    }

    /**
     * Renders the bullet to the screen/canvas
     */
    this.render = function(){

        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();

    }

    /**
     * Main update function
     */
    this.update = function(){
        
        this.spawnNextBullet();

        this.updatePos();   
        this.render();

    }
}