
/**
 * Unique id counter;
 *
 * @type Number
 */
var id = 0;

/**
 * Local slice alias
 *
 * @type Functions
 */
var slice = Array.prototype.slice;

/**
 * Iterator used to walk down a nested object.
 *
 * If Bottle.config.strict is true, this method will throw an exception if it encounters an
 * undefined path
 *
 * @param Object obj
 * @param String prop
 * @return mixed
 * @throws Error if Bottle is unable to resolve the requested service.
 */
var getNested = function getNested(obj, prop) {
    var service = obj[prop];
    if (service === undefined && globalConfig.strict) {
        throw new Error('Bottle was unable to resolve a service.  `' + prop + '` is undefined.');
    }
    return service;
};

/**
 * Get a nested bottle. Will set and return if not set.
 *
 * @param String name
 * @return Bottle
 */
var getNestedBottle = function getNestedBottle(name) {
    return this.nested[name] || (this.nested[name] = Bottle.pop());
};

/**
 * Get a service stored under a nested key
 *
 * @param String fullname
 * @return Service
 */
var getNestedService = function getNestedService(fullname) {
    return fullname.split('.').reduce(getNested, this);
};
