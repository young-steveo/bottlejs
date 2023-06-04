var Bottle;

/**
 * String constants
 */
var DELIMITER = '.';
var FUNCTION_TYPE = 'function';
var STRING_TYPE = 'string';
var GLOBAL_NAME = '__global__';
var PROVIDER_SUFFIX = 'Provider';

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
    if (service === undefined && Bottle.config.strict) {
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
    var bottle;
    if (!this.nested[name]) {
        bottle = Bottle.pop();
        this.nested[name] = bottle;
        this.factory(name, function SubProviderFactory() {
            return bottle.container;
        });
    }
    return this.nested[name];
};

/**
 * Get a service stored under a nested key
 *
 * @param String fullname
 * @return Service
 */
var getNestedService = function getNestedService(fullname) {
    return fullname.split(DELIMITER).reduce(getNested, this);
};

/**
 * Split a dot-notation string on head segment and rest segment.
 *
 * @param String fullname
 * @return Array
 */
var splitHead = function splitHead(fullname) {
    var parts = fullname.split(DELIMITER);
    return parts.length > 1 ? [parts[0], parts.slice(1).join(DELIMITER)] : [parts[0]];
};
