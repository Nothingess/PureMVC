import { SceneController } from "./Scenes/SceneController";
import { MenuScene } from "./Scenes/ISceneState";

const { ccclass, property } = cc._decorator;

@ccclass
export class MainLoop extends cc.Component {

    private mSceneCtrl: SceneController = null;

    onLoad() {
        cc.game.addPersistRootNode(this.node);
    }

    start() {
        this.mSceneCtrl = new SceneController();
        this.mSceneCtrl.setState(new MenuScene(this.mSceneCtrl), false);
    }
    //渲染更新
    update(dt) {
        this.mSceneCtrl.rendererUpdate(dt);
    }
    //逻辑更新
    lateUpdate(dt) {
        this.mSceneCtrl.logicUpdate(dt);
    }
}
