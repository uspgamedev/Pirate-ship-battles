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

//needed for physics update
// var startTime = (new Date).getTime();
// var lastTime;
// var timeStep = 1/70;

// create a new game instance
var game = {
	// List of players in the game
	player_list: {},
	// Food object list
	food_list: {},
	// The max number of foods in the game
	food_max: 100,
	// Size of the food list
	food_len: 0,
	// Game height
	canvas_height: 4000,
	// Game width
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
		this.powerup = 0;
	}
}

// Returns a random integer between min and max
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

// Create the foods there are missing at the game
function addFood() {
	var n = game.food_max - game.food_len;
	for (var i = 0; i < n; i++) {
		var unique_id = unique.v4(); // Creates a unique id
		var foodentity = new Item(game.canvas_width, game.canvas_height,
								  'food', unique_id);
		game.food_list[unique_id] = foodentity;
		io.emit("item_update", foodentity);
		game.food_len++;
		console.log("Item added " + game.food_len + "/" + game.food_max);
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

	this.emit('create_player', data);

	var current_info = {
		id: newPlayer.id,
		x: newPlayer.x,
		y: newPlayer.y,
		angle: newPlayer.angle,
		size: newPlayer.size
	};

	for (let k in game.player_list) {
		existingPlayer = game.player_list[k];
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

	for (let k in game.food_list)
		this.emit('item_update', game.food_list[k]);

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

// Called when players collide
function onPlayerCollision (data) {

	if (!(this.id in game.player_list) || !(data.id in game.player_list))
		return;

	var movePlayer = game.player_list[this.id];
	var enemyPlayer = game.player_list[data.id];

	if (movePlayer.dead || enemyPlayer.dead)
		return;

	if (movePlayer.size == enemyPlayer.size)
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

// Called when an item is picked
function onItemPicked (data) {
	var movePlayer = game.player_list[this.id];

	if (!(data.id in game.food_list)) {
		console.log(data);
		console.log("could not find object");
		this.emit("itemremove", { id: data.id });
		return;
	}
	var object = game.food_list[data.id];

	//increase player size
	movePlayer.size += 3;
	//broadcast the new size
	this.emit("gained", {new_size: movePlayer.size});

	delete game.food_list[data.id];
	game.food_len--;
	console.log("item picked");

	io.emit('itemremove', object);

	addFood();
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

// Prepare the foods
addFood();
