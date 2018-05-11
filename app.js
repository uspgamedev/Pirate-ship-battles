const express = require('express');
//get the node-uuid package for creating unique id
var unique = require('node-uuid');

var app = express();
var serv = require('http').Server(app);

app.get('/',function(req, res) {
	res.sendFile(__dirname + '/index.html');
});
app.use('/client',express.static(__dirname + '/client'));

serv.listen({
	host: '0.0.0.0',
	port: 2000,
	exclusive: true
});
console.log("Server started.");

//needed for physics update
// var startTime = (new Date).getTime();
// var lastTime;
// var timeStep = 1/70;

const MAX_ACCEL = 30;
const DRAG_CONST = 0.1;
const UPDATE_TIME = 0.06;
const ANGULAR_VEL = 0.5;
const DRAG_POWER = 1.5;

// create a new game instance
var game = {
	// List of players in the game
	player_list: {},
	// boxes object list
	boxes_list: {},
	// The max number of pickable boxes in the game
	boxes_max: 100,
	// Size of the boxes list
	boxes_len: 0,
	// Game height
	canvas_height: 4000,
	// Game width
	canvas_width: 4000
};

// Player class inside the server
class Player {
	constructor(startX, startY, startAngle, id, username) {
		this.id = id;
		this.username = username;
		this.x = startX;
		this.y = startY;
		this.angle = Math.PI/2;
		this.speed = 0;
		this.accel = 0;
		this.ang_vel = 0;
		this.sendData = true;
		this.dead = false;
        this.bullets = 0;
        this.inputs = {
			up: false,
			left: false,
			right: false,
			shootLeft: false,
			shootRight: false
		};
	}
}

// Item class inside the server
class Item {
	constructor(max_x, max_y, type, id) {
        this.x = getRndInteger(100, max_x - 100);
		this.y = getRndInteger(100, max_y - 100);
        this.bullets = getRndInteger(1, 10);
		this.type = type;
		this.id = id;
	}
}

// Returns a random integer between min and max
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

setInterval(updateGame, 1000*UPDATE_TIME);

function updateGame() {
	for (var k in game.player_list) {
		var p = game.player_list[k];
		p.accel = -Math.max(DRAG_CONST*Math.pow(p.speed, DRAG_POWER), 0);
		p.accel += (p.inputs.up)? MAX_ACCEL : 0;
		p.speed += p.accel*UPDATE_TIME;
		p.x += Math.sin(p.angle)*p.speed*UPDATE_TIME;
		p.y -= Math.cos(p.angle)*p.speed*UPDATE_TIME;
		var ratio = p.speed/Math.pow(MAX_ACCEL/DRAG_CONST, 1/DRAG_POWER);
		p.angle += (p.inputs.right)? ratio*ANGULAR_VEL*UPDATE_TIME : 0;
		p.angle -= (p.inputs.left)? ratio*ANGULAR_VEL*UPDATE_TIME : 0;

		if (p.inputs.shootLeft) {
			console.log("Shoot Left");
		}
		if (p.inputs.shootRight) {
			console.log("Shoot Right");
		}
	}

	io.emit("update_game", game.player_list);
}

// Create the pickable boxes there are missing at the game
function addBox() {
	var n = game.boxes_max - game.boxes_len;
	for (var i = 0; i < n; i++) {
		var unique_id = unique.v4(); // Creates a unique id
		var boxentity = new Item(game.canvas_width, game.canvas_height,
								 'box', unique_id);
		game.boxes_list[unique_id] = boxentity;
		io.emit("item_update", boxentity); // MAYBE CHANGE THE FUNCTION DEPENDING OF WHAT I DO ON ITEM.JS
		game.boxes_len++;
	}
}

// Called after the player entered its name
function onEntername (data) {
	this.emit('join_game', {username: data.username, id: this.id});
}

// Called when a new player connects to the server
function onNewPlayer (data) {
	var newPlayer = new Player(data.x, data.y, data.angle, this.id,
							   data.username);

	console.log("created new player with id " + this.id);

	console.log(newPlayer);

	this.emit('create_player', data);

	var current_info = {
		id: newPlayer.id,
		x: newPlayer.x,
		y: newPlayer.y,
		angle: newPlayer.angle,
	};

	for (let k in game.player_list) {
		existingPlayer = game.player_list[k];
		var player_info = {
			id: existingPlayer.id,
			username: existingPlayer.username,
			x: existingPlayer.x,
			y: existingPlayer.y,
			angle: existingPlayer.angle,
		};
		console.log("pushing player");
		this.emit("new_enemyPlayer", player_info);
	}

	for (let k in game.boxes_list)
		this.emit('item_update', game.boxes_list[k]);

	//send message to every connected client except the sender
	this.broadcast.emit('new_enemyPlayer', current_info);

	game.player_list[this.id] = newPlayer;
}

// Called when someone fired an input
function onInputFired(data) {
	var movePlayer = game.player_list[this.id];

	if (movePlayer === undefined || movePlayer.dead || !movePlayer.sendData)
		return;

	//every 20ms, we send the data.
	setTimeout(function() {movePlayer.sendData = true}, 60);
	//we set sendData to false when we send the data.
	movePlayer.sendData = false;

	//movePlayer.x += movePlayer.speed*data[0];
	//movePlayer.y += movePlayer.speed*data[1];
	movePlayer.inputs.up = data.up;
	movePlayer.inputs.left = data.left;
	movePlayer.inputs.right = data.right;
	movePlayer.inputs.shootLeft = data.shootLeft;
	movePlayer.inputs.shootRight = data.shootRight;

	// var info = {
	// 	x: movePlayer.x,
	// 	y: movePlayer.y
	// };
	//
	// this.emit('input_recieved', info);
	//
	// var movePlayerData = {
	// 	id: movePlayer.id,
	// 	x: movePlayer.x,
	// 	y: movePlayer.y
	// };
	//
	// //send to everyone except sender
	// this.broadcast.emit('enemy_move', movePlayerData);
}

// Called when players collide
function onPlayerCollision (data) {

	if (!(this.id in game.player_list) || !(data.id in game.player_list))
		return;

	var movePlayer = game.player_list[this.id];
	var enemyPlayer = game.player_list[data.id];

	if (movePlayer.dead || enemyPlayer.dead)
		return;
}

// Called when an item is picked
function onItemPicked (data) {
	var movePlayer = game.player_list[this.id];

	if (!(data.id in game.boxes_list)) {
		console.log(data);
		console.log("could not find object");
		this.emit("itemremove", { id: data.id });
		return;
	}
	var object = game.boxes_list[data.id];

    movePlayer.bullets += object.bullets;

	delete game.boxes_list[data.id];
	game.boxes_len--;
	console.log("item picked");

	io.emit('itemremove', object);

	addBox();
}

// Called when a someone dies
function playerKilled (player) {
	if (player.id in game.player_list)
		delete game.player_list[player.id];

	player.dead = true;
}

// Called when a client disconnects to tell the clients, except sender, to
// remove the disconnected player
function onClientDisconnect() {
	console.log('disconnect');
	if (this.id in game.player_list)

		delete game.player_list[this.id];

	console.log("removing player " + this.id);

	this.broadcast.emit('remove_player', {id: this.id});
}

// io connection
var io = require('socket.io')(serv,{});

io.sockets.on('connection', function(socket) {
	console.log("socket connected");
	socket.on('enter_name', onEntername);
	socket.on('logged_in', function(data){
		this.emit('enter_game', {username: data.username});
	});
	socket.on('disconnect', onClientDisconnect);
	socket.on("new_player", onNewPlayer);
	socket.on("input_fired", onInputFired);
	socket.on("player_collision", onPlayerCollision);
	socket.on('item_picked', onItemPicked);
});

// Prepare the boxes
addBox();
