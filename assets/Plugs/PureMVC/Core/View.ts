namespace PureMVC {
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

        constructor() {
            if (View.instance) {
                throw Error(View.SINGLETON_MSG);
            }

            View.instance = this;
            this.mediatorMap = new Map<string, IMediator>();
            this.observerMap = new Map<string, Array<IObserver>>();
            this.initializeView();
        }

        initializeView(): void {

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
}