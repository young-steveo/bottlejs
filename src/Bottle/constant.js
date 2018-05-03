/**
 * Define an enumerable, non-configurable, non-writable value.
 *
 * @param String name
 * @param mixed value
 * @return undefined
 */
var defineConstant = function defineConstant(name, value) {
    Object.defineProperty(this, name, {
        configurable : false,
        enumerable : true,
        value : value,
        writable : false
    });
};

/**
 * Register a constant
 *
 * @param String name
 * @param mixed value
 * @return Bottle
 */
var constant = function constant(name, value) {
    var parts = name.split(DELIMITER);
    name = parts.pop();
    defineConstant.call(parts.reduce(setValueObject, this.container), name, value);
    return this;
};
