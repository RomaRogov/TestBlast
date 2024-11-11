import { instantiate, Node, ParticleSystem2D, Prefab, Vec3 } from "cc";
import { TileView } from "../TileView";
import { GameBalanceData } from "../../data/GameBalanceData";
export class TilesPoolController {

    public get tileColorsVariants() : number { return Math.min(this.tileColors, this.availableTileColors); }

    private tiles: TileView[] = [];
    private tileExplosions: ParticleSystem2D[] = [];
    private tileColors: number;
    private availableTileColors: number;
    private tileExplosionPrefab: Prefab;

    constructor(tileViewPrefab: Prefab, tileExplosionPrefab: Prefab, gameBalanceData: GameBalanceData) {
        let tilesCount = gameBalanceData.field.size.x * gameBalanceData.field.size.y;
        this.tileExplosionPrefab = tileExplosionPrefab;

        for (let i = 0; i < tilesCount; i++) {
            let tileView = instantiate(tileViewPrefab).getComponent(TileView);
            if (!tileView) {
                console.error('Tile prefab does not contain TileView component');
                return;
            }
            this.tiles.push(tileView);
        }

        for (let i = 0; i < tilesCount / 3; i++) {
            this.addExplostion();
        }

        this.tileColors = gameBalanceData.tileColorVariants;
        this.availableTileColors = this.tiles[0].colors.length;
    }

    public getTile(): TileView {
        if (this.tiles.length === 0) {
            console.error('No tiles in pool');
            return null;
        }

        return this.tiles.pop();
    }

    public returnTile(tile: TileView) {
        this.tiles.push(tile);
    }

    public performExplosion(fromTile: TileView) {
        let explosion = this.tileExplosions.pop();
        if (!explosion) {
            explosion = this.addExplostion();
            return;
        }
        
        explosion.node.setParent(fromTile.node.parent);
        explosion.node.position = fromTile.node.position;
        explosion.spriteFrame = fromTile.spriteFrame;
        explosion.resetSystem();

        setTimeout(() => { 
            explosion.node.removeFromParent();
            this.tileExplosions.push(explosion);
         }, explosion.life * 1000);
    }

    private addExplostion(): ParticleSystem2D {
        let explosion = instantiate(this.tileExplosionPrefab).getComponent(ParticleSystem2D);
        if (!explosion) {
            console.error('Tile explosion prefab does not contain ParticleSystem2D component');
        }
        this.tileExplosions.push(explosion);
        return explosion;
    }
}

