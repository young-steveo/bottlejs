/**
 * Records the service currently being built as a dependent of 'name'. When this bottle is not building
 * anything, the read happened inside a parent bottle's factory, so the record is made there instead.
 *
 * @param String name
 * @return void
 */
var recordDependent = function recordDependent(name) {
    var captureTarget, serviceDependents;
    if (this.capturingDepsOf.length) {
        captureTarget = this.capturingDepsOf[this.capturingDepsOf.length - 1];
        serviceDependents = this.dependents[name] = this.dependents[name] || [];
        if (serviceDependents.indexOf(captureTarget) === -1) {
            serviceDependents.push(captureTarget);
        }
    } else if (this.parent) {
        recordDependent.call(this.parent.bottle, this.parent.name + DELIMITER + name);
    }
};

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
            var index, next;
            recordDependent.call(bottle, name);
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
