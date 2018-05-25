const express = require('express');
const unique = require('node-uuid');
const SAT = require('sat');
const Player = require('./objects/player.js');
const Box = require('./objects/box.js');

let app = express();
let serv = require('http').Server(app);

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});
app.use('/client', express.static(__dirname + '/client'));

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

var counter = 0;

// create a new game instance
const game = {
    // List of players in the game
    playerList: {},
    /** @type Bullet[]*/
    bulletList: {},
    // boxes object list
    boxList: {},
    // The max number of pickable boxes in the game
    boxesMax: 100,
    // Size of the boxes list
    numOfBoxes: 0,
    // Game height
    canvasHeight: 4000,
    // Game width
    canvasWidth: 4000
};

setInterval(updateGame, 1000 * UPDATE_TIME);

function updateGame() {
    // Update players
    for (let k in game.playerList) {
        if (!(k in game.playerList))
            continue;
        let p = game.playerList[k];
        p.accel = -Math.max(DRAG_CONST*Math.pow(p.speed, DRAG_POWER), 0);
        p.accel += (p.inputs.up)? MAX_ACCEL : 0;
        p.speed += p.accel*UPDATE_TIME;
        p.addPos(Math.sin(p.angle)*p.speed*UPDATE_TIME, -Math.cos(p.angle)*p.speed*UPDATE_TIME);
        let ratio = p.speed/Math.pow(MAX_ACCEL/DRAG_CONST, 1/DRAG_POWER);
        p.addAngle((p.inputs.right)? ratio*ANGULAR_VEL*UPDATE_TIME : 0);
        p.addAngle((p.inputs.left)? -ratio*ANGULAR_VEL*UPDATE_TIME : 0);

        /** @type Bullet */
        let newBullet = null;
        if (p.inputs.shootLeft) {
            newBullet = p.tryToShoot(false);
        }
        if (p.inputs.shootRight) {
            newBullet = p.tryToShoot(true);
        }
        if (newBullet) {
            game.bulletList[newBullet.id] = newBullet;
            io.emit("bullet_update", newBullet)
        }
    }

    // Update bullets
    for (const kb in game.bulletList) {
        if (!(kb in game.bulletList))
            continue;
        let bullet = game.bulletList[kb];
        // TODO check bullet life and dissapear if too old

        // Move bullet
        let ds = bullet.speed * UPDATE_TIME
        bullet.addPos(Math.sin(bullet.angle) * ds, -Math.cos(bullet.angle) * ds);
    }

    // Do collisions
    for (const k1 in game.playerList) {
        let p1 = game.playerList[k1];
        for (const k2 in game.playerList) {
            p2 = game.playerList[k2];
            if (p2.id < p1.id)
                collidePlayers(p1, p2);
        }
        for (const kb in game.boxList)
            collidePlayerAndBox(p1, game.boxList[kb]);

        for (const kb in game.bulletList)
            collidePlayerAndBullet(p1, game.bulletList[kb]);
    }

    io.emit("update_game", {playerList: game.playerList, bulletList: game.bulletList});
}

// Create the pickable boxes there are missing at the game
function addBox() {
    let n = game.boxesMax - game.numOfBoxes;
    for (let i = 0; i < n; i++) {
        let unique_id = unique.v4(); // Creates a unique id
        let boxentity = new Box(game.canvasWidth, game.canvasHeight,
            'box', unique_id);
        game.boxList[boxentity.id] = boxentity;
        io.emit("item_update", boxentity);
        game.numOfBoxes++;
    }
}

// Called after the player entered its name
function onEntername(data) {
    this.emit('join_game', {username: data.username, id: this.id});
}

// Called when a new player connects to the server
function onNewPlayer(data) {
    let newPlayer = new Player(data.x, data.y, data.angle, this.id,
        data.username);

    console.log("created new player with id " + this.id);

    console.log(newPlayer);

    this.emit('create_player', data);

    let current_info = {
        id: newPlayer.id,
        x: newPlayer.x,
        y: newPlayer.y,
        angle: newPlayer.angle,
    };

    for (let k in game.playerList) {
        existingPlayer = game.playerList[k];
        let player_info = {
            id: existingPlayer.id,
            username: existingPlayer.username,
            x: existingPlayer.x,
            y: existingPlayer.y,
            angle: existingPlayer.angle,
        };
        console.log("pushing player");
        this.emit("new_enemyPlayer", player_info);
    }

    for (let k in game.boxList)
        this.emit('item_update', game.boxList[k]);

    for (let k in game.bulletList)
        this.emit('bullet_update', game.bulletList[k]);

    //send message to every connected client except the sender
    this.broadcast.emit('new_enemyPlayer', current_info);

    game.playerList[this.id] = newPlayer;
}

// Called when someone fired an input
function onInputFired(data) {
    let movePlayer = game.playerList[this.id];

    if (movePlayer === undefined || movePlayer.dead || !movePlayer.sendData)
        return;

    //every 20ms, we send the data.
    setTimeout(function () {
        movePlayer.sendData = true
    }, 60);
    //we set sendData to false when we send the data.
    movePlayer.sendData = false;

    movePlayer.inputs.up = data.up;
    movePlayer.inputs.left = data.left;
    movePlayer.inputs.right = data.right;
    movePlayer.inputs.shootLeft = data.shootLeft;
    movePlayer.inputs.shootRight = data.shootRight;
}

// Called when players collide
function collidePlayers (p1, p2) {
    if (!(p2.id in game.playerList) || !(p1.id in game.playerList)
        || p1.dead || p2.dead)
        return;
    if (SAT.testPolygonPolygon(p1.poly, p2.poly)) {
        console.log(`${counter}: ${p1.username} collided with ${p2.username}`);
        counter++;
    }
}

// Called when an item is picked
function collidePlayerAndBox (p1, bx) {

    if (!(p1.id in game.playerList) || !(bx.id in game.boxList))
        return;

    if (SAT.testPolygonPolygon(p1.poly, bx.poly)) {
        p1.bullets += bx.bullets;

        delete game.boxList[bx.id];
        game.numOfBoxes--;
        console.log("Box picked");

        io.emit('item_remove', bx);

        addBox();
    }
}

function collidePlayerAndBullet (p1, bullet) {
    if (!(p1.id in game.playerList) || !(bullet.id in game.bulletList)) {
        console.log("Returned");
        return;
    }

    if (bullet.creator == p1.id)
        return;

    if (SAT.testPolygonCircle(p1.poly, bullet.poly)) {
        delete game.bulletList[bullet.id];
        console.log(`Bullet hit ${p1.username}`);

        io.emit('bullet_remove', bullet);
        playerKilled(p1);
    }
}

// Called when a someone dies
function playerKilled(player) {
    console.log(`${player.username} died!`);
    if (player.id in game.playerList) {
        console.log(`${player.username} was removed`);
        delete game.playerList[player.id];
        io.emit('remove_player', player);
    }

    player.dead = true;
}

// Called when a client disconnects to tell the clients, except sender, to
// remove the disconnected player
function onClientDisconnect() {
    console.log('disconnect');
    if (this.id in game.playerList)
        delete game.playerList[this.id];

    console.log("removing player " + this.id);

    this.broadcast.emit('remove_player', {id: this.id});
}

// io connection
let io = require('socket.io')(serv,{});

io.sockets.on('connection', function(socket) {
    console.log("socket connected");
    socket.on('enter_name', onEntername);
    socket.on('logged_in', function(data){
        this.emit('enter_game', {username: data.username});
    });
    socket.on('disconnect', onClientDisconnect);
    socket.on("new_player", onNewPlayer);
    socket.on("input_fired", onInputFired);
});

// Prepare the boxes
addBox();
