function Rocket(genes){

  this.height = 35;
  this.width = 5;

  this.pos = Math.createVector(cells[0][0].pos.x + cellWidth / 2 - this.width / 2, cells[0][0].pos.y + cellWidth / 2 - this.height / 2);
  this.vel = Math.createVector(0, 0);
  this.color = "Yellow";

  this.deAcc = 0.95;
  this.maxForce = 1.25;
  this.minForce = 0.5;

  this.crashed = false;
  this.finished = false;
  this.radiusDet = this.height / 2.50;
  this.finishDet = 20;
  this.cellDet = 1;

  this.pathC = null;
  this.bonus = 10;

  this.fit;
  this.maxDistance = Math.distance(0, 0, cellWidth, cellWidth);

  if(genes != undefined){
    this.genes = genes;
  } else {

    this.genes = [];
    for(var i = 0; i < lifeLen; i++){

      var deg = Math.radians(Math.randomFloat(0, 360));
      var force = Math.randomFloat(this.minForce, this.maxForce);

      this.genes[i] = {
        x: Math.cos(deg) * force,
        y: Math.sin(deg) * force
      };

    }

  }

  this.checkCollisionCells = function(){

    for(var i = 0; i < cells.length; i++){
      for(var j = 0; j < cells[i].length; j++){

        var c = cells[i][j];

        if(c.walls.right){
          if((this.pos.x + this.radiusDet >= c.pos.x + cellWidth - this.cellDet)
          && (this.pos.x - this.radiusDet <= c.pos.x + cellWidth + this.cellDet)
          && (this.pos.y >= c.pos.y)
          && (this.pos.y <= c.pos.y + cellWidth)){
            return true;
          }
        }

        if(c.walls.left){
          if((this.pos.x + this.radiusDet >= c.pos.x - this.cellDet)
          && (this.pos.x - this.radiusDet <= c.pos.x + this.cellDet)
          && (this.pos.y >= c.pos.y)
          && (this.pos.y <= c.pos.y + cellWidth)){
            return true;
          }
        }

        if(c.walls.up){
          if((this.pos.y + this.radiusDet >= c.pos.y - this.cellDet)
          && (this.pos.y - this.radiusDet <= c.pos.y + this.cellDet)
          && (this.pos.x >= c.pos.x)
          && (this.pos.x <= c.pos.x + cellWidth)){
            return true;
          }
        }

        if(c.walls.down){
          if((this.pos.y + this.radiusDet >= c.pos.y + cellWidth - this.cellDet)
          && (this.pos.y - this.radiusDet <= c.pos.y + cellWidth + this.cellDet)
          && (this.pos.x >= c.pos.x)
          && (this.pos.x <= c.pos.x + cellWidth)){
            return true;
          }
        }

      }
    }

    return false;
  }

  this.checkCollision = function(){

    var crashed = false;
    if(this.pos.x - this.radiusDet <= 0){
      crashed = true;
    } else if(this.pos.x + this.radiusDet >= c.width){
      crashed = true;
    } else if(this.pos.y - this.radiusDet <= 0){
      crashed = true;
    } else if(this.pos.y + this.radiusDet >= c.height){
      crashed = true;
    } else {
      crashed = this.checkCollisionCells();
    }

    return crashed;
  }

  this.checkPathNode = function(){
		
		if(this.pathC - 1 == -1){
			
			var p = path[this.pathC];
			
			if(Math.distance(this.pos.x, this.pos.y, p.pos.x + cellWidth / 2, p.pos.y + cellWidth / 2) <= this.finishDet){
				
				this.finished = true;
				return;
				
			}
			
		}
		
    for(var i = this.pathC - 1; i >= 0; i--){

      var p = path[i];

      if((this.pos.x >= p.pos.x)
      && (this.pos.x <= p.pos.x + cellWidth)
      && (this.pos.y >= p.pos.y)
      && (this.pos.y <= p.pos.y + cellWidth)){

        this.pathC = i;

      }

    }

  }

  this.calcFit = function(){

    this.fit = Math.distance(this.pos.x, this.pos.y, path[this.pathC].pos.x + cellWidth / 2, path[this.pathC].pos.y + cellWidth / 2);
    // this.fit = Math.distance(this.pos.x, this.pos.y, path[this.pathC].pos.x + cellWidth / 2, path[this.pathC].pos.y + cellWidth / 2);
    this.fit = Math.normalize(this.fit, this.maxDistance, 0, 0, 1);

    if(this.crashed){
      this.fit /= this.bonus;
    }

    if(this.finished){
      this.fit *= this.bonus * this.bonus;
    }

    if(this.pathC != path.length - 1){
      this.fit += path.length - 1 - this.pathC;
    }

    this.fit *= this.fit;

    if(this.fit > maxFit){
      maxFit = this.fit;
    }

  }

  this.render = function(){

    ctx.fillStyle = this.color;

    ctx.save();

    ctx.translate(this.pos.x, this.pos.y);
    ctx.rotate(Math.atan2(this.vel.y, this.vel.x) + Math.radians(90));

    ctx.fillRect(0 - this.width / 2, 0 - this.height / 2, this.width, this.height);

    ctx.restore();

  }

  this.updatePos = function(){

    this.vel.x += this.genes[lifeC].x;
    this.vel.y += this.genes[lifeC].y;

    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;

    this.vel.x *= this.deAcc;
    this.vel.y *= this.deAcc;

  }

  this.update = function(){

    if(this.pathC == null){
      this.pathC = path.length - 1;
    }

    if(!this.crashed && !this.finished){
      this.crashed = this.checkCollision();
      this.checkPathNode();
      this.updatePos();
    } else if(this.finished){
      this.pos = {
        x: end.pos.x + cellWidth / 2,
        y: end.pos.y + cellWidth / 2
      };
    }
    this.render();

  }

}
