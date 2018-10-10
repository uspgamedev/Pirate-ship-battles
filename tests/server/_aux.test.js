////////////////////////////////////////////////////////////////////////////////
//                            Pirate Ship Battles                             //
//                                                                            //
//                            Tests - Server - Aux                            //
////////////////////////////////////////////////////////////////////////////////

const aux = require('../../objects/_aux.js'); // todo : Improve this finding the absolute root

////////////////////////////////////////////////////////////////////////////////
test('objects/_aux: getRndInteger()', () => {
  for (i = 0; i < 20; i++) {
    x = aux.getRndInteger(10, 50);
    expect(x).toBeGreaterThanOrEqual(10);
    expect(x).toBeLessThanOrEqual(50);
    x = aux.getRndInteger(-10, -5);
    expect(x).toBeGreaterThanOrEqual(-10);
    expect(x).toBeLessThanOrEqual(-5);
    expect(aux.getRndInteger(0, 0)).toBe(0);
  }
  expect(aux.getRndInteger(10, 3)).toThrow;
});

////////////////////////////////////////////////////////////////////////////////
test('objects/_aux: rotate()', () => {
  x = aux.rotate(Math.PI/2, 1, 2);
  expect(x[0]).toBeCloseTo(-2); expect(x[1]).toBeCloseTo(1);
  x = aux.rotate(Math.PI, 3, 4);
  expect(x[0]).toBeCloseTo(-3); expect(x[1]).toBeCloseTo(-4);
  x = aux.rotate(3*Math.PI/2, 5, 6);
  expect(x[0]).toBeCloseTo(6); expect(x[1]).toBeCloseTo(-5);
  x = aux.rotate(2*Math.PI, 7, 8);
  expect(x[0]).toBeCloseTo(7); expect(x[1]).toBeCloseTo(8);
});

////////////////////////////////////////////////////////////////////////////////
