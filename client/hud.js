
var hud = null;

class HUD {
    constructor(scene) {
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
        this.scene = scene;
        // this.ping = scene.add.text(50, 90, `Ping: ${ping}`,
        //                            {fill: "red"});
        // this.ping.setScrollFactor(0).setDepth(1);
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
        // this.ping.setText(`Ping: ${ping}`);
    }

    destroy() {
        this.bullets.destroy();
        for (let i = 0; i < this.hearts.length; i++)
            this.hearts[i].destroy();
        // this.ping.destroy();
    }
}
