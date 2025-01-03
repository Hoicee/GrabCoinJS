import * as global from "./global.js";

export class Sprite {
  #animationInterval = null;
  #animationLock = false; // Flag to lock animation changes

  constructor({
    ctx,
    image,
    position,
    velocity,
    scaleFactor,
    cropPosition,
    cropScale,
    animationList,
    animationCurr,
    animationFrame,
    animationFinished,
    animationIntervalTime,
  }) {
    this.ctx = ctx;
    this.image = image;
    this.position = position;
    this.velocity = velocity || { x: 0, y: 0 };
    this.scaleFactor = scaleFactor || { w: 1, h: 1 };
    this.cropPosition = cropPosition || { x: 0, y: 0 };
    this.cropScale = cropScale || { w: image.width, h: image.height };

    this.animationList = animationList || {};
    this.animationCurr = animationCurr || "";
    this.animationFrame = animationFrame || 0;
    this.animationFinished = animationFinished || function () {};
    this.animationIntervalTime = animationIntervalTime || 0;

    this.resetAnimation();
  }

  draw() {
    let frame = this.getAnimationFrame();

    let cropScale = {
      w: frame.w || this.cropScale.w,
      h: frame.h || this.cropScale.h,
    };

    this.ctx.drawImage(
      this.image,
      frame.x || this.cropPosition.x,
      frame.y || this.cropPosition.y,
      cropScale.w,
      cropScale.h,
      this.position.x,
      this.position.y,
      cropScale.w * this.scaleFactor.w,
      cropScale.h * this.scaleFactor.h
    );

    this.move();
  }

  getHeight() {
    return (
      (this.getAnimationFrame().h || this.cropScale.h) * this.scaleFactor.h
    );
  }

  getWidth() {
    return (
      (this.getAnimationFrame().w || this.cropScale.w) * this.scaleFactor.w
    );
  }

  move() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }

  animate() {
    if (!this.canUseAnimation()) return;
    this.animationFrame = this.animationFrame + 1;

    if (this.animationFrame >= this.animationList[this.animationCurr].length) {
      this.animationFrame = 0;
      this.animationFinished(this);
    }
  }

  resetAnimation() {
    clearInterval(this.#animationInterval);

    this.animationFrame = 0;
    this.#animationInterval = setInterval(
      () => this.animate(),
      this.animationIntervalTime
    );
  }

  changeAnimation(animationCurr, animationIntervalTime) {
    if (this.#animationLock) return; // Prevent change if animation is locked
    this.animationIntervalTime = animationIntervalTime;

    if (this.animationCurr != animationCurr) {
      this.animationCurr = animationCurr;
      this.resetAnimation();
    }
  }

  // Lock the animation for a specified duration
  lockAnimation(duration) {
    this.#animationLock = true;
    setTimeout(() => {
      this.#animationLock = false;
    }, duration);
  }

  canUseAnimation() {
    return this.animationCurr != "" && this.animationCurr in this.animationList;
  }

  getAnimationFrame() {
    return this.canUseAnimation()
      ? this.animationList[this.animationCurr][this.animationFrame]
      : {};
  }
}
