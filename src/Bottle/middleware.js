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
    var bottle = this;
    var descriptor = {
        configurable : true,
        enumerable : true,
        get : function getWithMiddlewear() {
            var captureTarget,serviceDependents, index, next;
            if (bottle.capturingDepsOf.length) {
                captureTarget = bottle.capturingDepsOf[bottle.capturingDepsOf.length - 1];
                serviceDependents = bottle.dependents[name] = bottle.dependents[name] || [];
                if (serviceDependents.indexOf(captureTarget) === -1) {
                    serviceDependents.push(captureTarget);
                }
            }
            if (!middleware.length) {
                return instance;
            }
            index = 0;
            next = function nextMiddleware(err) {
                if (err) {
                    throw err;
                }
                if (middleware[index]) {
                    middleware[index++](instance, next);
                }
            };
            next();
            return instance;
        },
    };

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
