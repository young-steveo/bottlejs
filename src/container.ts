import Bottle from './bottle.js';
import { defineValue } from './value.js'

export const DELIMITER = '.'

export default interface Container {
    [key: string]: any
    $decorator: () => void
    $list: () => void
    $name: string | undefined
    $bottle: Bottle
}

type ContainerGetter = (container: Container, name: string) => Container

export type Element<Service> = Service | Container | undefined;

export function isContainer<Service>(element: Element<Service>): element is Container {
    if (element === undefined) {
        return false
    }
    const container = element as Container
    return container.$decorator !== undefined &&
        container.$list !== undefined &&
        container.$bottle !== undefined
}

export const newContainer = ($bottle: Bottle, $name?: string): Container => {
    return {
        $decorator: () => {},
        $list: () => {},
        $name,
        $bottle
    }
}

/**
 * Get a property of a container, and set it as a new container
 * if it is not already set.
 */
export const getValueContainer: ContainerGetter = (container: Container, name: string): Container => {
    let nestedContainer = container[name]
    if (!nestedContainer) {
        nestedContainer = newContainer(container.$bottle, name)
        defineValue(container, name, nestedContainer)
    }
    return nestedContainer
}

export const split = (name: string): [string[], string] => {
    const parts = name.split(DELIMITER)
    name = parts.pop() || name
    return [parts, name]
}

/**
 * Traverse nested containers
 */
export const resolveContainer: ContainerGetter = (container: Container, name: string): Container => {
    return split(name)[0].reduce(getValueContainer, container)
}

export const getElement = <Service>(container: Container, name: string): Element<Service> => {
    const element: Element<Service> = container[name];
    return element
}
