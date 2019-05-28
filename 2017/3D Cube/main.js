"use strict"
// The camera
var cam;
// The scene
var scene;
// The renderer
var r;
var cube;

var width = window.innerWidth;
var height = window.innerHeight;
var pause = false;

window.onload = function(){

  r = new THREE.WebGLRenderer({alpha: true});
  r.setSize(width, height);
  r.setClearColor(0x000000, 0);
  document.body.appendChild(r.domElement);

  cam = new THREE.PerspectiveCamera(50, width / height, 1, 10000);
  cam.position.z = 500;

  scene = new THREE.Scene();

  cube = new THREE.Mesh(new THREE.CubeGeometry(150, 150, 150), new THREE.MeshNormalMaterial());
  scene.add(cube);

  update();

}

window.onkeydown = function(e){

  if(e.key == "Escape"){
    if(pause){
      pause = false;
      update();
    } else {
      pause = true;
    }
  }

}

function update(){

  if(!pause){

    window.requestAnimationFrame(update);

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    r.render(scene, cam);

  }

}
