import { Texture, Sprite, Container, Rectangle } from "pixi.js";
import { loadTiledMap } from "./TiledMapLoader";
import type { TiledTileset, TiledMap } from "./TiledMapLoader";

function getTilesetForGid(tilesets: TiledTileset[], gid: number) {
  let selected = null;
  for (const ts of tilesets) {
    if (gid >= ts.firstgid) selected = ts;
    else break;
  }
  return selected;
}

export async function loadTiledMapAndSprites(
  mapPath: string,
  layerName?: string
): Promise<{ map: TiledMap; container: Container }> {
  const { map, tilesetTextures } = await loadTiledMap(mapPath);
  const mapContainer = new Container();

  for (const layer of map.layers) {
    if (
      layer.type !== "tilelayer" ||
      !layer.visible ||
      (layerName && !layer.name.startsWith(layerName))
    ) {
      continue;
    }

    const chunks = layer.chunks || [
      {
        data: layer.data,
        x: layer.x || 0,
        y: layer.y || 0,
        width: layer.width,
        height: layer.height,
      },
    ];

    for (const chunk of chunks) {
      for (let i = 0; i < chunk.data.length; i++) {
        const FLIP_MASK = 0x1fffffff;
        let rawGid = chunk.data[i];
        let gid = rawGid & FLIP_MASK;
        if (gid === 0) continue;

        const tileset = getTilesetForGid(map.tilesets, gid);
        if (!tileset) continue;

        const tilesetIndex = map.tilesets.indexOf(tileset);
        const texture = tilesetTextures[tilesetIndex];

        const localId = gid - tileset.firstgid;
        const cols = tileset.columns || 1;
        const tileW = tileset.tilewidth || map.tilewidth;
        const tileH = tileset.tileheight || map.tileheight;

        const sx = (localId % cols) * tileW;
        const sy = Math.floor(localId / cols) * tileH;

        const tileTexture = new Texture({
          source: texture.source,
          frame: new Rectangle(sx, sy, tileW, tileH),
        });

        const x = (i % chunk.width) + chunk.x;
        const y = Math.floor(i / chunk.width) + chunk.y;

        const sprite = new Sprite(tileTexture);
        sprite.x = x * tileW;
        sprite.y = y * tileH;

        mapContainer.addChild(sprite);
      }
    }
  }

  return { map, container: mapContainer };
}
