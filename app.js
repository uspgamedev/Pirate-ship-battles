////////////////////////////////////////////////////////////////////////////////
//                            Pirate Ship Battles                             //
////////////////////////////////////////////////////////////////////////////////

const express = require('express');
const unique = require('node-uuid');
const SAT = require('sat');
const Player = require('./objects/player.js');
const Box = require('./objects/box.js');
const SafeZone = require('./objects/safe_zone.js');
const Island = require('./objects/island.js');
const Stone = require('./objects/stone.js');
const ScoreBoard = require('./objects/score_board.js');
const aux = require('./objects/_aux.js');

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

const UPDATE_TIME = 0.06; // sec
const BULLET_LIFETIME = 1000; // ms

// Create a new game instance
const game = {
  // List of players in the game
  playerList: {},
  /** @type Bullet{}*/
  bulletList: {},
  //List of islands in the game
  islandList: {},
  //List of stones in the game
  stoneList: {},
  // boxes object list
  boxList: {},
  // The list of scores form active players
  score_board: new ScoreBoard(),
  // The max number of pickable boxes in the game
  boxesMax: 15,
  // Size of the boxes list
  numOfBoxes: 0,
  // The max number of islands in the game
  islandMax: 10,
  // The max number of stones in the game
  stoneMax: 4,
  // Game height
  canvasHeight: 2000,
  // Game width
  canvasWidth: 2000,
  // Advances by one each game update cycle (related to player invulnerability)
  delta: 1,
  // Arbitrary integer variable, used to define invulnerability time
  mod: 120
};

circle = new SafeZone(1000, 1000, 1000, game.canvasWidth, game.canvasHeight);

setInterval(updateGame, 1000 * UPDATE_TIME);

////////////////////////////////////////////////////////////////////////////////
function updateGame () {
  // Update players
  for (let k in game.playerList) {
    if (!(k in game.playerList))
      continue;
    let p = game.playerList[k];
    p.updatePos(UPDATE_TIME);

    if (p.inputs.shootLeft && !p.leftHoldStart && p.canShoot(false))
      p.leftHoldStart = Date.now();
    if (p.inputs.shootRight && !p.rightHoldStart && p.canShoot(true))
      p.rightHoldStart = Date.now();

    if (!p.inputs.shootLeft && p.leftHoldStart) {
      let newBullets = p.tryToShoot(false);
      for (const b of newBullets) {
        game.bulletList[b.id] = b;
        io.in('game').emit("bullet_create", b);
      }
      p.leftHoldStart = 0;
    }
    if (!p.inputs.shootRight && p.rightHoldStart) {
      let newBullets = p.tryToShoot(true);
      for (const b of newBullets) {
        game.bulletList[b.id] = b;
        io.in('game').emit("bullet_create", b);
      }
      p.rightHoldStart = 0;
    }
    //checking if outside safe-zone
    if (!circle.in_circle(p)) {
      p.takeDamage(game.delta, game.mod);
      if (p.life <= 0) {
      playerKilled(p);
      }
    }
  }

  // Update bullets
  for (const kb in game.bulletList) {
    if (!(kb in game.bulletList))
      continue;
    let bullet = game.bulletList[kb];
    bullet.updatePos(UPDATE_TIME);

    //if (Date.now() > bullet.timeCreated + BULLET_LIFETIME) {
    if (bullet.z <= 0) {
      delete game.bulletList[bullet.id];
      io.in('game').emit('bullet_remove', bullet);
    }
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

      for (const kb in game.islandList) {
        collidePlayerAndIslandRestore(p1, game.islandList[kb]);
        collidePlayerAndIslandGround(p1, game.islandList[kb]);
      }

      for (const kb in game.stoneList) {
        collidePlayerAndStone(p1, game.stoneList[kb]);
      }
  }

  io.in('game').emit("update_game", {playerList:  game.playerList,
                                     bulletList:  game.bulletList,
                                     score_board: game.score_board});
}

////////////////////////////////////////////////////////////////////////////////
// Create the pickable boxes there are missing at the game
function addBox () {
  let n = game.boxesMax - game.numOfBoxes;
  for (let i = 0; i < n; i++) {
    let boxentity = new Box(game.canvasWidth, game.canvasHeight, 'box');
    game.boxList[boxentity.id] = boxentity;
    io.in('game').emit("item_create", boxentity);
    game.numOfBoxes++;
  }
}

////////////////////////////////////////////////////////////////////////////////
function addIslands () {
  let n = game.islandMax - Object.keys(game.islandList).length;
  for (let i = 0; i < n; i++) {
    // Generating them like this is redundant, considering the consistency check
    // contained inside island.js, but this may allow more customization options later

    let bad = true;
    while (bad) {
      bad = false;
      var temp_x = aux.getRndInteger(0, game.canvasWidth);
      var temp_y = aux.getRndInteger(0, game.canvasHeight);
      for (let k in game.islandList) {
        if (distSq({x: temp_x, y: temp_y}, k) < 20) {
          bad = true;
          break;
        }
      }
    }
    let islandentity = new Island(temp_x, temp_y, 100, "bullet_island", game.canvasWidth, game.canvasHeight);
    /*
    let x = aux.getRndInteger(0, game.canvasWidth);
    let y = aux.getRndInteger(0, game.canvasHeight);
    let islandentity = new Island(x, y, 100, "bullet_island", game.canvasWidth, game.canvasHeight);
    */
    game.islandList[islandentity.id] = islandentity;
    io.in('game').emit("island_create", islandentity);
  }
}

////////////////////////////////////////////////////////////////////////////////
function addStones () {
  let n = game.stoneMax - Object.keys(game.stoneList).length;
  for (let i = 0; i < n; i++) {
    let x = aux.getRndInteger(0, game.canvasWidth);
    let y = aux.getRndInteger(0, game.canvasHeight);
    for (let k in game.stoneList) {
      while (k.x == x && k.y == y) {
        let x = aux.getRndInteger(0, game.canvasWidth);
        let y = aux.getRndInteger(0, game.canvasHeight);
      }
    }
    for (let k in game.islandList) {
      while (k.x == x && k.y == y) {
        let x = aux.getRndInteger(0, game.canvasWidth);
        let y = aux.getRndInteger(0, game.canvasHeight);
      }
    }
    let stoneentity = new Stone(x, y, 65, game.canvasWidth, game.canvasHeight);
    game.stoneList[stoneentity.id] = stoneentity;
    io.in('game').emit("stone_create", stoneentity);
  }
}

////////////////////////////////////////////////////////////////////////////////
// Called after the player entered its name
function onEntername (data) {
  console.log(`Received joinning request from ${this.id}, size: ${data.config.width}:${data.config.height}`);
  if (data.username.length > 0 && data.username.length < 15)
    this.emit('join_game', {username: data.username, id: this.id});
  else if (data.username.length <= 0)
    this.emit('throw_error', {message: "Name can't be null"});
  else if (data.username.length >= 15)
    this.emit('throw_error', {message: "Name is too long"});
}

////////////////////////////////////////////////////////////////////////////////
function distSq (p1, p2) {
  let xdiff = p1.x - p2.x;
  let ydiff = p1.y - p2.y;
  return xdiff*xdiff + ydiff*ydiff;
}

////////////////////////////////////////////////////////////////////////////////
function mapFloatToInt (v, fmin, fmax, imin, imax) {
  return Math.floor((v - fmin)*(imax - imin)/(fmax - fmin) + imin);
}

////////////////////////////////////////////////////////////////////////////////
function colliding (newPlayer) {
  let minPlayerDist = 130*130;
  let minIslandDist = 300*300;
  let minStoneDist = 200*200;
  // Check for players
  for (const k in game.playerList) {
    if (distSq(newPlayer, game.playerList[k]) < minPlayerDist)
      return true;
  }
  for (const i in game.islandList) {
    if (distSq(newPlayer, game.islandList[i]) < minIslandDist)
      return true;
  }
  for (const i in game.stoneList) {
    if (distSq(newPlayer, game.stoneList[i]) < minStoneDist)
      return true;
  }
  return false;
}

////////////////////////////////////////////////////////////////////////////////
// Called when a new player connects to the server
function onNewPlayer (data) {
  if (this.id in game.playerList) {
    console.log(`Player with id ${this.id} already exists`);
    return;
  }
  let newPlayer = new Player(mapFloatToInt(Math.random(), 0, 1, 250, game.canvasWidth - 250),
                 mapFloatToInt(Math.random(), 0, 1, 250, game.canvasHeight - 250),
                 Math.PI / 2, this.id, data.username);

  while (colliding(newPlayer) && !circle.in_circle(newPlayer)) {
    newPlayer.setPos(mapFloatToInt(Math.random(), 0, 1, 250, game.canvasWidth - 250),
             mapFloatToInt(Math.random(), 0, 1, 250, game.canvasHeight - 250));
  }
  console.log("Created new player with id " + this.id);

  this.emit('create_player', data);

  let current_info = {
    id: newPlayer.id,
    x: newPlayer.x,
    y: newPlayer.y,
    angle: newPlayer.angle,
    username: newPlayer.username,
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
    this.emit("new_enemyPlayer", player_info);
  }

  game.playerList[this.id] = newPlayer;
  game.score_board.add_player(this.id, data.username);

  for (let k in game.boxList)
    this.emit('item_create', game.boxList[k]);

  for (let k in game.bulletList)
    this.emit('bullet_create', game.bulletList[k]);

  for (let k in game.islandList)
    this.emit('island_create', game.islandList[k]);

  for (let k in game.stoneList)
    this.emit('stone_create', game.stoneList[k]);

  //send message to every connected client except the sender
  this.broadcast.emit('new_enemyPlayer', current_info);
}

////////////////////////////////////////////////////////////////////////////////
// Called when someone fired an input
function onInputFired (data) {
  let movePlayer = game.playerList[this.id];

  if (!(this.id in game.playerList) || game.playerList[this.id].dead)
    return;

  movePlayer.inputs.up = data.up;
  movePlayer.inputs.left = data.left;
  movePlayer.inputs.right = data.right;
  movePlayer.inputs.shootLeft = data.shootLeft;
  movePlayer.inputs.shootRight = data.shootRight;
}

////////////////////////////////////////////////////////////////////////////////
// Called to verify if two players collide
function collidePlayers (p1, p2) {
  if (!(p2.id in game.playerList) || !(p1.id in game.playerList)
    || p1.dead || p2.dead)
    return;
  if (SAT.testPolygonPolygon(p1.poly, p2.poly)) {
    if (SAT.testPolygonPolygon(p1.prowLine, p2.poly)) {
      if (SAT.testPolygonPolygon(p1.poly, p2.prowLine)) {
        playerKilled(p1);
        playerKilled(p2);
      } else {
        playerKilled(p2);
      }
    } else if (SAT.testPolygonPolygon(p1.poly, p2.prowLine)) {
      playerKilled(p1);
    } else if (SAT.testPolygonPolygon(p1.middleLine, p2.poly)) {
      if (SAT.testPolygonPolygon(p1.poly, p2.middleLine)) {
        playerKilled(p1);
        playerKilled(p2);
      } else {
        playerKilled(p2);
      }
    } else if (SAT.testPolygonPolygon(p1.poly, p2.middleLine)) {
      playerKilled(p1);
    } else {
      console.log("Could not threat the collision D:");
    }
  }
}

////////////////////////////////////////////////////////////////////////////////
// Called to verify if an item is picked
function collidePlayerAndBox (p1, bx) {
  if (!(p1.id in game.playerList) || !(bx.id in game.boxList))
    return;

  if (SAT.testPolygonCircle(p1.poly, bx.poly)) {
    p1.bullets += bx.bullets;

    console.log(`Box with ${bx.bullets} bullets picked`);
    delete game.boxList[bx.id];
    game.numOfBoxes--;

    io.in('game').emit('item_remove', bx);

    addBox();
  }
}

////////////////////////////////////////////////////////////////////////////////
// Called to verify if a bullet collide with a player
function collidePlayerAndBullet (p1, bullet) {
  if (!(p1.id in game.playerList) || !(bullet.id in game.bulletList) || bullet.creator == p1.id)
    return;

  if (SAT.testPolygonCircle(p1.poly, bullet.poly)) {
    game.score_board.update_score(bullet.creator);
    delete game.bulletList[bullet.id];
    io.in('game').emit('bullet_remove', bullet);
    console.log(`Bullet hit ${p1.username}`);
    p1.life--;
    if (p1.life <= 0)
      playerKilled(p1);
  }
}

////////////////////////////////////////////////////////////////////////////////
// Called to verify player is in island restore area
function collidePlayerAndIslandRestore (p1, isl) {
  if (!(p1.id in game.playerList) || !(isl.id in game.islandList))
    return;

  if (SAT.testPolygonCircle(p1.poly, isl.restore_poly)) {

    // Player has touched island area, and is waiting
    if (p1.anchored_timer < 180) {
      io.to(p1.id).emit("disable_inputs");
      p1.speed = 0;
      p1.accel = 0;
      p1.anchored_timer += 1;
    }

    // Player is ready to be freed
    else {
      // Move player on server and client
      del_x = p1.x - isl.x;
      del_y = p1.y - isl.y;
      theta = Math.atan2(del_y, del_x);
      // Setting anchored_timer to zero here may cause issues, because
      // the player is still in contact with the island's restore poly.
      // We should make this state known to the game (something like, moving_away).
      p1.angle = theta + Math.PI/2;

      if (SAT.testPolygonCircle(p1.poly, isl.restore_poly)) {
        //Waiting for player to move out of the area
        p1.addPos(Math.sign(Math.cos(theta)) * 0.5, Math.sign(Math.sin(theta)) * 0.5);

        t_p1_poly = JSON.parse(JSON.stringify(p1.poly));
        t_p1_poly.pos.x = p1.x;
        t_p1_poly.pos.y = p2.y;

        // Player left the area after this movement
        if (!SAT.testPolygonCircle(t_p1_poly, isl.restore_poly)) {
          p1.gainResource(game.delta, game.mod, isl.type);
          p1.anchored_timer = 0;
        }
      }
    }
  }
}

////////////////////////////////////////////////////////////////////////////////
// Called to verify player is in island restore area
function collidePlayerAndIslandGround (p1, isl) {
  if (!(p1.id in game.playerList) || !(isl.id in game.islandList))
    return;

  if (SAT.testPolygonCircle(p1.poly, isl.collision_poly)) {
    playerKilled(p1);

  }
}

// Called to verify player is in stone area
function collidePlayerAndStone (p1, stn) {
  if (!(p1.id in game.playerList) || !(stn.id in game.stoneList))
    return;

  if (SAT.testPolygonCircle(p1.poly, stn.collision_poly)) {
    playerKilled(p1);
  }
}

////////////////////////////////////////////////////////////////////////////////
// Called when a someone dies
function playerKilled (player) {
  console.log(`${player.username} died!`);
  if (player.id in game.playerList) {
    console.log(`${player.username} was removed`);
    game.score_board.remove_player(player.id);
    delete game.playerList[player.id];
    io.in('game').emit('remove_player', player);
    io.sockets.sockets[player.id].leave('game');
    io.sockets.sockets[player.id].join('login');
  }

  player.dead = true;
}

////////////////////////////////////////////////////////////////////////////////
// Called when a client disconnects to  tell  the  clients,  except  sender,  to
// remove the disconnected player
function onClientDisconnect () {
  console.log('disconnect');
  if (this.id in game.playerList) {
    game.score_board.remove_player(this.id);
    delete game.playerList[this.id];
  }
  console.log("removing player " + this.id);

  this.broadcast.emit('remove_player', {id: this.id});
}

let io = require('socket.io')(serv,{});

////////////////////////////////////////////////////////////////////////////////
io.sockets.on('connection', function(socket) {
  console.log("socket connected");
  socket.join('login');
  socket.on('enter_name', onEntername);
  socket.on('logged_in', function(data) {
    this.emit('enter_game', {username: data.username});
    socket.leave('login');
    socket.join('game');
  });
  socket.on('disconnect', onClientDisconnect);
  socket.on("new_player", onNewPlayer);
  socket.on("input_fired", onInputFired);
});

// Prepare the boxes
addBox();
// Prepare the islands
addIslands();
// Prepare the stones
addStones();

////////////////////////////////////////////////////////////////////////////////
