function Laser(pos, heading, playerHeight, id, playerId){

  this.speed = 3;

  this.test = 0;

  this.playerId = playerId;
  this.id = id;

  this.heading = heading - Math.radians(90);

  this.height = 25;
  this.width = 2;

  this.lifeTime = 93; // In fames (It should be 1.5 sec)
  this.lifeFrame = 0;

  this.pos = Math.createVector(pos.x + Math.cos(this.heading) * playerHeight, pos.y + Math.sin(this.heading) * playerHeight);

  this.render = function(){

    ctx.save();

    ctx.strokeStyle = "White";
    ctx.lineWidth = this.width;

    ctx.beginPath();
    ctx.moveTo(this.pos.x, this.pos.y);
    ctx.lineTo(this.pos.x + Math.cos(this.heading) * this.height, this.pos.y + Math.sin(this.heading) * this.height);
    ctx.stroke();

    ctx.restore();

  }

  this.updatePos = function(){

    this.checkCollision();
    this.checkOutWindow();

    this.pos.x += Math.cos(this.heading) * this.speed;
    this.pos.y += Math.sin(this.heading) * this.speed;

  }

  this.updateId = function(id){

    for(var i = 0; i < player.lasers.length; i++){
      if(this.pos.x == player.lasers[i].pos.x && this.pos.y == player.lasers[i].pos.y){
        this.id = i;
        break;
      }
    }

  }

  this.timerDone = function(){
    deleteLaser(this.id);
  }

  this.checkOutWindow = function(){

    if(this.pos.x + this.height < 0){
      this.pos.x = c.width + this.height;
    } else if(this.pos.x - this.height > c.width){
      this.pos.x = 0 - this.height;
    }

    if(this.pos.y + this.height < 0){
      this.pos.y = c.height + this.height;
    } else if(this.pos.y - this.height > c.height){
      this.pos.y = 0 - this.height;
    }

  }

  this.checkCollision = function(){

    var point = {
      x: this.pos.x,
      y: this.pos.y
    };

    var nextPoint = {
      x: this.pos.x + Math.cos(this.heading) * this.height,
      y: this.pos.y + Math.sin(this.heading) * this.height
    };

    var angleDist = 2;
    var dir = {
      x: Math.cos(this.heading) * angleDist,
      y: Math.sin(this.heading) * angleDist
    };

    var coll = {
      state: false,
      index: undefined
    };

    if(nextPoint.x > point.x){

      while(nextPoint.x > point.x){

        for(var i = 0; i < ast.length; i++){

          if(ast[i].checkCollision(point)){
            coll.state = true;
            coll.index = i;
          }

        }

        if(coll.state){
          break;
        }

        point.x += dir.x;
        point.y += dir.y;
      }

    } else {

      while(nextPoint.x < point.x){

        for(var i = 0; i < ast.length; i++){

          if(ast[i].checkCollision(point)){
            coll.state = true;
            coll.index = i;
          }

        }

        if(coll.state){
          break;
        }

        point.x += dir.x;
        point.y += dir.y;
      }

    }

    if(coll.state){
      ast[coll.index].crashed = true;
      deleteLaser(this.id);

      scoreMan.updateScore(this.playerId, "hit");
    }

  }

  this.update = function(){

    if(this.lifeFrame >= this.lifeTime){
      this.timerDone();
    } else {

      this.updatePos();

      this.lifeFrame++;
    }

  }

}
