var enemies = {};
var player = null;

const LABEL_DIFF = 45;

class Ship {
	constructor() {
		this.body = null;
		this.text = null;
	}

	update(data) {
        this.body.x = data.x;
        this.body.y = data.y;
        this.body.setVelocity(Math.sin(data.angle) * data.speed, -Math.cos(data.angle) * data.speed);
        this.body.angle = data.angle * 180 / Math.PI;
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
		this.text = scene.add.text(x, y - LABEL_DIFF, username, {fill: "black"});
		this.body = scene.physics.add.image(x, y, "player");
        this.text.setOrigin(0.5);
        this.body.setOrigin(0.5);
        this.body.setCircle(1, 16, 32);
		this.body.angle = 90; // This starts the player facing the right direction
		this.bullets = 0;
		scene.cameras.main.startFollow(this.body);
    }

	update(data) {
		super.update(data);
		this.bullets = data.bullets;
	}

};

class Enemy extends Ship {
    constructor(scene, id, x, y, username) {
		super();
        this.id = id;
		this.text = scene.add.text(x, y - LABEL_DIFF, username, {fill: "darkGray"});
		this.body = scene.physics.add.image(x, y, "enemy");
		this.text.setOrigin(0.5);
		this.body.setOrigin(0.5);
		this.body.setCircle(1, 16, 32);
		this.body.angle = 90; // This starts the player facing the right direction
    }

};

function createPlayer(data) {
	if (!player)
    	player = new Player(this, data.x, data.y, data.username);
}

function createEnemy(data) {
	if (!(data.id in enemies))
    	enemies[data.id] = new Enemy(this, data.id, data.x, data.y, data.username)
	else
		console.log("Failed to create enemy")
}
