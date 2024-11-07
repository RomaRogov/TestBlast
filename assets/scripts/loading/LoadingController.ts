import { director, Size, Vec2, view } from 'cc';
import { LoadingView } from './LoadingView';
import { ControllersManager } from '../gameplay/ControllersManager';

export class LoadingController {

    private loadingView: LoadingView;
    private tilePoolLoaded: boolean = false;

    constructor(loadingView: LoadingView) {
        const SCENE_NAME : string = 'gameplay';

        this.loadingView = loadingView;
        this.loadingView.node.removeFromParent();

        ControllersManager.setEventHandler(
            () => { 
                this.tilePoolLoaded = true; 
                this.checkAllLoaded();
            });

        director.loadScene(SCENE_NAME, () => {
                this.loadingView.node.setParent(director.getScene());
            });
    }

    private checkAllLoaded() {
        if (this.tilePoolLoaded) {
            this.loadingView.hideLoading();
        }
    }
}

