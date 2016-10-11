
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
 * Map of nested bottles by index => name
 *
 * @type Array
 */
var nestedBottles = [];

/**
 * Get a group (middleware, decorator, etc.) for this bottle instance and service name.
 *
 * @param Array collection
 * @param Number id
 * @param String name
 * @return Array
 */
var get = function get(collection, id, name) {
    var group = collection[id];
    if (!group) {
        group = collection[id] = {};
    }
    if (name && !group[name]) {
        group[name] = [];
    }
    return name ? group[name] : group;
};

/**
 * Will try to get all things from a collection by name, and by __global__.
 *
 * @param Array collection
 * @param Number id
 * @param String name
 * @return Array
 */
var getAllWithMapped = function(collection, id, name) {
    return get(collection, id, name).concat(get(collection, id, '__global__'));
};

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
 * Getet a nested bottle from nestedBottles.  will set and return if not set.
 *
 * @param String name
 * @return Bottle
 */
var getNestedBottle = function getNestedBottle(name, id) {
    bottles = get(nestedBottles, id);
    var t = bottles[name] || (bottles[name] = Bottle.pop());
    return t;
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

/**
 * A helper function for pushing middleware and decorators onto their stacks.
 *
 * @param Array collection
 * @param String name
 * @param Function func
 */
var set = function set(collection, id, name, func) {
    if (typeof name === 'function') {
        func = name;
        name = '__global__';
    }
    get(collection, id, name).push(func);
};
