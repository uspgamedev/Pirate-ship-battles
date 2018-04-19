
var gameProperties = {
	gameWidth: 4000,
	gameHeight: 4000,
	game_elemnt: "gameDiv",
	in_game: false,
};

function onSocketConnected (data) {
	console.log("connected to server");
	gameProperties.in_game = true;
	var username = data.username;
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

function onInputRecieved(data) {
	player.move(data.x, data.y);
}

function onEnemyMove(data) {
	if (!(data.id in enemies)) {
		return;
	}

	var movePlayer = enemies[data.id];

	movePlayer.body.x = data.x;
	movePlayer.body.y = data.y;
}

function onGained (data) {
	player.scale = data.new_size;
}

function onKilled (data) {
	player.body.destroy();
}

class Main extends Phaser.Scene {

	constructor() {
		super({key: "Main"});
	}

	preload() {
		this.load.image("ball", "client/assets/ball.png");
		this.load.image("star", "client/assets/star.png");
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
		socket.on('input_recieved', onInputRecieved);
		socket.on('killed', onKilled);
		socket.on('gained', onGained);
		socket.on ('itemremove', onItemRemove);
		socket.on('item_update', onItemUpdate.bind(this));

		this.key_W = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.key_A = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.key_S = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.key_D = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

		this.cameras.main.setBounds(0, 0, gameProperties.gameWidth,
									gameProperties.gameHeight);

	}

	update() {
		if (gameProperties.in_game) {
			var v = [0, 0];
			if (this.key_W.isDown)
				v[1] -= 1;
	        if (this.key_A.isDown)
				v[0] -= 1;
	        if (this.key_S.isDown)
				v[1] += 1;
	        if (this.key_D.isDown)
				v[0] += 1;
			if (v[0] != 0 || v[1] != 0)
				socket.emit('input_fired', v);
		}
	}

	colide(event) {
		console.log(event);
	}
}
