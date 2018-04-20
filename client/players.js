
var enemies = {};
var player;

const LABEL_DIFF = 45;

class Player {
	constructor(scene, x, y, username) {
		this.text = scene.add.text(x, y - LABEL_DIFF, username, {fill: "black"});
		this.body = scene.physics.add.image(x, y, "player");
		this.text.setOrigin(0.5);
		this.body.setOrigin(0.5);
		this.body.setCircle(32, -16, 0);
		// this.body.setSize(32, 32, true);
		this.size = 0;
		scene.physics.world.enable(this.body);
		//this.body.body.setCollideWorldBounds(true);
		this.body.angle = 90;
	}

	update(data) {
		this.body.x = data.x;
		this.body.y = data.y;
		this.text.x = data.x;
		this.text.y = data.y - LABEL_DIFF;
		this.body.setVelocity(Math.sin(data.angle)*data.speed, -Math.cos(data.angle)*data.speed);
		this.body.angle = data.angle*180/Math.PI;
	}

	destroy() {
		this.body.destroy();
		this.text.destroy();
	}
};

class Enemy {
	constructor(scene, id, startx, starty) {
		this.id = id;
		this.body = scene.physics.add.image(startx, starty, "enemy");
		this.body.setOrigin(0.5);
		this.body.setCircle(32, -16, 0);
		scene.physics.world.enable(this.body);
		this.body.par_obj = this; // Just to associate this id with the image
	}

	update(data) {
		this.body.x = data.x;
		this.body.y = data.y;
		//this.text.x = data.x;
		//this.text.y = data.y - LABEL_DIFF;
		this.body.setVelocity(Math.sin(data.angle)*data.speed, -Math.cos(data.angle)*data.speed);
		this.body.angle = data.angle*180/Math.PI;
	}
};

function createPlayer(data) {
	player = new Player(this, data.x, data.y, data.username);
	this.cameras.main.startFollow(player.body);
}

function createEnemy (data) {
	var new_enemy = new Enemy(this, data.id, data.x, data.y);
	enemies[data.id] = new_enemy
	this.physics.add.collider(player.body, new_enemy.body, fight, null, this);

}

function player_coll (body, bodyB, shapeA, shapeB, equation) {
	console.log("collision");

	//the id of the collided body that player made contact with
	var key = body.sprite.id;
	//the type of the body the player made contact with
	var type = body.sprite.type;

	if (type == "player_body") {
		//send the player collision
		socket.emit('player_collision', {id: key});
	} else if (type == "food_body") {
		console.log("items food");
		socket.emit('item_picked', {id: key});
	}
}

function fight(player, enemy) {
	socket.emit("player_collision", {id: enemy.par_obj.id});
}

function pickup_food(player, food) {
	socket.emit("item_picked", {id: food.par_obj.id});
}
