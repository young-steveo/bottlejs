/**
 * Exports script adapted from lodash v2.4.1 Modern Build
 *
 * @see http://lodash.com/
 */

/**
 * Valid object type map
 *
 * @type Object
 */
var objectTypes = {
    'function' : true,
    'object' : true
};

(function exportBottle(root) {

    /**
     * Free variable exports
     *
     * @type Function
     */
    var freeExports = objectTypes[typeof exports] && exports && !exports.nodeType && exports;

    /**
     * Free variable module
     *
     * @type Object
     */
    var freeModule = objectTypes[typeof module] && module && !module.nodeType && module;

    /**
     * CommonJS module.exports
     *
     * @type Function
     */
    var moduleExports = freeModule && freeModule.exports === freeExports && freeExports;

    /**
     * Free variable `global`
     *
     * @type Object
     */
    var freeGlobal = objectTypes[typeof global] && global;
    if (freeGlobal && (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal)) {
        root = freeGlobal;
    }

    /**
     * Export
     */
    if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {
        root.Bottle = Bottle;
        define(function() { return Bottle; });
    } else if (freeExports && freeModule) {
        if (moduleExports) {
            (freeModule.exports = Bottle).Bottle = Bottle;
        } else {
            freeExports.Bottle = Bottle;
        }
    } else {
        root.Bottle = Bottle;
    }
}((objectTypes[typeof window] && window) || this));
