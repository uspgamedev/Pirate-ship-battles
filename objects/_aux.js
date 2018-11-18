////////////////////////////////////////////////////////////////////////////////
//                            Pirate Ship Battles                             //
//                                                                            //
//                                Server - Aux                                //
////////////////////////////////////////////////////////////////////////////////

// Returns a random integer between min and max
function getRndInteger (min, max) {
  try {
    if (max < min) throw "max must be bigger than min";
    return Math.floor(Math.random() * (max - min + 1)) + min;
  } catch (err) {
    console.log("function getRndInteger: " + err);
  }
}

////////////////////////////////////////////////////////////////////////////////
function rotate (angle, x, y=0) {
  return [x*Math.cos(angle) - y*Math.sin(angle),
          x*Math.sin(angle) + y*Math.cos(angle)]
}


////////////////////////////////////////////////////////////////////////////////
function distSq (p1, p2) {
  let xdiff = p1.x - p2.x;
  let ydiff = p1.y - p2.y;
  return xdiff*xdiff + ydiff*ydiff;
}

////////////////////////////////////////////////////////////////////////////////
function mapFloatToInt (v, fmin, fmax, imin, imax) {
  return Math.floor((v - fmin)*(imax - imin)/(fmax - fmin) + imin);
}

module.exports = {getRndInteger: getRndInteger, rotate: rotate, distSq : distSq, mapFloatToInt : mapFloatToInt};
