
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
    decorator : decorator,
    factory : factory,
    middleware : middleware,
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
