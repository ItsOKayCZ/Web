function Point(){

	this.radius = 12;
	this.pos = Math.createVector(Math.randomFloat(0 + this.radius, c.width - this.radius), Math.randomFloat(0 + this.radius, c.height - this.radius));

	if(this.pos.x > this.pos.y){
		this.group = 1;
		this.color = "Red";
	} else {
		this.group = -1;
		this.color = "Orange";
	}

	this.render = function(){

		ctx.fillStyle = this.color;
		ctx.beginPath();
		ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
		ctx.fill();

	}

	this.update = function(){

		this.render();

	}

}