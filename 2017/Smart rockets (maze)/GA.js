var rockets = [];
var rocketsC = 200;
var lifeC = 0;
var lifeLen = 1500;
var maxFit = 0;
var rocketsCopy;
var nextGenC = 0;
var mutPer = 0.01;

function chooseParents(){

  var done = false;
  var parentADone = false;
  var parentBDone = false;
  while(!done){

    if(!parentADone){
      var parA = Math.randomInt(0, rocketsCopy.length - 1);
    }

    if(!parentBDone){
      var parB = Math.randomInt(0, rocketsCopy.length - 1);
    }

    if(Math.randomFloat(0, maxFit) <= rocketsCopy[parA].fit && !parentADone){
      parentADone = true;
    }

    if(Math.randomFloat(0, maxFit) <= rocketsCopy[parB].fit && !parentBDone){
      parentBDone = true;
    }

    if(parA == parB){
      parentADone = parentBDone = false;
    }

    if(parentADone && parentBDone){
      done = true;
    }

  }

  crossOver(parA, parB);
}

function mutation(genes){

  for(var i = 0; i < lifeLen; i++){

    if(Math.randomFloat(0, 1) < mutPer){

      var deg = Math.radians(Math.randomFloat(0, 360));
      var force = Math.randomFloat(rockets[nextGenC].minForce, rockets[nextGenC].maxForce);

      genes[i] = {
        x: Math.cos(deg) * force,
        y: Math.sin(deg) * force
      };

    }

  }

  return genes;
}

function crossOver(parA, parB){

  var genes = [];

  var r = Math.randomInt(0, 2);
  if(r == 0){

    var breakPoint = Math.randomInt(0, rockets.length - 1);

    for(var i = 0; i < lifeLen; i++){

      if(i < breakPoint){
        genes[i] = {
          x: rocketsCopy[parA].genes[i].x,
          y: rocketsCopy[parA].genes[i].y
        };
      } else {
        genes[i] = {
          x: rocketsCopy[parB].genes[i].x,
          y: rocketsCopy[parB].genes[i].y
        };
      }

    }

  } else if(r == 1){

    for(var i = 0; i < lifeLen; i++){

      if(i & 2 == 0){
        genes[i] = {
          x: rocketsCopy[parA].genes[i].x,
          y: rocketsCopy[parA].genes[i].y
        };
      } else {
        genes[i] = {
          x: rocketsCopy[parB].genes[i].x,
          y: rocketsCopy[parB].genes[i].y
        };
      }

    }

  } else {

    var breakPoint = Math.randomInt(0, rockets.length - 1);

    for(var i = 0; i < lifeLen; i++){

      if(i < breakPoint){
        genes[i] = {
          x: rocketsCopy[parB].genes[i].x,
          y: rocketsCopy[parB].genes[i].y
        };
      } else {
        genes[i] = {
          x: rocketsCopy[parA].genes[i].x,
          y: rocketsCopy[parA].genes[i].y
        };
      }

    }

  }

  genes = mutation(genes);
  rockets[nextGenC] = new Rocket(genes);
  nextGenC++;
}
