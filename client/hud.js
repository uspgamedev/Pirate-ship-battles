
var hud = null;

class HUD {
    constructor(scene) {
        this.life = scene.add.text(50, 50, `Life: ${player.life}`,
                                   {fill: "red"});
        this.life.setScrollFactor(0).setDepth(1);
        this.bullets = scene.add.text(50, 70, `Bullets: ${player.bullets}`,
                                      {fill: "red"});
        this.bullets.setScrollFactor(0).setDepth(1);
        // this.ping = scene.add.text(50, 90, `Ping: ${ping}`,
        //                            {fill: "red"});
        // this.ping.setScrollFactor(0).setDepth(1);
    }

    update() {
        this.life.setText(`Life: ${player.life}`);
        this.bullets.setText(`Bullets: ${player.bullets}`);
        // this.ping.setText(`Ping: ${ping}`);
    }

    destroy() {
        this.life.destroy();
        this.bullets.destroy();
        // this.ping.destroy();
    }
}
