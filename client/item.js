//the box list
var boxList = {};

//bullets list
var bulletList = {};

// client bullet class
class Bullet {
	constructor(scene, id, creator, startx, starty, speed) {
        this.sizeX = 10;
		this.sizeY = 10;
		this.creator = creator;
		this.id = id;
		this.speed = speed;
		this.item = scene.physics.add.image(startx, ISO_CONST*starty, "bullet");
        this.item.setDisplaySize(this.sizeX, this.sizeY);
		this.item.par_obj = this; // Just to associate this id with the image
	}

	update(data) {
		this.item.x = data.x;
		this.item.y = ISO_CONST*data.y;
		this.item.setVelocity(Math.sin(data.angle)*this.speed, -ISO_CONST*Math.cos(data.angle)*this.speed);
		this.item.setDepth(this.item.y);
		//this.item.angle = data.angle*180/Math.PI;
	}
};

// client box class
class Box {
	constructor(scene, id, startx, starty) {
        this.sizeX = 20;
		this.sizeY = 20;
		this.id = id;
		this.item = scene.add.image(startx, ISO_CONST*starty, "barrel");
        this.item.setDisplaySize(this.sizeX, this.sizeY);
        this.item.setSize(this.sizeX, this.sizeY);
		this.item.par_obj = this; // Just to associate this id with the image
	}
};

// function called when new box is added at the server.
function onCreateItem (data) {
	if (!(data.id in boxList)) {
		let newBox = new Box(this, data.id, data.x, data.y);
		boxList[data.id] = newBox;
	}
}

// function called when box needs to be removed at the client.
function onItemRemove (data) {

	if (!(data.id in boxList)) {
		console.log("Could not find box to remove");
		return;
	}

	//destroy the phaser object
	boxList[data.id].item.destroy();

	delete boxList[data.id];
}

// function called when new bullet is added at the server.
function onCreateBullet (data) {
	if (!(data.id in bulletList)) {
		let newBullet = new Bullet(this, data.id, data.creator, data.x, data.y, data.speed);
		bulletList[data.id] = newBullet;
	}
}

// function called when bullet needs to be removed at the client.
function onBulletRemove (data) {

	if (!(data.id in bulletList)) {
		console.log("Could not find bullet to remove");
		return;
	}

	//destroy the phaser object
	bulletList[data.id].item.destroy();

	delete bulletList[data.id];
}
