/**
 * Register decorator.
 *
 * @param String fullname
 * @param Function func
 * @return Bottle
 */
var decorator = function decorator(fullname, func) {
    var parts, name;
    if (typeof fullname === FUNCTION_TYPE) {
        func = fullname;
        fullname = GLOBAL_NAME;
    }

    parts = fullname.split(DELIMITER);
    name = parts.shift();
    if (parts.length) {
        getNestedBottle.call(this, name).decorator(parts.join(DELIMITER), func);
    } else {
        if (!this.decorators[name]) {
            this.decorators[name] = [];
        }
        this.decorators[name].push(func);
    }
    return this;
};
