import { director } from "cc";
import { GameEndView } from "../GameEndView";
import { Action, Action1 } from "../../common/ActionType";

export enum GameEndReason {
    NoMovesLeft,
    GoalReached,
    NoGroupsLeft
}

export class GameEndController {

    private view: GameEndView;
    private onGameEndCallback: Action1<GameEndReason>;

    constructor(view: GameEndView, onGameEndCallback: Action1<GameEndReason>) {
        this.view = view;
        this.onGameEndCallback = onGameEndCallback;
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
        this.onGameEndCallback(reason);
    }

}

