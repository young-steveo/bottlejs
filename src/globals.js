
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
    if (!group[name]) {
        group[name] = [];
    }
    return group[name];
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
