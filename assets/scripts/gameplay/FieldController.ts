import { EventHandler, Vec2, Vec3 } from "cc";
import { FieldData } from "../data/GameBalanceData";
import { FieldView } from "./FieldView";
import { Action, InitializableController } from "./ControllersManager";
import { TilesPoolController } from "./TilesPoolController";
import { TileController } from "./TileController";

export class FieldController implements InitializableController {
    
    isInitialized: boolean = false;
    finishInitializationHandler: Action;

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
        
        this.isInitialized = true;
        if (this.finishInitializationHandler)
            this.finishInitializationHandler();
    }

    public getTileViewPosition(pos: Vec2, out: Vec3) {
        this.fieldView.getTilePosition(pos, out);
    }
}