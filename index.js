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

// Disable image smoothing
c.imageSmoothingEnabled = false;
c.mozImageSmoothingEnabled = false;
c.webkitImageSmoothingEnabled = false;
c.msImageSmoothingEnabled = false;

//LOADING ALL ASSETS
const coinImage = new Image();
const worldTilesetImage = new Image();
const knightImage = new Image();
const fruitImage = new Image();
const mutedImage = new Image();
const unmutedImage = new Image();
coinImage.src = "./assets/sprites/coin.png";
worldTilesetImage.src = "./assets/sprites/world_tileset.png";
knightImage.src = "./assets/sprites/knight.png";
fruitImage.src = "./assets/sprites/fruit.png";
mutedImage.src = "./assets/sprites/muted.png";
unmutedImage.src = "./assets/sprites/unmuted.png";
await loadImages([
  coinImage,
  worldTilesetImage,
  knightImage,
  fruitImage,
  mutedImage,
  unmutedImage,
]);

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
knight.position.x = global.GAME_WIDTH / 2 - knight.getWidth() / 2;
const resetKnightPosition = () =>
  (knight.position.y =
    global.GAME_HEIGHT - global.TILE_SIZE - knight.getHeight());
resetKnightPosition();

let collectList = [];
let collectedAmount = 0;
let lastCoinPosition = 0;
let coinRange = {
  min: 10,
  max: global.GAME_WIDTH - global.TILE_SIZE - 10,
};
let remainingLifes = global.MAX_LIFES;
let record = parseInt(localStorage.getItem("record") || 0);

let moveKeys = new Set();
let lastDirection = "";
let isDashing = false;
let loadingDash = false;
let isJumping = false;

let map = [];
let lifeList = [];

let btnPlay = {
  x: global.GAME_WIDTH / 2 - 150 / 2,
  y: global.GAME_HEIGHT / 2 - 75 / 2,
  w: 150,
  h: 75,
};

let isGameStarted = false;

//GENERATING THE GROUND
for (let i = 0; i < global.GAME_WIDTH; i += global.TILE_SIZE) {
  map.push(
    new Sprite({
      ctx: c,
      image: worldTilesetImage,
      position: { x: i, y: global.GAME_HEIGHT - global.TILE_SIZE },
      scaleFactor: { w: 2, h: 2 },
      cropScale: { w: 16, h: 16 },
    })
  );
}

//GENERATING HEARTS
for (let i = 0; i < remainingLifes; i++) {
  lifeList.push(
    new Sprite({
      ctx: c,
      image: fruitImage,
      position: { x: i * 40 + 10, y: 40 },
      scaleFactor: { w: 2.5, h: 2.5 },
      cropPosition: { x: 32, y: 48 },
      cropScale: { w: 16, h: 16 },
    })
  );
}

window.addEventListener("keydown", (e) => {
  const key = e.key.toLowerCase();
  if (key == "a" || key == "d") moveKeys.add(key);
  if (key == "shift" && !loadingDash) handleDash();
  if (key == " " && !isJumping) handleJump();
});

window.addEventListener("keyup", (e) => {
  const key = e.key.toLowerCase();
  if (key == "a" || key == "d") moveKeys.delete(key);
});

canvas.addEventListener("click", (e) => {
  let isBtnPlayClick = checkCollision(
    { x: e.offsetX, y: e.offsetY, w: 1, h: 1 },
    { x: btnPlay.x, y: btnPlay.y, w: btnPlay.w, h: btnPlay.h }
  );

  if (isBtnPlayClick) {
    startGame();
  }
});

function startGame() {
  collectList = [];
  collectedAmount = 0;
  lastCoinPosition = 0;
  coinRange = {
    min: 10,
    max: global.GAME_WIDTH - global.TILE_SIZE - 10,
  };
  remainingLifes = global.MAX_LIFES;

  gameMusic.play();
  isGameStarted = true;
}

function finishGame() {
  isGameStarted = false;
  localStorage.setItem("record", "" + Math.max(collectedAmount, record));
  record = parseInt(localStorage.getItem("record") || 0);

  gameMusic.pause();
}

function knightMovement() {
  let lastKey = Array.from(moveKeys).pop();

  if (!isGameStarted) {
    knight.velocity.x = 0;
    knight.changeAnimation(lastDirection == "left" ? "idleLeft" : "idle", 300);
    return;
  }

  if (lastKey == "a" || lastKey == "d") {
    let speed = isDashing
      ? global.PLAYER_SPEED * global.DASH_SPEED_MULT
      : global.PLAYER_SPEED;

    if (isDashing) {
      knight.animationCurr = `roll${lastKey == "a" ? "Left" : ""}`;
    }

    knight.velocity.x = lastKey == "a" ? -speed : speed;
    knight.changeAnimation(`run${lastKey == "a" ? "Left" : ""}`, 100);
    lastDirection = lastKey == "a" ? "left" : "right";
  } else {
    knight.velocity.x = 0;
    knight.changeAnimation(lastDirection == "left" ? "idleLeft" : "idle", 300);
  }

  if (knight.position.x < 0 && lastKey == "a") {
    knight.position.x = global.GAME_WIDTH;
  }

  if (
    knight.position.x >= global.GAME_WIDTH - knight.getWidth() &&
    lastKey == "d"
  ) {
    knight.position.x = -knight.getWidth();
  }
}

function handleDash() {
  if (["hit", "hitLeft"].includes(knight.animationCurr)) return;

  isDashing = true;
  loadingDash = true;
  knight.changeAnimation(
    "roll",
    global.DASH_TIME / knightAnimationList["roll"].length
  );
  knight.lockAnimation(global.DASH_TIME);

  setTimeout(() => {
    isDashing = false;
  }, global.DASH_TIME);

  setTimeout(() => {
    loadingDash = false;
  }, global.DASH_RELOAD);
}

//THIS FUNCTION NEED TO BE REFACTORED WHEN GRAVITY IS ADDED TO THE KNIGHT.
async function handleJump() {
  if (isJumping) return;
  isJumping = true;

  //INITIAL JUMP POWER
  knight.velocity.y = -global.PLAYER_SPEED;
  let jumpBegin = new Promise((resolve) => {
    setTimeout(resolve, 100);
  });
  await jumpBegin;

  //GRAVITY
  const interval = setInterval(() => {
    knight.velocity.y += 0.8;
  }, 100);

  const interval2 = setInterval(() => {
    if (
      knight.position.y + knight.getHeight() >=
      global.GAME_HEIGHT - global.TILE_SIZE
    ) {
      knight.velocity.y = 0;
      isJumping = false;
      resetKnightPosition();
      clearInterval(interval);
      clearInterval(interval2);
    }
  }, 10);
}

function filterCollectList() {
  collectList = collectList.filter((coin) => {
    if (!isGameStarted) return false;

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
      return false;
    }

    if (
      coin.position.y + coin.getHeight() >=
      global.GAME_HEIGHT - global.TILE_SIZE
    ) {
      remainingLifes--;
      explosionSound.play();

      knight.changeAnimation(
        `hit${lastDirection == "left" ? "Left" : ""}`,
        150
      );
      knight.lockAnimation(150);

      if (remainingLifes == 0) {
        finishGame();
      }

      return false;
    }

    return true;
  });
}

function generateCoins() {
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
    min: lastCoinPosition - 180,
    max: lastCoinPosition + 180,
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
}

function drawMap() {
  map.forEach((sprite) => sprite.draw());
}

function drawInterface() {
  drawText(c, `Coins: ${collectedAmount}`, {
    textSize: "24px",
    fontFamily: "pixel",
    position: { x: 10, y: 10 },
  });

  lifeList.slice(0, remainingLifes).forEach((sprite) => {
    sprite.draw();
  });

  if (!isGameStarted) {
    c.fillStyle = "white";
    c.fillRect(btnPlay.x, btnPlay.y, btnPlay.w, btnPlay.h);

    drawText(c, "PLAY", {
      position: {
        x: global.GAME_WIDTH / 2,
        y: global.GAME_HEIGHT / 2,
      },
      textSize: "24px",
      fontFamily: "pixel",
      textAlign: "center",
      textBaseline: "middle",
    });
  }

  drawText(c, `RECORD: ${record}`, {
    position: {
      x: global.GAME_WIDTH - 10,
      y: 10,
    },
    fontFamily: "pixel",
    textAlign: "right",
  });

  drawText(c, "JUMP (SPACE)", {
    position: {
      x: global.GAME_WIDTH - 10,
      y: 40,
    },
    fontFamily: "pixel",
    textAlign: "right",
  });

  drawText(c, `DASH (SHIFT): ${loadingDash ? "..." : "READY"}`, {
    position: {
      x: global.GAME_WIDTH - 10,
      y: 70,
    },
    fontFamily: "pixel",
    textAlign: "right",
  });
}

function animate() {
  c.fillStyle = "lightblue";
  c.fillRect(0, 0, global.GAME_WIDTH, global.GAME_HEIGHT);
  drawMap();

  knightMovement();
  knight.draw();

  filterCollectList();
  collectList.forEach((sprite) => {
    sprite.draw();
  });

  drawInterface();
}

setInterval(animate, 1000 / global.ANIMATION_FREQ);
setInterval(() => {
  if (!isGameStarted) return;
  generateCoins();
}, 1000);
