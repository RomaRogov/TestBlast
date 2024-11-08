import { instantiate, Prefab } from "cc";
import { FieldData } from "../data/GameBalanceData";
import { TileView } from "./TileView";

export class TilesPoolController {

    private tiles: TileView[] = [];

    constructor(tileViewPrefab: Prefab, fieldData: FieldData) {
        let tilesCount = fieldData.size.x * fieldData.size.y;

        for (let i = 0; i < tilesCount; i++) {
            let tileView = instantiate(tileViewPrefab).getComponent(TileView);
            if (!tileView) {
                console.error('Tile prefab does not contain TileView component');
                return;
            }
            this.tiles.push(tileView);
        }
    }

    getTile(): TileView {
        if (this.tiles.length === 0) {
            console.error('No tiles in pool');
            return null;
        }

        return this.tiles.pop();
    }

    returnTile(tile: TileView) {
        this.tiles.push(tile);
    }
}

