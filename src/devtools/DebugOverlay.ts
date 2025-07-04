import { Application, Text, TextStyle, Assets, Container } from "pixi.js";

await Assets.load({
  src: "/fonts/at01.ttf",
  data: {
    family: "at01",
  },
});

export class DebugOverlay {
  private app: Application;
  private debugText: Text;

  constructor(app: Application) {
    this.app = app;

    this.debugText = new Text({
      text: "Debug Mode",
      style: new TextStyle({
        fill: "#fffbe6",
        fontSize: 32,
        align: "center",
        fontFamily: "at01",
      }),
    });

    this.debugText.x = 16;
    this.debugText.y = 16;
  }

  public updateDebugInfo(info: string) {
    this.debugText.text = info;
  }

  public attachTo(container: Container) {
    container.addChild(this.debugText);
  }
}
