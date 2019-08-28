import { PureMVC } from "../../Plugs/PureMVC/PureMVC";

export class CalData {
    public inputA: number;
    public inputB: number;
    public result: number;
}

export class CalProxy extends PureMVC.Proxy {
    public static NAME:string = "CalProxy";

    constructor(proxyName: string = null, data: CalData = null) {
        super(proxyName, data);

        this.proxyName = "CalProxy";
        this.data = new CalData();
    }

    public SetInput(inputA: number, inputB: number) {
        this.data.inputA = inputA;
        this.data.inputB = inputB;
    }
    public add(): void {
        this.SetResult((this.data.inputA + this.data.inputB));
        this.sendNotification(GlobalVar.CONST.EVENT.RESULT, this.data.result);
    }
    public SetResult(result: number) {
        this.data.result = result;
    }
}