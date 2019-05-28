function Asteroid(radius, xPos, yPos){

    /**
     * Variables
     */
    this.speed = random(1, 2);
    this.points = [];
    this.ver = Math.PI * 2;
    this.radius = radius || random(20, 80);
    this.dir = getDirAngle(random(0, 360));

    this.offset = {
        min: -15
    };
    this.offset.max = Math.abs(this.offset.min);

    if(xPos != undefined && yPos != undefined){
        this.pos = {
            x: xPos,
            y: yPos
        };
    } else if(random(1, 2) == 1){
        this.pos = {
            x: random(0, c.width) + this.radius,
            y: 0
        };
    } else {
        this.pos = {
            x: 0,
            y: random(0, c.height) + this.radius
        };
    }

    this.over = {
        right: false,
        left: false,
        up: false,
        down: false
    };

    for(var i = 0; i <= this.ver; i++){

        if(i < this.ver){
            this.points[i] = {
                x: this.radius * Math.cos(i) + random(this.offset.min, this.offset.max),
                y: this.radius * Math.sin(i)
            };
        } else {
            this.points[i] = {
                x: this.points[0].x,
                y: this.points[0].y
            }
        }
    }

    this.point = 0;
    this.mostPoints = {
        right: {
            x: 0,
            y: 0
        },
        left: {
            x: 0,
            y: 0
        },
        down: {
            x: 0,
            y: 0
        },
        up: {
            x: 0,
            y: 0
        }
    };
    for(var i = 0; i < this.points.length; i++){
        if(Math.abs(this.points[i].x) > this.point){
            this.point = Math.abs(this.points[i].x);
        }

        if(Math.abs(this.points[i].y) > this.point){
            this.point = Math.abs(this.points[i].y);
        }

        if(this.points[i].x > this.mostPoints.right.x){
            this.mostPoints.right.x = this.points[i].x;
            this.mostPoints.right.y = this.points[i].y;
        }

        if(this.points[i].x < this.mostPoints.left.x){
            this.mostPoints.left.x = this.points[i].x;
            this.mostPoints.left.y = this.points[i].y;
        }

        if(this.points[i].y > this.mostPoints.down.y){
            this.mostPoints.down.x = this.points[i].x;
            this.mostPoints.down.y = this.points[i].y;
        }

        if(this.points[i].y < this.mostPoints.up.y){
            this.mostPoints.up.x = this.points[i].x;
            this.mostPoints.up.y = this.points[i].y;
        }

    }
    
    /**
     * Updating position
     */
    this.updatePos = function(){
    
        this.overLapping();

        this.pos.x += this.dir.x * this.speed;
        this.pos.y += this.dir.y * this.speed;

    }

    /**
     * If object is overlapping
     */
    this.overLapping = function(){

        if(this.pos.x - this.point <= 0){

            this.renderOpt(this.pos.x + c.width, this.pos.y);

            this.over.left = true;

            if(this.pos.x + c.width + this.point <= c.width){

                this.pos.x = this.pos.x + c.width;

                this.over.left = false;

            }

        } 
        
        if(this.pos.x + this.point >= c.width){
            
            this.renderOpt(this.pos.x - c.width, this.pos.y);

            this.over.right = true;

            if(this.pos.x - c.width - this.point >= 0){
                
                this.pos.x = this.pos.x - c.width;

                this.over.right = false;

            }

        }

        if(this.pos.y - this.point <= 0){

            this.renderOpt(this.pos.x, this.pos.y + c.height);

            this.over.up = true;

            if(this.pos.y + c.height + this.point <= c.height){

                this.pos.y = this.pos.y + c.height;

                this.over.up = false;

            }
            
        } else if(this.pos.y + this.point >= c.height){
            
            this.renderOpt(this.pos.x, this.pos.y - c.height);

            this.over.down = true;

            if(this.pos.y - c.height - this.point >= 0){
                
                this.pos.y = this.pos.y - c.height;

                this.over.down = false;

            }

        }

        if(this.over.left && this.over.down){
            this.renderOpt(this.pos.x + c.width, this.pos.y - c.height);
        } else if(this.over.left && this.over.up){
            this.renderOpt(this.pos.x + c.width, this.pos.y + c.height);
        } else if(this.over.right && this.over.down){
            this.renderOpt(this.pos.x - c.width, this.pos.y - c.height);
        } else if(this.over.right && this.over.up){
            this.renderOpt(this.pos.x - c.width, this.pos.y + c.height);
        }

    }

    /**
     * Renders the asteroid to the screen/canvas with optional position
     */
    this.renderOpt = function(posX, posY){

        ctx.save();
        ctx.translate(posX, posY);

        ctx.beginPath();

        for(var i = 0; i <= this.ver; i++){
            var x = this.points[i].x;
            var y = this.points[i].y;
            if(i == 0){
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }

        ctx.closePath();
        ctx.strokeStyle = "White";
        ctx.stroke();
        ctx.restore();

    }

    /**
     * Render the asteroid to the1 screen/canvas
     */
    this.render = function(){
        
        ctx.save();
        ctx.translate(this.pos.x, this.pos.y);

        ctx.beginPath();

        for(var i = 0; i <= this.ver; i++){
            var x = this.points[i].x;
            var y = this.points[i].y;
            if(i == 0){
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }

        ctx.closePath();
        ctx.strokeStyle = "White";
        ctx.stroke();
        ctx.restore();

    }

    /**
     * Checks collision with target
     * 
     * @param {Object} target X, Y of target
     * @param {Number} radius Radius
     */
    this.checkCollision = function(target, radius, pos){
        
        for(var i = 0; i < this.points.length; i++){
        
            var curPos = {
                x: this.pos.x + this.points[i].x,
                y: this.pos.y + this.points[i].y
            };

            if(this.points[i + 1] != undefined){
              
                var nextPos = {
                    x: this.pos.x + this.points[i + 1].x,
                    y: this.pos.y + this.points[i + 1].y
                };                

            } else {

                var nextPos = {
                    x: this.pos.x + this.points[0].x,
                    y: this.pos.y + this.points[0].y
                };
                
            }

            var angle = {
                x: Math.cos((Math.atan2(nextPos.y - curPos.y, nextPos.x - curPos.x) * 180 / Math.PI) * Math.PI / 180),
                y: Math.sin((Math.atan2(nextPos.y - curPos.y, nextPos.x - curPos.x) * 180 / Math.PI) * Math.PI / 180)
            };

            if(curPos.x < nextPos.x){

                while(curPos.x < nextPos.x){

                    if((curPos.x - radius <= target.x && curPos.x + radius >= target.x) && 
                    (curPos.y - radius <= target.y && curPos.y + radius >= target.y)){
                        return true;
                    }
                    
                    curPos.x += angle.x;
                    curPos.y += angle.y;
                }
                
            } else {

                while(curPos.x > nextPos.x){

                    if((curPos.x - radius <= target.x && curPos.x + radius >= target.x) && 
                    (curPos.y - radius <= target.y && curPos.y + radius >= target.y)){
                        return true;
                    }

                    curPos.x += angle.x;
                    curPos.y += angle.y;
                }

            }

            if(this.over.left){



            } else if(this.over.right){



            } else if(this.over.down){



            } else if(this.over.up){

                

            }

        }

        return false;
    }

    /** 
     * Main update function
    */
    this.update = function(){

        this.render();
        this.updatePos();
        
    }

}