/**
 * Register a service inside a generic factory.
 *
 * @param String name
 * @param Function Service
 * @return Bottle
 */
var service = function service(name, Service) {
    var deps = arguments.length > 2 ? slice.call(arguments, 2) : null;
    var bottle = this;
    return factory.call(this, name, function GenericFactory() {
        if (deps) {
            var args = deps.map(getNestedService, bottle.container);
            args.unshift(Service);
            Service = Service.bind.apply(Service, args);
        }
        return new Service();
    });
};
