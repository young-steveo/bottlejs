/**
 * Deletes providers from the map and container.
 *
 * @param String name
 * @return void
 */
var removeProviderMap = function resetProvider(name) {
    var parts = splitHead(name);
    if (parts.length > 1) {
         removeProviderMap.call(getNestedBottle.call(this, parts[0]), parts[1]);
    }
    delete this.providerMap[name];
    delete this.container[name];
    delete this.container[name + PROVIDER_SUFFIX];
};

/**
 * Clears a reseted service from the dependencies tracker.
 *
 * @param String name
 * @return void
 */
var removeFromDeps = function removeFromDeps(name) {
    var parts = splitHead(name);
    if (parts.length > 1) {
         removeFromDeps.call(getNestedBottle.call(this, parts[0]), parts[1]);
    }
    Object.keys(this.dependents).forEach(function clearDependents(serviceName) {
        if (this.dependents[serviceName]) {
            this.dependents[serviceName] = this.dependents[serviceName]
                .filter(function (dependent) { return dependent !== name; });
        }
    }, this);
};

/**
 * Resets providers on a bottle instance. If 'names' array is provided, only the named providers will be reset.
 *
 * @param Array names
 * @param Boolean [propagate]
 * @return void
 */
var resetProviders = function resetProviders(names, propagate) {
    var shouldFilter = Array.isArray(names);
    Object.keys(this.originalProviders).forEach(function resetProvider(originalProviderName) {
        if (shouldFilter && names.indexOf(originalProviderName) === -1) {
            return;
        }
        var parts = splitHead(originalProviderName);
        if (parts.length > 1) {
            resetProviders.call(getNestedBottle.call(this, parts[0]), [parts[1]], propagate);
        }
        if (shouldFilter && propagate && this.dependents[originalProviderName]) {
            this.resetProviders(this.dependents[originalProviderName], propagate);
        }
        if (shouldFilter) {
            removeFromDeps.call(this, originalProviderName);
        }
        removeProviderMap.call(this, originalProviderName);
        this.provider(originalProviderName, this.originalProviders[originalProviderName]);
    }, this);
};
