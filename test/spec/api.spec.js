/* globals Bottle */
;(function() {
    "use strict";

    /**
     * Bottle API test suite
     */
    describe("Bottle API", function() {
        describe("Constructor", function() {
            it("should allow the use of 'new'", function() {
                expect(new Bottle() instanceof Bottle).toBe(true);
            });

            it("creates a new instance if called like a function", function() {
                /* jshint newcap: false */
                expect(Bottle() instanceof Bottle).toBe(true);
                /* jshint newcap: true */
            });
            it("creates the same instance if called like a function with a name", function() {
                /* jshint newcap: false */
                expect(Bottle("Fizz")).toBe(Bottle("Fizz"));
                /* jshint newcap: true */
            });
        });
        describe("prototype", function() {
            it("exposes constant", function() {
                expect(Bottle.pop().constant).toBeDefined();
            });
            it("exposes factory", function() {
                expect(Bottle.pop().factory).toBeDefined();
            });
            it("exposes decorator", function() {
                expect(Bottle.pop().decorator).toBeDefined();
            });
            it("exposes defer", function() {
                expect(Bottle.pop().defer).toBeDefined();
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
}());
