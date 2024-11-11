import { _decorator, Color, Component, Enum, EventTouch, Node, Sprite, SpriteFrame, Tween, tween, Vec3 } from 'cc';
import { Action } from '../common/ActionType';
import { TileColor, TileController } from './Controllers/TileController';
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
    @property private fadingDuration: number = 0.2;

    private sprite: Sprite;
    private currentController: TileController;
    private onClick: Action;
    private movingTween: Tween;
    private fadingTween: Tween;

    protected onLoad(): void {
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    public setup(controller: TileController, position: Vec3, parent: Node, onClick: Action) {
        this.currentController = controller;
        this.setColor(this.currentController.color);
        this.node.position = position;
        this.node.parent = parent;
        this.onClick = onClick;

        this.sprite.color = new Color(255, 255, 255, 0);
        this.fadingTween = tween(this.sprite)
            .to(0.2, { color: Color.WHITE }, { easing: 'sineOut' }).start();
    }

    public animateFall(position: Vec3, blocksToFall: number, callback: Action) {
        if (this.movingTween) {
            this.movingTween.stop();
        }
        this.movingTween = tween(this.node)
            .to(blocksToFall * this.fallingDuration, { position: position }, { easing: 'bounceOut', onComplete: callback }).start();
    }

    public animateShuffle(position: Vec3, callback: Action) {
        if (this.movingTween) {
            this.movingTween.stop();
        }
        this.movingTween = tween(this.node)
            .to(this.shufflingDuration, { position: position }, { easing: 'expoInOut', onComplete: callback }).start();
    }

    public reset() {
        this.movingTween?.stop();
        this.movingTween = null;
        this.fadingTween?.stop();
        this.fadingTween = null;
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

