import { _decorator, CCFloat, clamp01, Component, Node, UITransform } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('UIProgressBar')
    export class UIProgressBar extends Component {

    @property({ type: UITransform })
    private progressBar: UITransform = null;
    @property({ type: CCFloat })
    private minimalWidth: number = 0;
    @property({ type: CCFloat })
    private maximalWidth: number = 0;
    @property({ type: CCFloat })
    private animDuration: number = 0.2;

    start() {
        this.progressBar.width = this.minimalWidth;
    }

    public setProgress(progress: number) {
        const width = this.minimalWidth + (this.maximalWidth - this.minimalWidth) * clamp01(progress);
        this.progressBar.width = width; //TODO: animate
    }
}

