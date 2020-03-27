class Particle{
    constructor(x, y){
        this.pos = createVector(random(width), random(height));
        this.vel = p5.Vector.random2D();
        this.acc = createVector();
        this.target = createVector(x, y);
        this.radius = 5;
        this.maxSpeed = 10;
        this.maxForce = 1;
    }

    render(){
        stroke(0);
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

        if(distance< 50){
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