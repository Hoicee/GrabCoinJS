import * as global from "./modules/global.js";
import { Sprite, Knight } from "./modules/model.js";
import { loadImages, getRandomIntInRange } from "./modules/helper.js";

const canvas = document.querySelector(".main-layer");
const c = canvas.getContext("2d");
canvas.width = global.GAME_WIDTH;
canvas.height = global.GAME_HEIGHT;

// Disable image smoothing (this will make the image scale without blur)
c.imageSmoothingEnabled = false; // For modern browsers
c.mozImageSmoothingEnabled = false; // For Firefox (older versions)
c.webkitImageSmoothingEnabled = false; // For WebKit-based browsers (e.g., Safari)
c.msImageSmoothingEnabled = false; // For IE/Edge

//LOADING ALL IMAGES
const coinImage = new Image();
coinImage.src = "./assets/sprites/coin.png";
const worldTilesetImage = new Image();
worldTilesetImage.src = "./assets/sprites/world_tileset.png";
const knightImage = new Image();
knightImage.src = "./assets/sprites/knight.png";
await loadImages([coinImage, worldTilesetImage, knightImage]);

let collectList = [];
let collectedAmount = 0;
let knight = new Knight({ ctx: c, image: knightImage, moveKeys: new Set() });

function animate() {
  c.fillStyle = "lightblue";
  c.fillRect(0, 0, global.GAME_WIDTH, global.GAME_HEIGHT);
  drawFloor();

  c.fillStyle = "black";
  c.font = "24px Pixel";
  c.textAlign = "left";
  c.textBaseline = "top";
  c.fillText(`Coins: ${collectedAmount}`, 10, 10);

  knight.draw();
  collectList = collectList.filter((sprite) => {
    return !sprite.onGround;
  });
  collectList.forEach((sprite) => {
    sprite.draw();
  });
}

function drawFloor() {
  for (let i = 0; i < global.GAME_WIDTH; i += global.TILE_SIZE) {
    c.drawImage(
      worldTilesetImage,
      0,
      0,
      16,
      16,
      i,
      global.GAME_HEIGHT - global.TILE_SIZE,
      global.TILE_SIZE,
      global.TILE_SIZE
    );
  }
}

setInterval(() => {
  animate();
}, 1000 / 60);

setInterval(() => {
  const random = getRandomIntInRange(
    10,
    global.GAME_WIDTH - global.TILE_SIZE - 10
  );

  collectList.push(
    new Sprite({
      ctx: c,
      position: {
        x: random,
        y: 16,
      },
      image: coinImage,
    })
  );
}, 1000);

window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "a":
      knight.moveKeys.add("a");
      break;
    case "d":
      knight.moveKeys.add("d");
      break;
  }
});

window.addEventListener("keyup", (e) => {
  switch (e.key) {
    case "a":
      knight.moveKeys.delete("a");
      break;
    case "d":
      knight.moveKeys.delete("d");
      break;
  }
});
