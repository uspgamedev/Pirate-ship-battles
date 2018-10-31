////////////////////////////////////////////////////////////////////////////////
//                            Pirate Ship Battles                             //
//                                                                            //
//                                Client - HUD                                //
////////////////////////////////////////////////////////////////////////////////

var hud = null;
const DBHT = 500; // ms  // Double bullet hold time
const TBHT = 1000; // ms  // Triple bullet hold time
const BULLET_COOLDOWN = 1000; // ms
var scoreBoard;

////////////////////////////////////////////////////////////////////////////////
// HUD                                                                        //
////////////////////////////////////////////////////////////////////////////////
class HUD {
  constructor (scene) {
    this.JS_MARGIN = 120;
    this.JS_RAD = 75;
    this.JS_X = this.JS_MARGIN;
    this.JS_Y = config.height - this.JS_X;
    this.JS_SHOT_RAD = 50;
    this.JS_SHOT_Y = config.height - this.JS_MARGIN;
    this.JS_SHOT_RIGHT_X = config.width - this.JS_MARGIN;
    this.JS_SHOT_LEFT_X = this.JS_SHOT_RIGHT_X - 150;
    this.mobileMode = (isTouchDevice() || mobilecheckbox.checked);
    this.hearts = [];
    for (let i = 0; i < 3; i++) {
      let heart = scene.add.image(70 + 50*i, 70, "heart");
      heart.setScrollFactor(0).setDepth(5000);
      this.hearts.push(heart);
    }
    this.bulletImage = scene.add.image(70, 125, "big_bullet");
    this.bulletImage.setScrollFactor(0).setDepth(5000);
    this.bullets = scene.add.text(100, 110, `${player.bullets}`, {color: "white", fontSize: 25, strokeThickness: 2});
    this.bullets.setScrollFactor(0).setDepth(5000);
    this.leftBulletBar = [];
    for (let i = 0; i < 3; i++) {
      let bullet = scene.add.sprite(70 + 30*i, 170, "bullet_fill", 0);
      bullet.setScrollFactor(0).setDepth(5000);
      this.leftBulletBar.push(bullet);
    }
    this.rightBulletBar = [];
    for (let i = 0; i < 3; i++) {
      let bullet = scene.add.sprite(70 + 30*i, 200, "bullet_fill", 0);
      bullet.setScrollFactor(0).setDepth(5000);
      this.rightBulletBar.push(bullet);
    }

    // Score Board
    this.scoreBoard = scene.add.text(32, 250, 'ScoreBoard', {
      backgroundColor: '#FFFFFF',
      fill: '#009696',
      fontSize: '24px'
    }).setScrollFactor(0).setDepth(5000);

    // Timer
    this.timer = scene.add.text(0, 0, 'Timer', {
      backgroundColor: '#009696',
      fill: '#FFFFFF',
      fontSize: '32px'
    }).setDepth(5000);

    if (this.mobileMode) {
      this.baseController = scene.add.sprite(this.JS_X, this.JS_Y, "base_controller");
      this.baseController.setScrollFactor(0).setDepth(5000);
      this.topController = scene.add.sprite(this.JS_X, this.JS_Y, "top_controller");
      this.topController.setScrollFactor(0).setDepth(5001);
      this.rightShotController = scene.add.sprite(this.JS_SHOT_RIGHT_X, this.JS_SHOT_Y, "shot_controller");
      this.rightShotController.setScrollFactor(0).setDepth(5000);
      this.leftShotController = scene.add.sprite(this.JS_SHOT_LEFT_X, this.JS_SHOT_Y, "shot_controller");
      this.leftShotController.setScrollFactor(0).setDepth(5000);
      this.pointers = [scene.input.pointer1, scene.input.pointer2];
    }
    this.scene = scene;
  }

  //////////////////////////////////////////////////////////////////////////////
  update () {
    // Update bullets
    this.bullets.setText(`${player.bullets}`);

    // Update life bar
    if (player.life < this.hearts.length) {
      let removed = this.hearts.splice(player.life, this.hearts.length - player.life);
      for (let heart of removed)
        heart.destroy();
    } else if (player.life > this.hearts.length) {
      let beg = 70 + this.hearts.length*50;
      for (let i = 0; i < player.life - this.hearts.length; i++) {
        let heart = scene.add.image(beg + 50*i, 110, "heart");
        heart.setScrollFactor(0).setDepth(5000);
        this.hearts.push(heart);
      }
    }

    // Update bullet charge bar
    if (player.bullets != 0) {
      this.leftBulletBar[0].setFrame(mapFloatToInt(Math.min(Date.now() - player.lastShootTimeLeft, 1000), 0, 1000, 0, 4));
      this.rightBulletBar[0].setFrame(mapFloatToInt(Math.min(Date.now() - player.lastShootTimeRight, 1000), 0, 1000, 0, 4));
    } else {
      this.leftBulletBar[0].setFrame(0);
      this.rightBulletBar[0].setFrame(0);
    }

    if (player.leftHoldStart == 0 || player.bullets == 1) {
      this.leftBulletBar[1].setFrame(0);
      this.leftBulletBar[2].setFrame(0);
    } else if (Date.now() - player.leftHoldStart <= DBHT || player.bullets == 2) {
      this.leftBulletBar[1].setFrame(mapFloatToInt(Math.min(Date.now() - player.leftHoldStart, DBHT), 0, DBHT, 0, 4));
      this.leftBulletBar[2].setFrame(0);
    } else {
      this.leftBulletBar[1].setFrame(mapFloatToInt(Math.min(Date.now() - player.leftHoldStart, DBHT), 0, DBHT, 0, 4));
      this.leftBulletBar[2].setFrame(mapFloatToInt(Math.min(Date.now() - player.leftHoldStart, TBHT), DBHT, TBHT, 0, 4));
    }

    if (player.rightHoldStart == 0 || player.bullets == 1) {
      this.rightBulletBar[1].setFrame(0);
      this.rightBulletBar[2].setFrame(0);
    } else if (Date.now() - player.rightHoldStart <= DBHT || player.bullets == 2) {
      this.rightBulletBar[1].setFrame(mapFloatToInt(Math.min(Date.now() - player.rightHoldStart, DBHT), 0, DBHT, 0, 4));
      this.rightBulletBar[2].setFrame(0);
    } else {
      this.rightBulletBar[1].setFrame(mapFloatToInt(Math.min(Date.now() - player.rightHoldStart, DBHT), 0, DBHT, 0, 4));
      this.rightBulletBar[2].setFrame(mapFloatToInt(Math.min(Date.now() - player.rightHoldStart, TBHT), DBHT, TBHT, 0, 4));
    }

    // Update virtual joystick
    if (this.mobileMode) {
      let nearest = argMax(this.pointers, (p) => -normSq(p.x - this.JS_X, p.y - this.JS_Y));
      if (nearest.isDown) {
        if (nearest.x < config.width/2) {
          let [x, y] = clampRad(nearest.x - this.JS_X, nearest.y - this.JS_Y, this.JS_RAD);
          this.topController.setPosition(x + this.JS_X, y + this.JS_Y);
        }
      } else {
        this.topController.setPosition(this.JS_X, this.JS_Y);
      }
    }

    // Update score board
    if (scoreBoard) {
      var text = "SCOREBOARD\n";
      for (const i in scoreBoard.score_list) {
        text += "\n" + scoreBoard.username_list[i] + ": " + scoreBoard.score_list[i];
      }
      this.scoreBoard.setText(text);
    }

    // Update timer
    if (0 < player.anchored_timer && player.anchored_timer < 180) {
      this.timer.visible = true;
      this.timer.x = player.body.x;
      this.timer.y = player.body.y;
      this.timer.setText(Math.round(100*player.anchored_timer/180) + "%");
    } else {
      this.timer.visible = false;
    }
  }

  //////////////////////////////////////////////////////////////////////////////
  getJSFeatures () {
    if (!this.mobileMode)
      return [false, false, false, false, false];
    let shootLeft = false;
    let shootRight = false;
    let nearest = argMax(this.pointers, (p) => -normSq(p.x - this.JS_SHOT_RIGHT_X, p.y - this.JS_SHOT_Y));
    if (nearest.isDown) {
      let dist = norm(nearest.x - this.JS_SHOT_RIGHT_X, nearest.y - this.JS_SHOT_Y);
      shootRight = (dist < this.JS_SHOT_RAD);
    }
    nearest = argMax(this.pointers, (p) => -normSq(p.x - this.JS_SHOT_LEFT_X, p.y - this.JS_SHOT_Y));
    if (nearest.isDown) {
      let dist = norm(nearest.x - this.JS_SHOT_LEFT_X, nearest.y - this.JS_SHOT_Y);
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

  //////////////////////////////////////////////////////////////////////////////
  getGameObjects () {
    let objs = [];
    objs.push(this.bulletImage, this.bullets, this.scoreBoard);
    for (let i = 0; i < this.hearts.length; i++) {
      objs.push(this.hearts[i]);
    }
    for (let i = 0; i < this.leftBulletBar.length; i++) {
      objs.push(this.leftBulletBar[i]);
    }
    for (let i = 0; i < this.rightBulletBar.length; i++) {
      objs.push(this.rightBulletBar[i]);
    }
    if (this.mobileMode) {
      objs.push(this.baseController);
      objs.push(this.topController);
      objs.push(this.rightShotController);
      objs.push(this.leftShotController);
    }
    return objs;
  }

  //////////////////////////////////////////////////////////////////////////////
  destroy () {
    for (let i = 0; i < this.hearts.length; i++)
      this.hearts[i].destroy();
    this.bulletImage.destroy();
    this.bullets.destroy();
    if (this.mobileMode) {
      this.baseController.destroy();
      this.topController.destroy();
      this.rightShotController.destroy();
      this.leftShotController.destroy();
    }
  }
}

////////////////////////////////////////////////////////////////////////////////
