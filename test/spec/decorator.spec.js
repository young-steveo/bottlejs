/* globals Bottle */
;(function() {
	'use strict';

	/**
	 * Bottle Decorator test suite
	 */
	describe('Bottle#decorator', function() {
		it('will add a decorator for every provider if no key is passed', function() {
			var b = new Bottle();
			b.service('Thing', function() { this.name = 'Thing'; });
			b.service('Prop', function() { this.name = 'Prop'; });
			b.decorator(function(Service) {
				Service.name = 'FooBar';
				return Service;
			});
			expect(b.container.Thing.name).toBe('FooBar');
			expect(b.container.Prop.name).toBe('FooBar');
		});

		it('will add a decorator for a single type if a name is passed', function() {
			var b = new Bottle();
			b.service('Thing', function() { this.name = 'Thing'; });
			b.service('Prop', function() { this.name = 'Prop'; });
			b.decorator('Thing', function(Service) {
				Service.name = 'FooBar';
				return Service;
			});
			expect(b.container.Thing.name).toBe('FooBar');
			expect(b.container.Prop.name).toBe('Prop');
		});
	});
}());