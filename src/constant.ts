import Container from './container.js'

export const defineConstant = <Constant>(container: Container, name: string, value: Constant): void => {
    Object.defineProperty(container, name, {
        configurable: false,
        enumerable: true,
        writable: false,
        value
    })
}
