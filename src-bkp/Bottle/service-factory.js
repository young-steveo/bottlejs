/**
 * Register a function service
 */
var serviceFactory = function serviceFactory(name, factoryService) {
    return createService.apply(this, [name, factoryService, false].concat(slice.call(arguments, 2)));
};
