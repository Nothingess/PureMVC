import { PureMVC } from "../../../Plugs/PureMVC/PureMVC";
import { CalProxy } from "../Models/CalProxy";

export class CalMediator extends PureMVC.Mediator {
    public static NAME:string = "CalMediator";

    private inputALa: cc.EditBox = null;
    private inputBLa: cc.EditBox = null;
    private result: cc.Label = null;
    private addBtn: cc.Node = null;

    constructor(mediatorName: string = null, viewComponent: any = null) {
        super(mediatorName, viewComponent);

        this.initMediator();
    }
    /**初始化中介者 */
    private initMediator(): void {
        if (this.viewComponent == null) return;
        this.inputALa = cc.find("inputA", this.viewComponent).getComponent(cc.EditBox);
        this.inputBLa = cc.find("inputB", this.viewComponent).getComponent(cc.EditBox);
        this.result = cc.find("res_la", this.viewComponent).getComponent(cc.Label);
        this.addBtn = cc.find("add_btn", this.viewComponent);

        this.onEvent();
    }
    /**注册事件 */
    private onEvent(): void {
        if (this.addBtn == null) return;
        this.addBtn.on("touchend", this.onClickAdd, this);
    }
    private onClickAdd(): void {
        let a: number, b: number;
        a = parseInt(this.inputALa.string);
        b = parseInt(this.inputBLa.string);
        let proxy: CalProxy = this.facade.retrieveProxy(CalProxy.NAME) as CalProxy;
        if (proxy == null) return;
        proxy.SetInput(a, b);
        this.sendNotification(GlobalVar.CONST.EVENT.CALCULATE);
    }
    public listNotificationInterests(): Array<string> {
        let list: Array<string> = new Array<string>();
        list.push(GlobalVar.CONST.EVENT.RESULT);
        return list;
    }
    public handleNotification(notification: PureMVC.INotification): void {
        switch (notification.getName()) {
            case GlobalVar.CONST.EVENT.RESULT:
                let ret: number = parseInt(notification.getBody());
                this.result.string = ret.toString();
                this.inputALa.string = "";
                this.inputBLa.string = "";
                break;
            default:
                break;
        }
    }

}