import { _decorator, Button, Component, Label, Node, Sprite } from 'cc';
import { GameEndReason } from './GameEndController';
const { ccclass, property } = _decorator;

@ccclass('GameEndView')
export class GameEndView extends Component {

    @property private winTitle: string = '';
    @property private loseTitle: string = '';
    @property private winMessage: string = '';
    @property private loseMessageNoMoves: string = '';
    @property private loseMessageNoGroups: string = '';

    @property({ type: Label })
    private title: Label = null;

    @property({ type: Node })
    private restartButton: Node = null;

    @property({ type: Label })
    private messageLabel: Label = null;

    public initialize(restartHandler: () => void) {
        this.restartButton.on(Node.EventType.TOUCH_END, () => {
            restartHandler();
        });
        this.node.active = false;
    }

    public showWin() {
        this.title.string = this.winTitle;
        this.messageLabel.string = this.winMessage;
        this.node.active = true;
    }

    public showLose(reason: GameEndReason) {
        this.title.string = this.loseTitle;
        this.messageLabel.string = reason === GameEndReason.NoMovesLeft ? this.loseMessageNoMoves : this.loseMessageNoGroups;
        this.node.active = true;
    }
}

