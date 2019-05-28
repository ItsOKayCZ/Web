function ScoreManager(){

  this.scores = [];

  this.scores = [{
    score: 0,
    lives: 3
  }];
  // for(var i = 0; i < player.length; i++){
  //   this.scores[i] = {
  //     score: 0,
  //     lives: 1
  //   };
  // }

  this.offset = 100;
  this.pos = [
    { // Player 1
      x: c.width / 20,
      y: c.height / 20
    },

    { // Player 2
      x: c.width - c.width / 20 - this.offset,
      y: c.height / 20
    },

    { // Player 3
      x: c.width / 20,
      y: c.height - c.height / 20
    },

    { // Player 4
      x: c.width - c.width / 20 - this.offset,
      y: c.height - c.height / 20
    }
  ];

  this.str = "Points: ";
  this.str1 = "Lives: ";

  this.height = 20;

  this.render = function(){

    ctx.font = "20px monospace";
    for(var i = 0; i < this.scores.length; i++){

      // ctx.fillStyle = player[i].color;
      ctx.fillStyle = "White";

      ctx.fillText(this.str + this.scores[i].score, this.pos[i].x, this.pos[i].y);
      ctx.fillText(this.str1 + this.scores[i].lives, this.pos[i].x, this.pos[i].y + this.height);

    }

    if(allGameOver){

      ctx.font = "20px monospace";

      var str = "Game Over";
      var width = ctx.measureText(str).width;

      ctx.fillText(str, c.width / 2 - width / 2, c.height / 2);

    }

  }

  this.update = function(){

    for(var i = 0; i < this.scores.length; i++){

      if(this.scores[i].lives != 0){
        allGameOver = false;
        break;
      }

      allGameOver = true;
    }

  }

  this.updateScore = function(play, state){

    if(state == "hit"){
      this.scores[play].score += 5;
    } else if(state == "crush"){
      this.scores[play].score -= 1;
      this.scores[play].lives--;
    }

  }

}
