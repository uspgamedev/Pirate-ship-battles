////////////////////////////////////////////////////////////////////////////////
//                            Pirate Ship Battles                             //
//                                                                            //
//                              Server - Bullet                               //
////////////////////////////////////////////////////////////////////////////////

const SAT = require('sat');
const unique = require('node-uuid');
const G_ACCEL = 9.8;

////////////////////////////////////////////////////////////////////////////////
// Box                                                                        //
////////////////////////////////////////////////////////////////////////////////
module.exports = class Bullet {
  constructor (/** Number */ startX, /** Number */ startY, /** Number */ startZ,
               /** Number */ angle, /** Player ID */ creator, /** Number */ speed) {
    this.x = startX;
    this.y = startY;
    this.z = startZ;
    this.angle = angle;
    this.speed = speed;
    this.zSpeed = 0;
    this.creator = creator;
    this.timeCreated = Date.now();
    this.poly = new SAT.Circle(new SAT.Vector(this.x, this.y), 10);
    this.id = unique.v4();
  }

  //////////////////////////////////////////////////////////////////////////////
  addPos (x, y) {
    this.x += x;
    this.y += y;
    this.poly.pos.x = this.x;
    this.poly.pos.y = this.y;
  }

  //////////////////////////////////////////////////////////////////////////////
  updatePos (dt) {
    this.addPos(Math.sin(this.angle) * this.speed * dt, -Math.cos(this.angle) * this.speed * dt);
    this.zSpeed -= G_ACCEL * dt * 1.6;
    this.z += this.zSpeed * dt;
  }
}

////////////////////////////////////////////////////////////////////////////////
