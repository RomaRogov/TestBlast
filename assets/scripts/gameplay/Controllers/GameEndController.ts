import { director } from "cc";
import { GameEndView } from "../GameEndView";

export enum GameEndReason {
    NoMovesLeft,
    GoalReached,
    NoGroupsLeft
}

export class GameEndController {

    private view: GameEndView;

    constructor(view: GameEndView) {
        this.view = view;
        this.view.initialize(() => {
            director.loadScene('boot');
        });
    }

    public onGameEnd(reason: GameEndReason) {
        switch (reason) {
            case GameEndReason.NoMovesLeft:
            case GameEndReason.NoGroupsLeft:
                this.view.showLose(reason);
                break;
            case GameEndReason.GoalReached:
                this.view.showWin();
                break;
        }
    }

}

