export class Bottle {
    static pop: (name?: string) => Bottle
    static config: Object;

    public container: Bottle.IContainer;

    constructor(name?: string);

    /**
     * Add a read only value to the container.
     */
    constant(name: string, value: any): this;

    /**
     * Register a decorator function that the provider will use to modify your services at creation time.
     */
    decorator(name: string|((service: any) => any), func?: (service: any) => any): this;

    /**
     * Register a function to be executed when Bottle#resolve is called.
     */
    defer(func: (data: any) => any): this;

    /**
     * Immediately instantiate an array of services and return their instances in the order of the array of instances.
     */
    digest(services: Array<string>): Array<any>;

    /**
     * Register a service factory
     */
    factory(name: string, Factory: (container: Bottle.IContainer) => any): this;

    /**
     * Register a middleware function. This function will be executed every time the service is accessed.
     */
    middleware(name: string|((service: any, next: (error?: Error) => void) => void),
        func?: (service: any, next: (error?: Error) => void) => void): this;

    /**
     * Register a service provider
     */
    provider(name: string, Provider: ((...any) => void)): this;

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
    service(name: string, Constructor: ((...any) => any), ...dependency: string[]): this;

    /**
     * Add an arbitrary value to the container.
     */
    value(name: string, val: any): this;
}

export module Bottle {
    interface IRegisterableObject {
        $name: string;
        $type?: string;
        $inject?: Array<string>;
        $value?: any;
        [others: string]: any;
    }

    interface IContainer {
        $register(Obj: Bottle.IRegisterableObject): this;
    }
}