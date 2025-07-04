import { Assets, Texture } from "pixi.js";

export interface TiledTileset {
  firstgid: number;
  image?: string;
  source?: string;
  imagewidth?: number;
  imageheight?: number;
  name?: string;
  tilewidth?: number;
  tileheight?: number;
  tilecount?: number;
  columns?: number;
}

export interface TiledMap {
  width: number;
  height: number;
  tilewidth: number;
  tileheight: number;
  tilesets: TiledTileset[];
  layers: any[];
}

async function loadTilesetImage(tileset: TiledTileset): Promise<string> {
  if (tileset.image) {
    return tileset.image;
  }
  if (tileset.source) {
    const tsxPath = "assets/tilesets/" + tileset.source.replace(/^.*[\\/]/, "");
    const response = await fetch(tsxPath);
    const tsxText = await response.text();

    // parse the XML to get tileset properties
    const parser = new DOMParser();
    const doc = parser.parseFromString(tsxText, "text/xml");
    const tilesetElement = doc.querySelector("tileset");
    const imageElement = doc.querySelector("image");

    if (!tilesetElement) throw new Error(`no tileset found in: ${tsxPath}`);
    if (!imageElement) throw new Error(`no image found in tileset: ${tsxPath}`);

    // populate tileset properties from the .tsx file
    tileset.tilewidth = parseInt(
      tilesetElement.getAttribute("tilewidth") || "0"
    );
    tileset.tileheight = parseInt(
      tilesetElement.getAttribute("tileheight") || "0"
    );
    tileset.tilecount = parseInt(
      tilesetElement.getAttribute("tilecount") || "0"
    );
    tileset.columns = parseInt(tilesetElement.getAttribute("columns") || "1");
    tileset.name = tilesetElement.getAttribute("name") || "";
    tileset.imagewidth = parseInt(imageElement.getAttribute("width") || "0");
    tileset.imageheight = parseInt(imageElement.getAttribute("height") || "0");

    return imageElement.getAttribute("source") || "";
  }
  throw new Error("tileset has no image or source");
}

export async function loadTiledMap(
  mapPath: string
): Promise<{ map: TiledMap; tilesetTextures: Texture[] }> {
  const response = await fetch(mapPath);
  if (!response.ok) throw new Error(`Map not loaded: ${mapPath}`);
  const map = await response.json();

  const tilesetTextures: Texture[] = [];
  for (const tileset of map.tilesets) {
    const imagePath = await loadTilesetImage(tileset);
    const imageFile = "assets/tilesets/" + imagePath.replace(/^.*[\\/]/, "");
    const texture = await Assets.load<Texture>(imageFile);
    tilesetTextures.push(texture);
    console.log(
      `loaded tileset: ${tileset.name || tileset.source} from ${imageFile}`,
      texture
    );
  }

  console.log("loaded map:", map);

  return { map, tilesetTextures };
}
