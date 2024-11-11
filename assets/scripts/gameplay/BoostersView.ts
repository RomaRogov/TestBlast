import { _decorator, Component, Label, Node } from 'cc';
import { Action1 } from '../common/ActionType';
import { BoosterType } from './Controllers/BoostersController';
const { ccclass, property } = _decorator;

@ccclass('BoostersView')
export class BoostersView extends Component {
    
    @property({ type: Label })
    private bombBoosterPriceLabel: Label = null;
    @property({ type: Label })
    private teleportBoosterPriceLabel: Label = null;

    @property({ type: Node })
    private bombBoosterButton: Node = null;
    @property({ type: Node })
    private teleportBoosterButton: Node = null;

    public initialize(onBoosterClicked: Action1<BoosterType>, bombPrice: number, teleportPrice: number) {
        this.bombBoosterButton.on(Node.EventType.TOUCH_END, () => {
            onBoosterClicked(BoosterType.Bomb);
        });
        this.teleportBoosterButton.on(Node.EventType.TOUCH_END, () => {
            onBoosterClicked(BoosterType.Teleport);
        });

        this.bombBoosterPriceLabel.string = bombPrice.toString();
        this.teleportBoosterPriceLabel.string = teleportPrice.toString();
    }

}

