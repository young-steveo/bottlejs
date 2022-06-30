/**
 * Register a function that will be executed when Bottle#resolve is called.
 *
 * @param Function func
 * @return Bottle
 */
var defer = function defer(func) {
    this.deferred.push(func);
    return this;
};
