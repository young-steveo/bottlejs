/**
 * Register a constant
 *
 * @param String name
 * @param mixed value
 * @return Bottle
 */
var constant = function constant(name, value) {
    Object.defineProperty(this.container, name, {
        configurable : false,
        enumerable : true,
        value : value,
        writable : false
    });

    return this;
};