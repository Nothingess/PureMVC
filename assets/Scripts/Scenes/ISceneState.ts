import { SceneController } from "./SceneController";
import { ISceneFacade, MenuFacade } from "./ISceneFacade";

export class ISceneState {
    protected mName: string = "";
    protected mResUrl: string = "";
    protected mSceneCtrl: SceneController = null;
    protected mFacade: ISceneFacade = null;
    public getSceneName(): string {
        return this.mName;
    }

    constructor(sceneCtrl: SceneController, name: string) {
        this.mSceneCtrl = sceneCtrl;
        this.mName = name;
    }

    //#region 状态生命周期

    /**状态初始化 */
    public stateStart(): void {

    }
    /**渲染更新 */
    public rendererUpdate(dt): void {
        this.mFacade.rendererUpdate(dt);
    }
    /**逻辑更新 */
    public logicUpdate(dt): void {
        this.mFacade.logicUpdate(dt);
    }
    /**状态结束，释放资源 */
    public stateEnd(): void {
        this.mFacade.endSys();
    }

    /**加载资源 */
    public loadRes(complete: Function) {
        if (this.mResUrl === "") { complete(); return; };
        //后面用load管理器代替，可以更加便利地释放不需要的资源
        cc.loader.loadResDir(this.mResUrl, this.loadPro.bind(this), () => { complete() })
    }
    /**加载进度 */
    protected loadPro(completedCount: number, totalCount: number): void {
        //TODO 通知观察者
    }
    //#endregion
}

export class MenuScene extends ISceneState {

    constructor(sceneCtrl: SceneController, name: string = "MenuScene") {
        super(sceneCtrl, name);
    }

    public stateStart(): void {
        super.stateStart();
        this.mFacade = new MenuFacade();
        this.mFacade.initSys();
    }

}
