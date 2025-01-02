import * as global from "./global.js";

export class Sprite {
  framePosition = 0;
  onGround = false;

  constructor({ ctx, position, image, frameList }) {
    this.ctx = ctx;
    this.position = position;
    this.image = image;
    this.frameList = frameList;
    this.animation(0.1);
  }

  draw() {
    this.ctx.drawImage(
      this.image,
      16 * this.framePosition,
      0,
      16,
      16,
      this.position.x,
      this.position.y,
      global.TILE_SIZE,
      global.TILE_SIZE
    );

    this.applyFall();
  }

  applyFall() {
    if (this.position.y + global.TILE_SIZE * 2 >= global.GAME_HEIGHT) {
      this.onGround = true;
    } else {
      this.position.y += global.FALL_SPEED;
    }
  }

  animation(delay) {
    setInterval(() => {
      this.framePosition =
        this.framePosition == 11 ? 0 : this.framePosition + 1;
    }, 1000 * delay);
  }
}

export class Knight {
  constructor({ ctx, image, moveKeys }) {
    this.ctx = ctx;
    this.position = {
      x: global.GAME_WIDTH / 2 - global.TILE_SIZE,
      y: global.GAME_HEIGHT - global.TILE_SIZE * 2 - 24,
    };
    this.image = image;
    this.moveKeys = moveKeys;
  }

  draw() {
    this.ctx.drawImage(
      this.image,
      0,
      0,
      32,
      32,
      this.position.x,
      this.position.y,
      global.TILE_SIZE * 2,
      global.TILE_SIZE * 2
    );

    this.move();
  }

  move() {
    let lastKey = Array.from(this.moveKeys).pop();

    if (lastKey == "w") {
    } else if (lastKey == "a") {
      if (this.position.x + 16 <= 0) {
        return;
      }

      this.position.x -= global.PLAYER_SPEED;
    } else if (lastKey == "s") {
    } else if (lastKey == "d") {
      if (this.position.x + global.TILE_SIZE + 16 >= global.GAME_WIDTH) {
        return;
      }

      this.position.x += global.PLAYER_SPEED;
    }
  }

  jump() {}

  dash() {}
}
