import { Graphics, Container } from "pixi.js";
import type { MovementInput } from "../../core/input/InputManager";

export class Player extends Container {
  private velocity = { x: 0, y: 0 };
  private walkSpeed = 6;
  private runSpeed = 12;
  private acceleration = 1;
  private friction = 0.15;

  constructor() {
    super();

    const playerGraphics = new Graphics()
      .rect(0, 0, 24, 32)
      .fill({ color: 0x00ff00 });

    this.addChild(playerGraphics);
  }

  public update(deltaMs: number, input: MovementInput) {
    const targetSpeed = input.isRunning ? this.runSpeed : this.walkSpeed;
    const targetVelocityX = input.x * targetSpeed;
    const targetVelocityY = input.y * targetSpeed;

    // smooth acceleration/deceleration
    this.velocity.x += (targetVelocityX - this.velocity.x) * this.acceleration;
    this.velocity.y += (targetVelocityY - this.velocity.y) * this.acceleration;

    // apply friction when no input
    if (input.x === 0) {
      this.velocity.x *= 1 - this.friction;
    }
    if (input.y === 0) {
      this.velocity.y *= 1 - this.friction;
    }

    // update position
    this.x += this.velocity.x * deltaMs * 0.016; // normalize to 60fps
    this.y += this.velocity.y * deltaMs * 0.016;
  }
}
