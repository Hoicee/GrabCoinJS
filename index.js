const canvas = document.querySelector(".main-layer");
// CONTEXT
const GAME_WIDTH = 512;
const GAME_HEIGHT = 768;
const USE_FREQUENCY = 60;
const FALL_SPEED = 3.2;
const PLAYER_SPEED = 3.2;

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

let collectList = [];
let keys = new Set();

class Sprite {
  framePosition = 0;
  onGround = false;

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
    if (this.position.y + TILE_SIZE * 2 >= GAME_HEIGHT) {
      this.onGround = true;
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

class Knight {
  constructor({ image }) {
    this.position = {
      x: GAME_WIDTH / 2 - TILE_SIZE,
      y: GAME_HEIGHT - TILE_SIZE * 2 - 24,
    };
    this.image = image;
  }

  draw() {
    c.drawImage(
      this.image,
      0,
      0,
      32,
      32,
      this.position.x,
      this.position.y,
      TILE_SIZE * 2,
      TILE_SIZE * 2
    );

    this.move();
  }

  move() {
    let lastKey = Array.from(keys).pop();

    if (lastKey == "w") {
    } else if (lastKey == "a") {
      if (this.position.x + 16 <= 0) {
        return;
      }

      this.position.x -= PLAYER_SPEED;
    } else if (lastKey == "s") {
    } else if (lastKey == "d") {
      if (this.position.x + TILE_SIZE + 16 >= GAME_WIDTH) {
        return;
      }

      this.position.x += PLAYER_SPEED;
    }
  }

  jump() {}

  dash() {}
}

let knight = new Knight({ image: knightImage });
let collectedAmount = 0;

function animate() {
  c.fillStyle = "lightblue";
  c.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
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
}, 1000);

window.addEventListener("keydown", (e) => {
  switch (e.key) {
    // case "w":
    //   keys.add("w");
    //   break;
    case "a":
      keys.add("a");
      break;
    // case "s":
    //   keys.add("s");
    //   break;
    case "d":
      keys.add("d");
      break;
  }
});

window.addEventListener("keyup", (e) => {
  switch (e.key) {
    // case "w":
    //   keys.delete("w");
    //   break;
    case "a":
      keys.delete("a");
      break;
    // case "s":
    //   keys.delete("s");
    //   break;
    case "d":
      keys.delete("d");
      break;
  }
});

// position: {x: ?, y: ?}
// scale: { w: ?, h: ?}
function checkColision(position1, scale1, position2, scale2) {}

class teste {
  carambolas = 0;

  constructor(args) {
    this.nome = args.nome;
    this.idade = args.idade;
  }
}

class testeFilho extends teste {
  constructor(args) {
    super(args);
    this.nome_pai = args.nome_pai;
  }
}

let testeInstance = new testeFilho({
  nome: "jose",
  idade: 24,
  nome_pai: "claudio",
});

console.log("aqui", testeInstance);
