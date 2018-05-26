/**
 * Server-side Box class
 */
const SAT = require('sat');
const unique = require('node-uuid');

// Returns a random integer between min and max
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = class Box {
    constructor(max_x, max_y, type) {
        this.x = getRndInteger(100, max_x - 100);
        this.y = getRndInteger(100, max_y - 100);
        this.bullets = getRndInteger(1, 10);
        this.type = type;
        this.id = unique.v4();
        this.poly = new SAT.Polygon(new SAT.Vector(this.x, this.y), [
            new SAT.Vector(-8, -8),
            new SAT.Vector(-8, 8),
            new SAT.Vector(8, 8),
            new SAT.Vector(8, -8)
        ]);
    }
}
