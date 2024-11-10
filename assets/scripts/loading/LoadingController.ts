import { director, Size, Vec2, view } from 'cc';
import { LoadingView } from './LoadingView';
import { ControllersManager } from '../gameplay/ControllersManager';

export class LoadingController {

    private loadingView: LoadingView;

    constructor(loadingView: LoadingView) {
        const SCENE_NAME : string = 'gameplay';

        this.loadingView = loadingView;
        this.loadingView.node.removeFromParent();

        ControllersManager.setOnCompleteHandler(
            () => { this.loadingView.hideLoading(ControllersManager.onLoadingHidden); });

        director.loadScene(SCENE_NAME, () => {
                this.loadingView.node.setParent(director.getScene());
            });
    }
}
