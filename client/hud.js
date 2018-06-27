
var hud = null;

class HUD {
    constructor(scene) {
        this.JS_MARGIN = 120;
        this.JS_RAD = 75;
        this.JS_X = this.JS_MARGIN;
        this.JS_Y = config.height - this.JS_X;
        this.JS_SHOT_RAD = 50;
        this.JS_SHOT_Y = config.height - this.JS_MARGIN;
        this.JS_SHOT_RIGHT_X = config.width - this.JS_MARGIN;
        this.JS_SHOT_LEFT_X = this.JS_SHOT_RIGHT_X - 150;
        this.hearts = [];
        for (let i = 0; i < 3; i++) {
            let heart = scene.add.image(70 + 50*i, 70, "heart");
            heart.setScrollFactor(0).setDepth(5000);
            this.hearts.push(heart);
        }
        this.bulletImage = scene.add.image(70, 125, "big_bullet");
        this.bulletImage.setScrollFactor(0).setDepth(5000);
        this.bullets = scene.add.text(100, 110, `${player.bullets}`,
            {color: "white", fontSize: 25, strokeThickness: 2});
        this.bullets.setScrollFactor(0).setDepth(5000);
        this.baseController = scene.add.sprite(this.JS_X, this.JS_Y, "base_controller");
        this.baseController.setScrollFactor(0).setDepth(5000);
        this.topController = scene.add.sprite(this.JS_X, this.JS_Y, "top_controller");
        this.topController.setScrollFactor(0).setDepth(5001);
        this.rightShotController = scene.add.sprite(this.JS_SHOT_RIGHT_X, this.JS_SHOT_Y, "shot_controller");
        this.rightShotController.setScrollFactor(0).setDepth(5000);
        this.leftShotController = scene.add.sprite(this.JS_SHOT_LEFT_X, this.JS_SHOT_Y, "shot_controller");
        this.leftShotController.setScrollFactor(0).setDepth(5000);
        this.scene = scene;
        this.mouse = scene.input.mousePointer;
        this.pointers = [scene.input.pointer1, scene.input.pointer2];
    }

    update() {
        this.bullets.setText(`${player.bullets}`);
        if (player.life < this.hearts.length) {
            let removed = this.hearts.splice(player.life, this.hearts.length - player.life);
            for (let heart of removed)
                heart.destroy();
        }
        else if (player.life > this.hearts.length) {
            let beg = 70 + this.hearts.length*50;
            for (let i = 0; i < player.life - this.hearts.length; i++) {
                let heart = scene.add.image(beg + 50*i, 110, "heart");
                heart.setScrollFactor(0).setDepth(5000);
                this.hearts.push(heart);
            }
        }
        let nearest = argMax(this.pointers, (p) => -normSq(p.x - this.JS_X, p.y - this.JS_Y));
        if (nearest.isDown) {
            if (nearest.x < config.width/2) {
                let [x, y] = clampRad(nearest.x - this.JS_X,
                                      nearest.y - this.JS_Y, this.JS_RAD);
                this.topController.setPosition(x + this.JS_X, y + this.JS_Y);
            }
        }
        else
            this.topController.setPosition(this.JS_X, this.JS_Y);
    }

    getJSFeatures() {
        let shootLeft = false;
        let shootRight = false;
        let nearest = argMax(this.pointers, (p) => -normSq(p.x - this.JS_SHOT_RIGHT_X, p.y - this.JS_SHOT_Y));
        if (nearest.isDown) {
            let dist = norm(nearest.x - this.JS_SHOT_RIGHT_X,
                            nearest.y - this.JS_SHOT_Y);
            shootRight = (dist < this.JS_SHOT_RAD);
        }
        nearest = argMax(this.pointers, (p) => -normSq(p.x - this.JS_SHOT_LEFT_X, p.y - this.JS_SHOT_Y));
        if (nearest.isDown) {
            let dist = norm(nearest.x - this.JS_SHOT_LEFT_X,
                            nearest.y - this.JS_SHOT_Y);
            shootLeft = (dist < this.JS_SHOT_RAD);
        }
        let x = this.topController.x - this.JS_X;
        let y = this.topController.y - this.JS_Y;
        if (x == 0 && y == 0)
            return [false, false, false, shootLeft, shootRight];
        let angle = fmod(Math.atan2(y, x), 2*Math.PI);
        let pAngle = fmod(player.body.body.angle, 2*Math.PI);
        let left = false;
        let right = false;
        if ((angle > pAngle && angle - pAngle < Math.PI && angle - pAngle > 0.05) ||
            (angle < pAngle && pAngle - angle > Math.PI && pAngle - angle < 2*Math.PI - 0.05))
            left = true;
        if ((angle > pAngle && angle - pAngle > Math.PI && angle - pAngle > 0.05) ||
            (angle < pAngle && pAngle - angle < Math.PI && pAngle - angle < 2*Math.PI - 0.05))
            right = true;
        return [true, right, left, shootLeft, shootRight];
    }

    destroy() {
        for (let i = 0; i < this.hearts.length; i++)
            this.hearts[i].destroy();
        this.bulletImage.destroy();
        this.bullets.destroy();
        this.baseController.destroy();
        this.topController.destroy();
        this.rightShotController.destroy();
        this.leftShotController.destroy();
    }
}
