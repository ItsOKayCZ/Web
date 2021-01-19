class Hook{
    speed = 2;
    maxLength = 250;
    isMaxLength = false;
    minLength = this.speed * 0.7;

    shooting = true;
    isStuck = false;

    width = 0;
    height = 0;

    ropeWidth = 3;
    ropeColor = 0x000000;

    offsetPos = {
        x: 0,
        y: 0
    }

    constructor(_parent, _dir){
        this.sprite = new PIXI.Sprite(PIXI.loader.resources.hook.texture);
        app.stage.addChild(this.sprite);

        this.width = this.sprite.width;
        this.height = this.sprite.height;

        this.parent = _parent;

        this.pos = {
            x: this.parent.pos.x,
            y: this.parent.pos.y
        };
        
        this.dir = _dir;

        this.rope = new PIXI.Graphics();
        app.stage.addChild(this.rope);

        // TODO: Set a direction for first launch of the hook
        this.update();
    }

    updateShooting(state){
        this.shooting = state;
    }

    updatePos(){
        this.sprite.position.set(this.pos.x + this.offsetPos.x, this.pos.y + this.offsetPos.y);
    }

    updateStartingPos(){
        this.startingPos = {
            x: this.parent.pos.x,
            y: this.parent.pos.y
        };
    }

    updateDir(){
        if(!this.shooting || this.isStuck){
            this.dir = Math.getAngle(this.pos, this.startingPos);
        }

        this.sprite.rotation = Math.PI*3/ 4;
        this.sprite.rotation += this.dir;
    }

    checkCollision(){
        if(!this.shooting)
            return;

        let offset = 5;

        for(let i = 0; i < platforms.length; i++){
            let platform = platforms[i];

            if((this.pos.x > platform.pos.x + offset && this.pos.x < platform.pos.x + platform.width - offset) &&
            (this.pos.y > platform.pos.y && this.pos.y < platform.pos.y + platform.height)){
                this.isStuck = true;
            }

            if((this.pos.y > platform.pos.y + offset && this.pos.y < platform.pos.y + platform.height - offset) &&
            (this.pos.x > platform.pos.x && this.pos.x < platform.pos.x + platform.width)){
                this.isStuck = true;
            }
        }
    }

    updateRope(){

        let d = Math.getDistance(this.pos, this.parent.pos);

        this.rope.clear();
        this.rope.position.set(this.parent.pos.x, this.parent.pos.y);
        this.rope.lineStyle(this.ropeWidth, this.ropeColor);

        this.rope.moveTo(0, 0);
        this.rope.lineTo(0, this.height - d);

        this.rope.rotation = this.dir + Math.PI / 2;
    }

    update(){
        this.updateStartingPos();
        this.updateDir();
        this.updateRope();
        this.checkCollision();

        if(this.isStuck && this.shooting)
            return;

        if(this.shooting && !this.isMaxLength){
            this.offsetPos.x += Math.cos(this.dir) * this.speed;
            this.offsetPos.y += Math.sin(this.dir) * this.speed;
        } else if(!this.shooting || this.isMaxLength){
            this.offsetPos.x -= Math.cos(this.dir) * this.speed;
            this.offsetPos.y -= Math.sin(this.dir) * this.speed;
        } 

        this.pos.x += this.offsetPos.x;
        this.pos.y += this.offsetPos.y;

        if(Math.getDistance(this.startingPos, this.pos) >= this.maxLength){
            this.isMaxLength = true;
            this.shooting = false;
            this.pos.x -= this.offsetPos.x;
            this.pos.y -= this.offsetPos.y;
            // this.offsetPos.x -= Math.cos(this.dir) * this.speed;
            // this.offsetPos.y -= Math.sin(this.dir) * this.speed;
        }

        if(Math.getDistance(this.pos, this.startingPos) <= this.minLength){
            app.stage.removeChild(this.sprite);
            app.stage.removeChild(this.rope);
            return true;
        }

        this.updatePos();

        return false;
    }
}