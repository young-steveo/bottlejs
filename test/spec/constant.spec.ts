import Bottle from '../../src/bottle'

/**
 * Bottle Constant test suite
 */
describe('Bottle#constant', function() {
    it('creates a property on the container', function() {
        var bottle = new Bottle();
        var container = bottle.container;

        expect(container.permanent).not.toBeDefined();
        bottle.constant('permanent', 'abc');
        expect(container.permanent).toBe('abc');
    });

    it('creates an immutable property on the container', function() {
        var bottle = new Bottle();
        var container = bottle.container;

        expect(container.permanent).not.toBeDefined();
        bottle.constant('permanent', 'abc');
        expect(() => container.permanent = 'xyz').toThrow(TypeError)
        expect(container.permanent).toBe('abc');
    });

    it('creates a property that cannot be removed from the container', function() {
        var bottle = new Bottle();
        var container = bottle.container;

        expect(container.permanent).not.toBeDefined();
        bottle.constant('permanent', 'abc');
        expect(() => delete container.permanent).toThrow(TypeError)
        expect(container.permanent).toBe('abc');
    });

    // it('will nest bottle containers if the name uses dot notation', function() {
    //     var b = new Bottle();
    //     b.constant('nested.thing', '123');

    //     expect(b.container.nested.thing).toBe('123');

    //     try {
    //         b.container.nested.thing = 'xyz';
    //     } catch (e) {
    //         // TypeError: Attempted to assign to readonly property.
    //     }
    //     expect(b.container.nested.thing).toBe('123');

    //     try {
    //         delete b.container.nested.thing;
    //     } catch (e) {
    //         // TypeError: Unable to delete property.
    //     }
    //     expect(b.container.nested.thing).toBe('123');
    // });
});
