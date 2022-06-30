const instances = {};
export class Bottle {
    static pop(name) {
        if (typeof name !== 'string') {
            return new Bottle();
        }
        let instance = instances[name];
        if (!instance) {
            instances[name] = instance = new Bottle();
        }
        return instance;
    }
}
