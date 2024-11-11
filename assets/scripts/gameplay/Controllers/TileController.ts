import { Color, Node, Sprite, Vec2, Vec3 } from "cc";
import { FieldController } from "./FieldController";
import { TilesPoolController } from "./TilesPoolController";
import { TileView } from "../TileView";
import { Action } from "../../common/ActionType";

export enum TileColor {
    Blue,
    Green,
    Purple,
    Red,
    Yellow
}

export class TileController {
    
    public color: number;
    public position: Vec2;
    public get isAnimating():boolean { return this.animating; }

    private fieldController: FieldController;
    private tilesPoolController: TilesPoolController;
    private tileView: TileView;
    private viewPosition: Vec3 = new Vec3();
    private animating: boolean = false;

    constructor(fieldController: FieldController, tilesContainer: Node, tilesPoolController: TilesPoolController, initialX: number, initialY: number) {
        this.fieldController = fieldController;
        this.tilesPoolController = tilesPoolController;
        this.position = new Vec2(initialX, initialY);
        this.color = Math.floor(Math.random() * tilesPoolController.tileColorsVariants);

        this.tileView = this.tilesPoolController.getTile();
        this.fieldController.getTileViewPosition(this.position, this.viewPosition);
        this.tileView.setup(this, this.viewPosition, tilesContainer, this.onClick.bind(this));
    }

    public fallToPosition(x: number, y: number, blocksToFall: number, onFallComplete: Action) {
        this.position.set(x, y);
        this.animating = true;
        this.fieldController.getTileViewPosition(this.position, this.viewPosition)
        this.tileView.animateFall(this.viewPosition, blocksToFall, () => { 
            this.animating = false; 
            if (onFallComplete) {
                onFallComplete();
            }
        });
    }

    public shuffleToPosition(x: number, y: number, onAnimComplete: Action) {
        this.position.set(x, y);
        this.animating = true;
        this.fieldController.getTileViewPosition(this.position, this.viewPosition);
        this.tileView.animateShuffle(this.viewPosition, () => { 
            this.fixSiblingIndex();
            this.animating = false;
            if (onAnimComplete) {
                onAnimComplete();
            }
        });
    }

    public fixSiblingIndex() {
        this.tileView.node.setSiblingIndex(this.position.x * this.fieldController.fieldSizeY + this.position.y);
    }

    public makeExpolosion() {
        this.tilesPoolController.performExplosion(this.tileView);
    }

    public dispose() {
        this.tileView.reset();
        this.tilesPoolController.returnTile(this.tileView);
        this.tileView = null;
        this.fieldController = null;
        this.tilesPoolController = null;
        this.viewPosition = null;
        this.position = null;
    }

    private onClick() {
        if (this.animating) {
            return;
        }
        this.fieldController.onTileClick(this);
    }
}

