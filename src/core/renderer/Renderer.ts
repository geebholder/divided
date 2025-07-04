import { Application } from "pixi.js";
import { RenderLoop } from "./RenderLoop";
import {
  BackgroundLayer,
  MainLayer,
  UILayer,
  DebugLayer,
} from "./RenderLayers";

export class Renderer {
  public app: Application;
  private loop: RenderLoop;
  private backgroundLayer: BackgroundLayer;
  private mainLayer: MainLayer;
  private uiLayer: UILayer;
  private debugLayer: DebugLayer;
  private updateCallback?: (deltaMs: number) => void;

  constructor() {
    throw new Error("Use Renderer.create() instead of new Renderer()");
  }

  static async create() {
    const app = new Application();
    await app.init({
      resizeTo: window,
      antialias: false,
      autoStart: false,
    });

    document.body.appendChild(app.canvas);

    const backgroundLayer = new BackgroundLayer();
    const mainLayer = new MainLayer();
    const uiLayer = new UILayer();
    const debugLayer = new DebugLayer();

    // add layers in order: background -> main -> ui -> debug
    app.stage.addChild(backgroundLayer);
    app.stage.addChild(mainLayer);
    app.stage.addChild(uiLayer);
    app.stage.addChild(debugLayer);

    const renderer = Object.create(Renderer.prototype) as Renderer;
    renderer.app = app;
    renderer.backgroundLayer = backgroundLayer;
    renderer.mainLayer = mainLayer;
    renderer.uiLayer = uiLayer;
    renderer.debugLayer = debugLayer;
    renderer.loop = new RenderLoop(app, renderer.update.bind(renderer));
    return renderer;
  }

  private update(deltaMs: number) {
    if (this.updateCallback) {
      this.updateCallback(deltaMs);
    }
    // game logic for each frame goes here
  }

  public setUpdateCallback(callback: (deltaMs: number) => void) {
    this.updateCallback = callback;
  }

  public start() {
    this.loop.start();
  }

  public stop() {
    this.loop.stop();
  }

  public getBackgroundLayer(): BackgroundLayer {
    return this.backgroundLayer;
  }

  public getMainLayer(): MainLayer {
    return this.mainLayer;
  }

  public getUILayer(): UILayer {
    return this.uiLayer;
  }

  public getDebugLayer(): DebugLayer {
    return this.debugLayer;
  }
}
