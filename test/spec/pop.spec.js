/* globals Bottle */
;(function() {
    'use strict';

    /**
     * Bottle Pop test suite
     */
    describe('Bottle#pop', function() {
        it('creates a new instance', function() {
            expect(Bottle.pop() instanceof Bottle).toBe(true);
        });
        it('will return a new instance each time it is called', function() {
            expect(Bottle.pop()).not.toBe(Bottle.pop());
        });
        it('will return the same instance when a name is passed', function() {
            expect(Bottle.pop('Soda')).toBe(Bottle.pop('Soda'));
            expect(Bottle.pop('Pop')).toBe(Bottle.pop('Pop'));
            expect(Bottle.pop('Soda')).not.toBe(Bottle.pop('Pop'));
        });
    });
}());
