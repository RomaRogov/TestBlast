import { Node, Vec2, Vec3 } from "cc";
import { FieldController } from "./FieldController";
import { TilesPoolController } from "./TilesPoolController";
import { TileView } from "./TileView";

export enum TileColor {
    Blue,
    Green,
    Purple,
    Red,
    Yellow
}

export class TileController {
    
    private fieldController: FieldController;
    private tilesPoolController: TilesPoolController;
    private tileView: TileView;
    private position: Vec2;
    private viewPosition: Vec3 = new Vec3();
    private color: TileColor;

    constructor(fieldController: FieldController, tilesContainer: Node, tilesPoolController: TilesPoolController, initialX: number, initialY: number) {
        this.fieldController = fieldController;
        this.tilesPoolController = tilesPoolController;
        this.position = new Vec2(initialX, initialY);
        this.color = Math.floor(Math.random() * 5);

        this.tileView = this.tilesPoolController.getTile();
        this.fieldController.getTileViewPosition(this.position, this.viewPosition);
        this.tileView.setup(this.color, this.viewPosition, tilesContainer);
    }
}

