import { EventHandler, game, Vec2, Vec3 } from "cc";
import { TilesPoolController } from "./TilesPoolController";
import { TileColor, TileController } from "./TileController";
import { FieldView } from "../FieldView";
import { Action, Action1 } from "../../common/ActionType";
import { GameBalanceData } from "../../data/GameBalanceData";
import { BoosterType } from "./BoostersController";

export class FieldController {

    public get fieldSizeY(): number { return this.fieldSize.y; }
    public get fieldSizeX(): number { return this.fieldSize.x; }

    public onNoShufflesLeft: Action;
    public onGroupRemoved: Action1<number>;

    private readonly neighbours: Vec2[] = [
        new Vec2(1, 0),
        new Vec2(-1, 0),
        new Vec2(0, 1),
        new Vec2(0, -1)
    ];

    private fieldView: FieldView;
    private tilesPool: TilesPoolController;
    private tileControllers: TileController[][] = [];
    private fieldSize: Vec2;
    private minimalGroupSize: number;
    private fallingTileCount: number = 0;
    private shuffleAttempts: number = 0;
    private shuffleMaxAttempts: number = 0;
    private inputLocked: boolean = false;
    private currentBooster: BoosterType = null;
    private bombRadius: number = 1;
    private tileToTeleport: Vec2 = null;
    private requireRebuild: boolean = false;

    constructor(fieldView: FieldView, tilesPool: TilesPoolController, gameBalance: GameBalanceData) {
        this.fieldSize = gameBalance.field.size;
        this.minimalGroupSize = gameBalance.minimalGroupSize;
        this.shuffleMaxAttempts = gameBalance.mixTries;
        this.bombRadius = gameBalance.bombBoosterRadius;
        
        this.fieldView = fieldView;
        this.tilesPool = tilesPool;

        fieldView.setSize(this.fieldSize.x, this.fieldSize.y);
    }

    public onGameStart() {
        for (let i = 0; i < this.fieldSize.x; i++) {
            this.tileControllers[i] = [];
            for (let j = 0; j < this.fieldSize.y; j++) {
                let tileController = new TileController(this, this.fieldView.tilesContainer, this.tilesPool, i, j);
                this.tileControllers[i][j] = tileController;
            }
        }

        this.makeSureEligibleGroupExists();
    }

    public onGameEnd() {
        this.inputLocked = true;
    }

    public getTileViewPosition(pos: Vec2, out: Vec3) {
        this.fieldView.getTilePosition(pos, out);
    }

    public onTileClick(tile: TileController) {
        if (this.inputLocked) {
            return;
        }

        if (this.currentBooster != null) {
            switch (this.currentBooster) {
                case BoosterType.Bomb:
                    let tiles = this.getTilesInRadius(tile.position, this.bombRadius);
                    this.removeGroup(tiles);
                    this.currentBooster = null;
                    return;
                case BoosterType.Teleport:
                    if (this.tileToTeleport == null) {
                        this.tileToTeleport = tile.position;
                    } else {
                        this.requireRebuild = true;
                        this.swapTiles(this.tileToTeleport.clone(), tile.position.clone());
                        this.tileToTeleport = null;
                        this.currentBooster = null;
                    }
                    return;
            }
        }

        let group = this.findGroup(tile.color, tile.position);
        if (group.length >= this.minimalGroupSize) {
            this.removeGroup(group);
            if (this.onGroupRemoved)
                this.onGroupRemoved(group.length);
        }
    }

    public setBoosterMode(boosterType: BoosterType) {
        this.currentBooster = boosterType;
    }

    private swapTiles(from: Vec2, to: Vec2) {
        let tileTo: TileController = this.tileControllers[to.x][to.y];
        let tileFrom: TileController = this.tileControllers[from.x][from.y];
        this.tileControllers[to.x][to.y] = tileFrom;
        this.tileControllers[from.x][from.y] = tileTo;
        this.fallingTileCount += 2;
        tileFrom.shuffleToPosition(to.x, to.y, this.checkFallingFinished.bind(this));
        tileTo.shuffleToPosition(from.x, from.y, this.checkFallingFinished.bind(this));
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

    private getTilesInRadius(center: Vec2, radius: number): Vec2[] {
        let tiles: Vec2[] = [];

        for (let i = 0; i < this.tileControllers.length; i++) {
            for (let j = 0; j < this.tileControllers[i].length; j++) {
                if (Vec2.distance(center, this.tileControllers[i][j].position) <= radius) {
                    tiles.push(this.tileControllers[i][j].position);
                }
            }
        }

        return tiles;
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

        //Remove tiles
        for (let pos of group) {
            this.tileControllers[pos.x][pos.y].dispose();
            this.tileControllers[pos.x][pos.y] = null;

            if (pos.x < startX) {
                startX = pos.x;
            }
        }
        
        //Find the lowest of each column
        let groupOfLowestY : Vec2[] = [];
        for (let pos of group) {
            if (groupOfLowestY[pos.x - startX] == null || groupOfLowestY[pos.x - startX].y > pos.y) {
                groupOfLowestY[pos.x - startX] = pos;
            }
        }

        for (let pos of groupOfLowestY) {
            //Remove nulls to "fall" tiles
            this.tileControllers[pos.x] = this.tileControllers[pos.x].filter((value) => value != null);

            let tilesToCreate = this.fieldSize.y - this.tileControllers[pos.x].length;

            //Trigger falling animation
            for (let i = pos.y; i < this.tileControllers[pos.x].length; i++) {
                let currentPos = this.tileControllers[pos.x][i].position.y;
                this.fallingTileCount++;
                this.tileControllers[pos.x][i].fallToPosition(pos.x, i, currentPos - i, this.checkFallingFinished.bind(this));
            }

            //Create new tiles
            let posToStart = this.tileControllers[pos.x].length;
            for (let i = posToStart; i < this.fieldSize.y; i++) {
                let tileController = new TileController(this, this.fieldView.tilesContainer, this.tilesPool, pos.x, this.tileControllers[pos.x].length + tilesToCreate);
                this.fallingTileCount++;
                tileController.fallToPosition(pos.x, this.tileControllers[pos.x].length, tilesToCreate, this.checkFallingFinished.bind(this));
                this.tileControllers[pos.x].push(tileController);
            }
        }
    }

    private checkFallingFinished() {
        if (--this.fallingTileCount === 0) {

            if (this.requireRebuild) {
                this.requireRebuild = false;
                for (let i = 0; i < this.tileControllers.length; i++) {
                    for (let j = 0; j < this.tileControllers[i].length; j++) {
                        this.tileControllers[i][j].fixSiblingIndex();
                    }
                }
            }
            
            this.makeSureEligibleGroupExists();
        }
    }

    private makeSureEligibleGroupExists() {
        for (let i = 0; i < this.tileControllers.length; i++) {
            for (let j = 0; j < this.tileControllers[i].length; j++) {
                let group = this.findGroup(this.tileControllers[i][j].color, this.tileControllers[i][j].position);
                if (group.length >= this.minimalGroupSize) {
                    this.shuffleAttempts = 0;
                    return; //All good!
                }
            }
        }

        this.shuffleTiles();
    }

    private shuffleTiles() {
        this.shuffleAttempts++;

        if (this.shuffleAttempts > this.shuffleMaxAttempts) {
            if (this.onNoShufflesLeft)
                this.onNoShufflesLeft();
            return;
        }

        let flattenedTiles: TileController[] = [];
        for (let i = 0; i < this.tileControllers.length; i++) {
            for (let j = 0; j < this.tileControllers[i].length; j++) {
                flattenedTiles.push(this.tileControllers[i][j]);
            }
        }

        for (let i = flattenedTiles.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [flattenedTiles[i], flattenedTiles[j]] = [flattenedTiles[j], flattenedTiles[i]];
        }

        for (let i = 0; i < this.tileControllers.length; i++) {
            for (let j = 0; j < this.tileControllers[i].length; j++) {
                this.tileControllers[i][j] = flattenedTiles[i * this.fieldSize.y + j];
                this.fallingTileCount++;
                this.tileControllers[i][j].shuffleToPosition(i, j, this.checkFallingFinished.bind(this));
            }
        }
    }
}