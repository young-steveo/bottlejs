/**
 * Map of decorator by index => name
 *
 * @type Object
 */
var middles = [];

var getDecorators = function getDecorators(id, name) {
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
 * Register decorator.
 *
 * @param String name
 * @param Function func
 * @return Bottle
 */
var decorator = function decorator(name, func) {
	if (typeof name === 'function') {
		func = name;
		name = '__global__';
	}
	getDecorators(this.id, name).push(func);
	return this;
};