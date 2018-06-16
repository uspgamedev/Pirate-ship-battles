/**
 * Server-side Player class
 */

const SAT = require('sat');
const Bullet = require('./bullet.js');

const MAX_ACCEL = 30;
const DRAG_CONST = 0.1;
const ANGULAR_VEL = 0.5;
const DRAG_POWER = 1.5;
const BULLET_COOLDOWN = 1000; // ms
const DBHT = 500; // ms  // double bullet hold time
const TBHT = 1000; // ms  // triple bullet hold time

module.exports = class Player {
    constructor(startX, startY, startAngle, id, username) {
        this.id = id;
        this.username = username;
        this.x = startX;
        this.y = startY;
        this.angle = Math.PI / 2;
        this.speed = 0;
        this.accel = 0;
        this.sendData = true;
        this.dead = false;
        this.bullets = 10;
        this.life = 3;
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
        this.leftHoldStart = 0;
        this.rightHoldStart = 0;
        this.lastShootTimeLeft = 0;
        this.lastShootTimeRight = 0;
        this.shootIntervalLeft = BULLET_COOLDOWN;
        this.shootIntervalRight = BULLET_COOLDOWN;
    }

    /**
     * Attempts to shoot a bullet in the provided direction taking into account
     * the last time it shot in the same direction.
     * @param {Boolean} rightSide whether the ship is shooting from the right side
     * @returns {Bullet} The bullet just created, or null if it can not shoot
     */
    tryToShoot(rightSide) {
        if (this.bullets <= 0)
            return null;

        let canShoot = false;
        let numShots = 1;

        if (rightSide) {
            if (this.canShoot(true)) {
                canShoot = true;
                this.lastShootTimeRight = Date.now();
                if (this.bullets >= 3 && Date.now() - this.rightHoldStart > TBHT)
                    numShots = 3;
                else if (this.bullets >= 2 && Date.now() - this.rightHoldStart > DBHT)
                    numShots = 2;
            }
        } else {
            if (this.canShoot(false)) {
                canShoot = true;
                this.lastShootTimeLeft = Date.now();
                if (this.bullets >= 3 && Date.now() - this.leftHoldStart > TBHT)
                    numShots = 3;
                else if (this.bullets >= 2 && Date.now() - this.leftHoldStart > DBHT)
                    numShots = 2;
            }
        }

        if (canShoot) {
            this.bullets -= numShots;
            console.log(`SHOOT bullets left: ${this.bullets}`);
            let bullets = [new Bullet(this.x, this.y,
                                      this.angle + (rightSide ? 3 : -3) *
                                      Math.PI / 8, this.id, 100)];
            if (numShots >= 2) {
                bullets.push(new Bullet(this.x, this.y,
                             this.angle + (rightSide ? 4 : -4) * Math.PI / 8,
                             this.id, 100));
            }
            if (numShots == 3) {
                bullets.push(new Bullet(this.x, this.y,
                             this.angle + (rightSide ? 5 : -5) * Math.PI / 8,
                             this.id, 100));
            }
            return bullets;
        } else {
            return null;
        }
    }

    canShoot(rightSide) {
        if (rightSide && this.lastShootTimeRight + this.shootIntervalRight < Date.now())
            return true;
        if (!rightSide && this.lastShootTimeLeft + this.shootIntervalLeft < Date.now())
            return true;
        return false;
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

    updatePos(dt) {
        this.accel = -Math.max(DRAG_CONST*Math.pow(this.speed, DRAG_POWER), 0);
        this.accel += (this.inputs.up)? MAX_ACCEL : 0;
        this.speed += this.accel*dt;
        if (this.speed < 2 && this.accel < 2)
            this.speed = 0;
        this.addPos(Math.sin(this.angle)*this.speed*dt,
                    -Math.cos(this.angle)*this.speed*dt);
        let ratio = this.speed/Math.pow(MAX_ACCEL/DRAG_CONST, 1/DRAG_POWER);
        this.addAngle((this.inputs.right)? ratio*ANGULAR_VEL*dt : 0);
        this.addAngle((this.inputs.left)? -ratio*ANGULAR_VEL*dt : 0);
    }
};
