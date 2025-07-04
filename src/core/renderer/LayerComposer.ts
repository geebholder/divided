import { Renderer } from "./Renderer";
import { DebugOverlay } from "../../devtools/DebugOverlay";
import { Player } from "../../game/player/Player";
import { InputManager } from "../../core/input/InputManager";
import { Checkerboard } from "../../assets/programmatic/Checkboard";
import { loadTiledMapAndSprites } from "../map/TilemapRenderer";
import { CameraController } from "../camera/CameraController";
import { Container } from "pixi.js";

export async function composeScene(renderer: Renderer) {
  const inputManager = new InputManager();

  // create world container for all game objects
  const worldContainer = new Container();

  // create camera controller
  const cameraController = new CameraController(worldContainer);

  const debugOverlay = new DebugOverlay(renderer.app);
  debugOverlay.attachTo(renderer.getDebugLayer());

  const player = new Player();
  player.x = 400; // set initial position
  player.y = 300;
  worldContainer.addChild(player);

  // set camera to follow player
  cameraController.setTarget(player);
  cameraController.setFollowSpeed(0.08);
  cameraController.setDeadzone(20, 20);

  const checkerboard = new Checkerboard(
    renderer.app.screen.width,
    renderer.app.screen.height
  );
  worldContainer.addChild(checkerboard);

  const { container: mapContainer } = await loadTiledMapAndSprites(
    "assets/maps/testmap.tmj"
  );
  worldContainer.addChild(mapContainer);

  // add camera (with world as child) to main layer
  renderer.getMainLayer().addChild(cameraController.getCamera());

  // add update loop to renderer
  renderer.setUpdateCallback((deltaMs: number) => {
    const input = inputManager.getMovementInput();
    player.update(deltaMs, input);

    // update camera
    cameraController.update(
      renderer.app.screen.width,
      renderer.app.screen.height
    );
  });
}
