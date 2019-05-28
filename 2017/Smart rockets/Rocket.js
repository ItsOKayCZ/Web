/**
 * Rocket "class"
 *
 * (Its the rectangle on the screen)
 */
function Rocket(genes){

  /*
  ####################
  # (static) VARIABLES
  ####################
   */

   // Height of rect
  this.height = 40;
  // Width of rect
  this.width = 7;
  // Minimal force that can apply on the rocket
  this.minForce = 0.5;
  // Maximal force that can apply on the rocket
  this.maxForce = 1.25;
  // "Deacceleration"
  this.deAcc = 0.98;
  // The fitness of the current rocket
  this.fit = 0;
  // If the rocket crashed
  this.crashed = false;
  // Penalty for crash
  this.bonus = 10;
  // The maximum distance that the rocket can be
  this.maxDistance = Math.distance(0, 0, target.pos.x, target.pos.y);
  // If the rocket finished
  this.finished = false;
  // Time when finished
  this.timeFinish = undefined;
  // Time when crashed
  this.timeCrash = undefined;

  /*
  #################
  # "for" VARIABLES
  #################
   */

  /**
   * Genes
   * The movement of the rocket
   */
  if(genes == undefined){
    this.genes = [];
    for(var i = 0; i <= lifeLen; i++){

      var deg = Math.radians(Math.randomFloat(0, 360));
      var force = Math.randomFloat(this.minForce, this.maxForce);

      this.genes[i] = {
        x: Math.cos(deg) * force,
        y: Math.sin(deg) * force
      };

    }
  } else {
    this.genes = genes;
  }

  /*
  #########
  # OBJECTS
  #########
   */

  /**
   * Velocity
   */
  this.vel = {
    x: 0,
    y: 0
  };

  /**
   * Position
   */
  this.pos = {
    x: 0 + 100,
    y: c.height / 2
  };

  /*
  ###########
  # FUNCTIONS
  ###########
   */

  /**
   * Renders the rectangle (rocket)
   */
  this.render = function(){

    ctx.fillStyle = "White";

    ctx.save();
    ctx.translate(this.pos.x, this.pos.y);
    ctx.rotate(Math.atan2(this.vel.y, this.vel.x) + Math.radians(90));

    ctx.fillRect(0 - this.width / 2, 0 - this.height / 2, this.width, this.height);

    ctx.restore();

  }

  /**
   * Updates the position of "rocket"
   */
  this.updatePos = function(){

    this.vel.x += this.genes[lifeC].x;
    this.vel.y += this.genes[lifeC].y;

    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;

    this.vel.x *= this.deAcc;
    this.vel.y *= this.deAcc;

  }



  /**
   * Calculates the fitness of the rocket
   */
  this.calcFit = function(){

    this.fit = Math.distance(this.pos.x, this.pos.y, target.pos.x, target.pos.y);
    this.fit = Math.normalize(this.fit, this.maxDistance, 0, 0, 1);

    if(this.crashed){
      this.fit /= this.bonus;
    }

    if(this.finished){
      this.fit *= this.bonus;
    }

		if(this.timeFinish != undefined){
      this.fit *= Math.normalize(this.timeFinish, lifeLen, 0, 1, 10);
    }

    this.fit *= this.fit;

    if(this.fit > maxFit){
      maxFit = this.fit;
    }
  }

  /**
   * Checks if the rocket crashed or went out of bounds
   */
  this.checkCrashed = function(){

    var params = {
      x: this.pos.x,
      y: this.pos.y,
      radius: this.height / 2
    };

    if(Math.isOffScreen(params)){
      this.timeCrash = lifeC;
      return true;
    }

  }

  /**
   * Main function of the object (rocket)
   */
  this.update = function(){

    if(!this.crashed && !this.finished){
      this.crashed = this.checkCrashed();
      this.updatePos();
    } else if(this.finished){
      this.pos = {
        x: target.pos.x,
        y: target.pos.y
      };
    }

    this.render();

  }

}
