import Container, { newContainer } from "./container.js";

/**
 * Define a mutable property on the container.
 */
 export const defineValue = <Type>(container: Container, name: string, value: Type): void => {
    Object.defineProperty(container, name, {
        configurable : true,
        enumerable : true,
        writable : true,
        value
    });
};

/**
 * Get a property of a container, and set it as an object
 * literal if it is not already set.
 */
export const setValueContainer = (container: Container, name: string): Container => {
    let nestedContainer = container[name];
    if (!nestedContainer) {
        nestedContainer = newContainer(name);
        defineValue(container, name, nestedContainer);
    }
    return nestedContainer;
};
