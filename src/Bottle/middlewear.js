/**
 * Map of middlewear by index => name
 *
 * @type Object
 */
var middles = [];

var getMiddlewear = function getMiddlewear(id, name) {
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
 * Register middlewear.
 *
 * @param String name
 * @param Function func
 * @return Bottle
 */
var middlewear = function middlewear(name, func) {
	if (typeof name === 'function') {
		func = name;
		name = '__global__';
	}
	getMiddlewear(this.id, name).push(func);
	return this;
};