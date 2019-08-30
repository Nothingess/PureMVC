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
    private mOpenDict: Map<string, cc.Node>;         //用于存放已打开的面板
    private mMaskLyer: cc.Node = null;               //遮罩层

    private mWaitQueue: Array<PanelInfo> = null;     //等待打开的面板队列
}
