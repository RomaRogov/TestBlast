import { _decorator, Canvas, Component, JsonAsset, Prefab, Size, UITransform } from 'cc';
import { FieldView } from './FieldView';
import { GameBalanceData } from '../data/GameBalanceData';
import { Action } from '../common/ActionType';
import { GameScoringView } from './GameScoringView';
import { GameEndView } from './GameEndView';
import { FieldController } from './Controllers/FieldController';
import { TilesPoolController } from './Controllers/TilesPoolController';
import { GameScoringController } from './Controllers/GameScoringController';
import { GameEndController, GameEndReason } from './Controllers/GameEndController';
import { BoostersController } from './Controllers/BoostersController';
import { BoostersView } from './BoostersView';
const { ccclass, property } = _decorator;

@ccclass('ControllersManager')
export class ControllersManager extends Component {

    private static onInitializationCompleted: Action;
    private static startGame: Action;

    @property({ type: JsonAsset })
    private gameBalanceDataAsset: JsonAsset;
    @property({ type: Prefab })
    private tilePrefab: Prefab;
    @property({ type: FieldView })
    private fieldView: FieldView;
    @property({ type: GameScoringView })
    private gameScoringView: GameScoringView;
    @property({ type: GameEndView })
    private gameEndView: GameEndView;
    @property({ type: BoostersView })
    private boostersView: BoostersView;
    @property({ type: Prefab })
    private tileExplosionPrefab: Prefab;

    private gameBalanceData: GameBalanceData;
    
    private fieldController: FieldController;
    private tilesPoolController: TilesPoolController;
    private gameScoringController: GameScoringController;
    private gameEndController: GameEndController;
    private boostersController: BoostersController;

    public static setOnCompleteHandler(handler: Action) {
        ControllersManager.onInitializationCompleted = handler;
    }

    public static onLoadingHidden() {
        ControllersManager.startGame();
    }

    //TODO: may implement asynchrounos initialization for loading progress
    start() {
        this.gameBalanceData = this.gameBalanceDataAsset.json as GameBalanceData;
        ControllersManager.startGame = this.onGameStart.bind(this);

        this.tilesPoolController = new TilesPoolController(this.tilePrefab, this.tileExplosionPrefab, this.gameBalanceData);
        this.gameScoringController = new GameScoringController(this.gameBalanceData, this.gameScoringView);
        this.fieldController = new FieldController(this.fieldView, this.tilesPoolController, this.gameBalanceData);
        this.boostersController = new BoostersController(this.boostersView, this.gameScoringController, this.gameBalanceData);
        this.gameEndController = new GameEndController(this.gameEndView, () => {
            this.fieldController.onGameEnd();
            this.boostersController.gameEnded();
        });

        this.fieldController.onGroupRemoved = this.gameScoringController.groupRemoved.bind(this.gameScoringController);
        this.fieldController.onNoShufflesLeft = () => { this.gameEndController.onGameEnd(GameEndReason.NoGroupsLeft); };
        this.gameScoringController.onGoalReached = () => { this.gameEndController.onGameEnd(GameEndReason.GoalReached); };
        this.gameScoringController.onNoMovesLeft = () => { this.gameEndController.onGameEnd(GameEndReason.NoMovesLeft); };
        this.boostersController.onBoosterUsed = (type) => {
            this.fieldController.setBoosterMode(type);
            this.gameScoringController.boosterUsed(type);
        };
        ControllersManager.onInitializationCompleted();
    }

    public onGameStart() {
        this.fieldController.onGameStart();
    }
}

