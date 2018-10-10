////////////////////////////////////////////////////////////////////////////////
//                            Pirate Ship Battles                             //
//                                                                            //
//                               Client - Util                                //
////////////////////////////////////////////////////////////////////////////////

const ISOMETRIC = true;
const ISO_ANGLE = (ISOMETRIC)? 0.61540852 /* 35.2603 degrees */ : Math.PI/2;
const ISO_SIN = Math.sin(ISO_ANGLE);
const ISO_COS = Math.cos(ISO_ANGLE);

////////////////////////////////////////////////////////////////////////////////
/** 
 * Receives the y and z coordinates of an object at the ortogonal grid and
 * returns the value of the object's y coordinate at an isometric grid with
 * angle ISO_ANGLE.
 */
function toIsometric (y, z=0) {
  return ISO_SIN*y - ISO_COS*(z - 1/ISO_SIN)
}

////////////////////////////////////////////////////////////////////////////////
/**
 * Modulo function for float values
 * Receives two numbers "num" and "mod" and returns the representative element
 * of the equivalence class of the remainder of "num" divided by "mod".
 */
function fmod (num, mod) {
  r = num%mod;
  return (r < 0)? r + mod : r;
}

////////////////////////////////////////////////////////////////////////////////
// Returns the sign of a number.
function sign (num) {
  return ((num < 0)? -1 : ((num > 0)? 1 : 0));
}

////////////////////////////////////////////////////////////////////////////////
// Receive a vector (x, y) and returns its norm squared.
function normSq (x, y) {
  return x*x + y*y;
}

////////////////////////////////////////////////////////////////////////////////
// Receives a vector (x, y) and returns its norm.
function norm (x, y) {
  return Math.sqrt(x*x + y*y);
}

////////////////////////////////////////////////////////////////////////////////
/** 
 * Returns the argmax of an array "array" according to the results of "avalFunc"
 * applied to each element of the array.
 */
function argMax (array, avalFunc=((x) => x)) {
  return array.map((x, i) => [avalFunc(x), x]).reduce((r, a) => (a[0] > r[0] ? a : r))[1];
}

////////////////////////////////////////////////////////////////////////////////

/** 
 * Get a vector (x, y) and a number "rad" and returns a vector pointing to the
 * same direction of (x, y) but with norm "rad".
 */
function clampRad (x, y, rad) {
  if (rad == 0)
    return [0, 0];
  let dist = norm(x, y);
  if (dist > rad) {
    let ratio = rad/dist;
    return [x*ratio, y*ratio];
  }
  return [x, y];
}

////////////////////////////////////////////////////////////////////////////////
/** 
 * Receives a vector (x, y) and a rectangle {x, y, w, h} and returns the nearest
 * point to (x, y) inside the rectangle.
 */
function clampRect (x, y, r) {
  return [Math.max(Math.min(x, r.x + r.w), r.x), Math.max(Math.min(y, r.y + r.h), r.y)];
}

////////////////////////////////////////////////////////////////////////////////
/** 
 * Receives a float "v" and two intervals, (fmin, fmax) and (imin, imax)
 * Let f be a linear function so that f(fmin) = imin and f(fmax) = imax
 * This function returns floor(f(v)).
 */
function mapFloatToInt (v, fmin, fmax, imin, imax) {
  return Math.floor((v - fmin)*(imax - imin)/(fmax - fmin) + imin);
}

////////////////////////////////////////////////////////////////////////////////
/** 
 * Returns true if the device that is running the game has touchscreen activated,
 * or false otherwise.
 */
function isTouchDevice () {
  if (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
    return true;
  }

  // include the 'heartz' as a way to have a non matching MQ to help terminate the join
  // https://git.io/vznFH
  let prefixes = ' -webkit- -moz- -o- -ms- '.split(' ');
  let query = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join('');
  return window.matchMedia(query).matches;
}

////////////////////////////////////////////////////////////////////////////////
