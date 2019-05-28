"use strict"
// The camera
var cam;
// The scene
var scene;
// The renderer
var r;
var player;
var platform;
var c;

var width = window.innerWidth;
var height = window.innerHeight;
var pause = false;

window.onload = function(){

  r = new THREE.WebGLRenderer({alpha: true});
  r.setSize(width, height);
  r.setClearColor(0x000000, 0);
  document.body.appendChild(r.domElement);

  cam = new THREE.PerspectiveCamera(75, width / height, 1, 10000);

  scene = new THREE.Scene();

  player = new Player();

  platform = new THREE.Mesh(new THREE.CubeGeometry(1000, 1, 1000), new THREE.MeshBasicMaterial({color: 0x34c82b}));
  platform.position.y -= player.widthY / 2;
  scene.add(platform);

  c = r.domElement;
  c.requestPointerLock = c.requestPointerLock || c.mozRequestPointerLock || c.webkitRequestPointerLock;
  c.onclick = function(){
    c.requestPointerLock();
  }

  update();

}

document.addEventListener("pointerlockchange", lockChange);
document.addEventListener("mozpointerlockchange", lockChange);
document.addEventListener("webkitpointerlockchange", lockChange);

function lockChange(){

  if(document.pointerLockElement === c
  || document.mozPointerLockElement === c
  || document.webkitPointerLockElement === c){
    document.addEventListener("mousemove", onMouseMove);
  } else {
    document.removeEventListener("mousemove", onMouseMove);
  }

}

function onMouseMove(e){

  player.mouseMoved({
    x: e.movementX || e.mozMovementX || e.webkitMovementX || 0,
    y: e.movementY || e.mozMovementY || e.webkitMovementY || 0
  });

}

window.onkeydown = function(e){

  if(e.key == "Enter"){
    if(pause){
      pause = false;
      console.log("Unpaused");
      update();
    } else {
      pause = true;
      console.log("Paused");
    }
  }

  if(e.code == "KeyW" || e.code == "KeyA" || e.code == "KeyS" || e.code == "KeyD" || e.code == "Space"){
    player.updateDir(e.code, true);
  }

}

window.onkeyup = function(e){

  if(e.code == "KeyW" || e.code == "KeyA" || e.code == "KeyS" || e.code == "KeyD" || e.code == "Space"){
    player.updateDir(e.code, false);
  }

}

function update(){

  if(!pause){

    window.requestAnimationFrame(update);

    player.update();
    r.render(scene, cam);

  }

}
