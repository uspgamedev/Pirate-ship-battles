/*
 * Tests the aux.js module
 */

 const aux = require('../../objects/aux.js'); // todo : Improve this finding the absolute root 

 test('getRndInteger checkbounds', () => {
   expect(aux.getRndInteger(10, 50)).toBeGreaterThanOrEqual(10);
   expect(aux.getRndInteger(10, 50)).toBeLessThanOrEqual(50);
 });

 test('rotate check', () => {
   expect(aux.rotate(0, 0, 0)).toEqual([0, 0]);
 });