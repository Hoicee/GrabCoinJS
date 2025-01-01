const canvas = document.querySelector(".main-layer");
// CONTEXT
const GAME_WIDTH = 512;
const GAME_HEIGHT = 768;
const USE_FREQUENCY = 60;
const FALL_SPEED = 3.2;

const TILE_SIZE = 32;
const TILE_MULT = TILE_SIZE / 16;

const c = canvas.getContext("2d");
canvas.width = GAME_WIDTH;
canvas.height = GAME_HEIGHT;

// Disable image smoothing (this will make the image scale without blur)
c.imageSmoothingEnabled = false; // For modern browsers
c.mozImageSmoothingEnabled = false; // For Firefox (older versions)
c.webkitImageSmoothingEnabled = false; // For WebKit-based browsers (e.g., Safari)
c.msImageSmoothingEnabled = false; // For IE/Edge

const coinImage = new Image();
coinImage.src = "./assets/sprites/coin.png";
const worldTilesetImage = new Image();
worldTilesetImage.src = "./assets/sprites/world_tileset.png";
const knightImage = new Image();
knightImage.src = "./assets/sprites/knight.png";

collectList = [];

class Sprite {
  framePosition = 0;

  constructor({ position, image, frameList }) {
    this.position = position;
    this.image = image;
    this.frameList = frameList;
    this.animation(0.1);
  }

  draw() {
    c.drawImage(
      this.image,
      16 * this.framePosition,
      0,
      16,
      16,
      this.position.x,
      this.position.y,
      TILE_SIZE,
      TILE_SIZE
    );

    this.applyFall();
  }

  applyFall() {
    //BOUNCE
    if (this.position.y + TILE_SIZE * 2 >= GAME_HEIGHT) {
      console.log(this.position.y);
      // this.position.y = GAME_HEIGHT - this.height;
      //NOT BOUNCE
    } else {
      this.position.y += FALL_SPEED;
    }
  }

  animation(delay) {
    setInterval(() => {
      this.framePosition =
        this.framePosition == 11 ? 0 : this.framePosition + 1;
    }, 1000 * delay);
  }
}

function animate() {
  c.fillStyle = "lightblue";
  c.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

  collectList.forEach((sprite) => {
    sprite.draw();
  });
}

function drawFloor() {
  for (let i = 0; i < GAME_WIDTH; i += TILE_SIZE) {
    c.drawImage(
      worldTilesetImage,
      0,
      0,
      16,
      16,
      i,
      GAME_HEIGHT - TILE_SIZE,
      TILE_SIZE,
      TILE_SIZE
    );
  }
}

setInterval(() => {
  animate();
  drawFloor();
  c.drawImage(knightImage, 0, 0, 32, 32, 0, 0, TILE_SIZE * 2, TILE_SIZE * 2);
}, 1000 / USE_FREQUENCY);

setInterval(() => {
  const upperBound = GAME_WIDTH - TILE_SIZE - 10;
  const random = Math.floor(Math.random() * (upperBound - 10 + 1)) + 10;

  collectList.push(
    new Sprite({
      position: {
        x: random,
        y: 16,
      },
      image: coinImage,
    })
  );
}, 100);
