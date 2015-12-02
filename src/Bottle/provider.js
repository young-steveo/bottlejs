/**
 * Map of nested bottles by index => name
 *
 * @type Array
 */
var nestedBottles = [];

/**
 * Map of provider constructors by index => name
 *
 * @type Array
 */
var providerMap = [];

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
    var parts, providers, name, id, factory;
    id = this.id;
    providers = get(providerMap, id);
    parts = fullname.split('.');
    if (providers[fullname] && parts.length === 1 && !this.container[fullname + 'Provider']) {
        return console.error(fullname + ' provider already instantiated.');
    }
    providers[fullname] = true;

    name = parts.shift();
    factory = parts.length ? createSubProvider : createProvider;

    return factory.call(this, name, Provider, fullname, parts);
};

/**
 * Create the provider properties on the container
 *
 * @param String fullname
 * @param String name
 * @param Function Provider
 * @return Bottle
 */
var createProvider = function createProvider(name, Provider) {
    var providerName, properties, container, id;

    id = this.id;
    container = this.container;
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
                delete container[providerName];
                delete container[name];

                // filter through decorators
                instance = getAllWithMapped(decorators, id, name)
                    .reduce(reducer, provider.$get(container));
            }
            return instance === undefined ? instance : applyMiddleware(id, name, instance, container);
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
 * @param String fullname
 * @param Array parts
 * @return Bottle
 */
var createSubProvider = function createSubProvider(name, Provider, fullname, parts) {
    var bottle, bottles, subname, id;

    id = this.id;
    bottles = get(nestedBottles, id);
    bottle = bottles[name];
    if (!bottle) {
        this.container[name] = (bottle = bottles[name] = Bottle.pop()).container;
    }
    subname = parts.join('.');
    bottle.provider(subname, Provider);

    set(fullnameMap, bottle.id, subname, { fullname : fullname, id : id });

    return this;
};
