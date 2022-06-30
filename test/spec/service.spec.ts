import { Bottle } from '../../src/bottle'

/**
 * Bottle Factory test suite
 */
describe('Bottle#service', function() {
    describe('when the same key is used twice', function() {
        beforeEach(function() {
            this.b = new Bottle();
            spyOn(console, 'error');
            this.b.service('same.name', function() {
                return function() { };
            });
        });
        describe('when the service has not yet been instantiated', function() {
            it('doesn\'t log an error', function() {
                this.b.service('same.name', function() { });
                expect(console.error).not.toHaveBeenCalled();
            });
        });
        describe('when the service has already been instantiated', function() {
            beforeEach(function() {
                this.b.container.same.name();
            });
            it('logs an error', function(){
                this.b.service('same.name', function(){ });
                expect(console.error).toHaveBeenCalled();
            });
        });
    });
    it('creates a provider and service instance on the container', function() {
        var b = new Bottle();
        var Thing = function() { };
        b.service('Thing', Thing);
        expect(b.container.ThingProvider).toBeDefined();
        expect(b.container.Thing).toBeDefined();
    });
    it('injects dependencies by passing them as string keys', function() {
        var b = new Bottle();
        var Thing = function(foo, bar) {
            this.foo = foo;
            this.bar = bar;
        };
        b.service('Thing', Thing, 'foo', 'bar');
        b.service('foo', function() { this.name = 'foo'; });
        b.value('bar', 'bippity');

        expect(b.container.Thing).toBeDefined();
        expect(b.container.Thing.foo).toBeDefined();
        expect(b.container.Thing.foo.name).toBe('foo');
        expect(b.container.Thing.bar).toBe('bippity');
    });

    it('will nest bottle containers if the service name uses dot notation', function() {
        var b = new Bottle();
        var Thing = function() {};
        b.service('Util.Thing', Thing);
        expect(b.container.Util).toBeDefined();
        expect(b.container.Util.ThingProvider).toBeDefined();
        expect(b.container.Util.Thing).toBeDefined();
    });

    it('can resolve dot-notation dependencies', function() {
        var b = new Bottle();
        var Thing = function(sub) { this.sub = sub; };
        var SubThing = function() {};
        b.service('Thing', Thing, 'Nest.SubThing');
        b.service('Nest.SubThing', SubThing);
        expect(b.container.Thing.sub).toBeDefined();
        expect(b.container.Thing.sub instanceof SubThing).toBe(true);
    });

    describe('strict service resolution', function() {
        afterEach(function() {
            Bottle.config.strict = false;
        });
        it('will not care if a service is undefined when strict mode is off', function() {
            var b = new Bottle();
            var Thing = function(phantom) { this.phantom = phantom; };

            Bottle.config.strict = false;
            b.service('Thing', Thing, 'PhantomService');
            expect(b.container.Thing).toBeDefined();
            expect(b.container.Thing.phantom).toBeUndefined();
        });
        it('will throw an exception if a service is undefined in strict mode', function() {
            var b = new Bottle();
            var Thing = function(phantom) { this.phantom = phantom; };

            Bottle.config.strict = true;
            b.service('Thing', Thing, 'PhantomService');

            var test = function() {
                return b.container.Thing;
            };
            expect(test).toThrowError(/PhantomService/);
        });
    });
});
