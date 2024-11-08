import { Vec2 } from "cc";

export interface GameBalanceData {
    field: FieldData;
    tileVariants: number;
    minimalGroupSize: number;
}

export interface FieldData {
    size: Vec2;
}