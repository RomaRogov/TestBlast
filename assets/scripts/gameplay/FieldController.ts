import { EventHandler, Vec2, Vec3 } from "cc";
import { FieldData, GameBalanceData } from "../data/GameBalanceData";
import { FieldView } from "./FieldView";
import { TilesPoolController } from "./TilesPoolController";
import { TileColor, TileController } from "./TileController";

export class FieldController {

    private readonly neighbours: Vec2[] = [
        new Vec2(1, 0),
        new Vec2(-1, 0),
        new Vec2(0, 1),
        new Vec2(0, -1)
    ];

    private fieldView: FieldView;
    private tileControllers: TileController[][] = [];
    private fieldSize: Vec2;
    private minimalGroupSize: number;

    constructor(fieldView: FieldView, tilesPool: TilesPoolController, gameBalance: GameBalanceData) {
        this.fieldSize = gameBalance.field.size;
        this.minimalGroupSize = gameBalance.minimalGroupSize;

        this.fieldView = fieldView;
        fieldView.setSize(this.fieldSize.x, this.fieldSize.y);
        
        for (let i = 0; i < this.fieldSize.x; i++) {
            this.tileControllers[i] = [];
            for (let j = 0; j < this.fieldSize.y; j++) {
                let tileController = new TileController(this, fieldView.tilesContainer, tilesPool, i, j);
                this.tileControllers[i][j] = tileController;
            }
        }
    }

    public getTileViewPosition(pos: Vec2, out: Vec3) {
        this.fieldView.getTilePosition(pos, out);
    }

    public onTileClick(tile: TileController) {
        let group = this.findGroup(tile.color, tile.position);
        if (group.length >= this.minimalGroupSize) {
            this.removeGroup(group);
        }
    }

    private findGroup(color: TileColor, position: Vec2): Vec2[] {
        let group: Vec2[] = [];
        let visited: boolean[][] = [];
        for (let i = 0; i < this.tileControllers.length; i++) {
            visited[i] = [];
            for (let j = 0; j < this.tileControllers[i].length; j++) {
                visited[i][j] = false;
            }
        }

        this.findGroupRecursive(color, position, visited, group);

        return group;
    }

    private findGroupRecursive(color: TileColor, position: Vec2, visited: boolean[][], group: Vec2[]) {
        visited[position.x][position.y] = true;

        group.push(position);

        const neighbour : Vec2 = new Vec2();
        for (let neighbourShift of this.neighbours) {
            neighbour.set(position.x + neighbourShift.x, position.y + neighbourShift.y);
            if (neighbour.x >= 0 && neighbour.x < this.tileControllers.length &&
                neighbour.y >= 0 && neighbour.y < this.tileControllers[0].length &&
                !visited[neighbour.x][neighbour.y]) {
                    visited[neighbour.x][neighbour.y] = true;
                    if (this.tileControllers[neighbour.x][neighbour.y] != null &&
                        this.tileControllers[neighbour.x][neighbour.y].color === color) {
                        this.findGroupRecursive(color, neighbour.clone(), visited, group);
                    }
            }
        }
    }

    private removeGroup(group: Vec2[]) {
        let startX = group[0].x;

        for (let pos of group) {
            this.tileControllers[pos.x][pos.y].dispose();
            this.tileControllers[pos.x][pos.y] = null;

            if (pos.x < startX) {
                startX = pos.x;
            }
        }

        let groupOfLowestY : Vec2[] = [];
        for (let pos of group) {
            if (groupOfLowestY[pos.x - startX] == null || groupOfLowestY[pos.x - startX].y > pos.y) {
                groupOfLowestY[pos.x - startX] = pos;
            }
        }

        for (let pos of groupOfLowestY) {
            let currentCell = pos.y;
            for (let i = pos.y + 1; i < this.tileControllers[0].length; i++) {
                if (this.tileControllers[pos.x][i] != null) {
                    this.tileControllers[pos.x][i].fallToPosition(pos.x, currentCell);
                    this.tileControllers[pos.x][currentCell] = this.tileControllers[pos.x][i];
                    this.tileControllers[pos.x][i] = null;
                    currentCell++;
                }
            }
        }
    }
}