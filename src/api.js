
/**
 * Bottle constructor
 */
var Bottle = function Bottle() {
	if (!(this instanceof Bottle)) {
		return new Bottle();
	}
	this.id = id++;
	this.container = {};
};

/**
 * Bottle prototype
 */
Bottle.prototype = {
    constant : constant,
    factory : factory,
    middlewear : middlewear,
    provider : provider,
    service : service,
    value : value
};

/**
 * Bottle static
 */
Bottle.pop = function pop() {
	return new Bottle();
};