/**
 * You can create an Obstacle, amazing!!!
 */
function Obstacle(x, y){

  /*
  ###########
  # (static) VARIABLES
  ###########
   */

  // Color of obstacle
  this.color = "#fff385";
  // When the obstacle is creating
  this.createAlpha = 0.5;
  // Width of obstacle
  this.width = undefined;
  // Height of obstacle
  this.height = undefined;
  // When the mouse is pressed
  this.pressed = false;

  /*
  #########
  # OBJECTS
  #########
   */

  /**
   * Position
   */
  this.pos = {
    x: x,
    y: y
  };

  /**
   * Renders the obstacle
   */
  this.render = function(){

    ctx.fillStyle = this.color;

    if(this.pressed){
      ctx.save();
      ctx.globalAlpha = this.createAlpha;
    }

    ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height);

    if(this.pressed){
      ctx.restore();
    }
  }

  /**
   * Checks the collision with the rockets
   */
  this.checkCollision = function(){

    for(var i = 0; i < rockets.length; i++){

      var r = rockets[i];

      if(this.width < 0 || this.height < 0){

        if((r.pos.x + r.height / 2 > this.pos.x)
        && (r.pos.x - r.height / 2 < this.pos.x + this.width)
        && (r.pos.y - r.height / 2 < this.pos.y)
        && (r.pos.y + r.height / 2 > this.pos.y + this.height)){
          rockets[i].crashed = true;
        }

      } else {

        if((r.pos.x + r.height / 2 > this.pos.x)
        && (r.pos.x - r.height / 2 < this.pos.x + this.width)
        && (r.pos.y + r.height / 2 > this.pos.y)
        && (r.pos.y - r.height / 2 < this.pos.y + this.height)){
          rockets[i].crashed = true;
        }

      }

    }

  }

  /**
   * Main function of obstacle
   */
  this.update = function(){

    this.render();
    if(!this.pressed){
      this.checkCollision();
    }
  }

}
