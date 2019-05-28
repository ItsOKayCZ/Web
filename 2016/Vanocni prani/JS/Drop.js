function Drop(candleHeight, candleWidth){

    setInterval(this.dropingDrop, 3000);

    this.candleInfo = {
        height: candleHeight,
        width: candleWidth
    };

    this.offset = {
        x: 12,
        y: 17
    };

    this.pos = {
        x: c.width / 2 - (this.candleInfo.width / 2),
        y: c.height / 2 - (this.candleInfo.height / 2)
    };

    this.width = 10;
    this.height = 18;
    this.color = "#b77a73";
    this.radius = 8;
    this.dropingDropInfo = {
        width: 5,
        height: 8,
        falling: false
    };

    this.totFrames = 150;
    this.frame = 0;
    this.dir = 0;
    this.maxDir = (c.height / 2 + (this.candleInfo.height / 2) + 12) - this.pos.y;
    this.speed = 1;

    this.dropingDrop = function(){

        if(this.frame >= this.totFrames || this.dropingDropInfo.falling){

            ctx.save();

            ctx.translate(this.pos.x + this.offset.x, this.pos.y + this.offset.y + (this.speed * this.dir));
            ctx.rotate(30 * Math.PI / 180);

            this.drawDrop(this.dropingDropInfo.width, this.dropingDropInfo.height);
            ctx.fill();

            ctx.restore();

            if(this.dir >= this.maxDir){

                this.dir = 0;
                this.dropingDropInfo.falling = false;

            } else {

                this.dir++;
                this.dropingDropInfo.falling = true;

            }

            this.frame = 0;

        } else {

            this.frame++;

        }

    };

    this.drawDrop = function(width, height){

        ctx.beginPath();
        ctx.moveTo(0 - width, 0);
        ctx.lineTo(0, 0 - height);
        ctx.lineTo(0 + width, 0);
        ctx.arc(0, 0, width, 0, Math.PI);

    };

    this.drawDrops = function(){

        ctx.fillStyle = this.color;

        ctx.save();

        ctx.translate(this.pos.x + this.offset.x, this.pos.y + this.offset.y);
        ctx.rotate(45 * Math.PI / 180);

        this.drawDrop(this.width, this.height - 4);

        ctx.fill();

        ctx.restore();

        ctx.save();

        ctx.translate(c.width / 2 - (this.candleInfo.width / 2) + this.offset.x + 9, c.height / 2 + (this.candleInfo.height / 2) + 15);
        
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();

        ctx.save();

        ctx.translate(c.width / 2 - (this.candleInfo.width / 2) + this.offset.x, c.height / 2 + (this.candleInfo.height / 2) + 12);
        ctx.rotate(20 * Math.PI / 180);

        this.drawDrop(this.radius, this.height - 4);
        ctx.fill();

        ctx.restore();

    };

    this.update = function(){

        this.pos.x = c.width / 2 - (this.candleInfo.width / 2);
        this.pos.y = c.height / 2 - (this.candleInfo.height / 2);
        this.maxDir = (c.height / 2 + (this.candleInfo.height / 2) + 12) - this.pos.y - 20;

        this.drawDrops();
        this.dropingDrop();


    };

}

// ctx.moveTo(x - 5, y);
//  ctx.lineTo(x, y - 7);
//  ctx.lineTo(x + 5, y);
//  ctx.arc(x, y, 5, 0, Math.PI);