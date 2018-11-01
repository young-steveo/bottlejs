declare class Bottle<EntryName extends string = string> {
    static pop(name?: string): Bottle;
    static clear(name?: string): void;
    static list<T extends string = string>(container?: Bottle.IContainer<T>): Array<T>;
    static config: Object;

    public container: Bottle.IContainer;
    public decorators: Object;
    public middlewares: Object;
    public nested: Object;
    public providerMap: Object;
    public deferred: Array<(data: any) => any>;

    constructor(name?: string);

    /**
     * Add a read only value to the container.
     */
    constant(name: string, value: any): this;

    /**
     * Register a decorator function that the provider will use to modify your services at creation time.
     */
    decorator(func: Bottle.Decorator): this;
    decorator(name: EntryName, func: Bottle.Decorator): this;

    /**
     * Register a function to be executed when Bottle#resolve is called.
     */
    defer(func: (data: any) => any): this;

    /**
     * Immediately instantiate an array of services and return their instances in the order of the array of instances.
     */
    digest(services: EntryName[]): Array<any>;

    /**
     * Register a service factory
     */
    factory(name: EntryName, Factory: (container: Bottle.IContainer<EntryName>) => any): this;

    /**
     * Register a service instance factory
     */
    instanceFactory(name: EntryName, Factory: (container: Bottle.IContainer<EntryName>) => any): this;

    /**
     * List the services registered on the container
     */
    list<T extends string = EntryName>(container?: Bottle.IContainer<T>): Array<T>;

    /**
     * Register a middleware function. This function will be executed every time the service is accessed.
     */
    middleware(func: Bottle.Middleware): this;
    middleware(name: EntryName, func: Bottle.Middleware): this;

    /**
     * Register a service provider
     */
    provider(name: EntryName, Provider: ((...any: any[]) => void)): this;

    /**
     * Reset providers on the bottle instance.
     */
    resetProviders(): void;

    /**
     * Register a service, factory, provider, or value based on properties of the Obj.
     */
    register(Obj: Bottle.IRegisterableObject): this;

    /**
     * Execute any deferred functions registered by Bottle#defer.
     */
    resolve(data: any): this;

    /**
     * Register a service constructor. If Bottle.config.strict is set to true, this method will throw an error if an injected dependency is undefined.
     */
    service(name: EntryName, Constructor: ((...any: any[]) => any), ...dependency: EntryName[]): this;
    service<T>(name: EntryName, Constructor: new (...any: any[]) => T, ...dependency: EntryName[]): this;

    /**
     * Register a service function. If Bottle.config.strict is set to true, this method will throw an error if an injected dependency is undefined.
     */
    serviceFactory(name: EntryName, factoryService: ((...any: any[]) => any), ...dependency: EntryName[]): this;
    serviceFactory<T>(name: EntryName, factoryService: ((...any: any[]) => T), ...dependency: EntryName[]): this;

    /**
     * Add an arbitrary value to the container.
     */
    value(name: EntryName, val: any): this;
}

export = Bottle;

declare module Bottle {
    type Middleware = ((service: any, next: (error?: Error) => void) => void);
    type Decorator = (service: any) => any;

    interface IRegisterableObject {
        $name: string;
        $type?: string;
        $inject?: Array<string>;
        $value?: any;
        [others: string]: any;
    }

    interface IContainer<EntryName extends string = string> {
        [key: string]: any;
        $decorator(name: string | Decorator, func?: Decorator): this;
        $register(Obj: Bottle.IRegisterableObject): this;
        $list(container?: Bottle.IContainer): EntryName[];
    }
}
