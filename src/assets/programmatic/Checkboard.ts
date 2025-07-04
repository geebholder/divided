import { TilingSprite, Texture, Ticker } from "pixi.js";
import { generateCheckerboard } from "./generateCheckboard";

export class Checkerboard extends TilingSprite {
  private speed: number;

  constructor(width: number, height: number, tileSize = 32, speed = 0.42) {
    const texture = Texture.from(generateCheckerboard(tileSize));
    super({
      texture,
      width,
      height,
    });

    this.speed = speed;

    Ticker.shared.add(this.updateScroll, this);
  }

  private updateScroll = (ticker: Ticker) => {
    this.tilePosition.x += this.speed * ticker.deltaTime;
    this.tilePosition.y += this.speed * ticker.deltaTime;
  };

  destroy() {
    Ticker.shared.remove(this.updateScroll, this);
    super.destroy();
  }
}
