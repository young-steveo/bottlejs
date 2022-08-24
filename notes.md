using bottle like a function is deprecated

i.e. `Bottle('foo')`.  You must use `new` as in `new Bottle('foo')` or use `Bottle.pop('foo')`

bottle.container.BOTTLE_NAME is renamed to bottle.container.$name


nesting has been updated to make nested containers into actual containers.


private collections are now private.


console.error has been replaced with throw Error

register has been split into several methods, and expanded to include all the different bottle definitions

