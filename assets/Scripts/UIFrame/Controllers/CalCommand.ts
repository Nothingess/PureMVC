import { PureMVC } from "../../../Plugs/PureMVC/PureMVC";
import { CalProxy } from "../Models/CalProxy";

export class CalCommand extends PureMVC.MacroCommand{
    public execute(notification:PureMVC.INotification){
        let dataPro = PureMVC.Facade.getInstance().retrieveProxy(CalProxy.NAME) as CalProxy;
        dataPro.add();
    }
}