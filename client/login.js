entername.onclick = function () {
	if (!gameProperties.in_game) {
		gameProperties.in_game = true;
		signDiv.style.display = 'none';
		socket.emit('enter_name', {username: signdivusername.value});
	}
}

function join_game (data) {
	game.scene.start('Main', data.username);
}

class Login extends Phaser.Scene {
	constructor() {
		super({key: "Login"})
	}

	create() {
		game.backgroundColor = "#AFF7F0";
		socket.on('join_game', join_game.bind(this));
	}
}
