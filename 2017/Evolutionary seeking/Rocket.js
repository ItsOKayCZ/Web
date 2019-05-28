var mutPer = 0.1;

function Rocket(position, dna) {

  var minSpeed = 2;
  if (position == undefined) {
    this.pos = Math.createVector(
      Math.randomFloat(0 + border, c.width - border),
      Math.randomFloat(0 + border, c.height - border)
    );
  } else {
    this.pos = position;
  }
  var dir = Math.radians(Math.randomFloat(0, 360));
  this.vel = Math.createVector(Math.cos(dir) * minSpeed, Math.sin(dir) * minSpeed);

  this.heading = 0;
  this.height = 18;

  this.health = 1;
  this.deHealth = 0.004;
  this.heal = 0.25;
  this.deHeal = 0.5;

  this.clonePer = 0.001;

  this.speed = 2;

  this.maxWeight = 1.25;

  this.minDist = 15;

  this.dna = [];
  if (dna == undefined) {
    this.dna = [
      { // Attraction
        weight: Math.randomFloat(-this.maxWeight, this.maxWeight),
        distance: Math.randomFloat(this.minDist - this.minDist / 3, 200),
    },
      { // Repulsion
        weight: Math.randomFloat(-this.maxWeight, this.maxWeight),
        distance: Math.randomFloat(this.minDist - this.minDist / 3, 200)
      }
    ];
  } else {

    this.dna = [
      { // Attraction
        weight: Math.randomFloat(0, 1) <= mutPer ? Math.randomFloat(-this.maxWeight, this.maxWeight) : dna[0].weight,

        distance: Math.randomFloat(0, 1) <= mutPer ? Math.randomFloat(-this.maxWeight, this.maxWeight) : dna[0].distance
      },
      {
        weight: Math.randomFloat(0, 1) <= mutPer ? Math.randomFloat(-this.maxWeight, this.maxWeight) : dna[1].weight,

        distance: Math.randomFloat(0, 1) <= mutPer ? Math.randomFloat(-this.maxWeight, this.maxWeight) : dna[1].distance
      }
    ];

  }

  this.outWindowWeight = 0.5;

  this.target = false;
  this.deAcc = 0.99;

}

Rocket.prototype.render = function () {

  if (this.health >= 0) {

    ctx.strokeStyle = "White";

    ctx.save();

    ctx.translate(this.pos.x, this.pos.y);
    ctx.rotate(Math.atan2(this.vel.y, this.vel.x) + Math.radians(90));
    ctx.globalAlpha = this.health;

    ctx.beginPath();
    ctx.moveTo(0 - this.height, 0 + this.height);
    ctx.lineTo(0 + this.height, 0 + this.height);
    ctx.lineTo(0, 0 - this.height);
    ctx.lineTo(0 - this.height, 0 + this.height);
    ctx.stroke();

    if (debug) {

      ctx.strokeStyle = "#16f702";
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, 0 - (this.dna[0].weight) * 20);
      ctx.stroke();

      ctx.strokeStyle = "#f70202";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, 0 - (this.dna[1].weight) * 20);
      ctx.stroke();

    }

    ctx.restore();

    if (debug) {

      ctx.save();

      ctx.globalAlpha = this.health;

      ctx.strokeStyle = "#16f702";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(this.pos.x, this.pos.y, Math.abs(this.dna[0].distance), 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = "#f70202";
      ctx.beginPath();
      ctx.arc(this.pos.x, this.pos.y, Math.abs(this.dna[1].distance), 0, Math.PI * 2);
      ctx.stroke();

      ctx.restore();

    }

  }

}

Rocket.prototype.outWindow = function () {

  if (this.pos.x > c.width - border) {

    var pos = Math.createVector(c.width - border, this.pos.y);
    var angle = Math.atan2(this.pos.y - pos.y, this.pos.x - pos.x);

    var dsVel = Math.createVector(Math.cos(angle), Math.sin(angle));
    dsVel.mult(this.outWindowWeight);

  } else if (this.pos.x < 0 + border) {

    var pos = Math.createVector(0 + border, this.pos.y);
    var angle = Math.atan2(this.pos.y - pos.y, this.pos.x - pos.x);

    var dsVel = Math.createVector(Math.cos(angle), Math.sin(angle));
    dsVel.mult(this.outWindowWeight);

  }

  if (dsVel != undefined) {
    this.vel.x -= dsVel.x;

    dsVel = undefined;
  }

  if (this.pos.y > c.height - border) {

    var pos = Math.createVector(this.pos.x, c.height - border);
    var angle = Math.atan2(this.pos.y - pos.y, this.pos.x - pos.x);

    var dsVel = Math.createVector(Math.cos(angle), Math.sin(angle));
    dsVel.mult(this.outWindowWeight);

  } else if (this.pos.y < 0 + border) {

    var pos = Math.createVector(this.pos.x, 0 + border);
    var angle = Math.atan2(this.pos.y - pos.y, this.pos.x - pos.x);

    var dsVel = Math.createVector(Math.cos(angle), Math.sin(angle));
    dsVel.mult(this.outWindowWeight);

  }

  if (dsVel != undefined) {
    this.vel.y -= dsVel.y;
  }

}

Rocket.prototype.nearest = function (type) {

  var record = Infinity;
  var typeRecord = undefined;

  if (type == "food") {

    for (var i = 0; i < food.length; i++) {

      var dist = Math.distance(this.pos.x, this.pos.y, food[i].pos.x, food[i].pos.y);
      if (dist < record) {
        typeRecord = food[i];
        typeRecord.index = i;
        record = dist;
      }
    }

  } else {

    for (var i = 0; i < poison.length; i++) {

      var dist = Math.distance(this.pos.x, this.pos.y, poison[i].pos.x, poison[i].pos.y);
      if (dist < record) {
        typeRecord = poison[i];
        typeRecord.index = i;
        record = dist;
      }

    }

  }

  if (typeRecord != undefined) {
    return typeRecord;
  }
}

Rocket.prototype.attract = function () {

  var f = this.nearest("food");

  if (f != undefined) {

    var distance = Math.distance(this.pos.x, this.pos.y, f.pos.x, f.pos.y);
    if (distance > this.minDist) {

      if (distance <= this.dna[0].distance) {

        var angle = Math.atan2(this.pos.y - f.pos.y, this.pos.x - f.pos.x);

        var dsVel = Math.createVector(Math.cos(angle), Math.sin(angle));

        if (distance <= this.dna[0].distance) {

          var speed = Math.normalize(distance, 0, this.dna[0].distance, 0, this.speed);
          dsVel.mult(speed);

        } else {
          dsVel.mult(this.speed);
        }

        dsVel.mult(this.dna[0].weight);

        this.vel.sub(dsVel);
        this.target = true;

      } else {
        this.target = false;
      }

    } else {
      this.target = false;
      this.addHealth(f.index);
    }

  }

  for (var i = 0; i < food.length; i++) {
    if (Math.distance(this.pos.x, this.pos.y, food[i].pos.x, food[i].pos.y) <= this.minDist) {
      this.target = false;
      this.addHealth(i);
    }
  }

}

Rocket.prototype.repulsion = function () {


  var p = this.nearest("poison");

  if (p != undefined) {

    var distance = Math.distance(this.pos.x, this.pos.y, p.pos.x, p.pos.y);
    if (distance > this.minDist) {

      if (distance <= this.dna[1].distance) {

        var angle = Math.atan2(this.pos.y - p.pos.y, this.pos.x - p.pos.x);

        var dsVel = Math.createVector(Math.cos(angle), Math.sin(angle));

        if (distance <= this.dna[1].distance) {

          var speed = Math.normalize(distance, 0, this.dna[1].distance, 0, this.speed);
          dsVel.mult(speed);

        } else {
          dsVel.mult(this.speed);
        }

        dsVel.mult(this.dna[1].weight);

        this.vel.sub(dsVel);
        this.target = true;

      } else {
        this.target = false;
      }

    } else {
      this.target = false;
      this.removeHealth(p.index);
    }

  }

  for (var i = 0; i < poison.length; i++) {
    if (Math.distance(this.pos.x, this.pos.y, poison[i].pos.x, poison[i].pos.y) <= this.minDist) {
      this.target = false;
      this.removeHealth(i);
    }
  }

}

Rocket.prototype.addHealth = function (index) {

  this.health += this.heal;
  food.splice(index, 1);

}

Rocket.prototype.removeHealth = function (index) {

  this.health -= this.deHeal;
  poison.splice(index, 1);

}

Rocket.prototype.dead = function () {

  food.push(new Food(this.pos.x, this.pos.y));
  deleteRocket(this.pos);

}

Rocket.prototype.clone = function () {

  if (Math.randomFloat(0, 1) <= this.clonePer) {
    makeRocket(this.dna);
  }

}

Rocket.prototype.update = function () {

  this.clone();

  if (this.health <= 0) {

    this.dead();

  } else {

    this.outWindow();
    this.attract();
    this.repulsion();

    this.pos.add(this.vel);

    if (this.target) {
      this.vel.mult(this.deAcc);
      this.target = false;
    } else {

      var direction = Math.atan2(this.vel.y, this.vel.x);
      this.vel = Math.createVector(Math.cos(direction), Math.sin(direction));
      this.vel.mult(this.speed);
      this.target = false;

    }

    this.health -= this.deHealth;

  }
}
