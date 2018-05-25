//the box list
var box_pickup = {};

//bullets list
var bulletList = {};

// client bullet class
class Bullet {
	constructor(scene, id, creator, startx, starty, speed) {
        this.sizeX = 8;
		this.sizeY = 8;
		this.creator = creator;
		this.id = id;
		this.speed = speed;
		this.item = scene.physics.add.image(startx, starty, "bullet");
        this.item.setDisplaySize(this.sizeX, this.sizeY);
		//this.item.setOrigin(0.5);
		//this.item.setCircle(1, 4, 4);
		this.item.par_obj = this; // Just to associate this id with the image
	}

	update(data) {
		this.item.x = data.x;
		this.item.y = data.y;
		this.item.setVelocity(Math.sin(data.angle)*this.speed, -Math.cos(data.angle)*this.speed);
		this.item.angle = data.angle*180/Math.PI;
		//console.log(data);
		//console.log(this.item.x);
	}
};

// client box class
class Box {
	constructor(scene, id, startx, starty) {
        this.sizeX = 16;
		this.sizeY = 16;
		this.id = id;
		this.item = scene.add.image(startx, starty, "box");
        this.item.setDisplaySize(this.sizeX, this.sizeY);
        this.item.setSize(this.sizeX, this.sizeY);
		this.item.par_obj = this; // Just to associate this id with the image
	}
};

// function called when new box is added at the server.
function onItemUpdate (data) {
	var new_box = new Box(this, data.id, data.x, data.y);
	box_pickup[data.id] = new_box;
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

// function called when new bullet is added at the server.
function onBulletUpdate (data) {
	var new_bullet = new Bullet(this, data.id, data.creator, data.x, data.y, data.speed);
	bulletList[data.id] = new_bullet;
}

// function called when bullet needs to be removed at the client.
function onBulletRemove (data) {

	if (!(data.id in bullet_list)) {
		console.log("Could not find bullet to remove");
		return;
	}

	console.log("Removed: ");
	console.log(data);
	//destroy the phaser object
	bullet_list[data.id].item.destroy();

	delete bullet_list[data.id];
}
