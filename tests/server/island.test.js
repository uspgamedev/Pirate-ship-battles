"test"////////////////////////////////////////////////////////////////////////////////
//                            Pirate Ship Battles                             //
//                                                                            //
//                          Tests - Server - Island                           //
////////////////////////////////////////////////////////////////////////////////

const Island = require('../../server/island.js');
const Player = require('../../server/player.js');

////////////////////////////////////////////////////////////////////////////////
test('server/island: class Island - constructor', () => {
  let p = new Island(1, 1, 1, "test", 10, 10);

  expect(new Island(1, 1, 1, "test", 10, 10)).toBeInstanceOf(Island);
  expect(p.x).toBe(1);
  expect(p.y).toBe(1);
  expect(p.radius).toBe(1);
  expect(p.type).toEqual("test");

  expect(new Island(-1, -1, -1, "test", 10, 10)).toThrow;
});

////////////////////////////////////////////////////////////////////////////////
test('server/island: onIsland()', () => {
  let p1 = new Player(2, 2, 0, 0, "test");
  let p2 = new Island(1, 1, 1, "test", 10, 10);

  p2.onIsland(p1);
  expect(p2.onIsland(p1)).toBe(false);
});
