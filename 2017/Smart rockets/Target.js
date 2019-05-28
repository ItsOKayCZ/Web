/**
 * Target "class"
 *
 * (Its the circle on the screen)
 */
function Target(){

  /*
  ###########
  # VARIABLES
  ###########
   */

   // The color of the fill
  this.fillColor = "#ff7171";
  // The color of the stroke
  this.strokeColor = "#8cff82";
  // Radius of the circle
  this.radius = 20;

  /*
  #########
  # OBJECTS
  #########
   */

  /**
   * Position
   */
  this.pos = {
    x: c.width - 100,
    y: c.height / 2
  };

  /*
  ###########
  # FUNCTIONS
  ###########
   */

  /**
   * Renders the target
   */
  this.render = function(){

    ctx.fillStyle = this.fillColor;
    ctx.strokeStyle = this.strokeColor;
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

  }

  /**
   * Checks the collision with the rocket
   */
  this.checkCollision = function(){

    for(var i = 0; i < rockets.length; i++){

      if(!this.finished){

        var r = rockets[i];

        var params = {
          x: this.pos.x,
          y: this.pos.y,
          radius: this.radius,
          targetX: r.pos.x,
          targetY: r.pos.y,
          targetRadius: r.height / 1.25
        };

        if(Math.hitbox(params)){

          if(rockets[i].finished == false){
            rockets[i].timeFinish = lifeC;
            console.log("FINISHED");
          }

          rockets[i].finished = true;

        }

      }

    }

  }

  /**
   * Main function of the target
   */
  this.update = function(){

    this.render();
    this.checkCollision();

  }

}
