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
 * Register a provider.
 *
 * @param String fullname
 * @param Function Provider
 * @return Bottle
 */
var provider = function provider(fullname, Provider) {
    var parts, name;
    parts = fullname.split('.');
    if (this.providerMap[fullname] && parts.length === 1 && !this.container[fullname + 'Provider']) {
        return console.error(fullname + ' provider already instantiated.');
    }
    this.originalProviders[fullname] = Provider;
    this.providerMap[fullname] = true;

    name = parts.shift();

    if (parts.length) {
        createSubProvider.call(this, name, Provider, parts);
        return this;
    }
    return createProvider.call(this, name, Provider);
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
    var providerName, properties, container, id, decorators, middlewares;

    id = this.id;
    container = this.container;
    decorators = this.decorators;
    middlewares = this.middlewares;
    providerName = name + 'Provider';

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
                // filter through decorators
                instance = getWithGlobal(decorators, name).reduce(reducer, provider.$get(container));

                delete container[providerName];
                delete container[name];
            }
            return instance === undefined ? instance : applyMiddleware(getWithGlobal(middlewares, name),
                name, instance, container);
        }
    };

    Object.defineProperties(container, properties);
    return this;
};

/**
 * Creates a bottle container on the current bottle container, and registers
 * the provider under the sub container.
 *
 * @param String name
 * @param Function Provider
 * @param Array parts
 * @return Bottle
 */
var createSubProvider = function createSubProvider(name, Provider, parts) {
    var bottle;
    bottle = getNestedBottle.call(this, name);
    this.factory(name, function SubProviderFactory() {
        return bottle.container;
    });
    return bottle.provider(parts.join('.'), Provider);
};
