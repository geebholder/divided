import { Application } from "pixi.js";
import { Clock } from "../time/Clock";

type UpdateFunction = (deltaMs: number) => void;

export class RenderLoop {
  private app: Application;
  private clock: Clock;
  private updateFn: UpdateFunction;
  private running = false;

  constructor(app: Application, updateFn: UpdateFunction) {
    this.app = app;
    this.updateFn = updateFn;
    this.clock = new Clock(60);
  }

  public start() {
    this.running = true;
    this.loop();
  }

  public stop() {
    this.running = false;
  }

  private loop = () => {
    if (!this.running) return;

    this.clock.tick(this.updateFn);
    this.app.render();
    requestAnimationFrame(this.loop);
  };
}
