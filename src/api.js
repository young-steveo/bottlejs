
/**
 * Bottle constructor
 *
 * @param String name Optional name for functional construction
 */
var Bottle = function Bottle(name) {
    if (!(this instanceof Bottle)) {
        return Bottle.pop(name);
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
    digest : digest,
    factory : factory,
    middleware : middleware,
    provider : provider,
    service : service,
    value : value
};

/**
 * Bottle static
 */
Bottle.pop = pop;
