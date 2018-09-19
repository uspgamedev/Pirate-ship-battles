/*
 * Tests the death_circle.js object
 */

const DeathCircle = require('../../objects/death_circle.js'); // todo : Improve this finding the absolute root
const Player = require('../../objects/player.js');

test('objects/death_circle: class DeathCircle - constructor', () => {
    let dc = new DeathCircle(1000, 1000, 1000, 2000, 2000);
    expect(dc.center_x).toBe(1000);
    expect(dc.center_y).toBe(1000);
    expect(dc.radius).toBe(1000);
});

test('objects/death_circle: update_circle() sucess', () => {
    let dc = new DeathCircle(1000, 1000, 1000, 2000, 2000);
    dc.update_circle(500, 500, 10);
    expect(dc.center_x).toBe(500);
    expect(dc.center_y).toBe(500);
    expect(dc.radius).toBe(10);

});

test('objects/death_circle: update_circle() failure', () => {
    let dc = new DeathCircle(1000, 1000, 1000, 2000, 2000);
    expect(dc.update_circle(1500, 1000, 1000)).toThrow;
    //dc.update_circle(1500, 1000, 1000);
});

test('objects/death_circle: in_circle()', () => {
    let dc = new DeathCircle(0, 0, 1000, 2000, 2000);
    let p1 = new Player(0, 0, 0, 0, 'test1');
    let p2 = new Player(5000, 5000, 0, 0, 'test2');

    expect(dc.in_circle(p1)).toBe(true);
    expect(dc.in_circle(p2)).toBe(false);
});
