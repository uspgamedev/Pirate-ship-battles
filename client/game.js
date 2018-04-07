var socket = io({transports: ['websocket'], upgrade: false});

var config = {
	type: Phaser.CANVAS,
	width: window.innerWidth * window.devicePixelRatio,
	height: window.innerHeight * window.devicePixelRatio,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: 0
		}
	},
    backgroundColor: "#AFF7F0",
	scene: [Login, Main]
};

var game = new Phaser.Game(config);
