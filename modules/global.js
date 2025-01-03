export const GAME_WIDTH = 512;
export const GAME_HEIGHT = 768;

export const BASE_ANIMATION_FREQ = 60;
export const ANIMATION_FREQ = 120;
export const FREQ_RATIO = BASE_ANIMATION_FREQ / ANIMATION_FREQ;

export const FALL_SPEED = 3.2 * FREQ_RATIO; // COIN LINEAR FALL SPEED.
export const GRAVITY = 1.6 * FREQ_RATIO; // GRAVITY IN PIXELS / FRAME^2 (NOT USED YET);

export const PLAYER_SPEED = 3.2 * FREQ_RATIO;
export const DASH_SPEED_MULT = 1.6;
export const DASH_TIME = 500;
export const DASH_RELOAD = 1500;
export const MAX_LIFES = 3;

export const TILE_DEFAULT = 16;
export const TILE_SIZE = 32;
export const TILE_MULT = TILE_SIZE / TILE_DEFAULT;
