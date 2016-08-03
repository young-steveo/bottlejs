/**
 * Register an instance factory inside a generic factory.
 *
 * @param {String} name - The name of the service
 * @param {Function} Factory - The factory function, matches the signature required for the
 * `factory` method
 * @return Bottle
 */
var instanceFactory = function instanceFactory(name, Factory) {
    return factory.call(this, name, function GenericInstanceFactory(container) {
        return {
            instance : Factory.bind(Factory, container)
        };
    });
};
