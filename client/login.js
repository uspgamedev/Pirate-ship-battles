entername.onclick = function () {
	if (!gameProperties.inGame) {
		signDiv.style.display = 'none';
		console.log(`Player ${socket.id} entered name`);
		socket.emit('enter_name', {username: signdivusername.value});
	}
}

function join_game (data) {
	console.log(`Player ${socket.id} joined the game`);
	game.scene.start('Main', data.username);
}

class Login extends Phaser.Scene {
	constructor() {
		super({key: "Login"})
	}

	create() {
		signDiv.style.display = null;
		game.backgroundColor = "#AFF7F0";
		gameProperties.inGame = false;
		if (!LoginConnected) {
			// Everything here will execute just one time per client session
			socket.on('join_game', join_game.bind(this));
			LoginConnected = true;
		}
	}
}
