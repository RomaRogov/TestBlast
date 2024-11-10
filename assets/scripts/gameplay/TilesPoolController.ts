import { instantiate, Prefab } from "cc";
import { GameBalanceData } from "../data/GameBalanceData";
import { TileView } from "./TileView";

export class TilesPoolController {

    public get tileColorsVariants() : number { return Math.min(this.tileColors, this.availableTileColors); }

    private tiles: TileView[] = [];
    private tileColors: number;
    private availableTileColors: number;

    constructor(tileViewPrefab: Prefab, gameBalanceData: GameBalanceData) {
        let tilesCount = gameBalanceData.field.size.x * gameBalanceData.field.size.y;

        for (let i = 0; i < tilesCount; i++) {
            let tileView = instantiate(tileViewPrefab).getComponent(TileView);
            if (!tileView) {
                console.error('Tile prefab does not contain TileView component');
                return;
            }
            this.tiles.push(tileView);
        }

        this.tileColors = gameBalanceData.tileColorVariants;
        this.availableTileColors = this.tiles[0].colors.length;
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

