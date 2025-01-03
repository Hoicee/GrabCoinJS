const knightAnimationList = {
  idle: [
    { x: 8 + 32 * 0, y: 8 },
    { x: 8 + 32 * 1, y: 8 },
    { x: 8 + 32 * 2, y: 8 },
    { x: 8 + 32 * 3, y: 8 },
  ],
  run: [
    { x: 8 + 32 * 0, y: 8 + 32 },
    { x: 8 + 32 * 1, y: 8 + 32 },
    { x: 8 + 32 * 2, y: 8 + 32 },
    { x: 8 + 32 * 3, y: 8 + 32 },
  ],
  roll: [
    // { x: 8 + 32 * 0, y: 8 + 32 * 2 },
    { x: 8 + 32 * 1, y: 8 + 32 * 2 },
    { x: 8 + 32 * 2, y: 8 + 32 * 2 },
    { x: 8 + 32 * 3, y: 8 + 32 * 2, w: 16 + 1, h: 20 + 1 }, //
    { x: 8 + 32 * 4, y: 8 + 32 * 2, w: 16 + 1, h: 20 + 1 }, //
    { x: 8 + 32 * 5, y: 8 + 32 * 2, w: 16 + 1, h: 20 + 1 }, //
    { x: 8 + 32 * 6, y: 8 + 32 * 2 },
    // { x: 8 + 32 * 7, y: 8 + 32 * 2 },
  ],
  hit: [{ x: 8 + 32 * 0, y: 8 + 32 * 3 }],
  death: [
    { x: 8 + 32 * 0, y: 8 + 32 * 4 },
    { x: 8 + 32 * 1, y: 8 + 32 * 4 },
    { x: 8 + 32 * 2, y: 8 + 32 * 4 },
    { x: 8 + 32 * 3, y: 8 + 32 * 4, w: 16 + 4 },
  ],
  jump: [{ x: 8 + 32 * 0, y: 8 + 32 }],
};

Object.keys(knightAnimationList).forEach((key) => {
  knightAnimationList[key + "Left"] = [];
  knightAnimationList[key].forEach((frame) => {
    knightAnimationList[key + "Left"].push({ ...frame, y: frame.y + 32 * 5 });
  });
});

knightAnimationList["rollLeft"][3].x -= 1;
knightAnimationList["rollLeft"][4].x -= 1;
knightAnimationList["rollLeft"][5].x -= 1;
knightAnimationList["rollLeft"][3].h += 1;
knightAnimationList["rollLeft"][4].h += 1;
knightAnimationList["rollLeft"][5].h += 1;

knightAnimationList["deathLeft"][3].x -= 4;

const coinAnimationList = {
  rotation: [
    { x: 3 + 16 * 0, y: 3 },
    { x: 3 + 16 * 1, y: 3 },
    { x: 3 + 16 * 2, y: 3 },
    { x: 3 + 16 * 3, y: 3 },
    { x: 3 + 16 * 4, y: 3 },
    { x: 3 + 16 * 5, y: 3 },
    { x: 3 + 16 * 6, y: 3 },
    { x: 3 + 16 * 7, y: 3 },
    { x: 3 + 16 * 8, y: 3 },
    { x: 3 + 16 * 9, y: 3 },
    { x: 3 + 16 * 10, y: 3 },
    { x: 3 + 16 * 11, y: 3 },
  ],
};
