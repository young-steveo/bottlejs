/**
 * Map of deferred functions by id => name
 *
 * @type Object
 */
var deferred = [];

/**
 * Register a function that will be executed when Bottle#resolve is called.
 *
 * @param Function func
 * @return Bottle
 */
var defer = function defer(func) {
    set(deferred, this.id, func);
    return this;
};
