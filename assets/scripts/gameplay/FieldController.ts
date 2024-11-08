import { EventHandler, Vec2, Vec3 } from "cc";
import { FieldData } from "../data/GameBalanceData";
import { FieldView } from "./FieldView";
import { TilesPoolController } from "./TilesPoolController";
import { TileColor, TileController } from "./TileController";

export class FieldController {

    private fieldView: FieldView;
    private tileControllers: TileController[][] = [];

    constructor(fieldView: FieldView, tilesPool: TilesPoolController, fieldData: FieldData) {
        this.fieldView = fieldView;
        fieldView.setSize(fieldData.size.x, fieldData.size.y);
        
        for (let i = 0; i < fieldData.size.x; i++) {
            this.tileControllers[i] = [];
            for (let j = 0; j < fieldData.size.y; j++) {
                let tileController = new TileController(this, fieldView.tilesContainer, tilesPool, i, j);
                this.tileControllers[i][j] = tileController;
            }
        }
    }

    public getTileViewPosition(pos: Vec2, out: Vec3) {
        this.fieldView.getTilePosition(pos, out);
    }

    public onTileClick(tile: TileController) {
        console.log('FieldController.onTileClick: ' + TileColor[tile.color] + " [ " + tile.position.x + " | " + tile.position.y + " ]");
    }
}