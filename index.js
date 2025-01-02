import * as global from "./modules/global.js";
import { Sprite } from "./modules/model.js";
import {
  loadImages,
  getRandomIntInRange,
  drawText,
  checkCollision,
} from "./modules/helper.js";

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

const coinSound = new Audio();
coinSound.src = "./assets/sounds/coin.wav";
coinSound.volume = 0.08;

const explosionSound = new Audio();
explosionSound.src = "./assets/sounds/explosion.wav";
explosionSound.volume = 0.08;

const gameMusic = new Audio();
gameMusic.src = "./assets/music/time_for_adventure.mp3";
gameMusic.loop = true;
gameMusic.volume = 0.08;

const knight = new Sprite({
  ctx: c,
  image: knightImage,
  position: { x: 0, y: 0 },
  scaleFactor: { w: global.TILE_MULT, h: global.TILE_MULT },
  cropPosition: { x: 8, y: 8 },
  cropScale: { w: 16, h: 20 },
  animationList: knightAnimationList,
  animationCurr: "idle",
  animationIntervalTime: 500,
});
knight.position.y = global.GAME_HEIGHT - global.TILE_SIZE - knight.getHeight();

let collectList = [];
let collectedAmount = 0;

let moveKeys = new Set();
let lastDirection = "";

window.addEventListener("keydown", (e) => {
  gameMusic.play();

  switch (e.key) {
    case "a":
      moveKeys.add("a");
      break;
    case "d":
      moveKeys.add("d");
      break;
  }
});

window.addEventListener("keyup", (e) => {
  switch (e.key) {
    case "a":
      moveKeys.delete("a");
      break;
    case "d":
      moveKeys.delete("d");
      break;
  }
});

function knightMovement() {
  let lastKey = Array.from(moveKeys).pop();

  if (lastKey == "a") {
    knight.velocity.x = -global.PLAYER_SPEED;
    knight.changeAnimation("runLeft", 100);
    lastDirection = "left";

    if (knight.position.x < 0) {
      knight.position.x = global.GAME_WIDTH;
    }
  } else if (lastKey == "d") {
    knight.velocity.x = global.PLAYER_SPEED;
    knight.changeAnimation("run", 100);
    lastDirection = "right";

    if (knight.position.x >= global.GAME_WIDTH - knight.getWidth()) {
      knight.position.x = -knight.getWidth();
    }
  } else {
    knight.velocity.x = 0;
    knight.changeAnimation(lastDirection == "left" ? "idleLeft" : "idle", 300);
  }
}

function filterCollectList() {
  collectList = collectList.filter((coin) => {
    let colideWithKnight = checkCollision(
      {
        x: knight.position.x,
        y: knight.position.y,
        w: knight.getWidth(),
        h: knight.getHeight(),
      },
      {
        x: coin.position.x,
        y: coin.position.y,
        w: coin.getWidth(),
        h: coin.getHeight(),
      }
    );

    if (colideWithKnight) {
      coinSound.play();
      collectedAmount++;
    }

    if (
      coin.position.y + coin.getHeight() >=
      global.GAME_HEIGHT - global.TILE_SIZE
    ) {
      explosionSound.play();
    }

    return (
      coin.position.y + coin.getHeight() <
        global.GAME_HEIGHT - global.TILE_SIZE && !colideWithKnight
    );
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

function animate() {
  c.fillStyle = "lightblue";
  c.fillRect(0, 0, global.GAME_WIDTH, global.GAME_HEIGHT);
  drawFloor();

  drawText(c, `Coins: ${collectedAmount}`, {
    textSize: "24px",
    fontFamily: "pixel",
    position: { x: 10, y: 10 },
  });

  knightMovement();
  knight.draw();

  filterCollectList();
  collectList.forEach((sprite) => {
    sprite.draw();
  });
}

setInterval(() => {
  animate();
}, 1000 / 60);

let lastCoinPosition = 0;
let coinRange = {
  min: 10,
  max: global.GAME_WIDTH - global.TILE_SIZE - 10,
};

//GENERATE COINS
setInterval(() => {
  let random = getRandomIntInRange(coinRange.min, coinRange.max);

  while (Math.abs(random - lastCoinPosition) < 50) {
    random = getRandomIntInRange(coinRange.min, coinRange.max);
  }

  if (random < 0) {
    random += global.GAME_WIDTH - global.TILE_SIZE;
  } else if (random > global.GAME_WIDTH - global.TILE_SIZE) {
    random -= global.GAME_WIDTH - global.TILE_SIZE;
  }

  lastCoinPosition = random;
  coinRange = {
    min: lastCoinPosition - 200,
    max: lastCoinPosition + 200,
  };

  collectList.push(
    new Sprite({
      ctx: c,
      image: coinImage,
      position: { x: random, y: global.TILE_DEFAULT },
      velocity: { x: 0, y: global.FALL_SPEED },
      scaleFactor: { w: global.TILE_MULT, h: global.TILE_MULT },
      cropPosition: { x: 3, y: 3 },
      cropScale: { w: 10, h: 10 },
      animationList: coinAnimationList,
      animationCurr: "rotation",
      animationIntervalTime: 100,
    })
  );
}, 1000);
