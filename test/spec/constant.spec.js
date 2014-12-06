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

        it('will nest bottle containers if the name uses dot notation', function() {
            var b = new Bottle();
            b.constant('nested.thing', '123');

            expect(b.container.nested.thing).toBe('123');

            try {
                b.container.nested.thing = 'xyz';
            } catch (e) {
                // TypeError: Attempted to assign to readonly property.
            }
            expect(b.container.nested.thing).toBe('123');

            try {
                delete b.container.nested.thing;
            } catch (e) {
                // TypeError: Unable to delete property.
            }
            expect(b.container.nested.thing).toBe('123');
        });
    });
}());
