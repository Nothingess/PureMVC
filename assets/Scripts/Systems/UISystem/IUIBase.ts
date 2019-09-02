import { IOpenStrategy } from "./IOpenStrategy";

const { ccclass, property } = cc._decorator;

@ccclass
export class IUIBase extends cc.Component {

    protected mSkinPath: string = "";                       //皮肤路径（名称）
    protected mSkin: cc.Node = null;                        //皮肤节点（面板）
    protected mLayer: string = "";                          //层级
    protected mArgs: any[] = [];                            //面板参数
    protected mOpenStrategy: IOpenStrategy = null;          //动画策略

    protected isClose: boolean = false;                     //是否已经关闭面板

    /**初始化动画策略 */
    public initStrategy(): void { }
    /**获取皮肤路径 */
    public getSkinPath(): string {
        return `${GlobalVar.CONST.UI_PATH.PANEL_PATH}${this.mSkinPath}`;
    }
    /**获取皮肤名称 */
    public getSkinName(): string {
        return this.mSkinPath;
    }

    //#region 面板生命周期


    public init(params?: any[]): void {
        if (!!params) {
            this.mArgs = params;
        }
    }
    /**初始化组件、节点 */
    protected initComponent(): void {

    }
    /**对外开放接口 */
    public open(): void {
        this.onShowing();
        this.playPanelAudio();
    }
    protected onShowing(): void {
        this.mOpenStrategy.open(this.onShowed.bind(this));
    }
    protected onShowed(): void {

    }
    public panelUpdate(): void { }
    /**对外开放接口 */
    public close(cb: Function): void {
        this.onClosing(cb);
        this.playCloseAudio();
    }
    protected onClosing(cb: Function): void {
        this.mOpenStrategy.close(() => { cb(); this.onClosed(); });
    }
    protected onClosed(): void {

    }

    //#endregion

    protected playPanelAudio(): void {

    }
    protected playCloseAudio(): void {

    }
}
