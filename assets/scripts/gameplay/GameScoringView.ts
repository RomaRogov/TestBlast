import { _decorator, Component, Label, Node } from 'cc';
import { UIProgressBar } from '../ui/UIProgressBar';
const { ccclass, property } = _decorator;

@ccclass('GameScoringView')
export class GameScoringView extends Component {
    @property({ type: Label })
    private scoreLabel: Label = null;

    @property({ type: Label })
    private movesLeftLabel: Label = null;

    @property({ type: UIProgressBar })
    private progressBar: UIProgressBar = null;

    public setScore(score: number, maxScore: number, animate: boolean = false) {
        //TODO: Animate score change
        this.scoreLabel.string = score.toString();
        this.progressBar.setProgress(score / maxScore);
    }

    public setMovesLeft(movesLeft: number, animate: boolean = false) {
        //TODO: Animate moves left change
        this.movesLeftLabel.string = movesLeft.toString();
    }
}

