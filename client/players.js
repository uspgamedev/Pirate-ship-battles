
var enemies = {};
var player;

class Player {
	constructor(scene, x, y, username) {
		var style = {fill: "black"};
		this.text = scene.add.text(x, y - 50, username, style);
		this.body = scene.physics.add.image(x, y, "ball");
		this.text.setOrigin(0.5);
	}

	move(x, y) {
		this.text.x = x;
		this.text.y = y - 50;
		this.body.x = x;
		this.body.y = y;
	}
};

class Enemy {
	constructor(scene, id, startx, starty) {
		this.id = id;
		this.body = scene.add.image(startx, starty, "enemy");

		// TODO: Add collisions
	}
};

function createPlayer(data) {
	player = new Player(this, data.x, data.y, data.username);

	// TODO: Add collisions
	// TODO: Make camera follow the player
}

function createEnemy (data) {
	var new_enemy = new Enemy(this, data.id, data.x, data.y);
	enemies[data.id] = new_enemy;
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
