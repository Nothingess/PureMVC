import { ISceneState } from "./ISceneState";

export class SceneController {
    private mSceneState: ISceneState = null;                //场景状态
    private isLoadSceneComplete: boolean = false;           //是否加载完场景
    private isLoadResComplete: boolean = false;             //是否加载完下一个场景的资源
    private isRunStart: boolean = false;                    //是否已经执行过当前场景的start方法

    public setState(sceneState: ISceneState, isLoadScene: boolean = true) {
        //TODO 通知面板管理器打开loading面板
        if (this.mSceneState != null) {
            this.mSceneState.stateEnd();
        }
        this.mSceneState = sceneState;
        let self = this;
        if (isLoadScene) {
            this.isLoadSceneComplete = this.isLoadResComplete = this.isRunStart = false;

            cc.director.loadScene(this.mSceneState.getSceneName(), () => {
                //加载场景完成
                self.isLoadSceneComplete = true;
            })
            this.mSceneState.loadRes(() => {
                //加载资源完成
                self.isLoadResComplete = true;
            })
        } else {
            this.mSceneState.stateStart();
            this.isLoadSceneComplete = this.isLoadResComplete = this.isRunStart = true;
        }
    }
    /**渲染更新 */
    public rendererUpdate(dt): void {
        if (!this.isLoadSceneComplete) return;
        if (!this.isLoadResComplete) return;
        if (this.mSceneState == null) return;
        if (!this.isRunStart) {
            this.mSceneState.stateStart();
            this.isRunStart = true;
        }
        this.mSceneState.rendererUpdate(dt);
    }
    /**逻辑更新 */
    public logicUpdate(dt): void {
        if (!this.isLoadSceneComplete) return;
        if (!this.isLoadResComplete) return;
        if (this.mSceneState == null) return;
        this.mSceneState.logicUpdate(dt);
    }
}