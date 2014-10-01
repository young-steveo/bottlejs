/* globals Bottle */
;(function() {
    'use strict';

    /**
     * Bottle Factory test suite
     */
    describe('Bottle#factory', function() {
        it('will log an error if the same key is used twice', function() {
            var b = new Bottle();

            spyOn(console, 'error');
            b.factory('same', function(){ });
            expect(console.error).not.toHaveBeenCalled();

            b.factory('same', function(){ });
            expect(console.error).toHaveBeenCalled();
        });
        it('creates a provider instance on the container', function() {
            var b = new Bottle();
            var ThingFactory = function() { };
            b.factory('Thing', ThingFactory);
            expect(b.container.ThingProvider).toBeDefined();
        });
        it('creates services, and gets passesed a container', function() {
            var b = new Bottle();
            var spy = jasmine.createSpy('ThingFactory').and.returnValue(true);
            b.factory('Thing', spy);
            expect(b.container.Thing).toBeDefined();
            expect(spy).toHaveBeenCalledWith(b.container);
        });
    });
}());
