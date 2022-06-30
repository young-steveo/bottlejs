import { Bottle } from '../../src/bottle'

/**
 * Bottle Factory test suite
 */
describe('Bottle#factory', function() {
    describe('when the same key is used twice', function() {
        beforeEach(function() {
            this.b = new Bottle();
            spyOn(console, 'error');
            this.b.factory('same.name', function() {
                return function() { };
            });
        });
        describe('when the service has not yet been instantiated', function() {
            it('doesn\'t log an error', function() {
                this.b.factory('same.name', function() { });
                expect(console.error).not.toHaveBeenCalled();
            });
        });
        describe('when the service has already been instantiated', function() {
            beforeEach(function() {
                this.b.container.same.name();
            });
            it('logs an error', function(){
                this.b.factory('same.name', function(){ });
                expect(console.error).toHaveBeenCalled();
            });
        });
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

    it('will nest bottle containers if the service name uses dot notation', function() {
        var b = new Bottle();
        var Thing = function() {};
        var ThingFactory = function() { return new Thing(); };
        b.factory('Util.Thing', ThingFactory);
        expect(b.container.Util).toBeDefined();
        expect(b.container.Util.ThingProvider).toBeDefined();
        expect(b.container.Util.Thing).toBeDefined();
    });
});
