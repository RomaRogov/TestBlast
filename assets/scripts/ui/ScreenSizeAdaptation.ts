import { _decorator, Component, Canvas, UITransform, screen, view } from 'cc';
const { ccclass, property, requireComponent } = _decorator;

@ccclass('ScreenSizeAdaptation')
@requireComponent(Canvas)
export class ScreenSizeAdaptation extends Component {

    protected start(): void {
        const canvas = this.getComponent(Canvas);
        const uiTransform = this.node.getComponent(UITransform);
        if (canvas && uiTransform) {
            const initialDesignSize = view.getDesignResolutionSize();
            const initialRatio = initialDesignSize.width / initialDesignSize.height;
            const screenSize = screen.windowSize;
            const screenAspectRatio = screenSize.width / screenSize.height;
            if (initialRatio < screenAspectRatio) {
                initialDesignSize.width = initialDesignSize.height * screenAspectRatio;
            } else {
                initialDesignSize.height = initialDesignSize.width / screenAspectRatio;
            }

            uiTransform.setContentSize(initialDesignSize);
            view.setDesignResolutionSize(initialDesignSize.width, initialDesignSize.height, 4);
        }
    }
}

