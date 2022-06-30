/**
 * Register a factory inside a generic provider.
 *
 * @param String name
 * @param Function Factory
 * @return Bottle
 */
var factory = function factory(name, Factory) {
    return provider.call(this, name, function GenericProvider() {
        this.$get = Factory;
    });
};
