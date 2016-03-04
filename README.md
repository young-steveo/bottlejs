
![BottleJS](/bottle-logo.jpg)
# BottleJS [![Build Status](https://travis-ci.org/young-steveo/bottlejs.svg?branch=master)](https://travis-ci.org/young-steveo/bottlejs)

> A powerful dependency injection micro container

## Introduction

BottleJS is a tiny, powerful dependency injection container.  It features lazy loading, middleware hooks, decorators and a clean api inspired by the [AngularJS Module API](https://docs.angularjs.org/api/ng/type/angular.Module) and the simple PHP library [Pimple](http://pimple.sensiolabs.org/).  You'll like BottleJS if you enjoy:

* building a stack from components rather than a kitchen-sink framework.
* uncoupled objects and dependency injection.
* an API that makes sense.
* lazily loaded objects.
* trying cool stuff :smile:

## Browser Support

BottleJS supports IE9+ and other ECMAScript 5 compliant browsers.

## Installation

BottleJS can be used in a browser or in a nodejs app.  It can be installed via bower or npm:

```bash
$ bower install bottlejs
```

```bash
$ npm install bottlejs
```

## Simple Example

The simplest recipe to get started with is `Bottle#service`.  Say you have a constructor for a service object:

```js
var Beer = function() { /* A beer service, :yum: */ };
```

You can register the constructor with `Bottle#service`:

```js
var bottle = new Bottle();
bottle.service('Beer', Beer);
```

Later, when you need the constructed service, you just access the `Beer` property like this:

```js
bottle.container.Beer;
```

A lot happened behind the scenes:

1. Bottle created a provider containing a factory function when you registered the Beer service.
2. When the `bottle.container.Beer` property was accessed, Bottle looked up the provider and executed the factory to build and return the Beer service.
3. The provider and factory were deleted, and the `bottle.container.Beer` property was set to be the Beer service instance.  Accessing `bottle.container.Beer` in the future becomes a simple property lookup.

## Injecting Dependencies

The above example is simple.  But, what if the Beer service had dependencies?  For example:

```js
var Barley = function() {};
var Hops = function() {};
var Water = function() {};
var Beer = function(barley, hops, water) { /* A beer service, :yum: */ };
```

You can register services with `Bottle#service` and include dependencies like this:

```js
var bottle = new Bottle();
bottle.service('Barley', Barley);
bottle.service('Hops', Hops);
bottle.service('Water', Water);
bottle.service('Beer', Beer, 'Barley', 'Hops', 'Water');
```

Now, when you access `bottle.container.Beer`, Bottle will lazily load all of the dependencies and inject them into your Beer service before returning it.

### Service Factory

If you need more complex logic when generating a service, you can register a factory instead.  A factory function receives the container as an argument, and should return your constructed service:

```js
var bottle = new Bottle();
bottle.service('Barley', Barley);
bottle.service('Hops', Hops);
bottle.service('Water', Water);
bottle.factory('Beer', function(container) {
    var barley = container.Barley;
    var hops = container.Hops;
    var water = container.Water;

    barley.halved();
    hops.doubled();
    water.spring();
    return new Beer(barley, hops, water);
});
```

### Service Provider

This is the meat of the Bottle library.  The above methods `Bottle#service` and `Bottle#factory` are just shorthand for the provider function.  You usually can get by with the simple functions above, but if you really need more granular control of your services in different environments, regiser them as a provider.  To use it, pass a constructor for the provider that exposes a `$get` function.  The `$get` function is used as a factory to build your service.

```js
var bottle = new Bottle();
bottle.service('Barley', Barley);
bottle.service('Hops', Hops);
bottle.service('Water', Water);
bottle.provider('Beer', function() {
    // This environment may not support water.
    // We should polyfill it.
    if (waterNotSupported) {
        Beer.pollyfillWater();
    }

    // this is the service factory.
    this.$get = function(container) {
        var barley = container.Barley;
        var hops = container.Hops;
        var water = container.Water;

        barley.halved();
        hops.doubled();
        water.spring();
        return new Beer(barley, hops, water);
    };
});
```

## Decorators

Bottle supports injecting decorators into the provider pipeline with the `Bottle#decorator` method.  Bottle decorators are just simple functions that intercept a service in the provider phase after it has been created, but before it is accessed for the first time.  The function should return the service, or another object to be used as the service instead.

```js
var bottle = new Bottle();
bottle.service('Beer', Beer);
bottle.service('Wine', Wine);
bottle.decorator(function(service) {
    // this decorator will be run for both Beer and Wine services.
    service.stayCold();
    return service;
});

bottle.decorator('Wine', function(wine) {
    // this decorator will only affect the Wine service.
    wine.unCork();
    return wine;
});
```

## Middleware

Bottle middleware are similar to decorators, but they are executed every time a service is accessed from the container.  They are passed the service instance and a `next` function:

```js
var bottle = new Bottle();
bottle.service('Beer', Beer);
bottle.middleware(function(service, next) {
    // this middleware will be executed for all services
    console.log('A service was accessed!');
    next();
});

bottle.middleware('Beer', function(beer, next) {
    // this middleware will only affect the Beer service.
    console.log('Beer?  Nice.  Tip your bartender...');
    next();
});
```

Middleware can pass an error object to the `next` function, and bottle will throw the error:

```js
var bottle = new Bottle();
bottle.service('Beer', Beer);
bottle.middleware('Beer', function(beer, next) {
    if (beer.hasGoneBad()) {
        return next(new Error('The Beer has gone bad!'));
    }
    next();
});

// results in Uncaught Error: The Beer has gone bad!(…)
```

## Nested Bottles
Bottle will generate nested containers if dot notation is used in the service name.  A sub container will be created for you based on the name given:

```js
var bottle = new Bottle();
var IPA = function() {};
bottle.service('Beer.IPA', IPA);
bottle.container.Beer; // this is a new Bottle.container object
bottle.container.Beer.IPA; // the service
```

## API

### Bottle

#### pop([name])

Used to get an instance of bottle.  If a name is passed, bottle will return the same instance.  Calling the Bottle constructor as a function will call and return return `Bottle.pop`, so `Bottle.pop('Soda') === Bottle('Soda')`

Param                      | Type       | Details
:--------------------------|:-----------|:--------
**name**<br />*(optional)* | *String*   | The name of the bottle. If passed, bottle will store the instance internally and return the same instance if `Bottle.pop` is subsequently called with the same name.

#### config

A global configuration object.

Property   | Type      | Default | Details
:----------|:----------|:--------|:--------
**strict** | *Boolean* | `false` | Enables strict mode.  Currently only verifies that automatically injected dependencies are not undefined.

### Bottle.prototype

#### constant(name, value)

Used to add a read only value to the container.

Param     | Type       | Details
:---------|:-----------|:--------
**name**  | *String*   | The name of the constant.  Must be unique to each Bottle instance.
**value** | *Mixed*    | A value that will be defined as enumerable, but not writable.

#### decorator(name, func)

Used to register a decorator function that the provider will use to modify your services at creation time.

Param                      | Type       | Details
:--------------------------|:-----------|:--------
**name**<br />*(optional)* | *String*   | The name of the service this decorator will affect. Will run for all services if not passed.
**func**                   | *Function* | A function that will accept the service as the first parameter.  Should return the service, or a new object to be used as the service.

#### defer(func)

Register a function to be executed when `Bottle#resolve` is called.

Param    | Type       | Details
:--------|:-----------|:--------
**func** | *Function* | A function to be called later.  Will be passed a value given to `Bottle#resolve`.

#### digest(services)

Immediately instantiate an array of services and return their instances
in the order of the array of instances.

Param        | Type    | Details
:------------|:--------|:--------
**services** | *Array* | Array of services that should be instantiated.

#### factory(name, Factory)

Used to register a service factory

Param       | Type       | Details
:-----------|:-----------|:--------
**name**    | *String*   | The name of the service.  Must be unique to each Bottle instance.
**Factory** | *Function* | A function that should return the service object.  Will only be called once; the Service will be a singleton.  Gets passed an instance of the container to allow dependency injection when creating the service.

#### middleware(name, func)

Used to register a middleware function.  This function will be executed every time the service is accessed.

Param                      | Type       | Details
:--------------------------|:-----------|:--------
**name**<br />*(optional)* | *String*   | The name of the service for which this middleware will be called. Will run for all services if not passed.
**func**                   | *Function* | A function that will accept the service as the first parameter, and a `next` function as the second parameter.  Should execute `next()` to allow other middleware in the stack to execute.  Bottle will throw anything passed to the `next` function, i.e. `next(new Error('error msg'))`.

#### provider(name, Provider)

Used to register a service provider

Param        | Type       | Details
:------------|:-----------|:--------
**name**     | *String*   | The name of the service.  Must be unique to each Bottle instance.
**Provider** | *Function* | A constructor function that will be instantiated as a singleton.  Should expose a function called `$get` that will be used as a factory to instantiate the service.

#### register(Obj)
#### container.$register(Obj)

Used to register a service, factory, provider, or value based on properties of the Obj.  `bottle.container.$register` is an alias of `bottle.register`; this allows factories and providers to register multiple services on the container without needing access to the bottle instance itself.

If `Bottle.config.strict` is set to `true`, this method will throw an error if an injected dependency is `undefined`.

Param   | Type       | Details
:-------|:-----------|:--------
**Obj** | *Object*\|*Function* | An object or constructor with one of several properties:<br /><ul><li>**Obj.$name** &mdash; *required* &mdash; the name used to register the object</li><li>**Obj.$type** &mdash; *optional* &mdash; the method used to register the object.  Defaults to `'service'` in which case the Obj will be treated as a constructor. Valid types are: `'service'`, `'factory'`, `'provider'`, `'value'`</li><li>**Obj.$inject** &mdash; *optional* &mdash; If `Obj.$type` is `'service'`, this property can be a string name or an array of names of dependencies to inject into the constructor.<br />E.g. `Obj.$inject = ['dep1', 'dep2'];`</li><li>**Obj.$value** &mdash; *optional* &mdash; Normally Obj is registered on the container.  However, if this property is included, it's value will be registered on the container instead of the object itself.  Useful for registering objects on the bottle container without modifying those objects with bottle specific keys.</li></ul>

#### resolve(data)

Execute any deferred functions registered by `Bottle#defer`.

Param                      | Type    | Details
:--------------------------|:--------|:--------
**data**<br />*(optional)* | *Mixed* | Value to be passed to each deferred function as the first parameter.

#### service(name, Constructor [, dependency [, ...]])

Used to register a service constructor.  If `Bottle.config.strict` is set to `true`, this method will throw an error if an injected dependency is `undefined`.

Param                            | Type       | Details
:--------------------------------|:-----------|:--------
**name**                         | *String*   | The name of the service.  Must be unique to each Bottle instance.
**Constructor**                  | *Function* | A constructor function that will be instantiated as a singleton.
**dependency**<br />*(optional)* | *String*   | An optional name for a dependency to be passed to the constructor.  A dependency will be passed to the constructor for each name passed to `Bottle#service` in the order they are listed.

#### value(name, val)

Used to add an arbitrary value to the container.

Param    | Type     | Details
:--------|:---------|:--------
**name** | *String* | The name of the value.  Must be unique to each Bottle instance.
**val**  | *Mixed*  | A value that will be defined as enumerable, but not writable.

## TypeScript

A TypeScript declaration file is bundled with this package. To get TypeScript to resolve it automatically, you need to set `moduleResolution` to `node` in your `tsconfig.json`. 
