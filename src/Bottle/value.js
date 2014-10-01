/**
 * Register a value
 *
 * @param String name
 * @param mixed val
 * @return
 */
var value = function value(name, val) {
    Object.defineProperty(this.container, name, {
        configurable : true,
        enumerable : true,
        value : val,
        writable : true
    });

    return this;
};
