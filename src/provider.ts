import Container from './container.js'

export const PROVIDER_SUFFIX = 'Provider'

export default interface Provider<Service> {
    $get: (container: Container) => Service
}

/**
 * Create the provider properties on the container
 */
export const defineProvider = <Service>(
    container: Container,
    name: string,
    providerDef: new () => Provider<Service>
): void => {
    const providerName = name + PROVIDER_SUFFIX
    const properties: PropertyDescriptorMap = {}
    properties[providerName] = {
        configurable: true,
        enumerable: true,
        get(): Provider<Service> {
            const instance = new providerDef()
            delete container[providerName]
            container[providerName] = instance
            return instance
        }
    }

    properties[name] = {
        configurable: true,
        enumerable: true,
        get(): Service {
            const provider: Provider<Service> = container[providerName]
            const instance = provider.$get(container)

            // @todo decorators

            delete container[providerName]
            delete container[name]

            // @todo middleware
            Object.defineProperty(container, name, {
                configurable: true,
                enumerable: true,
                writable: true,
                value: instance
            })

            return instance
        }
    }

    Object.defineProperties(container, properties)
    return this
}
