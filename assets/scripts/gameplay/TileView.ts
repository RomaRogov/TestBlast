import { _decorator, Component, Enum, EventMouse, EventTouch, Input, input, Node, Sprite, SpriteFrame, Vec3 } from 'cc';
import { TileColor, TileController } from './TileController';
import { Action } from '../common/ActionType';
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
    private currentController: TileController;
    private onClick: Action;

    protected onLoad(): void {
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    public setup(controller: TileController, position: Vec3, parent: Node, onClick: Action) {
        this.currentController = controller;
        this.setColor(this.currentController.color);
        this.node.position = position;
        this.node.parent = parent;
        this.onClick = onClick;
    }

    public setColor(color: TileColor) {
        this.sprite ??= this.getComponent(Sprite);
        this.sprite.spriteFrame = this.colors[color].sprite;
    }

    private onTouchEnd(e: EventTouch) {
        if (this.onClick) {
            this.onClick();
        }
    }
}

