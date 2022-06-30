import Container from './container.js';
export default class Bottle {
    private id;
    container: Container;
    /**
     * Bottle constructor
     *
     * @param string name Optional name for the bottle instance
     */
    constructor(name?: string);
    /**
     * Get an instance of bottle.
     *
     * If a name is provided the instance will be stored in a local record.  Calling Bottle.pop multiple
     * times with the same name will return the same instance.
     */
    static pop(name?: string): Bottle;
    /**
     * Clear one or all named bottles.
     */
    static clear(name?: string): void;
    constant<Type>(name: string, value: Type): Bottle;
}
