
var enemies = {};
var player;

class Player {
	constructor(scene, x, y, username) {
		var text = scene.add.text(0, -50, username, {fill: "black"});
		var image = scene.add.image(0, 0, "ball");
		text.setOrigin(0.5);
		this.body = scene.add.container(x, y, [image, text]);
	}

	move(x, y) {
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
	this.cameras.main.startFollow(player.body);

	// TODO: Add collisions
	// TODO: Make camera follow the player
}

function createEnemy (data) {
	enemies[data.id] = new Enemy(this, data.id, data.x, data.y);
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
