import { newContainer } from './container.js';
const bottles = {};
let id = 0;
export default class Bottle {
    /**
     * Bottle constructor
     *
     * @param string name Optional name for the bottle instance
     */
    constructor(name) {
        this.id = id++;
        this.container = newContainer(name);
        if (typeof name === 'string') {
            return Bottle.pop(name);
        }
    }
    /**
     * Get an instance of bottle.
     *
     * If a name is provided the instance will be stored in a local record.  Calling Bottle.pop multiple
     * times with the same name will return the same instance.
     */
    static pop(name) {
        if (typeof name !== 'string') {
            return new Bottle();
        }
        let instance = bottles[name];
        if (!instance) {
            bottles[name] = instance = new Bottle();
            instance.container.$name = name;
        }
        return instance;
    }
    /**
     * Clear one or all named bottles.
     */
    static clear(name) {
        if (typeof name === 'string') {
            delete bottles[name];
            return;
        }
        for (const prop in bottles) {
            if (bottles.hasOwnProperty(prop)) {
                delete bottles[prop];
            }
        }
    }
    constant(name, value) {
        Object.defineProperty(this.container, name, {
            configurable: false,
            enumerable: true,
            writable: false,
            value
        });
        return this;
    }
}
