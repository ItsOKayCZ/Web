console.log("Initialize");
/**
 * @method Transforms degress to radians
 * @param {Number} degress
 * @return {Number} radians
*/
Math.radians = function(deg){
  return deg * Math.PI / 180;
}

/**
 * @method Generates a random int
 * @param {Number} min Minimum
 * @param {Number} max Maximum
 * @return {Number} randomInt
*/
Math.randomInt = function(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * @method Generates a random float
 * @param {Number} min Minimum
 * @param {Number} max Maximum
 * @return {Number} randomFloat
*/
Math.randomFloat = function(min, max){
  return Math.random() * (max - min) + min;
}

/**
 * @method Calculates the distance between to points
 * @param {Number} x1 Current X position
 * @param {Number} y1 Current Y position
 * @param {Number} x2 Target X position
 * @param {Number} y2 Target Y position
 * @return {Number} Distance
*/
Math.distance = function(x1, y1, x2, y2){
  var a = x1 - x2;
  var b = y1 - y2;
  return Math.sqrt(a * a + b * b);
}

/**
 * @method Calculates a circle/square hitbox
 * @param {Object} params x, y, radius, targetX, targetY, targetRadius
 * @return {Boolean} If is collision
*/
Math.hitbox = function(params){
  if((params.targetX - params.targetRadius < params.x - params.radius)
  && (params.targetX + params.targetRadius > params.x + params.radius)){
    if((params.targetY - params.targetRadius < params.y - params.radius)
    && (params.targetY + params.targetRadius > params.y + params.radius)){
      return true;
    }
  }
  return false;
}

/**
 * @method Creates a vector
 * @param  {Number} x The X vector
 * @param  {Number} y The Y vector
 * @param  {Number} y The Z vector
 * @return {Object}   Returns the vectors in a object
*/
Math.createVector = function(x, y, z){
  if(z == undefined){
    return {
      x: x,
      y: y,
    };
  } else {
    return {
      x: x,
      y: y,
      z: z
    }
  }
}

/**
 * @method If the object is off screen
 * @param {Object} params x, y, radius
 * @return {Boolean} Returns a boolean that is acording to the object
 */
Math.isOffScreen = function(params){
  if((params.x - params.radius <= 0)
  || (params.x + params.radius >= c.width)
  || (params.y - params.radius <= 0)
  || (params.y + params.radius >= c.height)){
    return true;
  }
  return false;
}

/**
 * p5.prototype.map = function(n, start1, stop1, start2, stop2) {
   return ((n-start1)/(stop1-start1))*(stop2-start2)+start2;
 };
 * Normalizes the value between 0 and 1
 * @param  {Number} val value
 * @param  {Number} min
 * @param  {Number} max
 * @param  {Number} shrinkMin
 * @param  {Number} shrinkMax
 * @return {Number} The scaled value
 */
Math.normalize = function(val, min, max, shrinkMin, shrinkMax){
  return ((val - min) / (max - min)) * (shrinkMax - shrinkMin) + shrinkMin;
}
