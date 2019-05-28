function AIPlayer(){

    this.height = 100;
    this.width = 15;
    this.speed = 2.75;

    this.pos = {
        x: undefined,
        y: undefined
    };
    
    this.render = function(){

        ctx.fillStyle = "White";
        ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height);

    };

    this.updatePos = function(){

        if(ball.pos.y > this.pos.y + (this.height / 2)){

            this.pos.y += this.speed;
            
        } else {

            this.pos.y -= this.speed;

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