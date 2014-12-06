/* globals Bottle */
;(function() {
    'use strict';

    /**
     * Bottle Factory test suite
     */
    describe('Bottle#service', function() {
        it('will log an error if the same key is used twice', function() {
            var b = new Bottle();

            spyOn(console, 'error');
            b.service('same', function(){ });
            expect(console.error).not.toHaveBeenCalled();

            b.service('same', function(){ });
            expect(console.error).toHaveBeenCalled();
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
    });
}());
