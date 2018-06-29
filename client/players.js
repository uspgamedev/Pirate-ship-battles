var enemies = {};
var player = null;

const IMAGE_OFFSET = (ISOMETRIC)? 20 : 0;
const LABEL_DIFF = IMAGE_OFFSET + 45;

class Ship {
	constructor() {}

	update(data) {
        this.body.x = data.x;
        this.body.y = toIsometric(data.y) - IMAGE_OFFSET;
        this.body.setVelocity(Math.sin(data.angle) * data.speed,
							  -toIsometric(Math.cos(data.angle) * data.speed));
		if (ISOMETRIC)
			this.body.setFrame(Math.floor(fmod(data.angle - HALF_FRAME, 2*Math.PI)*8/Math.PI));
		else
			this.body.angle = data.angle * 180 / Math.PI;
		this.body.setDepth(toIsometric(data.y));
		this.text.setDepth(toIsometric(data.y));
    }

    updatePredictive(delta) {
        this.text.x = this.body.x;
        this.text.y = this.body.y - LABEL_DIFF;
    }

    destroy() {
        this.body.destroy();
        this.text.destroy();
    }
}

class Player extends Ship {
    constructor(scene, x, y, username) {
		super();
		this.text = scene.add.text(x, toIsometric(y) - LABEL_DIFF, username, {fill: "white"});
		let sprite = (ISOMETRIC)? "ship" : "ship_up";
		this.body = scene.physics.add.sprite(x, toIsometric(y) - IMAGE_OFFSET, sprite, 0);
        this.text.setOrigin(0.5);
        this.body.setOrigin(0.5);
        this.body.setCircle(1, 16, 32);
		this.bullets = 0;
		scene.cameras.main.startFollow(this.body);
    }

	update(data) {
		super.update(data);
		this.bullets = data.bullets;
		this.life = data.life;
	}

};

class Enemy extends Ship {
    constructor(scene, id, x, y, username) {
		super();
        this.id = id;
		this.text = scene.add.text(x, toIsometric(y) - LABEL_DIFF, username, {fill: "darkGray"});
		let sprite = (ISOMETRIC)? "ship" : "ship_up";
		this.body = scene.physics.add.sprite(x, toIsometric(y) - IMAGE_OFFSET, sprite, 0);
		this.text.setOrigin(0.5);
		this.body.setOrigin(0.5);
		this.body.setCircle(1, 16, 32);
    }

};

function createPlayer(data) {
	if (!player) {
		player = new Player(this, data.x, data.y, data.username);
		hud = new HUD(this, mobileMode);
	}
}

function createEnemy(data) {
	if (!(data.id in enemies))
		enemies[data.id] = new Enemy(this, data.id, data.x, data.y, data.username);
	else
		console.log("Failed to create enemy");
}
