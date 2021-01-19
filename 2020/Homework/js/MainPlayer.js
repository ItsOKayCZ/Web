class MainPlayer{
    pos = {
        x: 0,
        y: 0
    };
    width = 0;
    height = 0;

    dir = {
        up: false,
        down: false,
        left: false,
        right: false
    };
    vel = {
        x: 0,
        y: 0
    };
    acc = 0.90;
    speed = 0.9;
    maxSpeed = 5;
    jumpSpeedMulti = 20;
    gravity = 0.07;
    onGround = false;
    amountOfTimeNotOnGround = 0;

    constructor(_x, _y){
        this.sprite = new PIXI.Sprite(PIXI.loader.resources.mainPlayer.texture);
        app.stage.addChild(this.sprite);

        this.pos = {
            x: _x,
            y: _y
        };

        this.width = this.sprite.width;
        this.height = this.sprite.height;

        if(DEBUG){
            this.hitbox = new PIXI.Graphics();

            this.hitbox.beginFill(0xffffff);
            this.hitbox.alpha = 0.5;
            this.hitbox.lineStyle(1, 0x000000);
            this.hitbox.drawRect(0, 0, this.width, this.height);
            app.stage.addChild(this.hitbox);
        }

        this.grapler = new Grapler(this);
        this.updatePos();
    }

    update(){

        if(this.dir.left)
            this.vel.x -= this.speed;
        else if(this.dir.right)
            this.vel.x += this.speed;

        if(this.dir.up && this.onGround){
            this.vel.y -= this.speed * this.jumpSpeedMulti;
            this.onGround = false;
        } else if(this.dir.down)
            this.vel.y += this.speed;


        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;

        this.vel.x *= this.acc;
        this.vel.y *= this.acc;

        if(!this.onGround){
            this.vel.y += this.gravity * this.amountOfTimeNotOnGround;
            this.amountOfTimeNotOnGround++;
        }

        this.vel.x = Math.min(this.vel.x, this.maxSpeed);
        this.vel.x = Math.max(this.vel.x, -this.maxSpeed);

        this.checkCollision();
        this.checkIfOutOfBounds();

        this.updatePos();
        this.updateGrapler();
        this.updateSprite();
    }

    updateGrapler(){
        this.grapler.update();
    }

    updateSprite(){
        if(this.dir.left){
            this.sprite.anchor.x = 1;
            this.sprite.scale.x = -1;
        } else if(this.dir.right){
            this.sprite.anchor.x = 0;
            this.sprite.scale.x = 1;
        }
    }

    checkCollision(){
        let isOnGround = false;
        let partialWidth = this.width * 0.20;
        for(let i = 0; i < platforms.length; i++){
            let platform = platforms[i];

            if((this.pos.y < platform.pos.y && this.pos.y + this.height >= platform.pos.y) && 
            ((this.pos.x + partialWidth > platform.pos.x && this.pos.x + partialWidth < platform.pos.x + platform.width) ||
            (this.pos.x + this.width - partialWidth > platform.pos.x && this.pos.x + this.width - partialWidth < platform.pos.x + platform.width))){
                this.pos.y = platform.pos.y - this.height;
                isOnGround = true;
            }

            if((this.pos.y > platform.pos.y && this.pos.y < platform.pos.y + platform.height) &&
            ((this.pos.x + partialWidth > platform.pos.x && this.pos.x + partialWidth < platform.pos.x + platform.width) ||
            (this.pos.x + this.width - partialWidth > platform.pos.x && this.pos.x + this.width - partialWidth < platform.pos.x + platform.width))){
                this.pos.y = platform.pos.y + platform.height;
                this.onGround = false;
                this.vel.y = 0;
            }

            if((this.pos.y > platform.pos.y && this.pos.y < platform.pos.y + platform.height) ||
            (this.pos.y + this.height > platform.pos.y && this.pos.y < platform.pos.y + platform.height)){
                if(this.pos.x + this.width >= platform.pos.x && this.pos.x < platform.pos.x){
                    this.pos.x = platform.pos.x - this.width;
                } else if(this.pos.x <= platform.pos.x + platform.width && this.pos.x + this.width > platform.pos.x + platform.width){
                    this.pos.x = platform.pos.x + platform.width;
                }
            }
        }

        this.onGround = isOnGround;

        if(this.onGround){
            this.vel.y = 0;
            this.amountOfTimeNotOnGround = 1;
        }
    }

    checkIfOutOfBounds(){
        if(this.pos.y > HEIGHT){
            this.pos.y = 0 - this.height;
        }

        if(this.pos.x > WIDTH){
            this.pos.x = 0 - this.width;
        } else if(this.pos.x + this.width < 0){
            this.pos.x = WIDTH;
        }
    }

    keyPressed({ type, originalEvent: event}){
        let state = type != 'keyup';

        if(event.keyCode === 65) // a
            this.dir.left = state;
        else if(event.keyCode == 68) // d
            this.dir.right = state;
        else if(event.keyCode == 87) // w
            this.dir.up = state;
        else if(event.keyCode == 83) // s
            this.dir.down = state;
    }

    mousePressed({ type, originalEvent: event }){
        this.grapler.shoot(type, event);
    }

    updatePos(){
        this.sprite.position.set(this.pos.x, this.pos.y);
        
        if(DEBUG){
            this.hitbox.position.set(this.pos.x, this.pos.y);
        }
    }
}