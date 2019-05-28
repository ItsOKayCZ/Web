function Player(){

  this.widthX = 100;
  this.widthY = 200;
  this.widthZ = 100;
  this.speed = 5;
  this.sens = 0.001;
  this.jumping = false;
  this.gravity = 0.4;

  this.geo = new THREE.CubeGeometry(this.widthX, this.widthY, this.widthZ);
  this.mat = new THREE.MeshNormalMaterial();
  this.cube = new THREE.Mesh(this.geo, this.mat);
  scene.add(this.cube);

  this.camRot = Math.createVector(0, 0, 0);
  this.pos = this.cube.position;
  this.velY = 0;
  this.dirs = {
    left: false,
    right: false,
    forward: false,
    back: false,
    up: false
  };

  this.updateDir = function(dir, b){

    if(dir == "KeyW"){
      this.dirs.forward = b;
    }

    if(dir == "KeyS"){
      this.dirs.back = b;
    }

    if(dir == "KeyA"){
      this.dirs.left = b;
    }

    if(dir == "KeyD"){
      this.dirs.right = b;
    }

    if(dir == "Space"){
      this.dirs.up = b;
    }

  }

  this.mouseMoved = function(mouse){

    this.camRot.y -= mouse.x * this.sens;
    this.camRot.x -= mouse.y * this.sens;
    this.camRot.x = Math.max(-Math.PI * 2, Math.min(Math.PI * 2, this.camRot.x));

    if(this.camRot.x < Math.radians(-90)){
      this.camRot.x = Math.radians(-90);
    } else if(this.camRot.x > Math.radians(90)){
      this.camRot.x = Math.radians(90);
    }

    var rot = new THREE.Euler(this.camRot.x, this.camRot.y, 0, "YXZ");
    cam.setRotationFromEuler(rot);

  }

  this.updatePos = function(){

    if(this.dirs.forward){
      this.pos.x -= Math.sin(this.camRot.y) * this.speed;
      this.pos.z -= Math.cos(this.camRot.y) * this.speed;
    }

    if(this.dirs.back){
      this.pos.x -= Math.sin(this.camRot.y - Math.radians(180)) * this.speed;
      this.pos.z -= Math.cos(this.camRot.y - Math.radians(180)) * this.speed;
    }

    if(this.dirs.left){
      this.pos.x -= Math.sin(this.camRot.y - Math.radians(-90)) * this.speed;
      this.pos.z -= Math.cos(this.camRot.y - Math.radians(-90)) * this.speed;
    }

    if(this.dirs.right){
      this.pos.x -= Math.sin(this.camRot.y - Math.radians(90)) * this.speed;
      this.pos.z -= Math.cos(this.camRot.y - Math.radians(90)) * this.speed;
    }

    if(this.dirs.up){

      if(!this.jumping){
        this.jumping = true;
        this.velY = -this.speed * 2;
      }

    }

    this.velY += this.gravity;
    this.pos.y -= this.velY;

    if(this.pos.y - this.widthY / 2 < -100){
      this.pos.y = 0;
      this.jumping = false;
    }

    cam.position.x = this.pos.x;
    cam.position.y = this.pos.y + this.widthY / 2;
    cam.position.z = this.pos.z;

  }

  this.update = function(){

    this.updatePos();

  }

}
