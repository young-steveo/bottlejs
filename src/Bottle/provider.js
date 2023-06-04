/**
 * Used to process decorators in the provider
 *
 * @param Object instance
 * @param Function func
 * @return Mixed
 */
var reducer = function reducer(instance, func) {
    return func(instance);
};


/**
 * Get decorators and middleware including globals
 *
 * @return array
 */
var getWithGlobal = function getWithGlobal(collection, name) {
    return (collection[name] || []).concat(collection.__global__ || []);
};


/**
 * Create the provider properties on the container
 *
 * @param String name
 * @param Function Provider
 * @return Bottle
 */
var createProvider = function createProvider(name, Provider) {
    var bottle, providerName, properties, container, decorators, middlewares;

    bottle = this;
    container = this.container;
    decorators = this.decorators;
    middlewares = this.middlewares;
    providerName = name + PROVIDER_SUFFIX;

    properties = Object.create(null);
    properties[providerName] = {
        configurable : true,
        enumerable : true,
        get : function getProvider() {
            var instance = new Provider();
            delete container[providerName];
            container[providerName] = instance;
            return instance;
        }
    };

    properties[name] = {
        configurable : true,
        enumerable : true,
        get : function getService() {
            var provider = container[providerName];
            var instance;
            if (provider) {
                bottle.capturingDepsOf.push(name);
                // filter through decorators
                instance = getWithGlobal(decorators, name).reduce(reducer, provider.$get(container));
                bottle.capturingDepsOf.pop();

                delete container[providerName];
                delete container[name];
            }
            if (instance === undefined) {
                return instance;
            }
            return applyMiddleware.call(bottle, getWithGlobal(middlewares, name), name, instance, container);
        }
    };

    Object.defineProperties(container, properties);
    return this;
};


/**
 * Register a provider.
 *
 * @param String fullname
 * @param Function Provider
 * @return Bottle
 */
var provider = function provider(fullname, Provider) {
    var parts, name;
    parts = fullname.split(DELIMITER);
    if (this.providerMap[fullname] && parts.length === 1 && !this.container[fullname + PROVIDER_SUFFIX]) {
        return console.error(fullname + ' provider already instantiated.');
    }
    this.originalProviders[fullname] = Provider;
    this.providerMap[fullname] = true;

    name = parts.shift();

    if (parts.length) {
        getNestedBottle.call(this, name).provider(parts.join(DELIMITER), Provider);
        return this;
    }
    return createProvider.call(this, name, Provider);
};
