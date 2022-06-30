import Bottle from '../../src/bottle'

/**
 * Bottle API test suite
 */
describe("Bottle API", function() {
    describe("Constructor", function() {
        it("should allow the use of 'new'", function() {
            expect(new Bottle() instanceof Bottle).toBe(true);
        });

        it("creates the same instance if called like a function with a name", function() {
            expect(new Bottle("Fizz")).toBe(Bottle("Fizz"));
        });
    });
    describe("prototype", function() {
        it("exposes constant", function() {
            expect(Bottle.pop().constant).toBeDefined();
        });
        it("exposes decorator", function() {
            expect(Bottle.pop().decorator).toBeDefined();
        });
        it("exposes defer", function() {
            expect(Bottle.pop().defer).toBeDefined();
        });
        it("exposes digest", function() {
            expect(Bottle.pop().digest).toBeDefined();
        });
        it("exposes factory", function() {
            expect(Bottle.pop().factory).toBeDefined();
        });
        it("exposes instanceFactory", function() {
            expect(Bottle.pop().instanceFactory).toBeDefined();
        });
        it("exposes list", function() {
            expect(Bottle.pop().list).toBeDefined();
        });
        it("exposes middleware", function() {
            expect(Bottle.pop().middleware).toBeDefined();
        });
        it("exposes provider", function() {
            expect(Bottle.pop().provider).toBeDefined();
        });
        it("exposes register", function() {
            expect(Bottle.pop().register).toBeDefined();
        });
        it("exposes resolve", function() {
            expect(Bottle.pop().resolve).toBeDefined();
        });
        it("exposes service", function() {
            expect(Bottle.pop().service).toBeDefined();
        });
        it("exposes value", function() {
            expect(Bottle.pop().value).toBeDefined();
        });
        it("exposes container on the instance", function() {
            expect(Bottle.pop().container).toBeDefined();
        });
    });
});
