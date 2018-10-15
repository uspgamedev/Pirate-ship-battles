// // NOT WORKING, PROBABLY BECAUSE room.js IS NOT WORKING
// // TO USE THIS FILE, JUST DISCOMMENT BY (CTRL + A --> CTRL + /)
// // IN OTHER WORDS, DELETE THE FIRST "//" FROM EACH LINE OF THIS FILE
//
// ////////////////////////////////////////////////////////////////////////////////
// //                            Pirate Ship Battles                             //
// //                                                                            //
// //                           Tests - Server - Room                            //
// ////////////////////////////////////////////////////////////////////////////////
//
//
// const Room = require('../../objects/room.js');
// const Player = require('../../objects/player.js');
//
// ////////////////////////////////////////////////////////////////////////////////
// test('objects/room: class Room - constructor', () => {
//   let p = new Room('test', 10, 2000, 2000, 1, 120);
//
//   expect(new Room('test', 10, 2000, 2000, 1, 120)).toBeInstanceOf(Room);
//   expect(p.type).toBe('test');
//   expect(p.canvasHeight).toBe(2000);
//   expect(p.canvasWidth).toBe(2000);
//   expect(p.delta).toBe(1);
//   expect(p.mod).toBe(120);
// });
//
// ////////////////////////////////////////////////////////////////////////////////
// test('objects/room: updateGame()', () => {
//   let p = new Room('test', 10, 2000, 2000, 1, 120);
//
//   expect(p.updateGame()).not.toReturn;
// });
//
// ////////////////////////////////////////////////////////////////////////////////
// test('objects/room: addBox()', () => {
//   let p = new Room('test', 10, 2000, 2000, 1, 120);
//
//   expect(p.addBox()).not.toReturn;
// });
//
// ////////////////////////////////////////////////////////////////////////////////
// test('objects/room: distSq()', () => {
//   let p = new Room('test', 10, 2000, 2000, 1, 120);
//   let p1 = new Player(5, 3, 0, 0, 'test');
//   let p2 = new Player(2, 1, 0, 0, 'test');
//
//   p.distSq(p1, p2);
//   expect(p.distSq()).toBe(13);
// });
//
// ////////////////////////////////////////////////////////////////////////////////
// test('objects/room: mapFloatToInt()', () => {
//   let p = new Room('test', 10, 2000, 2000, 1, 120);
//
//   expect(p.mapFloatToInt(1, 1, 2, 1, 1)).toBe(1);
// });
//
// ////////////////////////////////////////////////////////////////////////////////
// test('objects/room: colliding()', () => {
//   let p1 = new Room('test', 10, 2000, 2000, 1, 120);
//   let p2 = new Player(5, 3, 0, 0, 'test');
//
//   expect(p.colliding(p2)).toBe(true);
// });
//
// ////////////////////////////////////////////////////////////////////////////////
// test('objects/room: playerKilled()', () => {
//   let p1 = new Room('test', 10, 2000, 2000, 1, 120);
//   let p2 = new Player(5, 3, 0, 0, 'test');
//
//   expect(p1.playerKilled(p2)).not.toReturn;
// });
//
// ////////////////////////////////////////////////////////////////////////////////
// test('objects/room: onClientDisconnect()', () => {
//   let p = new Room('test', 10, 2000, 2000, 1, 120);
//
//   expect(p.onClientDisconnect()).not.toReturn;
// });
