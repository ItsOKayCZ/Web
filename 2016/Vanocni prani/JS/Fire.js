function Fire(ropeHeight, candleHeight, candleWidth){

    this.drop = new Drop(candleHeight, candleWidth);

    this.dirs = {
        right: true,
        left: false
    };

    this.dirX = 0;
    this.speed = 2;
    this.frame = 0;
    this.totFrames = 12;
    this.offsetX = 0.5;
    this.maxDirX = 1;

    this.candleInfo = {
      ropeHeight: ropeHeight,
      candleHeight: candleHeight
    };

    this.yellowInfo = {
      offsetY: 15,
      dirX: 0,
      color: "#FFD678",
      width: 25,
      height: 40
    };

    this.yellowInfo.pos = {
        x: c.width / 2 - this.offsetX,
        y: c.height / 2 - (this.candleInfo.candleHeight / 2) - this.candleInfo.ropeHeight - this.yellowInfo.offsetY
    };

    this.orangeInfo = {
      pos: {
        x: undefined,
        y: undefined
      },
      dirX: 0,
      offsetY: 7,
      color: "#e59400",
      width: this.yellowInfo.width / 2,
      height: this.yellowInfo.height / 2
    };

    this.lighting = {
        pos: {
            x: c.width / 2 - this.offsetX,
            y: c.height / 2 - (this.candleInfo.candleHeight / 2) - this.candleInfo.ropeHeight - this.yellowInfo.offsetY
        },
        radius: 70,
        color: "#FFD678"
    };

    this.ellipse = function(xPos, yPos, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11, arg12){

      ctx.beginPath();

      ctx.moveTo(xPos, yPos);

      ctx.bezierCurveTo(arg1, arg2, arg3, arg4, arg5, arg6);
      ctx.bezierCurveTo(arg7, arg8, arg9, arg10, arg11, arg12);

    };

    this.drawFireYellow = function(){
        
      this.ellipse(
        this.yellowInfo.pos.x,
        this.yellowInfo.pos.y - this.yellowInfo.height / 2,
        this.yellowInfo.pos.x + this.yellowInfo.width / 2, 
        this.yellowInfo.pos.y - this.yellowInfo.height / 2,
        this.yellowInfo.pos.x + this.yellowInfo.width / 2,
        this.yellowInfo.pos.y + this.yellowInfo.height / 2,
        this.yellowInfo.pos.x, 
        this.yellowInfo.pos.y + this.yellowInfo.height / 2,

        this.yellowInfo.pos.x - this.yellowInfo.width / 2, 
        this.yellowInfo.pos.y + this.yellowInfo.height / 2,
        this.yellowInfo.pos.x - this.yellowInfo.width / 2, 
        this.yellowInfo.pos.y - this.yellowInfo.height / 2,
        this.yellowInfo.pos.x, 
        this.yellowInfo.pos.y - this.yellowInfo.height / 2
      );

      ctx.globalAlpha = 0.90;
      ctx.fillStyle = this.yellowInfo.color;
      ctx.fill();
      ctx.closePath();
      ctx.globalAlpha = 1;

    };

    this.drawFireOrange = function(){

      ctx.beginPath();

      this.ellipse(
        this.orangeInfo.pos.x,
        this.orangeInfo.pos.y - this.orangeInfo.height / 2,
        this.orangeInfo.pos.x + this.orangeInfo.width / 2, 
        this.orangeInfo.pos.y - this.orangeInfo.height / 2,
        this.orangeInfo.pos.x + this.orangeInfo.width / 2, 
        this.orangeInfo.pos.y + this.orangeInfo.height / 2,
        this.orangeInfo.pos.x, 
        this.orangeInfo.pos.y + this.orangeInfo.height / 2,

        this.orangeInfo.pos.x - this.orangeInfo.width / 2, 
        this.orangeInfo.pos.y + this.orangeInfo.height / 2,
        this.orangeInfo.pos.x - this.orangeInfo.width / 2, 
        this.orangeInfo.pos.y - this.orangeInfo.height / 2,
        this.orangeInfo.pos.x, 
        this.orangeInfo.pos.y - this.orangeInfo.height / 2
      );

      ctx.globalAlpha = 0.95;
      ctx.fillStyle = this.orangeInfo.color;
      ctx.fill();
      ctx.closePath();
      ctx.globalAlpha = 1;

    };

    this.updateFlameOrange = function(){

        if(this.frame >= this.totFrames){
            
            if(this.dirX >= this.maxDirX){

                this.orangeInfo.pos.x = c.width / 2 + this.offsetX; 
                this.orangeInfo.pos.x += this.speed * (this.dirX - 1);
                this.orangeInfo.pos.y = c.height / 2 - (this.candleInfo.candleHeight / 2) - this.candleInfo.ropeHeight - this.orangeInfo.offsetY;

            } else if(this.dirX <= -this.maxDirX){

                this.orangeInfo.pos.x = c.width / 2 + this.offsetX; 
                this.orangeInfo.pos.x += this.speed * this.dirX;
                this.orangeInfo.pos.y = c.height / 2 - (this.candleInfo.candleHeight / 2) - this.candleInfo.ropeHeight - this.orangeInfo.offsetY;

            } else if(this.dirs.right){

                this.orangeInfo.pos.x = c.width / 2 + this.offsetX; 
                this.orangeInfo.pos.x += this.speed * (this.dirX - 1);
                this.orangeInfo.pos.y = c.height / 2 - (this.candleInfo.candleHeight / 2) - this.candleInfo.ropeHeight - this.orangeInfo.offsetY;

            } else if(this.dirs.left){

                this.orangeInfo.pos.x = c.width / 2 + this.offsetX; 
                this.orangeInfo.pos.x += this.speed * this.dirX;
                this.orangeInfo.pos.y = c.height / 2 - (this.candleInfo.candleHeight / 2) - this.candleInfo.ropeHeight - this.orangeInfo.offsetY;

            }
        }

    };

    this.updateFlameYellow = function(){
        
        if(this.frame >= this.totFrames){
            
            if(this.dirX >= this.maxDirX){

                this.yellowInfo.pos.x = c.width / 2 + this.offsetX; 
                this.yellowInfo.pos.x += this.speed * (this.dirX - 1);
                this.yellowInfo.pos.y = c.height / 2 - (this.candleInfo.candleHeight / 2) - this.candleInfo.ropeHeight - this.yellowInfo.offsetY;

            } else if(this.dirX <= -this.maxDirX){

                this.yellowInfo.pos.x = c.width / 2 + this.offsetX; 
                this.yellowInfo.pos.x += this.speed * this.dirX;
                this.yellowInfo.pos.y = c.height / 2 - (this.candleInfo.candleHeight / 2) - this.candleInfo.ropeHeight - this.yellowInfo.offsetY;

            } else if(this.dirs.right){

                this.yellowInfo.pos.x = c.width / 2 + this.offsetX; 
                this.yellowInfo.pos.x += this.speed * (this.dirX - 1);
                this.yellowInfo.pos.y = c.height / 2 - (this.candleInfo.candleHeight / 2) - this.candleInfo.ropeHeight - this.yellowInfo.offsetY;

            } else if(this.dirs.left){

                this.yellowInfo.pos.x = c.width / 2 + this.offsetX; 
                this.yellowInfo.pos.x += this.speed * this.dirX;
                this.yellowInfo.pos.y = c.height / 2 - (this.candleInfo.candleHeight / 2) - this.candleInfo.ropeHeight - this.yellowInfo.offsetY;

            }

        }

    };

    this.drawLighting = function(){

        this.lighting.pos.x = this.yellowInfo.pos.x; //c.width / 2 - this.offsetX;
        this.lighting.pos.y = this.yellowInfo.pos.y; //c.height / 2 - (this.candleInfo.candleHeight / 2) - this.candleInfo.ropeHeight - this.yellowInfo.offsetY; 

        ctx.globalAlpha = 0.05;
        ctx.fillStyle = this.lighting.color;

        ctx.beginPath();
        ctx.arc(this.lighting.pos.x, this.lighting.pos.y, this.lighting.radius, 0, Math.PI * 2, false);
        ctx.fill();

        ctx.globalAlpha = ctx.globalAlpha / 2;

        ctx.beginPath();
        ctx.arc(this.lighting.pos.x, this.lighting.pos.y, this.lighting.radius * 2, 0, Math.PI * 2, false);
        ctx.fill();

        ctx.globalAlpha = ctx.globalAlpha / 2;

        ctx.beginPath();
        ctx.arc(this.lighting.pos.x, this.lighting.pos.y, this.lighting.radius * 4, 0, Math.PI * 2, false);
        ctx.fill();

        ctx.globalAlpha = 1;

    };

    this.update = function(){

        this.updateFlameYellow();
        this.drawFireYellow();

        this.updateFlameOrange();
        this.drawFireOrange();

        this.drop.update();

        if(this.frame >= this.totFrames){

            this.frame = 0;

        } else {

            this.frame++;

        }

        if(this.dirX >= this.maxDirX){

            this.dirX--;
            this.dirs.right = false;
            this.dirs.left = true;

        } else if(this.dirX <= -this.maxDirX){

            this.dirX++; 
            this.dirs.left = false;
            this.dirs.right = true;
            
        } else if(this.dirs.right){

            this.dirX++; 

        } else if(this.dirs.left){

            this.dirX--;

        }

    };

}