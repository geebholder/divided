import { Container } from "pixi.js";

export class BackgroundLayer extends Container {
  constructor() {
    super();
    this.zIndex = 0; // bg and parallax
  }
}

export class MapLayerBelow extends Container {
  constructor() {
    super();
    this.zIndex = 1; // behind the player
  }
}

export class MainLayer extends Container {
  constructor() {
    super();
    this.zIndex = 2; // player + vfx and such
  }
}

export class MapLayerAbove extends Container {
  constructor() {
    super();
    this.zIndex = 3; //front of the player
  }
}

export class UILayer extends Container {
  constructor() {
    super();
    this.zIndex = 4; // ui
  }
}

export class DebugLayer extends Container {
  constructor() {
    super();
    this.zIndex = 5; // debug ui
  }
}
