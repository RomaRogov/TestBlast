import { Vec2 } from "cc";

export interface GameBalanceData {
    field: FieldData;
}

export interface FieldData {
    size: Vec2;
    tileVariants: number;        
}