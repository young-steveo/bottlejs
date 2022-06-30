import Container from './container.js'

export const defineConstant = <Type>(container: Container, name: string, value: Type): void => {
    Object.defineProperty(container, name, {
        configurable: false,
        enumerable: true,
        writable: false,
        value
    })
}
