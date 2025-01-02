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

export function checkCollision(position1, scale1, position2, scale2) {
  // Calculate the edges of the first object
  const left1 = position1.x;
  const right1 = position1.x + scale1.w;
  const top1 = position1.y;
  const bottom1 = position1.y + scale1.h;

  // Calculate the edges of the second object
  const left2 = position2.x;
  const right2 = position2.x + scale2.w;
  const top2 = position2.y;
  const bottom2 = position2.y + scale2.h;

  return right1 > left2 && left1 < right2 && bottom1 > top2 && top1 < bottom2;
}
