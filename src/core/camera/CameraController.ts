import { Camera } from "./Camera";
import { Container } from "pixi.js";

export class CameraController {
  private camera: Camera;
  private worldContainer: Container;

  constructor(worldContainer: Container) {
    this.camera = new Camera();
    this.worldContainer = worldContainer;

    // add camera as parent of world container
    this.camera.addChild(this.worldContainer);
  }

  public setTarget(target: Container) {
    this.camera.setTarget(target);
  }

  public update(screenWidth: number, screenHeight: number) {
    this.camera.update(screenWidth, screenHeight);
  }

  public getCamera(): Camera {
    return this.camera;
  }

  public setFollowSpeed(speed: number) {
    this.camera.setFollowSpeed(speed);
  }

  public setDeadzone(x: number, y: number) {
    this.camera.setDeadzone(x, y);
  }

  public setBounds(minX: number, maxX: number, minY: number, maxY: number) {
    this.camera.setBounds(minX, maxX, minY, maxY);
  }
}
