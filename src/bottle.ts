import { defineConstant } from './constant.js'
import Container, { DELIMITER, Element, newContainer, resolveContainer, split } from './container.js'
import Provider, { defineProvider, PROVIDER_SUFFIX } from './provider.js'
import Factory, { factoryProvider, instanceFactory } from './factory.js';
import { defineValue } from './value.js'
import { resolveService } from './service.js';

const bottles: Record<string, Bottle> = {}

let id = 0

export default class Bottle {
    /**
     * The container
     */
    public container: Container

    /**
     * Every bottle keeps track of an internal id
     */
    private id: number

    /**
     * Map of defined providers. `any` is used here because
     * the services provided by the providers are all defined
     * externally by the users
     */
    private providers: Record<string, new () => Provider<any>> = {}

    /**
     * Bottle constructor
     *
     * @param string name Optional name for the bottle instance
     */
    public constructor(name?: string) {
        this.id = id++
        this.container = newContainer(name)
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
            instance.container.$name = name
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

        defineProvider(container, name, provider)
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

    public service<Service>(name: string, service: new(...args: any[]) => Service, ...deps: string[]): Bottle {
        return this.factory(name, (container): Service => {
            const services = deps.map((depName: string): Element<any> => resolveService(container, depName), container)
            return new service(...services)
        })
    }
}
