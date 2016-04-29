/**
 * A filter function for removing bottle container methods and providers from a list of keys
 */
var byMethod = function byMethod(name) {
    return !/(?:^\$register$|^\$list$|Provider$)/.test(name);
};

/**
 * List the services registered on the container.
 *
 * @param Object container
 * @return Array
 */
var list = function list(container) {
    return Object.keys(container || this.container || {}).filter(byMethod);
};
