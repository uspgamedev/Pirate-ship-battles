////////////////////////////////////////////////////////////////////////////////
//                            Pirate Ship Battles                             //
//                                                                            //
//                          Tests - Server - Player                           //
////////////////////////////////////////////////////////////////////////////////

const Player = require('../../server/player.js');
const aux = require('../../server/_aux.js');

// Todo: position and angle related tests

////////////////////////////////////////////////////////////////////////////////
test('server/player: class Player - constructor', () => {
  let p = new Player(0, 0, 0, 0, 'test');
  expect(p.id).toBe(0);
  expect(p.username).toBe('test');
  expect(p.x).toBe(0);
  expect(p.y).toBe(0);
  expect(p.angle).toBe(0);
});

////////////////////////////////////////////////////////////////////////////////
test('server/player: tryToShoot() bullets', () => {
  let p = new Player(0, 0, 0, 0, 'test');
  const p_shoot = jest.fn(p.tryToShoot(true));

  p.rightHoldStart =  Date.now() - aux.getRndInteger(0, 2000);
  p_shoot;
  expect(p_shoot).not.toHaveReturnedWith([]);
  expect(p.bullets).toBeGreaterThanOrEqual(7);
});

////////////////////////////////////////////////////////////////////////////////
test('server/player: tryToShoot() no bullets', () => {
  let p = new Player(0, 0, 0, 0, 'test');
  p.bullets = 0;
  const p_shoot = jest.fn(p.tryToShoot(true));

  p.rightHoldStart =  Date.now() - aux.getRndInteger(0, 2000);
  p_shoot;
  // Jest considers returning an empty list as not returning.
  expect(p_shoot).not.toReturn;
});

////////////////////////////////////////////////////////////////////////////////
test('server/player: canShoot()', () => {
  let p = new Player(0, 0, 0, 0, 'test');
  let can = false;

  p.lastShootTimeRight =  Date.now() - 2000;
  can = p.canShoot(true);
  expect(can).toBe(true);

  p.lastShootTimeRight =  Date.now() + 6000;
  can = p.canShoot(true);
  expect(can).toBe(false);
});

////////////////////////////////////////////////////////////////////////////////
test('server/player: takeDamage()', () => {
  let p = new Player(0, 0, 0, 0, 'test');

  p.takeDamage(1, 1);
  expect(p.life).toBe(2);
  expect(p.invul_time).toBe(1);
});

////////////////////////////////////////////////////////////////////////////////
test('server/player: gainResource - life()', () => {
  let p = new Player(0, 0, 0, 0, 'test');

  p.gainResource(1, 1, "life");
  expect(p.life).toBe(4);
});

////////////////////////////////////////////////////////////////////////////////
test('server/player: gainResource - not life()', () => {
  let p = new Player(0, 0, 0, 0, 'test');

  p.gainResource(1, 1, "death");
  expect(p.bullets).toBe(13);
});
