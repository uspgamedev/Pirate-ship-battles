////////////////////////////////////////////////////////////////////////////////
//                            Pirate Ship Battles                             //
//                                                                            //
//                          Tests - Server - Island                           //
////////////////////////////////////////////////////////////////////////////////

const Stone = require('../../objects/stone.js');
const Player = require('../../objects/player.js');

////////////////////////////////////////////////////////////////////////////////
test('objects/island: class Island - constructor', () => {
  let p = new Stone(1, 1, 1, 10, 10);

  expect(new Stone(1, 1, 1, 10, 10)).toBeInstanceOf(Stone);
  expect(p.x).toBe(1);
  expect(p.y).toBe(1);
  expect(p.radius).toBe(1);

  expect(new Stone(-1, -1, -1, 10, 10)).toThrow;
});

////////////////////////////////////////////////////////////////////////////////
test('objects/stone: onStone()', () => {
  let p1 = new Player(2, 2, 0, 0, "test");
  let p2 = new Stone(1, 1, 1, 10, 10);

  p2.onStone(p1);
  expect(p2.onStone(p1)).toBe(false);
});
