import { PanelMgr } from "./UISystem/PanelMgr";
import { PureMVC } from "../../Plugs/PureMVC/PureMVC";
import { CalProxy } from "../UIFrame/Models/CalProxy";
import { CalCommand } from "../UIFrame/Controllers/CalCommand";
import { CalMediator } from "../UIFrame/Views/CalMediator";

export class ISystem {

    public initSys(): void { }
    public rendererUpdate(dt): void { }
    public logicUpdate(dt): void { }
    public endSys(): void { }

}

export class UISystem extends ISystem {

    private mPanelMgr: PanelMgr = null;

    private viewRoot: cc.Node = null;

    public initSys(): void {
        this.viewRoot = cc.find("Canvas/view_root");
        if (this.viewRoot == null) return;

        let facade: PureMVC.IFacade = PureMVC.Facade.getInstance();
        facade.registerProxy(new CalProxy());
        facade.registerCommand(GlobalVar.CONST.EVENT.CALCULATE, CalCommand);
        facade.registerMediator(new CalMediator(CalMediator.NAME, this.viewRoot));
    }

}
