
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
 * Map of fullnames by index => name
 *
 * @type Array
 */
var fullnameMap = [];

/**
 * Iterator used to flatten arrays with reduce.
 *
 * @param Array a
 * @param Array b
 * @return Array
 */
var concatIterator = function concatIterator(a, b) {
    return a.concat(b);
};

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
 * Will try to get all things from a collection by name, by __global__, and by mapped names.
 *
 * @param Array collection
 * @param Number id
 * @param String name
 * @return Array
 */
var getAllWithMapped = function(collection, id, name) {
    return get(fullnameMap, id, name)
        .map(getMapped.bind(null, collection))
        .reduce(concatIterator, get(collection, id, name))
        .concat(get(collection, id, '__global__'));
};

/**
 * Iterator used to get decorators from a map
 *
 * @param Array collection
 * @param Object data
 * @return Function
 */
var getMapped = function getMapped(collection, data) {
    return get(collection, data.id, data.fullname);
};

/**
 * Iterator used to walk down a nested object.
 *
 * @param Object obj
 * @param String prop
 * @return mixed
 */
var getNested = function getNested(obj, prop) {
    return obj[prop];
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

var mergeArray = function mergeArray(source, target) {
    source.forEach(function (item, index) {
        target[index] = item;
    });
    return target;
};

// https://github.com/sindresorhus/fn-args/blob/master/index.js
var fnArgs = function fnArgs(fn) {
    if (fn.length === 0) {
        return [];
    }
    var reComments = /(\/\*([\s\S]*?)\*\/|([^:]|^)\/\/(.*)$)/mg;
    var reFnArgs = /^function\s*[^(]*\(([^)]+)\)/;
    var match = reFnArgs.exec(fn.toString().replace(reComments, ''));
    return match ? match[1].split(',').map(function (el) {
        return el.trim();
    }) : [];
};
