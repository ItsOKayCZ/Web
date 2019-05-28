var current;
var cols;
var rows;
var stack = [];
var mazeLoaded = false;

function generateMaze(){

  if(current == undefined){
    current = cells[0][0];
  }

  var next = current.chooseNext();
  if(next != undefined){

    removeWall(current, next);

    current.visited = true;
    stack.push(current);
    current = next;

  } else if(stack.length > 0){

    current.visited = true;
    current = stack.pop();

  } else {
    if(!mazeLoaded){
      console.log("Maze loaded.");
    }
    mazeLoaded = true;
  }

  if(!mazeLoaded){
    ctx.fillStyle = "Yellow";
    ctx.fillRect(current.pos.x, current.pos.y, cellWidth, cellWidth);
  }

}

function removeWall(a, b){

  var x = a.coor.x - b.coor.x;
  if(x == -1){
    a.walls.right = false;
    b.walls.left = false;
  } else if(x == 1){
    a.walls.left = false;
    b.walls.right = false;
  }

  var y = a.coor.y - b.coor.y;
  if(y == -1){
    a.walls.down = false;
    b.walls.up = false;
  } else if(y == 1){
    a.walls.up = false;
    b.walls.down = false;
  }

}
