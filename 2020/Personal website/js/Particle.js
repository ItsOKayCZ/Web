class Particles{
    
    constructor(parameters){
		this.particles = [];

		var padding = 0;
		var userOffset = 0;
        [this.font, this.str, this.fontSize, this.color, this.backgroundColor, padding, userOffset] = parameters;

        textFont(this.font);

		this.updateSize(this.fontSize, padding, userOffset);
		return;

        for(var i = 0; i < points.length; i++){
            this.particles.push(new Particle(points[i].x, points[i].y, this.color, windowWidth, this.bounds.h + padding));
        }

    }

	getHeight(){
		return this.bounds.h;
	}

	updateSize(size, padding, userOffset){
		this.fontSize = size;
		this.bounds = this.font.textBounds(this.str, 0, 0, this.fontSize);
		var offsetX = this.bounds.w / 2;
		var offsetY = this.bounds.h / 2;

		var points = this.font.textToPoints(this.str, windowWidth / 2 - offsetX,
													  (this.bounds.h + padding) / 2 + offsetY + userOffset,
													  this.fontSize);
		for(var i = 0; i < points.length; i++){
			var pos = createVector(random(windowWidth), random(this.bounds.h + padding));
			if(this.particles[i] != undefined){
				pos = this.particles[i].pos;
			}

			this.particles[i] = new Particle(points[i].x, points[i].y, this.color, 0, 0);
			this.particles[i].pos = pos;

		}

		if(points.length < this.particles.length){
			this.particles.splice(points.length - 1, this.particles.length - points.length);
		}
	}

    update(){
        background(this.backgroundColor);

        for(var i = 0; i < this.particles.length; i++){
            this.particles[i].update();
        }

    }
}

class Particle{
    constructor(x, y, color, canvasWidth, canvasHeight){
        this.pos = createVector(random(canvasWidth), random(canvasHeight));
        this.vel = p5.Vector.random2D();
        this.acc = createVector();
        this.target = createVector(x, y);
        this.radius = 5;
        this.maxSpeed = 10;
        this.maxForce = 1;

        this.color = color;
    }

    render(){
        stroke(this.color);
        strokeWeight(this.radius);
        point(this.pos.x, this.pos.y);
    }

    update(){
        var arrive = this.arrive();
        var flee = this.flee();

        flee.mult(5);

        this.acc.add(arrive);
        this.acc.add(flee);

        this.pos.add(this.vel);
        this.vel.add(this.acc);
        this.acc.mult(0);

        this.render();
    }

    flee(){
        var mouse = createVector(mouseX, mouseY);

        var desired = p5.Vector.sub(mouse, this.pos);
        var distance = desired.mag();

        if(distance < 50){
            desired.setMag(this.maxSpeed);
            desired.mult(-1);

            var steer = p5.Vector.sub(desired, this.vel);
            steer.limit(this.maxForce);
            return steer;
        } else {
            return createVector(0, 0);
        }

    }

    arrive(){
        var desired = p5.Vector.sub(this.target, this.pos);
        var distance = desired.mag();
        var speed = this.maxSpeed;

        if(distance < 100){
            speed = map(distance, 0, 100, 0, this.maxSpeed);
        }

        desired.setMag(speed);
        var steer = p5.Vector.sub(desired, this.vel);
        steer.limit(this.maxForce);
        return steer;
    }
}
