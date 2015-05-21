/**
 * Named bottle instances
 *
 * @type Object
 */
var bottles = {};

/**
 * Get an instance of bottle.
 *
 * If a name is provided the instance will be stored in a local hash.  Calling Bottle.pop multiple
 * times with the same name will return the same instance.
 *
 * @param String name
 * @return Bottle
 */
var pop = function pop(name) {
    var instance;
    if (name) {
        instance = bottles[name];
        if (!instance) {
            bottles[name] = instance = new Bottle();
            instance.constant('BOTTLE_NAME', name);
        }
        return instance;
    }
    return new Bottle();
};
