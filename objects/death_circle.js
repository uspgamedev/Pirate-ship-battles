/**
 * Server-side Death Circle class
 */
const SAT = require('sat');
const unique = require('node-uuid');

module.exports = class Death_Circle {
  constructor(center_x, center_y, radius, max_x, max_y) {
    try {
      if (center_x < 0 || center_x >= max_x) throw "center_x must be non-negative or smaller than max_x";
      if (center_y < 0 || center_y >= max_y) throw "center_y must be non-negative or smaller than max_y";
      if (radius <= 0) throw "radius must be bigger than zero";
      
      this.circle = new SAT.Circle(center_x, center_y, radius);
      this.center_x = center_x;
      this.center_y = center_y;
      this.radius = radius;
      this.radius_sqr = radius**2;
    }
    catch(err) {
      console.log("Death_Circle constructor: " + err);
    }  
  }  
  
  udpate_circle(new_center_x, new_center_y, new_radius) {
    try {
      if (new_center_x >= this.center_x) throw "new_center_x must be smaller than current center_x";
      if (new_center_y >= this.center_y) throw "new_center_y must be smaller than current center_y";
      if (new_radius >= this.r)
      this.center_x = new_center_x;
      this.center_y = new_center_y;
      this.radius = new_radius;
      this.radius_sqr = new_radius**2;
    }
    catch(err) {
      console.log("Death_Circle constructor: " + err);
    }  
  }  
  
  in_circle(player) {
    var del_dist_x = player.x - this.center_x;
    var del_dist_y = player - this.center_y;
    if (del_dist_x**2 + del_dist_y**2 < this.radius_sqr)
      return true;
    console.log("malandro_mon não ta no circulo");
    return false;  
  }

}
