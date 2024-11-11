import { Game } from "cc";
import { BoostersView } from "../BoostersView";
import { GameBalanceData } from "../../data/GameBalanceData";
import { Action1 } from "../../common/ActionType";
import { GameScoringController } from "./GameScoringController";

export enum BoosterType {
    Bomb,
    Teleport
}

export class BoostersController {

    public onBoosterUsed: Action1<BoosterType>;
    
    private interactionLocked: boolean = false;

    constructor(view: BoostersView, gameScoringController: GameScoringController, gameBalanceData: GameBalanceData) {
        view.initialize((boosterType: BoosterType) => {
            if (this.interactionLocked) {
                return;
            }

            let price: number = 0;
            switch (boosterType) {
                case BoosterType.Bomb:
                    price = gameBalanceData.bombBoosterPrice;
                    break;
                case BoosterType.Teleport:
                    price = gameBalanceData.teleportBoosterPrice;
                    break;
            }
            if (gameScoringController.score < price) {
                return;
            }

            if (this.onBoosterUsed) {
                this.onBoosterUsed(boosterType);
            }
        }, gameBalanceData.bombBoosterPrice, gameBalanceData.teleportBoosterPrice);
    }

    public gameEnded() {
        this.interactionLocked = true;
    }
}

