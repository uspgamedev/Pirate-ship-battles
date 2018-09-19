/*
 * Tests the death_circle.js object
 */

const Player = require('../../objects/player.js');
const aux = require('../../objects/_aux.js');

test('objects/player: class Player - constructor', () => {
    let p = new Player(0, 0, 0, 0, 'test');
    expect(p.id).toBe(0);
    expect(p.username).toBe('test');
    expect(p.x).toBe(0);
    expect(p.y).toBe(0);
    expect(p.angle).toBe(0);
});

test('objects/player: tryToShoot() bullets', () => {
    let p = new Player(0, 0, 0, 0, 'test');
    const p_shoot = jest.fn(p.tryToShoot(true));

    p.rightHoldStart =  Date.now() - aux.getRndInteger(0, 2000);
    p_shoot;
    expect(p_shoot).not.toHaveReturnedWith([]);
    expect(p.bullets).toBeGreaterThanOrEqual(7);

});

test('objects/player: tryToShoot() no bullets', () => {
    let p = new Player(0, 0, 0, 0, 'test');
    p.bullets = 0;
    const p_shoot = jest.fn(p.tryToShoot(true));

    p.rightHoldStart =  Date.now() - aux.getRndInteger(0, 2000);
    p_shoot;
    // Jest considers returning an empty list as
    // not returning.
    expect(p_shoot).not.toReturn;

});
