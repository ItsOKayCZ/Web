var closedSet = [];
var openSet = [];
var start;
var end;
var pfDone = false;
var path = [];

function findPath(){

  if(openSet.length > 0){

    var currentH = {
      f: Infinity
    };
    for(var i = 0; i < openSet.length; i++){
      if(currentH.f >= openSet[i].f){
        currentH = openSet[i];
      }
    }

    if(currentH.coor.x == end.coor.x && currentH.coor.y == end.coor.y){
      console.log("A* pathfinding done");
      pfDone = true;

      var temp = currentH;
      while(temp){
        path.push(temp);
        temp = temp.parent;
      }

      return;
    }

    removeFromArr(currentH);
    closedSet.push(currentH);
    var neighbors = currentH.findNeighbors();
    for(var i = 0; i < neighbors.length; i++){

      var n = neighbors[i];

      if(!doesInclude(closedSet, n)){

        var tempG = currentH.g + 1;

        var newPath = false;
        if(doesInclude(openSet, n)){

          if(tempG < n.g){

            n.g = tempG;
            newPath = true;

          }

        } else {

          n.g = tempG;
          openSet.push(n);
          newPath = true;

        }

        if(newPath){

          n.h = calcH(n.coor, end.coor);
          n.f = n.g + n.h;
          n.parent = currentH;

        }

      }

    }

  }

  ctx.globalAlpha = 0.5;
  for(var i = 0; i < openSet.length; i++){
    ctx.fillStyle = "Green";
    ctx.fillRect(openSet[i].pos.x, openSet[i].pos.y, cellWidth, cellWidth);
  }

  for(var i = 0; i < closedSet.length; i++){
    ctx.fillStyle = "Red";
    ctx.fillRect(closedSet[i].pos.x, closedSet[i].pos.y, cellWidth, cellWidth);
  }

  ctx.globalAlpha = 1;
}

function calcH(a, b){
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

function removeFromArr(el){

  for(var i = 0; i < openSet.length; i++){

    if(openSet[i].coor.x == el.coor.x && openSet[i].coor.y == el.coor.y){
      openSet.splice(i, 1);
      break;
    }

  }

}

function doesInclude(arr, el){

  for(var i = 0; i < arr.length; i++){

    if(el.coor.x == arr[i].coor.x && el.coor.y == arr[i].coor.y){
      return true;
    }

  }

  return false;
}

function drawPath(){

  ctx.globalAlpha = 0.75;
  ctx.strokeStyle = "#ffc82e";
  ctx.lineWidth = 4;
  ctx.beginPath();

  for(var i = 0; i < path.length; i++){
    var p = path[i];

    if(i == 0){
      ctx.moveTo(p.pos.x + cellWidth / 2, p.pos.y + cellWidth / 2);
    } else {
      ctx.lineTo(p.pos.x + cellWidth / 2, p.pos.y + cellWidth / 2);
    }

  }

  ctx.stroke();
  ctx.closePath();
  ctx.globalAlpha = 1;

}
