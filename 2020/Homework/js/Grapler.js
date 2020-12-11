class Grapler{

    pos = {
        x: 0,
        y: 0
    };
    defaultAnchor = {
        x: 0,
        y: 0.9
    };

    constructor(_player){
        this.player = _player;

        this.sprite = new PIXI.Sprite(PIXI.loader.resources.grapler.texture);
        app.stage.addChild(this.sprite);

        this.sprite.anchor.x = this.defaultAnchor.x;
        this.sprite.anchor.y = this.defaultAnchor.y;

        this.update();
    }

    updatePos(){
        this.sprite.position.set(this.pos.x, this.pos.y);
    }

    updateRotation(){
        if(mousePos.x == undefined && mousePos.y == undefined)
            return;
        
        let angle = this.getAngle(mousePos, this.pos);
        if(Math.abs(radToDeg(angle)) > 90){
            this.sprite.scale.y = -1;
        } else {
            this.sprite.scale.y = 1;
        }
        this.sprite.rotation = angle;
    }

    // https://stackoverflow.com/questions/9614109/how-to-calculate-an-angle-from-points
    getAngle(pos1, pos2){
        let dx = pos1.x - pos2.x;
        let dy = pos1.y - pos2.y;

        let theta = Math.atan2(dy, dx);

        return theta;
    }

    update(){
        this.pos.x = this.player.pos.x + this.player.width / 2 - 10;
        this.pos.y = this.player.pos.y + this.player.height / 2 + this.sprite.height * 1.5;

        this.updateRotation();
        this.updatePos();
    }
}