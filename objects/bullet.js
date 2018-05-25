/**
 * Server-side Bullet class
 */
let lastBulletId = 0;

module.exports = class Bullet {
    constructor(/** Number */ startX, /** Number */ startY, /** Number */ angle,
                /** Player ID */ creator, /** Number */ speed) {
        this.x = startX;
        this.y = startY;
        this.angle = angle;
        this.speed = speed;
        this.creator = creator;
        this.timeCreated = Date.now();
        this.id = ++lastBulletId;
    }
}