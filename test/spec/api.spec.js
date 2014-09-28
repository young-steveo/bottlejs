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

			it("creates a new instance via Bottle.pop", function() {
				expect(Bottle.pop() instanceof Bottle).toBe(true);
			});
		});
		describe("prototype", function() {
			it("exposes constant", function() {
				expect(Bottle.pop().constant).toBeDefined();
			});
			it("exposes factory", function() {
				expect(Bottle.pop().factory).toBeDefined();
			});
			it("exposes middleware", function() {
				expect(Bottle.pop().middleware).toBeDefined();
			});
			it("exposes provider", function() {
				expect(Bottle.pop().provider).toBeDefined();
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