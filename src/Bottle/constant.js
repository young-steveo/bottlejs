/**
 * Register a constant
 *
 * @param String name
 * @param mixed value
 * @return Bottle
 */
var constant = function constant(name, value) {
    var parts = name.split('.');
    name = parts.pop();
    defineConstant.call(parts.reduce(setValueObject, this.container), name, value);
    return this;
};

var defineConstant = function defineConstant(name, value) {
    Object.defineProperty(this, name, {
        configurable : false,
        enumerable : true,
        value : value,
        writable : false
    });
};
