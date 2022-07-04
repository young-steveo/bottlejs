import Container from "./container.js";
import Provider from "./provider.js";

type Factory<Service> = (container: Container) => Service

export default Factory

export interface InstanceFactory<Service> {
    instance: () => Service
}

export const factoryProvider = <Service>(factory: Factory<Service>): new() => Provider<Service> => {
    return class {
        $get(container: Container) {
            return factory(container);
        }
    }
}

export const instanceFactory = <Service>(factory: Factory<Service>): Factory<InstanceFactory<Service>> => {
    return (container: Container) => {
        return { instance : () => factory(container) }
    }
}
