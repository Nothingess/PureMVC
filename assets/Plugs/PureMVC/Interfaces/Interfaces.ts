namespace PureMVC {

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
         * 恢复代理
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
        /**设置消息内容 */
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
}
