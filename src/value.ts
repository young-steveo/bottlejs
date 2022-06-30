import Container, { newContainer } from './container.js'

/**
 * Define a mutable property on the container.
 */
export const defineValue = <Value>(container: Container, name: string, value: Value): void => {
    Object.defineProperty(container, name, {
        configurable: true,
        enumerable: true,
        writable: true,
        value
    })
}
