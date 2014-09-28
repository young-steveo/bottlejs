/* globals Bottle */
;(function() {
	'use strict';

	/**
	 * Bottle Middleware test suite
	 */
	describe('Bottle#middleware', function() {
		it('will add middleware for every provider if no key is passed', function() {
			var b = new Bottle();
			b.service('Thing', function() { this.name = 'Thing'; });
			b.service('Prop', function() { this.name = 'Prop'; });
			b.middleware(function(Service) {
				Service.name = 'FooBar';
				return Service;
			});
			expect(b.container.Thing.name).toBe('FooBar');
			expect(b.container.Prop.name).toBe('FooBar');
		});

		it('will add middleware for a single type if a name is passed', function() {
			var b = new Bottle();
			b.service('Thing', function() { this.name = 'Thing'; });
			b.service('Prop', function() { this.name = 'Prop'; });
			b.middleware('Thing', function(Service) {
				Service.name = 'FooBar';
				return Service;
			});
			expect(b.container.Thing.name).toBe('FooBar');
			expect(b.container.Prop.name).toBe('Prop');
		});
	});
}());