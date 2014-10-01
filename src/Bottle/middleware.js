/**
 * Map of middleware by index => name
 *
 * @type Object
 */
var middles = [];

/**
 * Function used by provider to set up middleware for each request.
 *
 * @param Number id
 * @param String name
 * @param Object instance
 * @param Object container
 * @return void
 */
var applyMiddleware = function(id, name, instance, container) {
    var middleware = get(middles, id, '__global__').concat(get(middles, id, name));
    var descriptor = {
        configurable : true,
        enumerable : true
    };
    if (middleware.length) {
        descriptor.get = function getWithMiddlewear() {
            var index = 0;
            var next = function() {
                if (middleware[index]) {
                    middleware[index++](instance, next);
                }
            };
            next();
            return instance;
        };
    } else {
        descriptor.value = instance;
        descriptor.writable = true;
    }

    Object.defineProperty(container, name, descriptor);

    return container[name];
};

/**
 * Register middleware.
 *
 * @param String name
 * @param Function func
 * @return Bottle
 */
var middleware = function middleware(name, func) {
    set(middles, this.id, name, func);
    return this;
};
