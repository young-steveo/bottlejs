
/**
 * Execute any deferred functions
 *
 * @param Mixed data
 * @return Bottle
 */
var resolve = function resolve(data) {
    this.deferred.forEach(function deferredIterator(func) {
        func(data);
    });

    return this;
};
