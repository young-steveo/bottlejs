import Bottle from '../../src/bottle'

/**
 * Bottle Digest test suite
 */
describe('Bottle#digest', function() {
    it('will get an instance of all services in the container', function() {
        var b = new Bottle();
        var thinga = function() { this.foo = 'a'; };
        var thingb = function() { this.foo = 'b'; };
        var results;
        b.service('a', thinga);
        b.service('b', thingb);
        results = b.digest(['a', 'b']);
        expect(results[0].foo).toBeDefined();
        expect(results[0].foo).toBe('a');
        expect(results[1].foo).toBeDefined();
        expect(results[1].foo).toBe('b');
    });
    it('will get an instance of all services in the container in the correct order', function() {
        var b = new Bottle();
        var thinga = function() { this.foo = 'a'; };
        var thingb = function() { this.foo = 'b'; };
        var results;
        b.service('a', thinga);
        b.service('b', thingb);
        results = b.digest(['b', 'a']);
        expect(results[0].foo).toBeDefined();
        expect(results[0].foo).toBe('b');
        expect(results[1].foo).toBeDefined();
        expect(results[1].foo).toBe('a');
    });
    it('can digest dot notation strings', function() {
        var b = new Bottle();
        var Thing = function() { this.foo = 'c'; };
        var results;
        b.service('Util.Thing', Thing);
        results = b.digest(['Util.Thing']);
        expect(results[0].foo).toBeDefined();
        expect(results[0].foo).toBe('c');
    });
});
