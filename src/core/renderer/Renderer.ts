import { Application } from "pixi.js";
import { RenderLoop } from "./RenderLoop";
import {
  BackgroundLayer,
  MapLayerBelow,
  MainLayer,
  MapLayerAbove,
  UILayer,
  DebugLayer,
} from "./RenderLayers";

export class Renderer {
  public app: Application;
  private loop: RenderLoop;
  private backgroundLayer: BackgroundLayer;
  private mapLayerBelow: MapLayerBelow;
  private mainLayer: MainLayer;
  private mapLayerAbove: MapLayerAbove;
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
    const mapLayerBelow = new MapLayerBelow();
    const mainLayer = new MainLayer();
    const mapLayerAbove = new MapLayerAbove();
    const uiLayer = new UILayer();
    const debugLayer = new DebugLayer();

    // add layers in z order: background -> map below ->
    // player -> map above -> ui -> debug
    app.stage.addChild(backgroundLayer);
    app.stage.addChild(mapLayerBelow);
    app.stage.addChild(mainLayer);
    app.stage.addChild(mapLayerAbove);
    app.stage.addChild(uiLayer);
    app.stage.addChild(debugLayer);

    const renderer = Object.create(Renderer.prototype) as Renderer;
    renderer.app = app;
    renderer.backgroundLayer = backgroundLayer;
    renderer.mapLayerBelow = mapLayerBelow;
    renderer.mainLayer = mainLayer;
    renderer.mapLayerAbove = mapLayerAbove;
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

  public getMapLayerBelow(): MapLayerBelow {
    return this.mapLayerBelow;
  }

  public getMainLayer(): MainLayer {
    return this.mainLayer;
  }

  public getMapLayerAbove(): MapLayerAbove {
    return this.mapLayerAbove;
  }

  public getUILayer(): UILayer {
    return this.uiLayer;
  }

  public getDebugLayer(): DebugLayer {
    return this.debugLayer;
  }
}
