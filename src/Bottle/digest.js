var getService = function(service) {
    return this.container[service];
};

/**
 * Immediately instantiates the provided list of services and returns them.
 *
 * @param array services
 * @return array Array of instances (in the order they were provided)
 */
var digest = function digest(services) {
    return (services || []).map(getService, this);
};
