import { defineConstant } from './constant.js'
import Container, { newContainer } from './container.js'

const bottles: Record<string, Bottle> = {}
let id = 0

export default class Bottle {
    private id: number
    public container: Container

    /**
     * Bottle constructor
     *
     * @param string name Optional name for the bottle instance
     */
    public constructor(name?: string) {
        this.id = id++
        this.container = newContainer(name)
        if (typeof name === 'string') {
            return Bottle.pop(name)
        }
    }

    /**
     * Get an instance of bottle.
     *
     * If a name is provided the instance will be stored in a local record.  Calling Bottle.pop multiple
     * times with the same name will return the same instance.
     */
    public static pop(name?: string): Bottle {
        if (typeof name !== 'string') {
            return new Bottle()
        }
        let instance = bottles[name]
        if (!instance) {
            bottles[name] = instance = new Bottle()
            instance.container.$name = name
        }
        return instance
    }

    /**
     * Clear one or all named bottles.
     */
    public static clear(name?: string): void {
        if (typeof name === 'string') {
            delete bottles[name]
            return
        }
        for (const prop in bottles) {
            if (bottles.hasOwnProperty(prop)) {
                delete bottles[prop]
            }
        }
    }

    public constant<Type>(name: string, value: Type): Bottle {
        defineConstant(this.container, name, value)
        return this
    }
}
