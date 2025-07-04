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

  // background visuals (checkerboard, parallax, etc)
  const checkerboard = new Checkerboard(
    renderer.app.screen.width,
    renderer.app.screen.height
  );
  renderer.getBackgroundLayer().addChild(checkerboard);

  const { container: mapContainerBelow } = await loadTiledMapAndSprites(
    "assets/maps/testmap.tmj",
    "below"
  );

  const { container: mapContainerAbove } = await loadTiledMapAndSprites(
    "assets/maps/testmap.tmj",
    "above"
  );

  // create main world container for player + any shared entities
  const worldMainContainer = new Container();

  // player setup
  const player = new Player();
  player.x = 400;
  player.y = 300;
  worldMainContainer.addChild(player);

  // add mapContainerBelow to MapLayerBelow
  renderer.getMapLayerBelow().addChild(mapContainerBelow);

  // add player to MainLayer
  renderer.getMainLayer().addChild(worldMainContainer);

  // add mapContainerAbove to MapLayerAbove
  renderer.getMapLayerAbove().addChild(mapContainerAbove);

  // create a single camera controlling offsets
  const cameraController = new CameraController(worldMainContainer);
  cameraController.setTarget(player);
  cameraController.setFollowSpeed(0.1);
  cameraController.setDeadzone(20, 20);

  // debug overlay
  const debugOverlay = new DebugOverlay(renderer.app);
  debugOverlay.attachTo(renderer.getDebugLayer());

  // update loop
  renderer.setUpdateCallback((deltaMs: number) => {
    const input = inputManager.getMovementInput();
    player.update(deltaMs, input);

    cameraController.update(
      renderer.app.screen.width,
      renderer.app.screen.height
    );

    // invert camera position on world containers
    const cam = cameraController.getCamera();
    mapContainerBelow.position.set(cam.x, cam.y);
    worldMainContainer.position.set(cam.x, cam.y);
    mapContainerAbove.position.set(cam.x, cam.y);
  });
}
