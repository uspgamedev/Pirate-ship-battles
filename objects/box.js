/**
 * Server-side Box class
 */
const SAT = require('sat');
const unique = require('node-uuid');
const aux = require('./aux.js');

module.exports = class Box {
    constructor(max_x, max_y, type) {
        this.x = aux.getRndInteger(100, max_x - 100);
        this.y = aux.getRndInteger(100, max_y - 100);
        this.bullets = aux.getRndInteger(1, 10);
        this.type = type;
        this.id = unique.v4();
        this.poly = new SAT.Circle(new SAT.Vector(this.x, this.y), 9);
        // this.poly = new SAT.Polygon(new SAT.Vector(this.x, this.y), [
        //     new SAT.Vector(-10, -10),
        //     new SAT.Vector(-10, 10),
        //     new SAT.Vector(10, 10),
        //     new SAT.Vector(10, -10)
        // ]);
    }
}
