/**
 * Private helper for creating service and service factories.
 *
 * @param String name
 * @param Function Service
 * @return Bottle
 */
var createService = function createService(name, Service, isClass) {
    var deps = arguments.length > 3 ? slice.call(arguments, 3) : [];
    var bottle = this;
    return factory.call(this, name, function GenericFactory() {
        var serviceFactory = Service; // alias for jshint
        var args = deps.map(getNestedService, bottle.container);

        if (!isClass) {
            return serviceFactory.apply(null, args);
        }
        return new (Service.bind.apply(Service, [null].concat(args)))();
    });
};

/**
 * Register a class service
 *
 * @param String name
 * @param Function Service
 * @return Bottle
 */
var service = function service(name, Service) {
    return createService.apply(this, [name, Service, true].concat(slice.call(arguments, 2)));
};
