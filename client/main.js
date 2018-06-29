let gameProperties = {
    gameWidth: 4000,
    gameHeight: 4000,
    inGame: false,
}

let background = [];

const BG_MARGIN = 400;
const TILE_H = 144;
const TILE_W = 328;

function onSocketConnected(data) {
    console.log("connected to server");
    if (!gameProperties.inGame) {
        socket.emit('new_player', {username: data.username});
        gameProperties.inGame = true;
    }
}

function onRemovePlayer(data) {

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

function resetObjects() {
    enemies = {};
    hud = null;
    player = null;
    boxList = {};
    bulletList = {};
    background = [];
}

/**
 * Process data received from the server
 * @param {{playerList: {},bulletList: {}}} data
 */
function onUpdate(data) {
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

class Main extends Phaser.Scene {

    constructor() {
        super({key: "Main"});
        // Everything here will execute just once per client session
        socket.on('enter_game', onSocketConnected);
        socket.on("create_player", createPlayer.bind(this));
        socket.on("new_enemyPlayer", createEnemy.bind(this));
        socket.on('remove_player', onRemovePlayer.bind(this));
        socket.on('item_remove', onItemRemove);
        socket.on('item_create', onCreateItem.bind(this));
        socket.on('bullet_remove', onBulletRemove);
        socket.on('bullet_create', onCreateBullet.bind(this));
        socket.on('update_game', onUpdate);

    }

    preload() {
        this.load.spritesheet("ship", "client/assets/ship.png", {frameWidth: 112, frameHeight: 96});
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
    }

    create(username) {

        let camera = this.cameras.main;

        console.log("client started");

        socket.emit('logged_in', {username: username});

        this.input.addPointer(1);
        // this.input.pointer1.x / .y / .isDown
        // this.input.pointer2.x / .y / .isDown

        camera.setBounds(0, 0, gameProperties.gameWidth,
                         gameProperties.gameHeight);

        this.key_W = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.key_A = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.key_S = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.key_D = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

        this.key_J = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J);
        this.key_K = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K);

        let frameNames = this.anims.generateFrameNames('ocean', {
            start: 1, end: 21, zeroPad: 2,
            prefix: 'ocean', suffix: '.png'
        });
        this.anims.create({key: 'ocean', frames: frameNames, frameRate: 10, repeat: -1});
        this.heightTiles = Math.ceil((camera.height + 2*BG_MARGIN)/TILE_H);
        this.widthTiles = Math.ceil((camera.width + 2*BG_MARGIN)/TILE_W);
        this.cameraCornerX = 0;
        this.cameraCornerY = 0;
        this.screenRect = {
            x: camera.width/2,
            y: camera.height/2,
            w: gameProperties.gameWidth - camera.width,
            h: gameProperties.gameHeight - camera.height
        };
        console.log(this.widthTiles);
        console.log(this.heightTiles);
        for (let i = 0; i < this.widthTiles; i++) {
            for (let j = 0; j < this.heightTiles; j++) {
                let tmp = this.add.sprite(TILE_W*i, TILE_H*j, 'ocean');
                tmp.anims.play('ocean');
                background.push(tmp);
            }
        }

    }

    update(dt) {
        if (gameProperties.inGame) {
            if (hud) {
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

            for (const k in enemies) {
                enemies[k].updatePredictive(dt);
            }
            if (player) {
                player.updatePredictive(dt);
                hud.update();
            }
        }
        if (player) {
            this.cameras.main.setScroll(player.body.x, player.body.y);
            let cameraPos = clampRect(player.body.x, player.body.y, this.screenRect);
            this.cameraCornerX = cameraPos[0] - this.cameras.main.width/2 - BG_MARGIN;
            this.cameraCornerY = cameraPos[1] - this.cameras.main.height/2 - BG_MARGIN;
            for (let tile of background) {
                if (tile.x < this.cameraCornerX - TILE_W)
                    tile.x += this.widthTiles*TILE_W;
                else if (tile.x > this.cameraCornerX + this.widthTiles*TILE_W)
                    tile.x -= this.widthTiles*TILE_W;
                else if (tile.y < this.cameraCornerY - TILE_H)
                    tile.y += this.heightTiles*TILE_H;
                else if (tile.y > this.cameraCornerY + this.heightTiles*TILE_H)
                    tile.y -= this.heightTiles*TILE_H;
            }
        }
    }

    disableInputs() {
        this.input.keyboard.removeKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.input.keyboard.removeKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.input.keyboard.removeKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.input.keyboard.removeKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.input.keyboard.removeKey(Phaser.Input.Keyboard.KeyCodes.J);
        this.input.keyboard.removeKey(Phaser.Input.Keyboard.KeyCodes.K);
    }
}
