import { Bottle } from '../../src/bottle'

/**
 * Bottle Instance Factory test suite
 */
describe('Bottle#instanceFactory', function() {
    describe('when the same key is used twice', function() {
        beforeEach(function() {
            this.b = new Bottle();
            spyOn(console, 'error');
            this.b.instanceFactory('same.name', function() {
                return {};
            });
        });
        describe('when the service has not yet been instantiated', function() {
            it('doesn\'t log an error', function() {
                this.b.instanceFactory('same.name', function() { });
                expect(console.error).not.toHaveBeenCalled();
            });
        });
        describe('when the service has already been instantiated', function() {
            beforeEach(function() {
                this.b.container.same.name.instance();
            });
            it('logs an error', function(){
                this.b.instanceFactory('same.name', function(){ });
                expect(console.error).toHaveBeenCalled();
            });
        });
    });
    it('creates a provider instance on the container', function() {
        var b = new Bottle();
        var ThingFactory = function() { };
        b.instanceFactory('Thing', ThingFactory);
        expect(b.container.ThingProvider).toBeDefined();
    });
    it('creates an instance factory that gets passesed a container when it is requested', function() {
        var b = new Bottle();
        var spy = jasmine.createSpy('ThingFactory').and.returnValue(true);
        b.instanceFactory('Thing', spy);
        expect(b.container.Thing).toBeDefined();
        expect(spy).not.toHaveBeenCalled();

        b.container.Thing.instance();

        expect(spy).toHaveBeenCalledWith(b.container);
    });

    it('will create new instances when instance is called', function() {
        var b = new Bottle();
        var i = 0;
        var Thing = function() { i++; };
        var ThingFactory = function() { return new Thing(); };
        b.instanceFactory('Thing', ThingFactory);
        expect(b.container.Thing.instance()).toBeDefined();
        expect(b.container.Thing.instance()).not.toBe(b.container.Thing.instance());
        expect(i).toBe(3);
    });
});
