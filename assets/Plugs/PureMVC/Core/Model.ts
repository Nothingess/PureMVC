namespace PureMVC {
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

        constructor() {
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
}