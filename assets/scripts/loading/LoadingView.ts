import { _decorator, Component, Node } from 'cc';
import { LoadingController } from './LoadingController';
const { ccclass, property } = _decorator;

@ccclass('LoadingView')
export class LoadingView extends Component {

    private loadingController: LoadingController;

    onLoad() {
        this.loadingController = new LoadingController(this);
    }

    public hideLoading() {
        setTimeout(() => {
            console.log('LoadingView: hideLoading');
            this.node.destroy();
            this.loadingController = null;
        }, 200);
    }

}

