import Bottle from '../../src/bottle'

/**
 * Bottle Factory test suite
 */
describe('Bottle#factory', function() {
    describe('when the same key is used twice', function() {
        let b = new Bottle();
        beforeEach(function() {
            b = new Bottle();
            b.factory('same.name', function() {
                return function() { };
            });
        });
        describe('when the service has not yet been instantiated', function() {
            it('doesn\'t log an error', function() {
                expect(() => b.factory('same.name', function() { })).not.toThrowError();
            });
        });
        describe('when the service has already been instantiated', function() {
            it('logs an error', function(){
                b.container.same.name();
                expect(() => b.factory('same.name', function() { })).toThrowError();
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
        var spy = jest.fn(() => true);
        b.factory('Thing', spy);
        expect(b.container.Thing).toBeDefined();
        expect(spy).toHaveBeenCalledWith(b.container);
    });

    it('will nest bottle containers if the service name uses dot notation', function() {
        var b = new Bottle();
        var Thing = class{};
        var ThingFactory = function() { return new Thing(); };
        b.factory('Util.Thing', ThingFactory);
        expect(b.container.Util).toBeDefined();
        expect(b.container.Util.ThingProvider).toBeDefined();
        expect(b.container.Util.Thing).toBeDefined();
    });
});
