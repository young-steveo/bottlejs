var getProvider = function(provider) {
    return this.container[provider];
};

/**
 * Immediately instantiates the provided list of providers and returns them.
 *
 * @param array providers
 * @return array Array of instances (in the order they were provided)
 */
var digest = function digest(providers) {
    providers = providers || [];

    return providers.map(getProvider, this);
};
