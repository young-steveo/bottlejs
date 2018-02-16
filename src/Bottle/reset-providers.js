/**
 * Deletes providers from the map and container.
 *
 * @param String name
 * @return void
 */
var removeProviderMap = function resetProvider(name) {
    delete this.providerMap[name];
    delete this.container[name];
    delete this.container[name + PROVIDER_SUFFIX];
};

/**
 * Resets providers on a bottle instance. If 'names' array is provided, only the named providers will be reset.
 *
 * @param Array names
 * @return void
 */
var resetProviders = function resetProviders(names) {
    var tempProviders = this.originalProviders;
    var shouldFilter = Array.isArray(names);

    Object.keys(this.originalProviders).forEach(function resetProvider(originalProviderName) {
        if (shouldFilter && names.indexOf(originalProviderName) === -1) {
            return;
        }
        var parts = originalProviderName.split(DELIMITER);
        if (parts.length > 1) {
            parts.forEach(removeProviderMap, getNestedBottle.call(this, parts[0]));
        }
        removeProviderMap.call(this, originalProviderName);
        this.provider(originalProviderName, tempProviders[originalProviderName]);
    }, this);
};
