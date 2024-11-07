import { _decorator, Component, instantiate, Node, Prefab, Rect, UITransform, Vec2, Vec3 } from 'cc';
import { TileView } from './TileView';
const { ccclass, property } = _decorator;

@ccclass('FieldView')
export class FieldView extends Component {

    get tilesContainer() {
        return this.tailsParent.node;
    }

    @property({ type: Vec2 })
    private tileSize: Vec2;
    @property({ group: { name: 'BackgroundPadding'} })
    private paddingLeft: number = 0;
    @property({ group: { name: 'BackgroundPadding'} })
    private paddingRight: number = 0;
    @property({ group: { name: 'BackgroundPadding'} })
    private paddingTop: number = 0;
    @property({ group: { name: 'BackgroundPadding'} })
    private paddingBottom: number = 0;
    @property({ type: UITransform })
    private tailsParent: UITransform;
    
    private uiTransform: UITransform;
    private size: Vec2 = new Vec2(0, 0);

    public setSize(tilesAmountHorizontal: number, tilesAmountVertical: number)
    {
        this.uiTransform ??= this.node.getComponent(UITransform);
        this.size.set(
            this.tileSize.x * tilesAmountHorizontal,
            this.tileSize.y * tilesAmountVertical);
        this.uiTransform.setContentSize(
            this.size.x + this.paddingLeft + this.paddingRight,
            this.size.y + this.paddingTop + this.paddingBottom);
        this.tailsParent.setContentSize(this.size.x, this.size.y);
        this.tailsParent.node.position.set((this.paddingRight - this.paddingLeft) / 2, (this.paddingBottom - this.paddingTop) / 2);
    }

    public getTilePosition(pos: Vec2, out: Vec3)
    {
        out.set(
            this.size.x / 2 - pos.x * this.tileSize.x - this.tileSize.x / 2,
            -this.size.y / 2 + pos.y * this.tileSize.y + this.tileSize.y / 2);
    }
}

