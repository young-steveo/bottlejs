import Container, { DELIMITER, Element, getElement, isContainer } from "./container.js";
import Provider from "./provider.js";


const resolveService = <Service>(container: Container, name: string): Element<Service> => {
    return name.split(DELIMITER)
        .reduce((element: Element<Service>, prop: string) => {
            return isContainer(element) ? getElement<Service>(element, prop) : element
        }, container);
}

const resolveServices = (container: Container, deps: string[]) => {
    return deps.map((depName: string): Element<any> => resolveService(container, depName), container)
}

export type ServiceConstructor<Service> = new(...args: any[]) => Service
export type ServiceFactory<Service> = (...args: any[]) => Service

export const serviceFactory = <Service>(service: ServiceConstructor<Service>, deps: string[]) => {
    return (container: Container): Service => {
        return new service(...resolveServices(container, deps))
    }
}

export const serviceFactoryProvider = <Service>(factory: ServiceFactory<Service>, deps: string[]): new() => Provider<Service> => {
    return class {
        $get(container: Container) {
            return factory(...resolveServices(container, deps));
        }
    }
}
