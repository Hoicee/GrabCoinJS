export function loadImages(images) {
  return Promise.all(
    images.map((img) => {
      return new Promise((resolve, reject) => {
        img.onload = resolve; // Resolve the promise when the image loads
        img.onerror = reject; // Reject the promise if there's an error
      });
    })
  );
}

export function getRandomIntInRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function checkCollision(rec1, rec2) {
  // Calculate the edges of the first object
  const left1 = rec1.x;
  const right1 = rec1.x + rec1.w;
  const top1 = rec1.y;
  const bottom1 = rec1.y + rec1.h;

  // Calculate the edges of the second object
  const left2 = rec2.x;
  const right2 = rec2.x + rec2.w;
  const top2 = rec2.y;
  const bottom2 = rec2.y + rec2.h;

  return right1 > left2 && left1 < right2 && bottom1 > top2 && top1 < bottom2;
}

export function drawText(
  ctx,
  text,
  {
    color = "black",
    textSize = "12px",
    fontFamily = "arial",
    textAlign = "left",
    textBaseline = "top",
    position = { x: 0, y: 0 },
  }
) {
  if (!ctx) return;

  ctx.fillStyle = color;
  ctx.font = `${textSize} ${fontFamily}`;
  ctx.textAlign = textAlign;
  ctx.textBaseline = textBaseline;
  ctx.fillText(text, position.x, position.y);
}
