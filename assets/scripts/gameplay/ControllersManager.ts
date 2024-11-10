import { _decorator, Component, JsonAsset, Node, Prefab, TextAsset } from 'cc';
import { FieldController } from './FieldController';
import { TilesPoolController } from './TilesPoolController';
import { FieldView } from './FieldView';
import { GameBalanceData } from '../data/GameBalanceData';
import { Action } from '../common/ActionType';
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

    private gameBalanceData: GameBalanceData;
    
    private fieldController: FieldController;
    private tilesPoolController: TilesPoolController;

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

        this.tilesPoolController = new TilesPoolController(this.tilePrefab, this.gameBalanceData);
        this.fieldController = new FieldController(this.fieldView, this.tilesPoolController, this.gameBalanceData);
        ControllersManager.onInitializationCompleted();
    }

    public onGameStart() {
        this.fieldController.onGameStart();
    }
}

