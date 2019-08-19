namespace PureMVC {
    export class Facade implements IFacade {
        protected static SINGLETON_MSG: string = "Facade singleton already constructed!";

        protected model: IModel = null;
        protected view: IView = null;
        protected controller: IController = null;

        protected static instance: IFacade = null;
        public static getInstance(): IFacade {
            if (!Facade.instance) {
                Facade.instance = new Facade();
            }
            return Facade.instance;
        }

        constructor() {
            if (Facade.instance) {
                throw Error(Facade.SINGLETON_MSG);
            }
            Facade.instance = this;
            this.initializeFacade();
        }

        protected initializeFacade(): void {
            this.initializeModel();
            this.initializeController();
            this.initializeView();
        }

        protected initializeModel(): void {
            if (!this.model) {
                this.model = Model.getInstance();
            }
        }
        protected initializeController(): void {
            if (!this.controller) {
                this.controller = Controller.getInstance();
            }
        }
        protected initializeView(): void {
            if (!this.view) {
                this.view = View.getInstance();
            }
        }

        registerCommand(notificationName: string, commandClassRef: Function): void {
            this.controller.registerCommand(notificationName, commandClassRef);
        }
        removeCommand(notificationName: string): void {
            this.controller.removeCommand(notificationName);
        }
        hasCommand(notificationName: string): boolean {
            return this.controller.hasCommand(notificationName);
        }
        registerProxy(proxy: IProxy): void {
            this.model.registerProxy(proxy);
        }
        retrieveProxy(proxyName: string): IProxy {
            return this.model.retrieveProxy(proxyName);
        }
        removeProxy(proxyName: string): IProxy {
            let proxy: IProxy;
            if (this.model) {
                proxy = this.model.removeProxy(proxyName);
            }
            return proxy;
        }
        hasProxy(proxyName: string): boolean {
            return this.model.hasProxy(proxyName);
        }
        registerMediator(mediator: IMediator): void {
            if (this.view) {
                this.view.registerMediator(mediator);
            }
        }
        retrieveMediator(mediatorName: string): IMediator {
            return this.view.retrieveMediator(mediatorName);
        }
        removeMediator(mediatorName: string): IMediator {
            let mediator: IMediator;
            if (this.view) {
                mediator = this.view.removeMediator(mediatorName);
            }
            return mediator;
        }
        hasMediator(mediatorName: string): boolean {
            return this.view.hasMediator(mediatorName);
        }
        notifyObservers(notification: INotification): void {
            if (this.view) {
                this.view.notifyObservers(notification);
            }
        }
        sendNotification(name: string, body: any = null, type: string = null): void {
            this.notifyObservers(new Notification(name, body, type));
        }
    }
    export class Notifier implements INotifier {
        /**外观者的引用 */
        protected facade: IFacade = null;

        constructor(){
            this.facade = Facade.getInstance();
        }

        sendNotification(name: string, body: any = null, type: string = null): void {
            this.facade.sendNotification( name, body, type );
        }

    }
    export class Notification implements INotification {
        protected name: string = null;
        protected body: any = null;
        protected type: string = null;

        constructor(name: string, body: any = null, type: string = null) {
            this.name = name;
            this.body = body;
            this.type = type;
        }

        getName(): string {
            return this.name;
        }
        setBody(body: any): void {
            this.body = body;
        }
        getBody() {
            return this.body;
        }
        setType(type: string): void {
            this.type = type;
        }
        getType(): string {
            return this.type;
        }
        toString(): string {
            return `Notification Name: ${this.getName()
                }\nBody: ${((this.getBody() == null) ? "null" : this.getBody().toString())
                }\nType: ${((this.getType() == null) ? "null" : this.getType())}`;
        }
    }
    export class Proxy extends Notifier implements IProxy, INotifier {
        public static NAME: string = "Proxy";

        protected proxyName: string = null;
        protected data: any = null;
        constructor(proxyName: string = null, data: any = null) {
            super();
            this.proxyName = (proxyName != null) ? proxyName : Proxy.NAME;
            if (data != null) {
                this.setData(data);
            }
        }


        getProxyName(): string {
            return this.proxyName;
        }
        setData(data: any): void {
            this.data = data;
        }
        getData() {
            return this.data;
        }
        onRegister(): void {

        }
        onRemove(): void {

        }
    }
    export class Observer implements IObserver {

        protected notify: Function = null;
        protected context: any = null;

        constructor(notifyMethod: Function, notifyContext: any) {
            this.setNotifyMethod(notifyMethod);
            this.setNotifyContext(notifyContext);
        }

        private getNotifyMethod(): Function {
            return this.notify;
        }

        setNotifyMethod(notifyMethod: Function): void {
            this.notify = notifyMethod;
        }
        private getNotifyContext(): any {
            return this.context;
        }
        setNotifyContext(notifyContext: any): void {
            this.context = notifyContext;
        }
        notifyObserver(notification: INotification): void {
            this.getNotifyMethod().call(this.getNotifyContext(), notification);
        }
        compareNotifyContext(object: any): boolean {
            return object === this.context;
        }
    }
    export class Mediator extends Notifier implements IMediator, INotifier {
        public static NAME: string = 'Mediator';

        protected mediatorName: string = null;
        protected viewComponent: any = null;

        constructor(mediatorName: string = null, viewComponent: any = null) {
            super();

            this.mediatorName = (mediatorName != null) ? mediatorName : Mediator.name;
            this.viewComponent = viewComponent;
        }

        getMediatorName(): string {
            return this.mediatorName;
        }
        getViewComponent() {
            return this.viewComponent;
        }
        setViewComponent(viewComponent: any): void {
            this.viewComponent = viewComponent;
        }
        listNotificationInterests(): Array<string> {
            return new Array<string>();
        }
        handleNotification(notification: INotification): void {
            
        }
        onRegister(): void {

        }
        onRemove(): void {

        }
    }
    export class MacroCommand extends Notifier implements ICommand, INotifier {
        protected subCommands: Array<Function> = null;

        constructor() {
            super();

            this.subCommands = new Array<Function>();
            this.initializeMacroCommand();
        }

        initializeMacroCommand(): void {

        }

        addSubCommand(commandClassRef: Function): void {
            this.subCommands.push(commandClassRef);
        }

        execute(notification: INotification): void {
            let subCommands: Array<Function> = this.subCommands.slice(0);
            let len: number = this.subCommands.length;
            for (let i = 0; i < len; i++) {
                let commandClassRef: any = subCommands[i];
                let commandInstance: ICommand = <ICommand>new commandClassRef();
                commandInstance.execute(notification);
            }

            this.subCommands.splice(0);
        }
    }
    export class SimpleCommand extends Notifier implements ICommand, INotifier {
        execute(notification: INotification): void {
            
        }
    }
}