function Candle(){

    this.height = 200;
    this.width = 100;
    this.radius = this.width / 2;
    this.rope = {
        width: 5,
        height: 10
    };

    this.radiusPlate = {
        ledge: (this.width + 25) * 1.25,
        inner: this.width * 1.25
    };

    this.colors = {
        top: "#b77a73",
        rope: "Black",
        main: "#955148",
        plate: {
            ledge: "#8c8c8c",
            ledgerInner: "#7a7a7a",
            inner: "#595959" 
        },
    };

    this.fire = new Fire(this.rope.height, this.height, this.width);

    this.drawTop = function(){

        ctx.save();

        ctx.fillStyle = this.colors.top;
        ctx.translate(c.width / 2, c.height / 2 - (this.height / 2));
        
        ctx.scale(1, 0.50);
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2, false);

        ctx.fill();

        ctx.restore();

        ctx.save();

        ctx.translate(c.width / 2 + 2, c.height / 2 - (this.height / 2));

        ctx.fillStyle = this.colors.rope;
        ctx.fillRect(0, 0, -this.rope.width, -this.rope.height);

        ctx.restore();

    };

    this.drawMain = function(){

        ctx.save();

        ctx.fillStyle = this.colors.main;
        ctx.translate(c.width / 2 - (this.width / 2), c.height / 2 - (this.height / 2));
        
        ctx.fillRect(0, 0, this.width, this.height);

        ctx.restore();

    };

    this.drawBotton = function(){

        ctx.save();

        ctx.fillStyle = this.colors.main;
        ctx.translate(c.width / 2, c.height / 2 + (this.height / 2));

        ctx.scale(1, 0.50);
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2, false);

        ctx.fill();

        ctx.restore();

    };

    this.drawLedge = function(){

        ctx.save();

        ctx.fillStyle = this.colors.plate.ledge;
        ctx.translate(c.width / 2, c.height / 2 + (this.height / 2));

        ctx.scale(1, 0.50);
        ctx.beginPath();
        ctx.arc(0, 0, this.radiusPlate.ledge, 0, Math.PI * 2, false);
        
        ctx.fill();
        
        ctx.restore();

    };

    this.drawInner = function(){

        ctx.save();

        ctx.fillStyle = this.colors.plate.inner;
        ctx.strokeStyle = this.colors.plate.ledgerInner;
        ctx.lineWidth = 6;
        ctx.translate(c.width / 2, c.height / 2 + (this.height / 2));

        ctx.scale(1, 0.50);
        ctx.beginPath();
        ctx.arc(0, 0, this.radiusPlate.inner, 0, Math.PI * 2, false);

        ctx.fill();
        ctx.stroke();

        ctx.restore();

    };

    this.drawText = function(){

        ctx.fillStyle = "White";
        ctx.font = "90px Pacifico";
        var fontSize = ctx.measureText("Merry Christmas");

        ctx.fillText("Merry Christmas", c.width / 2 - (fontSize.width / 2), c.height / 2 + (this.height / 2) + 180);

    };

    this.update = function(){

        this.fire.drawLighting();

        this.drawLedge();
        this.drawInner();
        this.drawMain();
        this.drawTop();
        this.drawBotton();
        this.drawText();
        this.fire.update();

    };

}