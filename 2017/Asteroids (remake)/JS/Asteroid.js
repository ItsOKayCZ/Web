function Asteroid(pos, minRad, maxRad, index){

  if(pos == undefined){
    this.pos = Math.createVector(c.width / 2, c.height / 2);
  } else {
    this.pos = {
      x: pos.x,
      y: pos.y
    };
  }

  this.crashed = false;

  this.minSpeed = 0.5;
  this.maxSpeed = 2;
  this.speed = Math.randomFloat(this.minSpeed, this.maxSpeed);

  this.heading = Math.randomFloat(0, Math.radians(360));

  if(minRad == undefined){
    this.minRadius = 25;
    this.maxRadius = 150;
  } else {
    this.minRadius = minRad;
    this.maxRadius = maxRad;
  }
  this.points = [];
  var addVal = Math.radians(45);
  for(var angle = 0; angle <= Math.PI * 2; angle += addVal){

    var dist = Math.randomFloat(this.minRadius, this.maxRadius);

    if(angle + addVal > Math.PI * 2){
      this.points.push({
        x: this.points[0].x,
        y: this.points[0].y
      });
    } else {
      this.points.push({
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist
      });
    }

  }

  this.farPoints = {
    left: 0,
    right: 0,
    down: 0,
    up: 0
  };
  for(var i = 0; i < this.points.length; i++){

    // Right
    if(this.points[i].x > this.farPoints.right){
      this.farPoints.right = this.points[i].x;
    }

    // left
    if(this.points[i].x < this.farPoints.left){
      this.farPoints.left = Math.abs(this.points[i].x);
    }

    // Down
    if(this.points[i].y > this.farPoints.down){
      this.farPoints.down = this.points[i].y;
    }

    // Up
    if(this.points[i].y < this.farPoints.up){
      this.farPoints.up = Math.abs(this.points[i].y);
    }

  }

  this.render = function(){

    ctx.strokeStyle = "White";

    ctx.beginPath();
    for(var i = 0; i < this.points.length; i++){

      if(i == 0){
        ctx.moveTo(this.pos.x + this.points[i].x, this.pos.y + this.points[i].y);
      } else {
        ctx.lineTo(this.pos.x + this.points[i].x, this.pos.y + this.points[i].y);
      }

    }
    ctx.stroke();

  }

  this.checkOutWindow = function(){

    var offset = 1.25;

    if(this.pos.x - this.farPoints.right * offset > c.width){
      this.pos.x = 0 - this.farPoints.right;
    } else if(this.pos.x + this.farPoints.right < 0){
      this.pos.x = c.width + this.farPoints.right;
    }

    if(this.pos.y - this.farPoints.down * offset > c.height){
      this.pos.y = 0 - this.farPoints.down;
    } else if(this.pos.y + this.farPoints.down < 0){
      this.pos.y = c.height + this.farPoints.down * offset;
    }

  }

  this.checkCollision = function(target){

    for(var i = 0; i < this.points.length; i++){

      var point = {
        x: this.pos.x + this.points[i].x,
        y: this.pos.y + this.points[i].y
      };

      if(i + 1 == this.points.length){

        var nextPoint = {
          x: this.pos.x + this.points[0].x,
          y: this.pos.y + this.points[0].y
        };

      } else {

        var nextPoint = {
          x: this.pos.x + this.points[i + 1].x,
          y: this.pos.y + this.points[i + 1].y
        };

      }

      var angle = Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x);
      var angleDist = 8;
      var dir = {
        x: Math.cos(angle) * angleDist,
        y: Math.sin(angle) * angleDist
      };

      var collDist = angleDist / 2;
      if(nextPoint.x > point.x){

        while(nextPoint.x > point.x){

          if(Math.distance(point.x, point.y, target.x, target.y) <= collDist){
            return true;
          }

          point.x += dir.x;
          point.y += dir.y;
        }

      } else {

        while(nextPoint.x < point.x){

          if(Math.distance(point.x, point.y, target.x, target.y) <= collDist){
            return true;
          }

          point.x += dir.x;
          point.y += dir.y;
        }

      }

    }

    return false;
  }

  this.updatePos = function(){

    this.checkOutWindow();

    var x = Math.cos(this.heading) * this.speed;
    var y = Math.sin(this.heading) * this.speed;

    this.pos.x += x;
    this.pos.y += y;

  }

  this.crashedF = function(){

  }

  this.update = function(){

    if(!this.crashed){
      this.updatePos();
    } else {
      makeAsteroid(this.pos);
    }

  }

}
