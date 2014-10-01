/**
 * Map of provider constructors by index => name
 *
 * @type Object
 */
var providers = [];

var getProviders = function(id) {
    if (!providers[id]) {
        providers[id] = {};
    }
    return providers[id];
};

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
 * @param String name
 * @param Function Provider
 * @return Bottle
 */
var provider = function provider(name, Provider) {
    var providerName, providers, properties, container, id;

    id = this.id;
    providers = getProviders(id);
    if (providers[name]) {
        return console.error(name + ' provider already registered.');
    }

    container = this.container;
    providers[name] = Provider;
    providerName = name + 'Provider';

    properties = Object.create(null);
    properties[providerName] = {
        configurable : true,
        enumerable : true,
        get : function getProvider() {
            var Constructor = providers[name], instance;
            if (Constructor) {
                instance = new Constructor();
                delete container[providerName];
                container[providerName] = instance;
            }
            return instance;
        }
    };

    properties[name] = {
        configurable : true,
        enumerable : true,
        get : function getService() {
            var provider = container[providerName], instance;
            if (provider) {
                instance = provider.$get(container);

                // filter through decorators
                instance = getDecorators(id, '__global__')
                    .concat(getDecorators(id, name))
                    .reduce(reducer, instance);

                delete container[providerName];
                delete container[name];

                container[name] = instance;
            }
            return instance;
        }
    };

    Object.defineProperties(container, properties);
    return this;
};