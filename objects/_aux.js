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

module.exports = {getRndInteger: getRndInteger, rotate: rotate};

////////////////////////////////////////////////////////////////////////////////
