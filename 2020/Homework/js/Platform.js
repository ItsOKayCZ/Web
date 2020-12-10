class Platform{

    pos = {
        x: 0,
        y: 0
    }
    width = 0;
    height = 0;
    text = '';

    /**
     * options:
     * width
     * height
     * text
     * color
     */
    constructor(_x, _y, options){

        this.rect = new PIXI.Graphics();

        if(options.width != undefined && options.height != undefined){
            this.width = options.width;
            this.height = options.height;

            this.rect.beginFill(options.color);
            this.rect.drawRect(this.pos.x, this.pos.y, this.width, this.height);
            this.rect.endFill();
        } else if(options.text != undefined){
            this.text = options.text;
        }

        this.pos = {
            x: _x,
            y: _y
        }
        this.updatePos();

        app.stage.addChild(this.rect);
    }

    update(){

    }

    get pos(){
        return this.pos;
    }

    updatePos(){
        this.rect.position.set(this.pos.x, this.pos.y);
    }
}