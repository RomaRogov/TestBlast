import { _decorator, Component, easing, Enum, EventMouse, EventTouch, Input, input, Node, Sprite, SpriteFrame, Tween, tween, Vec3 } from 'cc';
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
    @property private fallingDuration: number = 0.15;
    @property private shufflingDuration: number = 0.3;

    private sprite: Sprite;
    private currentController: TileController;
    private onClick: Action;
    private currentTween: Tween;

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

    public animateFall(position: Vec3, blocksToFall: number, callback: Action) {
        if (this.currentTween) {
            this.currentTween.stop();
        }
        this.currentTween = tween(this.node)
            .to(blocksToFall * this.fallingDuration, { position: position }, { easing: 'bounceOut', onComplete: callback }).start();
    }

    public animateShuffle(position: Vec3, callback: Action) {
        if (this.currentTween) {
            this.currentTween.stop();
        }
        this.currentTween = tween(this.node)
            .to(this.shufflingDuration, { position: position }, { easing: 'expoInOut', onComplete: callback }).start();
    }

    public reset() {
        this.currentTween?.stop();
        this.currentTween = null;
        this.node.parent = null;
        this.currentController = null;
        this.onClick = null;
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

