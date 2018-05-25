let gameProperties = {
	gameWidth: 4000,
	gameHeight: 4000,
	game_elemnt: "gameDiv",
	in_game: false,
}

function onSocketConnected (data) {
	console.log("connected to server");
	gameProperties.in_game = true;
	let username = data.username;
	socket.emit('new_player', {username: data.username, x: 50, y: 50, angle: 0});
}

function onRemovePlayer (data) {

	if (!(data.id in enemies)) {
		console.log('Player not found: ', data.id);
		return;
	}

	var removePlayer = enemies[data.id];
	removePlayer.body.destroy();
	delete enemies[data.id];
}

function onEnemyMove(data) {
	if (!(data.id in enemies)) {
		return;
	}

	var movePlayer = enemies[data.id];

	movePlayer.body.x = data.x;
	movePlayer.body.y = data.y;
}

function onKilled (data) {
	player.destroy();
}

/**
 * Process data received from the server
 * @param {{playerList: {},bulletList: []}} data
 */
function onUpdate(data) {
	for (const k in data.playerList) {
		if (k in enemies)
			enemies[k].update(data.playerList[k]);
		else
			player.update(data.playerList[k]);
	}
	for (const bullet of data.bulletList) {
		bulletList[bullet.id].update(bullet);
		//console.log(bulletList[bullet.id]); // TODO show bullets in the screen
    }
}

class Main extends Phaser.Scene {

	constructor() {
		super({key: "Main"});
	}

	preload() {
		this.load.image("player", "client/assets/player.png");
		this.load.image("bullet", "client/assets/cannon_ball.png");
        this.load.image("box", "client/assets/box.png");
		this.load.image("enemy", "client/assets/enemy.png");
    }

	create(username) {

		console.log("client started");
		socket.emit('logged_in', {username: username});

		socket.on('enter_game', onSocketConnected);
		socket.on("create_player", createPlayer.bind(this));
		socket.on("new_enemyPlayer", createEnemy.bind(this));
		socket.on("enemy_move", onEnemyMove);
		socket.on('remove_player', onRemovePlayer);
		socket.on('killed', onKilled);
		socket.on('itemremove', onItemRemove);
		socket.on('item_update', onItemUpdate.bind(this));
		socket.on('bullet_remove', onBulletRemove);
		socket.on('bullet_update', onBulletUpdate.bind(this));
		socket.on('update_game', onUpdate);

		this.key_W = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.key_A = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.key_S = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.key_D = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

        this.key_J = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J);
        this.key_K = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K);

		this.cameras.main.setBounds(0, 0, gameProperties.gameWidth,
									gameProperties.gameHeight);

	}

	update(dt) {
		if (gameProperties.in_game) {
			let data = {
				up: this.key_W.isDown,
				left: this.key_A.isDown,
				right: this.key_D.isDown,
				shootLeft: this.key_J.isDown,
				shootRight: this.key_K.isDown
			}
			socket.emit('input_fired', data);
		}
		//console.log(dt);
	}

	colide(event) {
		console.log(event);
	}
}
