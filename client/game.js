var socket = io({transports: ['websocket'], upgrade: false});
var LoginConnected = false
var MainConnected = false

var config = {
	type: Phaser.CANVAS,
	width: window.innerWidth * window.devicePixelRatio,
	height: window.innerHeight * window.devicePixelRatio,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: 0,
			debug: false // TODO: Remove this at main branch
		}
	},
    backgroundColor: "#AFF7F0",
	scene: [Login, Main]
};

var game = new Phaser.Game(config);

const HALF_FRAME = Math.PI/16;
const G_ACCEL = 9.8;
