/**
 * Register an instance provider inside a generic provider.
 *
 * @param {String} name - The name of the service
 * @param {Function} Factory - The factory function, matches the signature required for the
 * `factory` method
 * @return Bottle
 */
var instanceProvider = function instanceProvider(name, Factory) {
  return factory.call(this, name, function GenericInstanceFactory(container) {
    return {
      instance : Factory.bind(null, container)
    };
  });
};
