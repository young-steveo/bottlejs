/**
 * Map of middleware by index => name
 *
 * @type Object
 */
var middles = [];

var getMiddleware = function getMiddleware(id, name) {
    var group = middles[id];
    if (!group) {
        group = middles[id] = {};
    }
    if (!group[name]) {
        group[name] = [];
    }
    return group[name];
};

/**
 * Register middleware.
 *
 * @param String name
 * @param Function func
 * @return Bottle
 */
var middleware = function middleware(name, func) {
	if (typeof name === 'function') {
		func = name;
		name = '__global__';
	}
	getMiddleware(this.id, name).push(func);
	return this;
};