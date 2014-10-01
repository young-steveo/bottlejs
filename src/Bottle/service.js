/**
 * Map used to inject dependencies in the generic factory;
 *
 * @param String key
 * @return mixed
 */
var mapContainer = function mapContainer(key) {
    return this.container[key];
};

/**
 * Register a service inside a generic factory.
 *
 * @param String name
 * @param Function Service
 * @return Bottle
 */
var service = function service(name, Service) {
    var deps = arguments.length > 2 ? slice.call(arguments, 1) : null;
    var bottle = this;
    return factory.call(bottle, name, function GenericFactory() {
        if (deps) {
            Service = Service.bind.apply(Service, deps.map(mapContainer, bottle));
        }
        return new Service();
    });
};
