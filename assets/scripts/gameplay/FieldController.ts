import { EventHandler, Vec2, Vec3 } from "cc";
import { FieldData } from "../data/GameBalanceData";
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

    constructor(fieldView: FieldView, tilesPool: TilesPoolController, fieldData: FieldData) {
        this.fieldView = fieldView;
        fieldView.setSize(fieldData.size.x, fieldData.size.y);
        
        for (let i = 0; i < fieldData.size.x; i++) {
            this.tileControllers[i] = [];
            for (let j = 0; j < fieldData.size.y; j++) {
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
        console.log(group);
        if (group.length > 1) {
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

        console.log(position + " " + TileColor[color]);

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
        for (let pos of group) {
            this.tileControllers[pos.x][pos.y].dispose();
            this.tileControllers[pos.x][pos.y] = null;
        }
    }
}