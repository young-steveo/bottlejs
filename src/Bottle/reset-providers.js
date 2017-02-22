var removeProviderMap = function resetProvider(name) {
    delete this.providerMap[name];
    delete this.container[name];
    delete this.container[name + 'Provider'];
};

var resetProviders = function resetProviders() {
    var providers = this.originalProviders;
    Object.keys(providers).forEach(function(provider) {
        var parts = provider.split('.');
        if (parts.length > 1) {
            removeProviderMap.call(this, parts[0]);
            parts.forEach(removeProviderMap.bind(getNestedBottle.call(this, parts[0])));
        }
        removeProviderMap.call(this, provider);
        this.provider(provider, providers[provider]);
    }.bind(this));
};
