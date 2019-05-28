function Player(color, id){

  this.pos = Math.createVector(c.width / 2, c.height / 2);

  this.id = id;

  this.dirs = Math.createDirections("2d");
  this.dirs.down = undefined;

  this.vel = Math.createVector(0, 0);
  this.deAcc = 0.98;
  this.speed = 0.3;

  this.heading = Math.radians(0);
  this.turnSpeed = Math.radians(3.5);

  this.height = 20;

  this.lasers = [];
  this.shooting = false;
  this.shootingLifeTime = 25; // In frames (Should be 400 ms)
  this.shootingFrame = this.shootingLifeTime;
  this.lasersC = 2;
  this.curLaserC = 0;
  this.shootingDelay = 50 // In frames (Should be 2.5 sec)
  this.shootingDelayFrame = 0;
  this.shootingDelayB = false;

  this.pointsAngle = [];

  this.needRespawn = false;
  this.deAlpha = 0.90;
  this.curAlpha = 1;
  this.crashed = false;
  this.respawn = {
    lifeTime: 62,  // In frames (Should be 1 sec)
    pos: Math.createVector(this.pos.x, this.pos.y),
    vel: Math.createVector(0, 0),
    heading: this.heading,
    lifeFrame: 0
  };

  this.color = color;

  this.updateDir = function(dir, b){

    if(dir == "ArrowUp"){
      this.dirs.up = b;
    } else if(dir == "Space" || dir == "ArrowDown"){
      if(!this.shooting){
        this.dirs.shoot = b;
      }
    } else if(dir == "ArrowLeft"){
      this.dirs.left = b;
    } else if(dir == "ArrowRight"){
      this.dirs.right = b;
    }

  }

  this.updatePos = function(){

    this.updateHeading();
    this.checkCollision();

    if(this.dirs.up){

      var x = Math.cos(this.heading - Math.radians(90)) * this.speed;
      var y = Math.sin(this.heading - Math.radians(90)) * this.speed;

      this.vel.x += x;
      this.vel.y += y;

    }

    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;

    this.vel.x *= this.deAcc;
    this.vel.y *= this.deAcc;

    this.checkOutWindow();

  }

  this.checkOutWindow = function(){

    if(this.pos.x + this.height * 1.75 < 0){
      this.pos.x = c.width + this.height;
    } else if(this.pos.x - this.height * 1.75 > c.width){
      this.pos.x = 0 - this.height;
    }

    if(this.pos.y + this.height * 1.75 < 0){
      this.pos.y = c.height + this.height;
    } else if(this.pos.y - this.height * 1.75 > c.height){
      this.pos.y = 0 - this.height;
    }

  }

  this.updateHeading = function(){

    if(this.dirs.right){
      this.heading += this.turnSpeed;
    } else if(this.dirs.left){
      this.heading -= this.turnSpeed;
    }

  }

  this.updatePoints = function(){

    this.points = [
      {
        x: this.pos.x - this.height,
        y: this.pos.y + this.height
      },
      {
        x: this.pos.x + this.height,
        y: this.pos.y + this.height
      },
      {
        x: this.pos.x,
        y: this.pos.y - this.height
      }
    ];

  }

  this.updateShoot = function(){

    if(this.dirs.shoot){

      this.shooting = true;
      this.dirs.shoot = false;

    }

  }

  this.makeLaser = function(){

    if(this.curLaserC > this.lasersC){

      this.shootingFrame = this.shootingLifeTime;

      this.curLaserC = 0;

      this.shootingDelayB = true;

    } else {

      makeLaser(this.id);

      this.shootingFrame = 0;
      this.curLaserC++;

    }

  }

  this.checkCollision = function(){

    for(var i = 0; i < this.pointsAngle.length; i++){

      var point = {
        x: this.pos.x + this.pointsAngle[i].x,
        y: this.pos.y + this.pointsAngle[i].y
      };

      if(i + 1 == this.pointsAngle.length){

        var nextPoint = {
          x: this.pos.x + this.pointsAngle[0].x,
          y: this.pos.y + this.pointsAngle[0].y
        };

      } else {

        var nextPoint = {
          x: this.pos.x + this.pointsAngle[i + 1].x,
          y: this.pos.y + this.pointsAngle[i + 1].y
        };

      }

      var angle = Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x);
      var angleDist = 2;
      var dir = {
        x: Math.cos(angle) * angleDist,
        y: Math.sin(angle) * angleDist
      };

      var done = false;
      if(nextPoint.x > point.x){

        while(nextPoint.x > point.x){

          for(var j = 0; j < ast.length; j++){

            if(ast[j].checkCollision(point)){
              this.gameOver();
              done = true;
              break;
            }

          }

          if(done){
            break;
          }

          point.x += dir.x;
          point.y += dir.y;
        }

      } else {

        while(nextPoint.x < point.x){

          for(var j = 0; j < ast.length; j++){

            if(ast[j].checkCollision(point)){
              this.gameOver();
              done = true;
              break;
            }

          }

          if(done){
            break;
          }

          point.x += dir.x;
          point.y += dir.y;
        }

      }

    }

  }

  this.gameOver = function(){

    if(!this.crashed){
      scoreMan.updateScore(this.id, "crush");
    }

    this.crashed = true;
  }

  this.renderCrash = function(){

    ctx.save();

    this.curAlpha *= this.deAlpha;
    ctx.globalAlpha = this.curAlpha;
    ctx.strokeStyle = this.color;

    ctx.beginPath();

    var x = this.pointsAngle[0].x + Math.cos(Math.radians(90) + this.heading) * this.respawn.lifeFrame;
    var y = this.pointsAngle[0].y + Math.sin(Math.radians(90) + this.heading) * this.respawn.lifeFrame;
    ctx.moveTo(this.pos.x + x, this.pos.y + y);

    x = this.pointsAngle[1].x + Math.cos(Math.radians(90) + this.heading) * this.respawn.lifeFrame;
    y = this.pointsAngle[1].y + Math.sin(Math.radians(90) + this.heading) * this.respawn.lifeFrame;
    ctx.lineTo(this.pos.x + x, this.pos.y + y);

    ctx.stroke();


    ctx.beginPath();

    x = this.pointsAngle[1].x + Math.cos(Math.radians(-60) + this.heading) * this.respawn.lifeFrame;
    y = this.pointsAngle[1].y + Math.sin(Math.radians(-60) + this.heading) * this.respawn.lifeFrame;
    ctx.moveTo(this.pos.x + x, this.pos.y + y);

    x = this.pointsAngle[2].x + Math.cos(Math.radians(-60) + this.heading) * this.respawn.lifeFrame;
    y = this.pointsAngle[2].y + Math.sin(Math.radians(-60) + this.heading) * this.respawn.lifeFrame;
    ctx.lineTo(this.pos.x + x, this.pos.y + y);

    ctx.stroke();


    ctx.beginPath();

    x = this.pointsAngle[2].x + Math.cos(Math.radians(-120) + this.heading) * this.respawn.lifeFrame;
    y = this.pointsAngle[2].y + Math.sin(Math.radians(-120) + this.heading) * this.respawn.lifeFrame;
    ctx.moveTo(this.pos.x + x, this.pos.y + y);

    x = this.pointsAngle[0].x + Math.cos(Math.radians(-120) + this.heading) * this.respawn.lifeFrame;
    y = this.pointsAngle[0].y + Math.sin(Math.radians(-120) + this.heading) * this.respawn.lifeFrame;
    ctx.lineTo(this.pos.x + x, this.pos.y + y);

    ctx.stroke();

    ctx.restore();
    ctx.globalAlpha = 1;

  }

  this.renderNormal = function(){

    for(var i = 0; i < this.points.length; i++){

      var angle = Math.atan2(this.points[i].y - this.pos.y, this.points[i].x - this.pos.x) + this.heading;

      this.pointsAngle[i] = {
        x: Math.cos(angle) * this.height,
        y: Math.sin(angle) * this.height
      };

    }

    ctx.strokeStyle = this.color;

    ctx.beginPath();
    ctx.moveTo(this.pos.x + this.pointsAngle[0].x, this.pos.y + this.pointsAngle[0].y);
    ctx.lineTo(this.pos.x + this.pointsAngle[1].x, this.pos.y + this.pointsAngle[1].y);
    ctx.lineTo(this.pos.x + this.pointsAngle[2].x, this.pos.y + this.pointsAngle[2].y);
    ctx.lineTo(this.pos.x + this.pointsAngle[0].x, this.pos.y + this.pointsAngle[0].y);
    ctx.stroke();

  }

  this.render = function(){

    if(!this.crashed){
      this.renderNormal();
    } else {
      this.renderCrash();
    }

  }

  this.update = function(){

    if(!this.crashed){
      this.updatePoints();
      this.updateShoot();

      if(this.shooting){

        if(!this.shootingDelayB){

          this.shootingFrame++;

          if(this.shootingFrame >= this.shootingLifeTime){
            this.makeLaser();
          }

        } else {

          if(this.shootingDelayFrame >= this.shootingDelay){

            this.shooting = false;
            this.shootingDelayB = false;
            this.shootingDelayFrame = 0;

          } else {
            this.shootingDelayFrame++;
          }

        }

      }

      this.updatePos();
    } else {

      if(allGameOver){

        this.respawn.lifeFrame++;

      } else {

        if(this.respawn.lifeFrame >= this.respawn.lifeTime){
          resetPlayer(this.respawn);
        }

        this.respawn.lifeFrame++;

        if(this.needRespawn){
          resetPlayer(this.respawn);
        }

      }

    }

  }

}
