import { Container } from "pixi.js";

export class DebugLayer extends Container {
  constructor() {
    super();
    // add debug-specific setup here
  }
}

export class UILayer extends Container {
  constructor() {
    super();
    // add UI-specific setup here
  }
}

export class MainLayer extends Container {
  constructor() {
    super();
    // add layer-specific setup here
  }
}

export class BackgroundLayer extends Container {
  constructor() {
    super();
    // add background-specific setup here
  }
}
