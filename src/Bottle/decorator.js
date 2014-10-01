/**
 * Map of decorator by index => name
 *
 * @type Object
 */
var decorators = [];

/**
 * Register decorator.
 *
 * @param String name
 * @param Function func
 * @return Bottle
 */
var decorator = function decorator(name, func) {
    set(decorators, this.id, name, func);
    return this;
};
