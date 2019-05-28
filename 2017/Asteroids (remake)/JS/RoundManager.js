function RoundManager(){

  this.astC = 4;

  this.round = 1;

  this.wait = 150;
  this.waitFrame = 0;

  this.str = "Round: ";

  this.startRound = function(){

    for(var i = 0; i < this.astC * this.round; i++){
      ast.push(new Asteroid(this.makePos()));
    }

  }

  this.makePos = function(){

    var randomF = Math.randomFloat(0, 1);

    var minOffset = 150 * (minWidth / c.width * 0.8);
    var maxOffset = 250 * (minHeight / c.height * 0.8);

    if(randomF <= 0.25){ // Up

      var position = Math.createVector(Math.randomFloat(0, c.width), 0 + Math.randomFloat(minOffset, maxOffset));

    } else if(randomF <= 0.5){ // Down

      var position = Math.createVector(Math.randomFloat(0, c.width), c.height - Math.randomFloat(minOffset, maxOffset));

    } else if(randomF <= 0.75){ // Left

      var position = Math.createVector(0 + Math.randomFloat(minOffset, maxOffset), Math.randomFloat(0, c.height));

    } else { // Right

      var position = Math.createVector(c.width - Math.randomFloat(minOffset, maxOffset), Math.randomFloat(0, c.height));

    }

    return position;
  }

  this.render = function(){

    ctx.font = "20px monospace";
    ctx.fillStyle = "White";

    var width = ctx.measureText(this.str + (this.round - 1).toString()).width;

    var pos = Math.createVector(c.width / 2 - width / 2, c.height / 20);

    ctx.fillText(this.str + (this.round - 1).toString(), pos.x, pos.y);

  }

  this.update = function(){

    if(ast[0] == undefined){

      if(this.round == 1){

        this.startRound();

        this.round++;

      } else {

        if(this.waitFrame >= this.wait){
          this.startRound();
          this.waitFrame = 0;
        } else {
          this.waitFrame++;
        }

      }



    }

  }

}
