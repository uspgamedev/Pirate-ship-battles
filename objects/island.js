////////////////////////////////////////////////////////////////////////////////
//                            Pirate Ship Battles                             //
//                                                                            //
//                                Server - Island                             //
////////////////////////////////////////////////////////////////////////////////


const SAT = require('sat');
const unique = require('node-uuid');

module.exports = class Island {
  constructor (center_x, center_y, radius, type, max_x, max_y) {
    try {
      if (center_x < 0 || center_x >= max_x) throw "center_x must be non-negative or smaller than max_x";
      if (center_y < 0 || center_y >= max_y) throw "center_y must be non-negative or smaller than max_y";
      if (radius <= 0) throw "radius must be bigger than zero";

      this.center_x = center_x;
      this.center_y = center_y;
      this.radius = radius;
      this.type = type;
      this.id = unique.v4();
      this.restore_poly = new SAT.Circle(new SAT.Vector(this.center_x, this.center_y), 2 * radius);
      this.collision_poly = new SAT.Circle(new SAT.Vector(this.center_x, this.center_y), radius);
    } catch(err) {
      console.log("Island constructor: " + err);
    }
  }
  
  onIsland(player) {
    var delta_dist_x = player.x - this.center_x;
    var delta_dist_y = player.y - this.center_y;
    if (delta_dist_x**2 + delta_dist_y**2 < this.radius_sqr)
      return true;
    return false;
  }
}