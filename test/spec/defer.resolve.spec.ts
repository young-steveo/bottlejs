import Bottle from '../../src/bottle'


/**
 * Bottle Defer Resolve test suite
 */
describe('Bottle#defer', function() {
    it('will register functions to be executed later', function() {
        var b = new Bottle();
        var executed = false;

        b.defer(function() { executed = true; });

        expect(executed).toBe(false);
        b.resolve();
        expect(executed).toBe(true);
    });
});
describe('Bottle#resolve', function() {
    it('will pass data to deferred functions', function() {
        var b = new Bottle();
        var test;

        b.defer(function(value) { test = value; });

        expect(test).not.toBe('Cookie');
        b.resolve('Cookie');
        expect(test).toBe('Cookie');
    });
});
