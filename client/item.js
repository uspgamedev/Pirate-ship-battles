////////////////////////////////////////////////////////////////////////////////
//                            Pirate Ship Battles                             //
//                                                                            //
//                              Client - Players                              //
////////////////////////////////////////////////////////////////////////////////

var boxList = {}; // The box list
var bulletList = {}; // Bullets list
var islandList = {}; // Islands list

////////////////////////////////////////////////////////////////////////////////
// Bullet                                                                     //
////////////////////////////////////////////////////////////////////////////////
// Client bullet class
class Bullet {
  constructor (scene, id, creator, x, y, z, speed) {
    this.sizeX = 10;
    this.sizeY = 10;
    this.creator = creator;
    this.id = id;
    this.speed = speed;
    this.z = z;
    this.zVelocity = 0;
    this.shadow = scene.physics.add.image(x, y, "bullet_shadow");
    this.item = scene.physics.add.image(x, toIsometric(y, z), "bullet");
    this.item.setDisplaySize(this.sizeX, this.sizeY);
    this.item.par_obj = this; // Just to associate this id with the image
  }

  //////////////////////////////////////////////////////////////////////////////
  update (data) {
    let iso_y = toIsometric(data.y);
    this.item.x = data.x;
    this.item.y = toIsometric(data.y, data.z);
    this.z = data.z;
    this.item.setVelocity(Math.sin(data.angle)*this.speed, -toIsometric(Math.cos(data.angle)*this.speed));
    this.item.setDepth(iso_y);
    this.shadow.x = data.x;
    this.shadow.y = iso_y;
    this.shadow.setVelocity(Math.sin(data.angle)*this.speed, -toIsometric(Math.cos(data.angle)*this.speed));
    this.shadow.setDepth(iso_y);
    // this.zVelocity -= G_ACCEL/1000;
    // this.z += this.zVelocity;
  }

  //////////////////////////////////////////////////////////////////////////////
  destroy () {
    this.item.destroy();
    this.shadow.destroy();
  }
};

////////////////////////////////////////////////////////////////////////////////
// Box                                                                        //
////////////////////////////////////////////////////////////////////////////////
// Client box class
class Box {
  constructor (scene, id, x, y) {
    this.sizeX = 20;
    this.sizeY = 20;
    this.id = id;
    this.item = scene.add.image(x, toIsometric(y), "barrel");
    this.item.setDisplaySize(this.sizeX, this.sizeY);
    this.item.setSize(this.sizeX, this.sizeY);
    this.item.par_obj = this; // Just to associate this id with the image
  }

  //////////////////////////////////////////////////////////////////////////////
  destroy () {
    this.item.destroy();
  }
};

////////////////////////////////////////////////////////////////////////////////
// Island                                                                        //
////////////////////////////////////////////////////////////////////////////////
// Client Island class
class Island {
  constructor (scene, id, x, y, r) {
    this.sizeX = 100;
    this.sizeY = 100;
    this.id = id;
    //this.island = scene.add.image(x, toIsometric(y), "barrel");
    //this.island.setDisplaySize(this.sizeX, this.sizeY);
    //this.island.setSize(this.sizeX, this.sizeY);
    //this.island.par_obj = this; // Just to associate this id with the image
  }

  //////////////////////////////////////////////////////////////////////////////
  destroy () {
    this.island.destroy();
  }
};

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
// Function called when new box is added at the server.
function onCreateItem (data) {
  if (!(data.id in boxList)) {
    let newBox = new Box(this, data.id, data.x, data.y, data.r);
    boxList[data.id] = newBox;
  }
}

////////////////////////////////////////////////////////////////////////////////
// Function called when box needs to be removed at the client.
function onItemRemove (data) {
  if (!(data.id in boxList)) {
    console.log("Could not find box to remove");
    return;
  }

  //destroy the phaser object
  boxList[data.id].destroy();

  delete boxList[data.id];
}

////////////////////////////////////////////////////////////////////////////////
// Function called when new island is added at the server.
function onCreateIsland (data) {
  if (!(data.id in islandList)) {
    console.log(`Criando ilha ${data.id}`);
    let newIsland = new Island(this, data.id, data.x, data.y, data.r);
    islandList[data.id] = newIsland;
  }
}

////////////////////////////////////////////////////////////////////////////////
// Function called when new bullet is added at the server.
function onCreateBullet (data) {
  if (!(data.id in bulletList)) {
    let newBullet = new Bullet(this, data.id, data.creator, data.x, data.y, data.z, data.speed);
    bulletList[data.id] = newBullet;
  }
}

////////////////////////////////////////////////////////////////////////////////
// Function called when bullet needs to be removed at the client.
function onBulletRemove (data) {
  if (!(data.id in bulletList)) {
    console.log("Could not find bullet to remove");
    return;
  }

  //destroy the phaser object
  bulletList[data.id].destroy();

  delete bulletList[data.id];
}

////////////////////////////////////////////////////////////////////////////////
