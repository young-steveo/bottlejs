const instances : Record<string,Bottle> = {}

export class Bottle {
    public static pop(name: string|undefined): Bottle {
        if (typeof name !== 'string') {
            return new Bottle()
        }
        let instance = instances[name]
        if (!instance) {
            instances[name] = instance = new Bottle()
        }
        return instance
    }
}
