//the bullet list
var bullet_pickup = {};

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

// function called when new bullet is added at the server.
function onItemUpdate (data) {
	var new_bullet = new Bullet(this, data.id, data.type, data.x, data.y);
	bullet_pickup[data.id] = new_bullet;
	this.physics.add.collider(player.body, new_bullet.item, pickup_bullet, null, this);
}

// function called when bullet needs to be removed at the client.
function onItemRemove (data) {

	if (!(data.id in bullet_pickup)) {
		console.log("Could not find item to remove");
		return;
	}

	console.log("Removed: ");
	console.log(data);
	//destroy the phaser object
	bullet_pickup[data.id].item.destroy();

	delete bullet_pickup[data.id];
}
