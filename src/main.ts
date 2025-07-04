import { Renderer } from "./core/renderer/Renderer";
import { composeScene } from "./core/renderer/LayerComposer";
import { loadTiledMap } from "./core/map/TiledMapLoader";

(async () => {
  const renderer = await Renderer.create();
  composeScene(renderer);
  renderer.start();
  loadTiledMap("assets/maps/testmap.tmj");
})();
