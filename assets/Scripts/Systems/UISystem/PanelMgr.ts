import { IUIBase } from "./IUIBase";

/**面板信息 */
interface PanelInfo {
    /**面板类型（继承自IUIBase） */
    type: any,
    /**面板名称 */
    name: string,
    /**面板参数 */
    args: any[],
}

export class PanelMgr {

    private mRoot: cc.Node = null;                   //UI跟节点
    private mLayerDict: Map<string, cc.Node>;        //存放各层级面板所对应的父物体
    private mOpenDict: Map<string, IUIBase>;         //用于存放已打开的面板
    private mMaskLyer: cc.Node = null;               //遮罩层

    private mWaitQueue: Array<PanelInfo> = null;     //等待打开的面板队列

    public initSys(): void {
        this.initLayer();
        this.mOpenDict = new Map<string, IUIBase>();
        this.mWaitQueue = new Array<PanelInfo>();
    }
    /**初始化层级 */
    private initLayer(): void {
        this.mRoot = cc.find("Canvas/uiRoot");
        this.mMaskLyer = cc.find("funcPanel/mask", this.mRoot);
        if (this.mRoot == null) {
            console.error("UISystem.initLayer fail, uiLayer is null!");
        }
        this.mLayerDict = new Map<string, cc.Node>();
        for (let pl in GlobalVar.CONST.ENUM.PanelLayer) {
            this.mLayerDict.set(pl, this.mRoot.getChildByName(pl));
        }
    }

    /**通过队列打开面板 */
    public waitOpenPanel<T extends IUIBase>(panelType: new () => T, name: string, args?: any[]): void {
        let push: boolean = true;
        this.mWaitQueue.forEach(e => {
            if (e.name == name) {
                push = false;
            }
        })
        if (!push) return;
        let info: PanelInfo = {
            type: panelType,
            name: name,
            args: args
        }
        this.mWaitQueue.push(info);
        this.openWaitPanel();
    }
    private openWaitPanel(): void {
        if (this.mOpenDict.size > 0) return;
        if (this.mWaitQueue.length <= 0) return;
        let info: PanelInfo = this.mWaitQueue.shift();
        this.openPanel(info.type, info.name, info.args);
    }
    /**
     * 打开任意类型面板（泛型方法）
     * @param panelType 面板类型
     * @param args 参数
     */
    public openPanel<T extends IUIBase>(panelType: new () => T, name: string, args?: any[]): void {
        if (this.mOpenDict.get(name) != null) return;//已经打开

    }
    public rendererUpdate(dt): void { }
    public logicUpdate(dt): void { }
    public endSys(): void { }
}
