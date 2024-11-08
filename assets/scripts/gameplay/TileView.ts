import { _decorator, Component, Enum, Node, Sprite, SpriteFrame, Vec3 } from 'cc';
import { TileColor } from './TileController';
const { ccclass, property } = _decorator;

@ccclass('TileColorSprite')
export class TileColorSprite {
    @property({ type: SpriteFrame })
    public sprite: SpriteFrame = null;
    @property({ type: Enum(TileColor) })
    public color: TileColor = TileColor.Blue;
}

@ccclass('TileView')
export class TileView extends Component {
    
    @property({ type: TileColorSprite })
    public colors: TileColorSprite[] = [];

    private sprite: Sprite;

    public setup(color: TileColor, position: Vec3, parent: Node) {
        this.setColor(color);
        this.node.position = position;
        this.node.parent = parent;
    }

    public setColor(color: TileColor) {
        this.sprite ??= this.getComponent(Sprite);
        this.sprite.spriteFrame = this.colors[color].sprite;
    }
}

