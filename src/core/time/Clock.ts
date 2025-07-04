export class Clock {
  private readonly step: number;
  private accumulator = 0;
  private lastTime = performance.now();

  constructor(ticksPerSecond = 60) {
    this.step = 1000 / ticksPerSecond;
  }

  public tick(callback: (deltaMs: number) => void) {
    const now = performance.now();
    let delta = now - this.lastTime;
    this.lastTime = now;

    this.accumulator += delta;

    while (this.accumulator >= this.step) {
      callback(this.step);
      this.accumulator -= this.step;
    }
  }

  public reset() {
    this.lastTime = performance.now();
    this.accumulator = 0;
  }
}
