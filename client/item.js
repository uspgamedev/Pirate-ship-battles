//the box list
var box_pickup = {};

/*
// client bullet class
class Bullet {
	constructor(scene, id, type, startx, starty) {
        this.sizeX = 8; this.sizeY = 8;
		this.id = id;
		this.item = scene.add.image(startx, starty, "bullet");
        this.item.setDisplaySize(this.sizeX, this.sizeY);
        this.item.setSize(this.sizeX, this.sizeY);
		scene.physics.world.enable(this.item);
		this.item.par_obj = this; // Just to associate this id with the image
	}
};
*/

// client box class
class Box {
	constructor(scene, id, type, startx, starty) {
        this.sizeX = 16; this.sizeY = 16;
		this.id = id;
		this.item = scene.add.image(startx, starty, "box");
        this.item.setDisplaySize(this.sizeX, this.sizeY);
        this.item.setSize(this.sizeX, this.sizeY);
		scene.physics.world.enable(this.item);
		this.item.par_obj = this; // Just to associate this id with the image
	}
};

// function called when new box is added at the server.
function onItemUpdate (data) {
	var new_box = new Box(this, data.id, data.type, data.x, data.y);
	box_pickup[data.id] = new_box;
	this.physics.add.collider(player.body, new_box.item, pickup_box, null, this);
}

// function called when box needs to be removed at the client.
function onItemRemove (data) {

	if (!(data.id in box_pickup)) {
		console.log("Could not find item to remove");
		return;
	}

	console.log("Removed: ");
	console.log(data);
	//destroy the phaser object
	box_pickup[data.id].item.destroy();

	delete box_pickup[data.id];
}
