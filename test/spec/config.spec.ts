import Bottle from '../../src/bottle'

/**
 * Bottle config test suite
 */
describe('Bottle config', function() {
    it('is a global property object', function() {
        expect(Bottle.config).toEqual(jasmine.any(Object));
    });
    describe('config.strict', function() {
        it('should be a boolean', function() {
            expect(Bottle.config.strict).toEqual(jasmine.any(Boolean));
        });
    });
});
