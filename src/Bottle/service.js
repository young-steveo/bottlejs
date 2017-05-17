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
        var ServiceCopy = Service;
        if (deps) {
            var args = deps.map(getNestedService, bottle.container);
            args.unshift(Service);
            ServiceCopy = Service.bind.apply(Service, args);
        }
        return new ServiceCopy();
    });
};
