import { defineValue } from './value.js'

export const DELIMITER = '.'

export default interface Container {
    [key: string]: any
    $decorator: () => void
    $register: () => void
    $list: () => void
    $name: string | undefined
}

type ContainerGetter = (container: Container, name: string) => Container

export const newContainer = (name?: string): Container => {
    return {
        $decorator: () => {},
        $register: () => {},
        $list: () => {},
        $name: name
    }
}

/**
 * Get a property of a container, and set it as a new container
 * if it is not already set.
 */
export const getValueContainer: ContainerGetter = (container: Container, name: string): Container => {
    let nestedContainer = container[name]
    if (!nestedContainer) {
        nestedContainer = newContainer(name)
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
export const resolveNestedContainer: ContainerGetter = (container: Container, name: string): Container => {
    return split(name)[0].reduce(getValueContainer, container)
}
