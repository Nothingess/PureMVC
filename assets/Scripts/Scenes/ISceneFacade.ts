import { ISystem, UISystem } from "../Systems/ISystem";

/**每个场景拥有一个 SceneFacade
 * 用来统一管理子系统，向客户端供高级接口
 */
export class ISceneFacade {
    protected mUISystem: ISystem = null;

    public initSys(): void {
        this.mUISystem = new UISystem();
        this.mUISystem.initSys();
    }
    public rendererUpdate(dt): void {
        this.mUISystem.rendererUpdate(dt);
    }
    public logicUpdate(dt): void {
        this.mUISystem.logicUpdate(dt);
    }
    public endSys(): void {
        this.mUISystem.endSys();
    }

}

export class MenuFacade extends ISceneFacade {

}
