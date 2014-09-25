/* globals Bottle */
;(function() {
	'use strict';

	/**
	 * Bottle Middlewear test suite
	 */
	describe('Bottle#middlewear', function() {
		it('will add middlewear for every provider if no key is passed', function() {
			var b = new Bottle();
			b.service('Thing', function() { this.name = 'Thing'; });
			b.service('Prop', function() { this.name = 'Prop'; });
			b.middlewear(function(Service) {
				Service.name = 'FooBar';
				return Service;
			});
			expect(b.container.Thing.name).toBe('FooBar');
			expect(b.container.Prop.name).toBe('FooBar');
		});

		it('will add middlewear for a single type if a name is passed', function() {
			var b = new Bottle();
			b.service('Thing', function() { this.name = 'Thing'; });
			b.service('Prop', function() { this.name = 'Prop'; });
			b.middlewear('Thing', function(Service) {
				Service.name = 'FooBar';
				return Service;
			});
			expect(b.container.Thing.name).toBe('FooBar');
			expect(b.container.Prop.name).toBe('Prop');
		});
	});
}());