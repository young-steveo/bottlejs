/**
 * Register a service, factory, provider, or value based on properties on the object.
 *
 * properties:
 *  * Obj.$name   String required ex: `'Thing'`
 *  * Obj.$type   String optional 'service', 'factory', 'provider', 'value'.  Default: 'service'
 *  * Obj.$inject Mixed  optional only useful with $type 'service' name or array of names
 *
 * @param Function Obj
 * @return Bottle
 */
var register = function register(Obj) {
    return this[Obj.$type || 'service'].apply(this, [Obj.$name, Obj].concat(Obj.$inject || []));
};
