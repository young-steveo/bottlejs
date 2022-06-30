
/**
 * Immediately instantiates the provided list of services and returns them.
 *
 * @param Array services
 * @return Array Array of instances (in the order they were provided)
 */
var digest = function digest(services) {
    return (services || []).map(getNestedService, this.container);
};
