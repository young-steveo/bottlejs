/**
 * Register an instance provider inside a generic provider.
 *
 * @param {String} name - The name of the service
 * @param {Function} Factory - The factory function, matches the signature required for the
 * `factory` method
 * @return Bottle
 */
var instanceProvider = function instanceProvider(name, Factory) {
  return provider.call(this, name, function GenericProvider() {
    this.$get = function(container) {
      return new InstanceProvider(container, Factory);
    }
  });
};

/**
 * A class to provide fully configured instances of an object.
 *
 * @param {*} container - The BottleJS container.
 * @param {Function} factoryFunction - The factory function
 * @constructor
 */
function InstanceProvider(container, factoryFunction) {
  this.container = container;
  this.factoryFunction = factoryFunction;
}

/**
 * Provides a newly created instance of an object.
 *
 * @returns {*}
 */
InstanceProvider.prototype.instance = function() {
  return this.factoryFunction(this.container);
};

