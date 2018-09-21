/*
 * Tests the bullet.js module
 */

const Bullet = require('../../objects/bullet.js'); // todo : Improve this finding the absolute root 

test('objects/bullet: class Bullet - constructor', () => {
  let bullet_test = new Bullet(200, 450, 10, 45, 1337, 300000000);
  expect(bullet_test.x).toBe(200);
  expect(bullet_test.y).toBe(450);
  expect(bullet_test.z).toBe(10);
  expect(bullet_test.angle).toBe(45);
  expect(bullet_test.creator).toBe(1337);
  expect(bullet_test.speed).toBe(300000000);
 });

 test('objects/bullet: addPos() - sucess', () => {
  let bullet_test = new Bullet(200, 450, 10, 45, 1337, 300000000);
  bullet_test.addPos(30, 70);
  expect(bullet_test.x).toBe(230);
  expect(bullet_test.y).toBe(520);
 });
 
 test('objects/bullet: addPos() - fail', () => {
  let bullet_test = new Bullet(200, 450, 10, 45, 1337, 300000000);
  bullet_test.addPos(30, 70);
  expect(bullet_test.x).not.toBe(200);
  expect(bullet_test.y).not.toBe(450);
 });
 
 test('objects/bullet: updatePos() - sucess', () => {
  let bullet_test = new Bullet(200, 450, 10, 0, 1337, 300000000);
  bullet_test.updatePos(0.1);
  expect(bullet_test.x).toBe(200);
  expect(bullet_test.y).toBe(-29999550);
  expect(bullet_test.zSpeed).toBeCloseTo(-1.568);
  expect(bullet_test.z).toBe(9.8432);
 });
 
 test('objects/bullet: updatePos() - fail', () => {
  let bullet_test = new Bullet(200, 450, 10, 0, 1337, 300000000);
  bullet_test.updatePos(0.1);
  expect(bullet_test.x).not.toBe(956378);
  expect(bullet_test.y).not.toBe(4387568);
  expect(bullet_test.zSpeed).not.toBeCloseTo(23846782);
  expect(bullet_test.z).not.toBe(286782);
 });
 