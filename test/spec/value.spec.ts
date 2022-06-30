import Bottle from '../../src/bottle'

/**
 * Bottle Value test suite
 */
describe('Bottle#value', function() {
    it('creates a property on the container', function() {
        var bottle = new Bottle();
        var container = bottle.container;

        expect(container.mutable).not.toBeDefined();

        bottle.value('mutable', 'abc');
        expect(container.mutable).toBe('abc');
    });

    it('creates a mutable property on the container', function() {
        var bottle = new Bottle();
        var container = bottle.container;

        expect(container.mutable).not.toBeDefined();

        bottle.value('mutable', 'abc');
        expect(container.mutable).toBe('abc');

        container.mutable = 'xyz';
        expect(container.mutable).toBe('xyz');
    });

    it('creates a property on the container that can be deleted', function() {
        var bottle = new Bottle();
        var container = bottle.container;

        expect(container.mutable).not.toBeDefined();

        bottle.value('mutable', 'abc');
        expect(container.mutable).toBe('abc');

        delete container.mutable;
        expect(container.mutable).not.toBeDefined();
    });

    it('will nest bottle containers if the value name uses dot notation', function() {
        var b = new Bottle();
        b.value('nested.thing', '123');
        expect(b.container.nested).toBeDefined();
        expect(b.container.nested.thing).toBe('123');
    });

    it('will not overwrite nested bottle containers when nested syntax is used', function() {
        var b = new Bottle();
        b.value('nested.thingOne', '123');
        b.value('nested.thingTwo', 'abc');
        expect(b.container.nested).toBeDefined();
        expect(b.container.nested.thingOne).toBe('123');
        expect(b.container.nested.thingTwo).toBe('abc');
    });
});
