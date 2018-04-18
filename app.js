var express = require('express');
//get the node-uuid package for creating unique id
var unique = require('node-uuid');

var app = express();
var serv = require('http').Server(app);

app.get('/',function(req, res) {
	res.sendFile(__dirname + '/client/index.html');
});
app.use('/client',express.static(__dirname + '/client'));

serv.listen({
	host: '127.0.0.1',
	port: 2000,
	exclusive: true
});
console.log("Server started.");

var player_lst = {};

//needed for physics update
var startTime = (new Date).getTime();
var lastTime;
var timeStep = 1/70;

// create a new game instance
var game_instance = {
	//The constant number of foods in the game
	food_num: 100,
	//food object list
	food_pickup: {},
	//size of food list
	food_len: 0,
	//game size height
	canvas_height: 4000,
	//game size width
	canvas_width: 4000
}

// Player class inside the server
class Player {
	constructor(startX, startY, startAngle, id, username) {
		this.id = id;
		this.username = username;
		this.x = startX;
		this.y = startY;
		this.angle = startAngle;
		this.speed = 5;
		this.sendData = true;
		this.size = getRndInteger(40, 100);
		this.dead = false;
	}
}

// Item class inside the server
class Item {
	constructor(max_x, max_y, type, id) {
		this.x = getRndInteger(10, max_x - 10);
		this.y = getRndInteger(10, max_y - 10);
		this.type = type;
		this.id = id;
		this.powerup;
	}
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

//We call physics handler 60fps.
setInterval(heartbeat, 1000/60);

function heartbeat () {
	//the number of food that needs to be generated
	//in this demo, we keep the food always at 100
	var food_generatenum = game_instance.food_num - game_instance.food_len;

	//add the food
	addfood(food_generatenum);
}

//create n number of foods to the game
function addfood(n) {
	for (var i = 0; i < n/2; i++) {
		//create the unique id using node-uuid
		var unique_id = unique.v4();
		var foodentity = new Item(game_instance.canvas_width,
								  game_instance.canvas_height,
								  'food', unique_id);
		game_instance.food_pickup[unique_id] = foodentity;
		//set the food data back to client
		io.emit("item_update", foodentity);
	}
	game_instance.food_len += n;
}

function onEntername (data) {
	this.emit('join_game', {username: data.username, id: this.id});
}

function onNewPlayer (data) {
	var newPlayer = new Player(data.x, data.y, data.angle,
							   this.id, data.username);

	console.log("created new player with id " + this.id);

	this.emit('create_player', data);

	var current_info = {
		id: newPlayer.id,
		x: newPlayer.x,
		y: newPlayer.y,
		angle: newPlayer.angle,
		size: newPlayer.size
	};

	for (let k in player_lst) {
		existingPlayer = player_lst[k];
		var player_info = {
			id: existingPlayer.id,
			username: existingPlayer.username,
			x: existingPlayer.x,
			y: existingPlayer.y,
			angle: existingPlayer.angle,
			size: existingPlayer.size
		};
		console.log("pushing player");
		this.emit("new_enemyPlayer", player_info);
	}

	for (let k in game_instance.food_pickup)
		this.emit('item_update', game_instance.food_pickup[k]);

	//send message to every connected client except the sender
	this.broadcast.emit('new_enemyPlayer', current_info);

	player_lst[this.id] = newPlayer;
}

function onInputFired(data) {
	var movePlayer = player_lst[this.id];

	if (movePlayer === undefined || movePlayer.dead || !movePlayer.sendData)
		return;

	//every 20ms, we send the data.
	setTimeout(function() {movePlayer.sendData = true}, 20);
	//we set sendData to false when we send the data.
	movePlayer.sendData = false;

	movePlayer.x += movePlayer.speed*data[0];
	movePlayer.y += movePlayer.speed*data[1];

	var info = {
		x: movePlayer.x,
		y: movePlayer.y
	};

	this.emit('input_recieved', info);

	var movePlayerData = {
		id: movePlayer.id,
		x: movePlayer.x,
		y: movePlayer.y
	};

	//send to everyone except sender
	this.broadcast.emit('enemy_move', movePlayerData);
}

function onPlayerCollision (data) {

	if (!(this.id in player_lst) || !(data.id in player_lst))
		return;

	var movePlayer = player_lst[this.id];
	var enemyPlayer = player_lst[data.id];

	if (movePlayer.dead || enemyPlayer.dead)
		return;

	if (movePlayer.size == enemyPlayer)
		return;

	//the main player size is less than the enemy size
	else if (movePlayer.size < enemyPlayer.size) {
		var gained_size = movePlayer.size / 2;
		enemyPlayer.size += gained_size;
		this.emit("killed");
		//provide the new size the enemy will become
		this.broadcast.emit('remove_player', {id: this.id});
		this.broadcast.to(data.id).emit("gained", {new_size: enemyPlayer.size});
		playerKilled(movePlayer);
	} else {
		var gained_size = enemyPlayer.size / 2;
		movePlayer.size += gained_size;
		this.emit('remove_player', {id: enemyPlayer.id});
		this.emit("gained", {new_size: movePlayer.size});
		this.broadcast.to(data.id).emit("killed");
		//send to everyone except sender.
		this.broadcast.emit('remove_player', {id: enemyPlayer.id});
		playerKilled(enemyPlayer);
	}

	console.log("someone ate someone!!!");
}

function onItemPicked (data) {
	var movePlayer = player_lst[this.id];

	if (!(data.id in game_instance.food_pickup)) {
		console.log(data);
		console.log("could not find object");
		return;
	}
	var object = game_instance.food_pickup[data.id];

	//increase player size
	movePlayer.size += 3;
	//broadcast the new size
	this.emit("gained", {new_size: movePlayer.size});

	delete game_instance.food_pickup[data.id];
	game_instance.food_len--;
	console.log("item picked");

	io.emit('itemremove', object);
}

function playerKilled (player) {
	if (player.id in player_lst)
		delete player_lst[player.id];

	player.dead = true;
}

//call when a client disconnects and tell the clients except sender to remove
//the disconnected player
function onClientDisconnect() {
	console.log('disconnect');

	if (this.id in player_lst)
		delete player_lst[this.id];

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
