////////////////////////////////////////////////////////////////////////////////
//                            Pirate Ship Battles                             //
//                                                                            //
//                       Tests - Server - Death Circle                        //
////////////////////////////////////////////////////////////////////////////////

const DeathCircle = require('../../objects/death_circle.js'); // todo : Improve this finding the absolute root
const Player = require('../../objects/player.js');

////////////////////////////////////////////////////////////////////////////////
// Constructs a valid DeathCircle
test('objects/death_circle: class DeathCircle - constructor - sucess', () => {
  let x = Math.floor(Math.random() * 2000);
  let y = Math.floor(Math.random() * 2000);
  let r = Math.floor(Math.random() * 500);

  let dc = new DeathCircle(x, y, r, 2000, 2000);

  expect(dc.center_x).toBe(x);
  expect(dc.center_y).toBe(y);
  expect(dc.radius).toBe(r);
});

////////////////////////////////////////////////////////////////////////////////
// Constructs a invalid DeathCircle, in all ways possible.
test('objects/death_circle: class DeathCircle - constructor - failure', () => {
  let temp_neg = Math.floor(Math.random() * -2000);
  let temp_bigger = Math.floor(Math.random() * 2000) + 2000;

  expect(new DeathCircle(temp_neg, 1000, 1000, 2000, 2000)).toThrow;
  expect(new DeathCircle(1000, temp_neg, 1000, 2000, 2000)).toThrow;
  expect(new DeathCircle(temp_bigger, 1000, 1000, 2000, 2000)).toThrow;
  expect(new DeathCircle(1000, temp_bigger, 1000, 2000, 2000)).toThrow;
  expect(new DeathCircle(1000, 1000, temp_neg, 2000, 2000)).toThrow;
});

////////////////////////////////////////////////////////////////////////////////
// Successfully updates de center and radius of a DeathCircle.
test('objects/death_circle: update_circle() - sucess', () => {
  let temp_x = Math.floor(Math.random() * 1000);
  let temp_y = Math.floor(Math.random() * 1000);
  let temp_r = Math.floor(Math.random() * 1000);

  let dc = new DeathCircle(temp_x, temp_y, temp_r, temp_x + 2000, temp_y + 2000);

  let new_temp_x = Math.floor(Math.random() * temp_x);
  let new_temp_y = Math.floor(Math.random() * temp_y);
  let new_temp_r = Math.floor(Math.random() * temp_r);

  dc.update_circle(new_temp_x, new_temp_y, new_temp_r);
  expect(dc.center_y).toBe(new_temp_y);
  expect(dc.center_x).toBe(new_temp_x);
  expect(dc.radius).toBe(new_temp_r);
});

////////////////////////////////////////////////////////////////////////////////
// Fails to update the DeathCircle in all ways that it could break.
test('objects/death_circle: update_circle() - failure', () => {
  let temp = Math.floor(Math.random() * 1000);
  let dc1 = new DeathCircle(temp, 1000, 1000, 2000, 2000);
  let dc2 = new DeathCircle(1000, temp, 1000, 2000, 2000);
  let dc3 = new DeathCircle(1000, 1000, temp, 2000, 2000);

  expect(dc1.update_circle(temp + 500, 1000, 1000)).toThrow;
  expect(dc2.update_circle(1000, temp + 500, 1000)).toThrow;
  expect(dc3.update_circle(1000, 1000, temp + 500)).toThrow;
});

////////////////////////////////////////////////////////////////////////////////
// Tests if we correctly say if a player is in the circle.
test('objects/death_circle: in_circle()', () => {
  let border = Math.floor(Math.random() * 5000);
  let center = Math.floor(Math.random() * border);
  let radius = Math.floor(Math.random() * 1000);

  let dc = new DeathCircle(center, center, radius, border, border);

  let inside_x = (center + radius) - Math.random() * radius;
  let inside_y = (center + radius) - Math.random() * radius;

  let outside_x = Math.random() * 1000 + (center + radius);
  let outside_y = Math.random() * 1000 + (center + radius);

  let inside_p = new Player(inside_x, inside_y, 0, 0, 'test1');
  let outside_p = new Player(outside_x, outside_y, 0, 0, 'test2');

  expect(dc.in_circle(inside_p)).toBe(true);
  expect(dc.in_circle(outside_p)).toBe(false);
});

////////////////////////////////////////////////////////////////////////////////
