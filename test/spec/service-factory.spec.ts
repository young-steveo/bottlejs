import Bottle from '../../src/bottle'

/**
 * Bottle Factory test suite
 */
describe('Bottle#serviceFactory', function() {
    it('injects dependencies to a service factory', function() {
        var b = new Bottle();
        var createThing = function(foo: any, bar: any) {
            return {foo: foo, bar: bar};
        };
        b.serviceFactory('Thing', createThing, 'foo', 'bar');
        b.service('foo', class { public name = 'foo'; });
        b.value('bar', 'bippity');

        expect(b.container.Thing).toBeDefined();
        expect(b.container.Thing.foo).toBeDefined();
        expect(b.container.Thing.foo.name).toBe('foo');
        expect(b.container.Thing.bar).toBe('bippity');
    });
});
