import { Container, Point } from "pixi.js";

export class Camera extends Container {
  private target: Container | null = null;
  private followSpeed = 0.05;
  private deadzone = { x: 50, y: 50 };
  private bounds?: { minX: number; maxX: number; minY: number; maxY: number };

  constructor() {
    super();
  }

  public setTarget(target: Container) {
    this.target = target;
  }

  public setFollowSpeed(speed: number) {
    this.followSpeed = speed;
  }

  public setDeadzone(x: number, y: number) {
    this.deadzone = { x, y };
  }

  public setBounds(minX: number, maxX: number, minY: number, maxY: number) {
    this.bounds = { minX, maxX, minY, maxY };
  }

  public update(screenWidth: number, screenHeight: number) {
    if (!this.target) return;

    const targetX = this.target.x;
    const targetY = this.target.y;

    // calculate desired camera position (inverted because we move the world, not the camera)
    const desiredX = -targetX + screenWidth / 2;
    const desiredY = -targetY + screenHeight / 2;

    // apply deadzone - only move if target is outside deadzone
    const deltaX = desiredX - this.x;
    const deltaY = desiredY - this.y;

    if (Math.abs(deltaX) > this.deadzone.x) {
      this.x += deltaX * this.followSpeed;
    }

    if (Math.abs(deltaY) > this.deadzone.y) {
      this.y += deltaY * this.followSpeed;
    }

    // round to avoid sub-pixel positioning
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);

    // apply bounds if set
    if (this.bounds) {
      this.x = Math.max(this.bounds.minX, Math.min(this.bounds.maxX, this.x));
      this.y = Math.max(this.bounds.minY, Math.min(this.bounds.maxY, this.y));
    }
  }

  public screenToWorld(screenX: number, screenY: number): Point {
    return new Point(screenX - this.x, screenY - this.y);
  }

  public worldToScreen(worldX: number, worldY: number): Point {
    return new Point(worldX + this.x, worldY + this.y);
  }
}
