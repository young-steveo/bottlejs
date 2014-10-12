
/**
 * Execute any deferred functions
 *
 * @param Mixed data
 * @return Bottle
 */
var resolve = function resolve(data) {
    get(deferred, this.id, '__global__').forEach(function deferredIterator(func) {
        func(data);
    });

    return this;
};
