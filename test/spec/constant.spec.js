/* globals Bottle */
;(function() {
    'use strict';

    /**
     * Bottle Constant test suite
     */
    describe('Bottle#constant', function() {
        it('creates an immutable property on the container', function() {
            var bottle = new Bottle();
            var container = bottle.container;

            expect(container.permanent).not.toBeDefined();

            bottle.constant('permanent', 'abc');
            expect(container.permanent).toBe('abc');

            try {
                container.permanent = 'xyz';
            } catch (e) {
                // TypeError: Attempted to assign to readonly property.
            }
            expect(container.permanent).toBe('abc');

            try {
                delete container.permanent;
            } catch (e) {
                // TypeError: Unable to delete property.
            }
            expect(container.permanent).toBe('abc');
        });
    });
}());
