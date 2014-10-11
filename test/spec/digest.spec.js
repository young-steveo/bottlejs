/* globals Bottle */
;(function() {
    'use strict';

    /**
     * Bottle Provider test suite
     */
    describe('Bottle#digest', function() {
        it('will get an instance of all providers in the container', function() {
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
        it('will get an instance of all providers in the container in the correct order', function() {
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
    });
}());
