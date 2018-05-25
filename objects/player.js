/**
 * Server-side Player class
 */

const SAT = require('sat');
const Bullet = require('./bullet.js');

module.exports = class Player {
    constructor(startX, startY, startAngle, id, username) {
        this.id = id;
        this.username = username;
        this.x = startX;
        this.y = startY;
        this.angle = Math.PI / 2;
        this.speed = 0;
        this.accel = 0;
        this.angularVel = 0; // Previously ang_vel, are we even using it?
        this.sendData = true;
        this.dead = false;
        this.bullets = 0;
        this.poly = new SAT.Polygon(new SAT.Vector(startX, startY), [
            new SAT.Vector(-32, -8),
            new SAT.Vector(-16, -15),
            new SAT.Vector(7, -15),
            new SAT.Vector(21, -11),
            new SAT.Vector(31, -3),
            new SAT.Vector(31, 2),
            new SAT.Vector(21, 10),
            new SAT.Vector(7, 14),
            new SAT.Vector(-16, 14),
            new SAT.Vector(-32, 7)
        ]);
        this.inputs = {
            up: false,
            left: false,
            right: false,
            shootLeft: false,
            shootRight: false
        };
        this.lastShootTimeLeft = 0;
        this.lastShootTimeRight = 0;
        this.shootIntervalLeft = 1000; // ms
        this.shootIntervalRight = 1000; // ms
    }

    /**
     * Attempts to shoot a bullet in the provided direction taking into account 
     * the last time it shot in the same direction.
     * @param {Boolean} rightSide whether the ship is shooting from the right side
     * @returns {Bullet} The bullet just created, or null if it can not shoot
     */
    tryToShoot(rightSide) {
        let canShoot = false; // TODO check ammo here
        
        if (rightSide) {
            if (this.lastShootTimeRight + this.shootIntervalRight < Date.now()) {
                canShoot = true;
                this.lastShootTimeRight = Date.now();
            }
        } else {
            if (this.lastShootTimeLeft + this.shootIntervalLeft < Date.now()) {
                canShoot = true;
                this.lastShootTimeLeft = Date.now();
            }
        }

        if (canShoot) {
            console.log('SHOOT');
            return new Bullet(this.x, this.y, this.angle + (rightSide ? 1 : -1) 
                              * Math.PI / 4, this.id, 100);
        } else {
            return null;
        }
    }

    addAngle(angle) {
        this.angle += angle;
        this.poly.setAngle(this.angle-Math.PI/2);
    }

    addPos(x, y) {
        this.x += x;
        this.y += y;
        this.poly.pos.x = this.x;
        this.poly.pos.y = this.y;
    }
};
