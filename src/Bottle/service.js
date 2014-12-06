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
    return factory.call(this, name, function GenericFactory() {
        if (deps) {
            Service = Service.bind.apply(Service, deps.map(getNested.bind(bottle, bottle.container)));
        }
        return new Service();
    });
};
