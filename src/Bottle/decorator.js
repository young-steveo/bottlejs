/**
 * Map of decorator by index => name
 *
 * @type Object
 */
var decorators = [];

/**
 * Register decorator.
 *
 * @param String fullname
 * @param Function func
 * @return Bottle
 */
var decorator = function decorator(fullname, func) {
    var parts, name;
    if (typeof fullname === 'function') {
        set(decorators, this.id, fullname);
        return this;
    }

    parts = fullname.split('.');
    name = parts.shift();
    if (parts.length) {
        getNestedBottle(name, this.id).decorator(parts.join('.'), func);
    } else {
        set(decorators, this.id, name, func);
    }
    return this;
};
