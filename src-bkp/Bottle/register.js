/**
 * Register a service, factory, provider, or value based on properties on the object.
 *
 * properties:
 *  * Obj.$name   String required ex: `'Thing'`
 *  * Obj.$type   String optional 'service', 'factory', 'provider', 'value'.  Default: 'service'
 *  * Obj.$inject Mixed  optional only useful with $type 'service' name or array of names
 *  * Obj.$value  Mixed  optional Normally Obj is registered on the container.  However, if this
 *                       property is included, it's value will be registered on the container
 *                       instead of the object itsself.  Useful for registering objects on the
 *                       bottle container without modifying those objects with bottle specific keys.
 *
 * @param Function Obj
 * @return Bottle
 */
var register = function register(Obj) {
    var value = Obj.$value === undefined ? Obj : Obj.$value;
    return this[Obj.$type || 'service'].apply(this, [Obj.$name, value].concat(Obj.$inject || []));
};
