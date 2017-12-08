/**
 * Function used by provider to set up middleware for each request.
 *
 * @param Number id
 * @param String name
 * @param Object instance
 * @param Object container
 * @return void
 */
var applyMiddleware = function applyMiddleware(middleware, name, instance, container) {
    var descriptor = {
        configurable : true,
        enumerable : true
    };
    if (middleware.length) {
        descriptor.get = function getWithMiddlewear() {
            var index = 0;
            var next = function nextMiddleware(err) {
                if (err) {
                    throw err;
                }
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
var middleware = function middleware(fullname, func) {
    var parts, name;
    if (typeof fullname === FUNCTION_TYPE) {
        func = fullname;
        fullname = GLOBAL_NAME;
    }

    parts = fullname.split(DELIMITER);
    name = parts.shift();
    if (parts.length) {
        getNestedBottle.call(this, name).middleware(parts.join(DELIMITER), func);
    } else {
        if (!this.middlewares[name]) {
            this.middlewares[name] = [];
        }
        this.middlewares[name].push(func);
    }
    return this;
};
