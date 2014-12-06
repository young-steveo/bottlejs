/* globals Bottle */
;(function() {
    'use strict';

    /**
     * Bottle Register test suite
     */
    describe('Bottle#register', function() {
        it('will register a service under the $name property', function() {
            var b = new Bottle();
            var Thing = function() {};
            Thing.$name = 'Thing';
            b.register(Thing);
            expect(b.container.Thing instanceof Thing).toBe(true);
        });
        it('will inject a dependency provided by the $inject property', function() {
            var b = new Bottle();
            var Dep1 = function() {};
            var Thing = function(d1) {
                expect(d1 instanceof Dep1).toBe(true);
            };
            Thing.$name = 'Thing';
            Thing.$inject = 'Dep1';

            b.service('Dep1', Dep1);
            b.register(Thing);
            expect(b.container.Thing).toBeDefined();
        });
        it('will inject multiple dependencies if $inject is an array', function() {
            var b = new Bottle();
            var Dep1 = function() {};
            var Dep2 = function() {};
            var Thing = function() {
                expect(arguments.length).toBe(2);
            };
            Thing.$name = 'Thing';
            Thing.$inject = ['Dep1', 'Dep2'];

            b.service('Dep1', Dep1);
            b.service('Dep2', Dep2);
            b.register(Thing);
            expect(b.container.Thing).toBeDefined();
        });
        it('defaults to Bottle#service if no $type is provided', function() {
            var b = new Bottle();
            var Thing = function() {};
            Thing.$name = 'Thing';
            Thing.$inject = ['A', 'B'];

            spyOn(b, 'service');

            b.register(Thing);
            expect(b.service).toHaveBeenCalledWith('Thing', Thing, 'A', 'B');
        });
        it('can register a factory', function() {
            var b = new Bottle();
            var ThingFactory = function() {};
            ThingFactory.$name = 'Thing';
            ThingFactory.$type = 'factory';

            spyOn(b, 'factory');

            b.register(ThingFactory);
            expect(b.factory).toHaveBeenCalledWith('Thing', ThingFactory);
        });
        it('can register a provider', function() {
            var b = new Bottle();
            var ThingProvider = function() {};
            ThingProvider.$name = 'Thing';
            ThingProvider.$type = 'provider';

            spyOn(b, 'provider');

            b.register(ThingProvider);
            expect(b.provider).toHaveBeenCalledWith('Thing', ThingProvider);
        });
        it('can register a value', function() {
            var b = new Bottle();
            var value = {
                $name : 'someValue',
                $type : 'value'
            };
            spyOn(b, 'value');
            b.register(value);
            expect(b.value).toHaveBeenCalledWith('someValue', value);
        });
        it('can nest definitions if dot notation is used', function() {
            var b = new Bottle();
            var ThingA = function() {};
            var ThingB = function() {};
            ThingA.$name = 'Util.ThingA';
            ThingB.$name = 'Util.ThingB';

            b.register(ThingA).register(ThingB);
            expect(b.container.Util).toBeDefined();
            expect(b.container.Util.ThingA instanceof ThingA).toBe(true);
            expect(b.container.Util.ThingB instanceof ThingB).toBe(true);
        });
    });
    describe('container#$register', function() {
        it('will register a service under the $name property', function() {
            var b = new Bottle();
            var Thing = function() {};
            Thing.$name = 'Thing';
            b.container.$register(Thing);
            expect(b.container.Thing instanceof Thing).toBe(true);
        });
        it('will inject a dependency provided by the $inject property', function() {
            var b = new Bottle();
            var Dep1 = function() {};
            var Thing = function(d1) {
                expect(d1 instanceof Dep1).toBe(true);
            };
            Thing.$name = 'Thing';
            Thing.$inject = 'Dep1';

            b.service('Dep1', Dep1);
            b.container.$register(Thing);
            expect(b.container.Thing).toBeDefined();
        });
        it('will inject multiple dependencies if $inject is an array', function() {
            var b = new Bottle();
            var Dep1 = function() {};
            var Dep2 = function() {};
            var Thing = function() {
                expect(arguments.length).toBe(2);
            };
            Thing.$name = 'Thing';
            Thing.$inject = ['Dep1', 'Dep2'];

            b.service('Dep1', Dep1);
            b.service('Dep2', Dep2);
            b.container.$register(Thing);
            expect(b.container.Thing).toBeDefined();
        });
        it('defaults to Bottle#service if no $type is provided', function() {
            var b = new Bottle();
            var Thing = function() {};
            Thing.$name = 'Thing';
            Thing.$inject = ['A', 'B'];

            spyOn(b, 'service');

            b.container.$register(Thing);
            expect(b.service).toHaveBeenCalledWith('Thing', Thing, 'A', 'B');
        });
        it('can register a factory', function() {
            var b = new Bottle();
            var ThingFactory = function() {};
            ThingFactory.$name = 'Thing';
            ThingFactory.$type = 'factory';

            spyOn(b, 'factory');

            b.container.$register(ThingFactory);
            expect(b.factory).toHaveBeenCalledWith('Thing', ThingFactory);
        });
        it('can register a provider', function() {
            var b = new Bottle();
            var ThingProvider = function() {};
            ThingProvider.$name = 'Thing';
            ThingProvider.$type = 'provider';

            spyOn(b, 'provider');

            b.container.$register(ThingProvider);
            expect(b.provider).toHaveBeenCalledWith('Thing', ThingProvider);
        });
        it('can register a value', function() {
            var b = new Bottle();
            var value = {
                $name : 'someValue',
                $type : 'value'
            };
            spyOn(b, 'value');
            b.container.$register(value);
            expect(b.value).toHaveBeenCalledWith('someValue', value);
        });
    });
}());
