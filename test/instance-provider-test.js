'use strict';

/**
 * For some reason I'm unable to run the Jasmine tests, it just freezes, so this is
 * a simple test for the new functionality.
 */


let Bottle = require('../dist/bottle.js');

let bottle = Bottle.pop();

let factory = (container) => { return { bar: Math.random() }};

bottle.factory('foo', factory);

bottle.instanceProvider('beer', factory);
bottle.instanceProvider('cold.beer', factory);

// Returns same instance
console.log(bottle.container.foo);
console.log(bottle.container.foo);

// Returns new instances
console.log(bottle.container.beer.instance());
console.log(bottle.container.beer.instance());
console.log(bottle.container.cold.beer.instance());
console.log(bottle.container.cold.beer.instance());


