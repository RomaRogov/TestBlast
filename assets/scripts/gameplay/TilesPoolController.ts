import { instantiate, Prefab } from "cc";
import { GameBalanceData } from "../data/GameBalanceData";
import { TileView } from "./TileView";

export class TilesPoolController {

    public get tileColorsVariants() : number { return Math.min(this.tileColors, this.tiles.length); }

    private tiles: TileView[] = [];
    private tileColors: number;

    constructor(tileViewPrefab: Prefab, gameBalanceData: GameBalanceData) {
        let tilesCount = gameBalanceData.field.size.x * gameBalanceData.field.size.y;
        this.tileColors = gameBalanceData.tileColorVariants;

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

