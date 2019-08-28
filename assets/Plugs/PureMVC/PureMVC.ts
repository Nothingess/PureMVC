//#region 注意：命名空间需要用 export 导出，在需要引用的地方要用 import 引入
//#endregion

export namespace PureMVC {

    //#region 核心MVC

    export class Model implements IModel {
        protected static SINGLETON_MSG: string = "Model singleton already constructed!";
        protected static instance: IModel;
        public static getInstance(): IModel {
            if (!Model.instance) {
                Model.instance = new Model();
            }
            return Model.instance;
        }

        protected proxyMap: Map<string, IProxy> = null;

        private constructor() {
            if (Model.instance) {
                throw Error(Model.SINGLETON_MSG);
            }

            Model.instance = this;
            this.proxyMap = new Map<string, IProxy>();
            this.initializeModel();
        }

        protected initializeModel(): void {

        }

        registerProxy(proxy: IProxy): void {
            this.proxyMap.set(proxy.getProxyName(), proxy);
            proxy.onRegister();
        }
        removeProxy(proxyName: string): IProxy {
            let proxy: IProxy = this.proxyMap.get(proxyName);
            if (proxy) {
                this.proxyMap.delete(proxyName);
                proxy.onRemove();
            }
            return proxy;
        }
        retrieveProxy(proxyName: string): IProxy {
            return this.proxyMap.get(proxyName) || null;
        }
        hasProxy(proxyName: string): boolean {
            return this.proxyMap.get(proxyName) != null;
        }
    }

    export class View implements IView {
        protected static SINGLETON_MSG: string = "View singleton already constructed!";
        protected static instance: IView;
        public static getInstance(): IView {
            if (!View.instance) {
                View.instance = new View();
            }
            return View.instance;
        }

        protected mediatorMap: Map<string, IMediator> = null;
        protected observerMap: Map<string, Array<IObserver>> = null;

        private constructor() {
            if (View.instance) {
                throw Error(View.SINGLETON_MSG);
            }

            View.instance = this;
            this.mediatorMap = new Map<string, IMediator>();
            this.observerMap = new Map<string, Array<IObserver>>();
            this.initializeView();
        }

        protected initializeView(): void {

        }


        registerObserver(notificationName: string, observer: IObserver): void {
            let observers: Array<IObserver> = this.observerMap.get(notificationName);
            if (observers) {
                observers.push(observer);
            } else {
                this.observerMap.set(notificationName, [observer]);
            }
        }
        removeObserver(notificationName: string, notifyContext: any): void {
            let observers: Array<IObserver> = this.observerMap.get(notificationName);
            let i: number = observers.length;
            while (i--) {
                let observer: IObserver = observers[i];
                if (observer.compareNotifyContext(notifyContext)) {
                    observers.splice(i, 1);
                    break;
                }
            }

            if (observers.length == 0) {
                this.observerMap.delete(notificationName);
            }
        }
        notifyObservers(notification: INotification): void {
            let notificationName: string = notification.getName();

            let observersRef: Array<IObserver> = this.observerMap.get(notificationName);
            if (observersRef) {
                let observers: Array<IObserver> = observersRef.slice(0);
                let len: number = observers.length;
                for (let i = 0; i < len; i++) {
                    let observer = observers[i];
                    observer.notifyObserver(notification);
                }
            }
        }
        registerMediator(mediator: IMediator): void {
            let name: string = mediator.getMediatorName();
            if (this.mediatorMap.get(name)) return;
            this.mediatorMap.set(name, mediator);

            let interests: Array<string> = mediator.listNotificationInterests();
            let len: number = interests.length;
            if (len > 0) {
                let observer: IObserver = new Observer(mediator.handleNotification, mediator);
                for (let i = 0; i < len; i++) {
                    this.registerObserver(interests[i], observer);
                }
            }

            mediator.onRegister();
        }
        retrieveMediator(mediatorName: string): IMediator {
            return this.mediatorMap.get(mediatorName) || null;
        }
        removeMediator(mediatorName: string): IMediator {
            let mediator: IMediator = this.mediatorMap.get(mediatorName);
            if (!mediator) return null;

            let interests: Array<string> = mediator.listNotificationInterests();
            let i: number = interests.length;
            while (i--) {
                this.removeObserver(interests[i], mediator);
            }

            this.mediatorMap.delete(mediatorName);
            mediator.onRemove();
            return mediator;
        }
        hasMediator(mediatorName: string): boolean {
            return this.mediatorMap.get(mediatorName) != null;
        }
    }

    export class Controller implements IController {
        protected static SINGLETON_MSG: string = "Controller singleton already constructed!";
        protected static instance: Controller = null;
        public static getInstance(): Controller {
            if (!Controller.instance) {
                Controller.instance = new Controller();
            }
            return Controller.instance;
        }

        protected view: IView = null;
        protected commandMap: Object = null;

        private constructor() {
            if (Controller.instance) {
                throw Error(Controller.SINGLETON_MSG);
            }
            Controller.instance = this;
            this.commandMap = {};
            this.initializeController();
        }

        initializeController(): void {
            this.view = View.getInstance();
        }

        executeCommand(notification: INotification): void {
            let commandClassRef: any = this.commandMap[notification.getName()];
            if (commandClassRef) {
                let command: ICommand = <ICommand>new commandClassRef();
                command.execute(notification);
            }
        }
        registerCommand(notificationName: string, commandClassRef: Function): void {
            if (!this.commandMap[notificationName]) {
                this.view.registerObserver(notificationName, new Observer(this.executeCommand, this));
            }
            this.commandMap[notificationName] = commandClassRef;
        }
        hasCommand(notificationName: string): boolean {
            return this.commandMap[notificationName] != null;
        }
        removeCommand(notificationName: string): void {
            if (this.hasCommand(notificationName)) {
                this.view.removeObserver(notificationName, this);
                delete this.commandMap[notificationName];
            }
        }
    }

    //#endregion

    //#region 接口 Interfaces

    //#region 上层消息接口（base notification interface）

    /**消息通告者接口 */
    export interface INotifier {
        /**
         * 发送消息
         * @param name 消息名称
         * @param body 消息体
         * @param type 消息类型
         */
        sendNotification(name: string, body?: any, type?: string): void;
    }
    /**消息体接口 */
    export interface INotification {
        /**获取消息名称 */
        getName(): string;
        /**设置消息体 */
        setBody(body: any): void;
        /**获取消息体 */
        getBody(): any;
        /**设置消息类型 */
        setType(type: string): void;
        /**获取消息类型 */
        getType(): string;
        /**序列化输出消息体（debug） */
        toString(): string;
    }

    //#endregion

    //#region 模型层接口

    /**数据模型代理接口 */
    export interface IProxy extends INotifier {
        /**获取代理名称 */
        getProxyName(): string;
        /**设置代理数据 */
        setData(data: any): void;
        /**获取代理数据 */
        getData(): any;
        /**注册
         * 注册IProxy时由模型调用。
         * 这个方法必须是由子类重写，以知道何时注册实例。
         */
        onRegister(): void;
        /**移除 */
        onRemove(): void;
    }
    /**数据模型层接口 */
    export interface IModel {
        /**
         * 注册代理
         * @param proxy 代理
         */
        registerProxy(proxy: IProxy): void;
        /**
         * 通过代理名称移除代理
         * @param proxyName 代理名称
         */
        removeProxy(proxyName: string): IProxy;
        /**
         * 检索代理
         * @param proxyName 代理名称
         */
        retrieveProxy(proxyName: string): IProxy;
        /**是否已经注册代理 */
        hasProxy(proxyName: string): boolean;
    }

    //#endregion

    //#region 视图层接口

    /**观察者接口 */
    export interface IObserver {
        /**设置消息回调 */
        setNotifyMethod(notifyMethod: Function): void;
        /**设置消息上下文 */
        setNotifyContext(notifyContext: any): void;
        /**监听事件 */
        notifyObserver(notification: INotification): void;
        /**比较消息内容 */
        compareNotifyContext(object: any): boolean;
    }
    /**中介者接口 */
    export interface IMediator extends INotifier {
        getMediatorName(): string;
        getViewComponent(): any;
        setViewComponent(viewComponent: any): void;
        listNotificationInterests(): string[];
        handleNotification(notification: INotification): void;
        onRegister(): void;
        onRemove(): void;
    }
    /**视图层接口 */
    export interface IView {
        registerObserver(notificationName: string, observer: IObserver): void;
        removeObserver(notificationName: string, notifyContext: any): void;
        notifyObservers(notification: INotification): void;
        registerMediator(mediator: IMediator): void;
        retrieveMediator(mediatorName: string): IMediator;
        removeMediator(mediatorName: string): IMediator;
        hasMediator(mediatorName: string): boolean;
    }

    //#endregion

    //#region 控制层接口

    /**命令接口 */
    export interface ICommand extends INotifier {
        /**执行命令 */
        execute(notification: INotification): void;
    }
    /**控制层接口 */
    export interface IController {
        executeCommand(notification: INotification): void;
        registerCommand(notificationName: string, commandClassRef: Function): void;
        hasCommand(notificationName: string): boolean;
        removeCommand(notificationName: string): void;
    }

    //#endregion

    /**外观者接口 */
    export interface IFacade extends INotifier {
        registerCommand(notificationName: string, commandClassRef: Function): void;
        removeCommand(notificationName: string): void;
        hasCommand(notificationName: string): boolean;
        registerProxy(proxy: IProxy): void;
        retrieveProxy(proxyName: string): IProxy;
        removeProxy(proxyName: string): IProxy;
        hasProxy(proxyName: string): boolean;
        registerMediator(mediator: IMediator): void;
        retrieveMediator(mediatorName: string): IMediator;
        removeMediator(mediatorName: string): IMediator;
        hasMediator(mediatorName: string): boolean;
        notifyObservers(notification: INotification): void;
    }

    //#endregion

    //#region 设计模式 Patterns

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

        private constructor() {
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
        /**检索代理 */
        retrieveProxy(proxyName: string): IProxy {
            return this.model.retrieveProxy(proxyName);
        }
        /**移除代理 */
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

        constructor() {
            this.facade = Facade.getInstance();
        }

        sendNotification(name: string, body: any = null, type: string = null): void {
            this.facade.sendNotification(name, body, type);
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
        protected context: any = null;          //上下文（即，目标this）

        /**
         * 注册观察者
         * @param notifyMethod 回调
         * @param notifyContext 上下文，this
         */
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
        /**监听感兴趣的事件 */
        listNotificationInterests(): Array<string> {
            return new Array<string>();
        }
        /**处理感兴趣的事件 */
        handleNotification(notification: INotification): void {

        }
        /**注册 */
        onRegister(): void {

        }
        /**移除 */
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

    //#endregion

}

