import { Action } from "../common/ActionType";
import { GameBalanceData } from "../data/GameBalanceData";
import { GameScoringView } from "./GameScoringView";

export class GameScoringController {

    public onNoMovesLeft: Action;
    public onGoalReached: Action;
    
    private gameBalanceData: GameBalanceData;

    private currentScore: number = 0;
    private movesLeft: number = 0;

    private view: GameScoringView;

    constructor(gameBalanceData: GameBalanceData, view: GameScoringView) {
        this.gameBalanceData = gameBalanceData;
        this.view = view;

        this.movesLeft = gameBalanceData.gameGoal.moves;

        this.view.setScore(this.currentScore, this.gameBalanceData.gameGoal.targetScore);
        this.view.setMovesLeft(this.movesLeft);
    }

    public groupRemoved(groupSize: number) {
        this.movesLeft--;
        this.view.setMovesLeft(this.movesLeft, true);

        if (this.movesLeft <= 0) {
            if (this.onNoMovesLeft) {
                this.onNoMovesLeft();
            }
            return;
        }

        let multiplier = 1;
        for (let [key, value] of this.gameBalanceData.scoreMultiplierPerCombo) {
            if (groupSize >= key) {
                multiplier = value;
            }
        }
        this.currentScore += this.gameBalanceData.baseScorePerTile * (groupSize - this.gameBalanceData.minimalGroupSize + 1) * multiplier;

        this.view.setScore(this.currentScore, this.gameBalanceData.gameGoal.targetScore, true);

        if (this.currentScore >= this.gameBalanceData.gameGoal.targetScore) {
            if (this.onGoalReached) {
                this.onGoalReached();
            }
        }
    }

}

