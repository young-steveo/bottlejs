/**
 * Define a mutable property on the container.
 *
 * @param String name
 * @param mixed val
 * @return void
 * @scope container
 */
var defineValue = function defineValue(name, val) {
    Object.defineProperty(this, name, {
        configurable : true,
        enumerable : true,
        value : val,
        writable : true
    });
};

/**
 * Iterator for setting a plain object literal via defineValue
 *
 * @param Object container
 * @param string name
 */
var setValueObject = function setValueObject(container, name) {
    var nestedContainer = container[name];
    if (!nestedContainer) {
        nestedContainer = {};
        defineValue.call(container, name, nestedContainer);
    }
    return nestedContainer;
};


/**
 * Register a value
 *
 * @param String name
 * @param mixed val
 * @return Bottle
 */
var value = function value(name, val) {
    var parts;
    parts = name.split(DELIMITER);
    name = parts.pop();
    defineValue.call(parts.reduce(setValueObject, this.container), name, val);
    return this;
};
