/*
 * Tests the _aux.js module
 */

 const aux = require('../../objects/_aux.js'); // todo : Improve this finding the absolute root 

 test('getRndInteger checkbounds', () => {
   for (i = 0; i < 20; i++) {
     rnd = aux.getRndInteger(10, 50);
     expect(rnd).toBeGreaterThanOrEqual(10);
     expect(rnd).toBeLessThanOrEqual(50);
     
     // corner cases
     expect(aux.getRndInteger(10, 3)).toThrow;
   }
   
 });

 test('rotate check', () => {
   expect(aux.rotate(0, 0, 0)).toEqual([0, 0]);
 });