import { Vec2 } from "cc";

export interface GameBalanceData {
    field: FieldData;
    gameGoal: GameGoalData;

    tileColorVariants: number; //Mentioned in test assignment as tile colors count C
    minimalGroupSize: number; //Mentioned in test assignment as minimal group size K
    mixTries: number; //Mentioned in test assignment as mix tries count S

    //I've decided to perform scoring in following way:
    //baseScorePerTile * (groupSize - minimalGroupSize + 1) * scoreMultiplier,
    //where scoreMultiplier is value from scoreMultiplierPerCombo map and depends on group size
    //Key is minimal group size to get this multiplier, value is multiplier itself
    baseScorePerTile: number;
    scoreMultiplierPerCombo: Map<number, number>;
}

export interface FieldData {
    size: Vec2;  //Mentioned in test assignment as N*M field size
}

export interface GameGoalData {
    targetScore: number; //Mentioned in test assignment as target score X
    moves: number; //Mentioned in test assignment as goal moves count Y
}