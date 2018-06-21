var enemies = {};
var player = null;

const IMAGE_OFFSET = 20;
const LABEL_DIFF = IMAGE_OFFSET + 45;

class Ship {
	constructor() {
		this.body = null;
		this.text = null;
	}

	update(data) {
        this.body.x = data.x;
        this.body.y = toIsometric(data.y) - IMAGE_OFFSET;
        this.body.setVelocity(Math.sin(data.angle) * data.speed,
							  -toIsometric(Math.cos(data.angle) * data.speed));
		this.body.setFrame(Math.floor(fmod(data.angle - HALF_FRAME, 2*Math.PI)*8/Math.PI));
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
		this.text = scene.add.text(x, toIsometric(y) - LABEL_DIFF, username, {fill: "black"});
		this.body = scene.physics.add.sprite(x, toIsometric(y) - IMAGE_OFFSET, "ship", 0);
        this.text.setOrigin(0.5);
        this.body.setOrigin(0.5);
        this.body.setCircle(1, 16, 32);
		//this.body.angle = 0; // This starts the player facing the right direction
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
		this.body = scene.physics.add.sprite(x, toIsometric(y) - IMAGE_OFFSET, "ship", 0);
		this.text.setOrigin(0.5);
		this.body.setOrigin(0.5);
		this.body.setCircle(1, 16, 32);
		//this.body.angle = 0; // This starts the player facing the right direction
    }

};

function createPlayer(data) {
	if (!player) {
		player = new Player(this, data.x, data.y, data.username);
		hud = new HUD(this);
	}
}

function createEnemy(data) {
	if (!(data.id in enemies))
    	enemies[data.id] = new Enemy(this, data.id, data.x, data.y, data.username)
	else
		console.log("Failed to create enemy")
}
