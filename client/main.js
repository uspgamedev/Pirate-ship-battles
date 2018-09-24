////////////////////////////////////////////////////////////////////////////////
//                            Pirate Ship Battles                             //
//                                                                            //
//                               Client - Main                                //
////////////////////////////////////////////////////////////////////////////////

let gameProperties = {
  gameWidth: 2000,
  gameHeight: 2000,
  inGame: false,
}

let background = [];
const BG_MARGIN = 700;
const TILE_H = 144;
const TILE_W = 328;

////////////////////////////////////////////////////////////////////////////////
function onSocketConnected (data) {
  console.log("connected to server");
  if (!gameProperties.inGame) {
    socket.emit('new_player', {username: data.username});
    gameProperties.inGame = true;
  }
}

////////////////////////////////////////////////////////////////////////////////
function onRemovePlayer (data) {
	if (data.id in enemies) {
		var removePlayer = enemies[data.id];
		removePlayer.destroy();
		delete enemies[data.id];
		return;
	}
	if (data.id == socket.id) {
    resetObjects();
    this.disableInputs();
    game.scene.stop('Main');
		game.scene.start('Login');
		return;
	}
	console.log('Player not found: ', data.id);
}

////////////////////////////////////////////////////////////////////////////////
function resetObjects () {
  enemies = {};
  hud = null;
  player = null;
  boxList = {};
  bulletList = {};
  islandList = {};
  background = [];
}

////////////////////////////////////////////////////////////////////////////////
/**
 * Process data received from the server
 * @param {{playerList: {}, bulletList: {}}} data
 */
function onUpdate (data) {
	for (const k in data.playerList) {
		if (k in enemies)
			enemies[k].update(data.playerList[k]);
		else if (player)
			player.update(data.playerList[k]);
	}
	for (const bk in data.bulletList) {
    if (bk in data.bulletList)
      bulletList[bk].update(data.bulletList[bk]);
  }
}

////////////////////////////////////////////////////////////////////////////////
// Main                                                                       //
////////////////////////////////////////////////////////////////////////////////
class Main extends Phaser.Scene {
  constructor () {
    super({key: "Main"});
    // Everything here will execute just once per client session
    socket.on('enter_game', onSocketConnected);
    socket.on("create_player", createPlayer.bind(this));
    socket.on("new_enemyPlayer", createEnemy.bind(this));
    socket.on('remove_player', onRemovePlayer.bind(this));
    socket.on('item_remove', onItemRemove);
    socket.on('item_create', onCreateItem.bind(this));
    socket.on('island_create', onCreateIsland.bind(this));
    socket.on('bullet_remove', onBulletRemove);
    socket.on('bullet_create', onCreateBullet.bind(this));
    socket.on('update_game', onUpdate);
  }

  ////////////////////////////////////////////////////////////////////////////////
  preload () {
    this.load.spritesheet("ship", "client/assets/ship.png", {frameWidth: 112, frameHeight: 96});
    this.load.spritesheet("bullet_fill", "client/assets/bullet_fill_anim.png", {frameWidth: 24, frameHeight: 24});
    this.load.image("ship_up", "client/assets/up_ship.png");
    this.load.image("bullet", "client/assets/cannon_ball.png");
    this.load.image("big_bullet", "client/assets/big_bullet.png");
    this.load.image("heart", "client/assets/heart.png");
    this.load.image("bullet_shadow", "client/assets/bullet_shadow.png");
    this.load.image("barrel", "client/assets/barrel.png");
    this.load.image("enemy", "client/assets/enemy.png");
    this.load.atlas('ocean', 'client/assets/Animations/ocean.png', 'client/assets/Animations/ocean.json');
    this.load.image('base_controller', 'client/assets/base_controller.png');
    this.load.image('top_controller', 'client/assets/top_controller.png');
    this.load.image('shot_controller', 'client/assets/shot_controller.png');
    this.load.image('mask', 'client/assets/mask1.png');
  }

  ////////////////////////////////////////////////////////////////////////////////
  create (username) {
    let camera = this.cameras.main;

    console.log("client started");

    socket.emit('logged_in', {username: username});

    // Set camera limits
    camera.setBounds(0, 0, gameProperties.gameWidth, gameProperties.gameHeight);

    // Rectangle that bounds the camera
    this.screenRect = {
      x: camera.width/2,
      y: camera.height/2,
      w: gameProperties.gameWidth - camera.width,
      h: gameProperties.gameHeight - camera.height
    };

    // Get listeners for keys
    this.key_W = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.key_A = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.key_S = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.key_D = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.key_J = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J);
    this.key_K = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K);

    // Add second pointer for mobile
    if (mobileMode)
      this.input.addPointer(1);

    // Create background animation
    let frameNames = this.anims.generateFrameNames('ocean', {
      start: 1, end: 21, zeroPad: 2,
      prefix: 'ocean', suffix: '.png'
    });
    this.anims.create({key: 'ocean', frames: frameNames, frameRate: 10, repeat: -1});

    // Create background tiles
    this.heightTiles = Math.ceil((camera.height + 2*BG_MARGIN)/TILE_H);
    this.widthTiles = Math.ceil((camera.width + 2*BG_MARGIN)/TILE_W);
    for (let i = 0; i < this.widthTiles; i++) {
      for (let j = 0; j < this.heightTiles; j++) {
        let tmp = this.add.sprite(TILE_W*i, TILE_H*j, 'ocean');
        tmp.anims.play('ocean');
        background.push(tmp);
      }
    }

    // var graphics = this.add.graphics({ lineStyle: { width: 2, color: 0xaa0000 }, fillStyle: { color: 0x0000aa } });
    // graphics.fillRect(0,0,500,500)
    //
    // var shape = this.make.graphics();
    //
    // // Create a hash shape Graphics object
    // shape.fillStyle(0xffffff);
    //
    // // You have to begin a path for a Geometry mask to work
    // shape.beginPath();
    //
    // shape.fillRect(50, 0, 50, 300);
    // shape.fillRect(175, 0, 50, 300);
    // shape.fillRect(0, 75, 275, 50);
    // shape.fillRect(0, 200, 275, 50);
    //
    // var mask = shape.createGeometryMask();
    //
    // shape.x = 200;
    // shape.y = 200;
    //
    // graphics.setMask(mask);
  }

  ////////////////////////////////////////////////////////////////////////////////
  update (dt) {
    if (gameProperties.inGame) {
      if (hud) {
        // Update inputs
        let jsFeat = hud.getJSFeatures();
        let data = {
          up: (this.key_W.isDown || jsFeat[0]),
          left: (this.key_A.isDown || jsFeat[1]),
          right: (this.key_D.isDown || jsFeat[2]),
          shootLeft: (this.key_J.isDown || jsFeat[3]),
          shootRight: (this.key_K.isDown || jsFeat[4])
        }
        socket.emit('input_fired', data);
      }

      // Update some objects
      for (const k in enemies) {
        enemies[k].updatePredictive(dt);
      }
      if (player) {
        player.updatePredictive(dt);
        hud.update();
      }
    }
    if (player) {
      // Scroll camera to player's position (Phaser is a little buggy when doing this)
      this.cameras.main.setScroll(player.body.x, player.body.y);

      // Wrap background tiles
      let cameraPos = clampRect(player.body.x, player.body.y, this.screenRect);
      let cameraCornerX = cameraPos[0] - this.cameras.main.width/2 - BG_MARGIN;
      let cameraCornerY = cameraPos[1] - this.cameras.main.height/2 - BG_MARGIN;
      for (let tile of background) {
        if (tile.x < cameraCornerX - TILE_W)
          tile.x += this.widthTiles*TILE_W;
        else if (tile.x > cameraCornerX + this.widthTiles*TILE_W)
          tile.x -= this.widthTiles*TILE_W;
        else if (tile.y < cameraCornerY - TILE_H)
          tile.y += this.heightTiles*TILE_H;
        else if (tile.y > cameraCornerY + this.heightTiles*TILE_H)
          tile.y -= this.heightTiles*TILE_H;
      }
    }
  }

  ////////////////////////////////////////////////////////////////////////////////
  disableInputs () {
    this.input.keyboard.removeKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.input.keyboard.removeKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.input.keyboard.removeKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.input.keyboard.removeKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.input.keyboard.removeKey(Phaser.Input.Keyboard.KeyCodes.J);
    this.input.keyboard.removeKey(Phaser.Input.Keyboard.KeyCodes.K);
  }
}

////////////////////////////////////////////////////////////////////////////////
