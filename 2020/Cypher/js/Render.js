class Render{
    c;
    ctx;

    constructor(){
        this.c = document.getElementById("canvas");
        this.ctx = this.c.getContext("2d");

        this.c.width = this.c.clientWidth;
        this.c.height = this.c.clientHeight;
    }

    clear(){
        this.ctx.clearRect(0, 0, this.c.width, this.c.height);
    }

    setColor(style, color){
        if(style == "fill"){
            this.ctx.fillStyle = color;
        } else if(style == "stroke"){
            this.ctx.strokeStyle = color;
        } else {
            console.log("Incorrect style");
        }
    }

    setFont(font=undefined, size=undefined){
        if(font == undefined){
            font = this.ctx.font.split(" ")[1];
        }

        if(size == undefined){
            size = this.ctx.font.split(" ")[0];
        }

        this.ctx.font = `${size} ${font}`;
    }

    text(x, y, str, style="fill", textAlign="left", constStr=""){

        if(textAlign == "center"){
            if(constStr != ""){

                var offsetX = this.ctx.measureText(constStr).width / 2;
                x -= offsetX;

            } else {
                this.ctx.textAlign = textAlign;
            }
        }
        

        if(style == "fill"){
            this.ctx.fillText(str, x, y);
        } else if(style == "stroke"){
            this.ctx.strokeText(str, x, y);
        }
    }
}

function generateNumber(min=0, max){
    return Math.floor(Math.random() * max) + min;
}