class Grapler{

    hookIsMaxLength = false;

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
        
        let angle = Math.getAngle(mousePos, this.pos);
        if(Math.abs(Math.radToDeg(angle)) > 90){
            this.sprite.scale.y = -1;
        } else {
            this.sprite.scale.y = 1;
        }
        this.sprite.rotation = angle;
    }

    shoot(type, event){
        if(type == 'mousedown'){
            if(this.hook == undefined){
                let mousePos = {
                    x: event.x,
                    y: event.y
                };
                this.hook = new Hook(this, Math.getAngle(mousePos, this.pos));
            }
        } else if(this.hook != undefined){
            this.hook.updateShooting(false);
        }
    }

    update(){
        this.pos.x = this.player.pos.x + this.player.width / 2 - 10;
        this.pos.y = this.player.pos.y + this.player.height / 2 + this.sprite.height * 1.5;

        this.updateRotation();
        this.updatePos();

        if(this.hook != undefined){
            let state = this.hook.update();
            if(state)
                this.hook = undefined;
            else
                this.hookIsMaxLength = this.hook.isMaxLength;
        }
    }
}