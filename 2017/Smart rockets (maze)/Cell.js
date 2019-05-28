function Cell(x, y){

  this.coor = Math.createVector(x, y);
  this.pos = Math.createVector(this.coor.x * cellWidth, this.coor.y * cellWidth);

  this.walls = {
    right: true,
    left: true,
    down: true,
    up: true
  };

  this.g = 0;
  this.h = 0;
  this.f = 0;

  this.parent = null;
  this.visited = false;

  this.chooseNext = function(){

    var n = [];

    if(cells[this.coor.x - 1] != undefined){
      if(!cells[this.coor.x - 1][this.coor.y].visited){
        n.push(cells[this.coor.x - 1][this.coor.y]);
      }
    }

    if(cells[this.coor.x + 1] != undefined){
      if(!cells[this.coor.x + 1][this.coor.y].visited){
        n.push(cells[this.coor.x + 1][this.coor.y]);
      }
    }

    if(cells[this.coor.x][this.coor.y - 1] != undefined){
      if(!cells[this.coor.x][this.coor.y - 1].visited){
        n.push(cells[this.coor.x][this.coor.y - 1]);
      }
    }

    if(cells[this.coor.x][this.coor.y + 1] != undefined){
      if(!cells[this.coor.x][this.coor.y + 1].visited){
        n.push(cells[this.coor.x][this.coor.y + 1]);
      }
    }

    return n[Math.randomInt(0, n.length - 1)];

  }

  this.findNeighbors = function(){

    var neigh = [];

    if(cells[this.coor.x - 1] != undefined){
      if(!this.walls.left){
        neigh.push(cells[this.coor.x - 1][this.coor.y]);
      }
    }

    if(cells[this.coor.x + 1] != undefined){
      if(!this.walls.right){
        neigh.push(cells[this.coor.x + 1][this.coor.y]);
      }
    }

    if(cells[this.coor.x][this.coor.y - 1] != undefined){
      if(!this.walls.up){
        neigh.push(cells[this.coor.x][this.coor.y - 1]);
      }
    }

    if(cells[this.coor.x][this.coor.y + 1] != undefined){
      if(!this.walls.down){
        neigh.push(cells[this.coor.x][this.coor.y + 1]);
      }
    }

    return neigh;

  }

  this.render = function(){

    ctx.strokeStyle = "White";
    ctx.lineWidth = 2.5;

    if(this.walls.up){
      // Top line
      ctx.beginPath();
      ctx.moveTo(this.pos.x, this.pos.y);
      ctx.lineTo(this.pos.x + cellWidth, this.pos.y);
      ctx.stroke();
      ctx.closePath();
    }

    if(this.walls.down){
      // Bottom line
      ctx.beginPath();
      ctx.moveTo(this.pos.x, this.pos.y + cellWidth);
      ctx.lineTo(this.pos.x + cellWidth, this.pos.y + cellWidth);
      ctx.stroke();
      ctx.closePath();
    }

    if(this.walls.left){
      // Left line
      ctx.beginPath();
      ctx.moveTo(this.pos.x, this.pos.y);
      ctx.lineTo(this.pos.x, this.pos.y + cellWidth);
      ctx.stroke();
      ctx.closePath();
    }

    if(this.walls.right){
      // Right line
      ctx.beginPath();
      ctx.moveTo(this.pos.x + cellWidth, this.pos.y);
      ctx.lineTo(this.pos.x + cellWidth, this.pos.y + cellWidth);
      ctx.stroke();
      ctx.closePath();
    }

  }

  this.update = function(){

    this.render();

  }

}
