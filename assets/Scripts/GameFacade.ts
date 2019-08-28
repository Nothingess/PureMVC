import { PureMVC } from "../Plugs/PureMVC/PureMVC";
import { CalProxy, CalData } from "./Models/CalProxy";
import { CalMediator } from "./Views/CalMediator";
import { CalCommand } from "./Controllers/CalCommand";

const { ccclass, property } = cc._decorator;

@ccclass
export class GameFacade extends cc.Component {

    @property(cc.Node)
    viewRoot: cc.Node = null;

    start(): void {
        let facade: PureMVC.IFacade = PureMVC.Facade.getInstance();
        facade.registerProxy(new CalProxy());
        facade.registerCommand(GlobalVar.CONST.EVENT.CALCULATE, CalCommand);
        facade.registerMediator(new CalMediator(CalMediator.NAME, this.viewRoot));
    }

}
