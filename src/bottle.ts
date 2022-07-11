import { defineConstant } from './constant.js'
import Container, { DELIMITER, newContainer, resolveContainer, split } from './container.js'
import Provider, { defineProvider, PROVIDER_SUFFIX } from './provider.js'
import Factory, { factoryProvider, instanceFactory } from './factory.js';
import { defineValue } from './value.js'
import { ServiceConstructor, ServiceFactory, serviceFactory, serviceFactoryProvider } from './service.js';
import { Decorator } from './decorator.js';

const GLOBAL_NAME = '__global__';
const bottles: Record<string, Bottle> = {}

export default class Bottle {

    public static config: { strict: boolean } = { strict: false }

    /**
     * The container
     */
    public container: Container

    /**
     * Map of defined providers. `any` is used here because
     * the services all defined externally by the users
     */
    private providers: Record<string, new () => Provider<any>> = {}

    /**
     * Map of defined decorators. `any` is used here because
     * the services all defined externally by the users
     */
    public decorators: Record<string, Decorator<any>[]> = {}

    /**
     * Bottle constructor
     *
     * @param string name Optional name for the bottle instance
     */
    public constructor(name?: string) {
        this.container = newContainer(this)
        if (name !== undefined) {
            return Bottle.pop(name)
        }
    }

    /**
     * Get an instance of bottle.
     *
     * If a name is provided the instance will be stored in a local record.  Calling Bottle.pop multiple
     * times with the same name will return the same instance.
     */
    public static pop(name?: string): Bottle {
        if (name === undefined) {
            return new Bottle()
        }
        let instance = bottles[name]
        if (!instance) {
            bottles[name] = instance = new Bottle()
        }
        return instance
    }

    /**
     * Clear one or all named bottles.
     */
    public static clear(name?: string): void {
        if (name !== undefined) {
            delete bottles[name]
            return
        }
        for (const prop in bottles) {
            if (bottles.hasOwnProperty(prop)) {
                delete bottles[prop]
            }
        }
    }

    public constant<Constant>(name: string, value: Constant): Bottle {
        const container = resolveContainer(this.container, name)
        defineConstant(container, split(name)[1], value)
        return this
    }

    public value<Value>(name: string, value: Value): Bottle {
        const container = resolveContainer(this.container, name)
        defineValue(container, split(name)[1], value)
        return this
    }

    /**
     * Register a provider.
     *
     * @param String fullName
     * @param Function Provider
     * @return Bottle
     */
    public provider<Service>(fullName: string, provider: new () => Provider<Service>): Bottle {
        const parts = fullName.split(DELIMITER)
        let container = this.container
        if (parts.length) {
            container = resolveContainer(container, parts.join(DELIMITER))
        }
        const name = parts.pop()
        if (!name) {
            throw new Error('Provider name is required.')
        }
        if (this.providers[fullName] && !container[name + PROVIDER_SUFFIX]) {
            throw new Error(fullName + ' provider already defined, and used to create a service.')
        }
        this.providers[fullName] = provider

        defineProvider(container, fullName, name, provider)
        return this
    }

    public resetProviders(names: string[] = []) {
        Object.keys(this.providers).forEach(providerName => {
            if (names.length && names.indexOf(providerName) === -1) {
                return
            }
            const container = resolveContainer(this.container, providerName)
            const name = split(providerName)[1]
            const provider = this.providers[providerName]
            delete this.providers[providerName]
            delete container[name]
            delete container[name + PROVIDER_SUFFIX]
            this.provider(providerName, provider)
        })
    }

    public factory<Service>(name: string, factory: Factory<Service>): Bottle {
        return this.provider(name, factoryProvider(factory))
    }

    public instanceFactory<Service>(name: string, factory: Factory<Service>): Bottle {
        return this.factory(name, instanceFactory(factory))
    }

    public service<Service>(name: string, service: ServiceConstructor<Service>, ...deps: string[]): Bottle {
        return this.factory(name, serviceFactory(service, deps))
    }

    public serviceFactory<Service>(name: string, factory: ServiceFactory<Service>, ...deps:string[]): Bottle {
        return this.provider(name, serviceFactoryProvider(factory, deps))
    }

    public decorator<Service>(name: string|Decorator<Service>, decorator?: Decorator<Service>): Bottle {
        if (typeof name !== 'string') {
            decorator = name;
            name = GLOBAL_NAME;
        }
        if (decorator === undefined) {
            throw Error('If naming a decorator, the second argument must be defined.')
        }
        if (!this.decorators[name]) {
            this.decorators[name] = [];
        }
        this.decorators[name].push(decorator);
        return this;
    };
}
