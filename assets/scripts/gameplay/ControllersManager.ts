import { _decorator, Component, JsonAsset, Node, Prefab, TextAsset } from 'cc';
import { FieldController } from './FieldController';
import { TilesPoolController } from './TilesPoolController';
import { FieldView } from './FieldView';
import { GameBalanceData } from '../data/GameBalanceData';
const { ccclass, property } = _decorator;

export type Action = () => void;

export interface InitializableController {
    isInitialized: boolean;
    finishInitializationHandler: Action;
}

@ccclass('ControllersManager')
export class ControllersManager extends Component {

    private static eventHandler: Action;

    @property({ type: JsonAsset })
    private gameBalanceDataAsset: JsonAsset;
    @property({ type: Prefab })
    private tilePrefab: Prefab;
    @property({ type: FieldView })
    private fieldView: FieldView;

    private gameBalanceData: GameBalanceData;
    
    private fieldController: FieldController;
    private tilesPoolController: TilesPoolController;
    private initializedControllers: number = 0;
    private controllersAmount: number = 0;

    public static setEventHandler(handler: Action) {
        this.eventHandler = handler;
    }

    start() {
        this.gameBalanceData = this.gameBalanceDataAsset.json as GameBalanceData;

        this.tilesPoolController = new TilesPoolController(this.tilePrefab, this.gameBalanceData.field);
        if (!this.tilesPoolController.isInitialized)
            this.tilesPoolController.finishInitializationHandler = this.onTilesPoolControllerInitialized.bind(this);
        else
            this.onTilesPoolControllerInitialized();
    }

    private onTilesPoolControllerInitialized() {
        console.log('ControllersManager: onTilesPoolControllerInitialized');

        this.fieldController = new FieldController(this.fieldView, this.tilesPoolController, this.gameBalanceData.field);
        this.waitForInitialization(this.fieldController);
    }

    private waitForInitialization(controller : InitializableController) {
        this.controllersAmount++;

        if (controller.isInitialized) {
            this.onControllerInitialized();
            return;
        }

        controller.finishInitializationHandler = this.onControllerInitialized.bind(this);
    }

    private onControllerInitialized() {
        this.initializedControllers++;
        console.log('ControllersManager: onControllerInitialized', this.initializedControllers, this.controllersAmount);
        if (this.initializedControllers === this.controllersAmount) {
            ControllersManager.eventHandler();
        }
    }
}

