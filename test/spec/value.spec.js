/* globals Bottle */
;(function() {
	'use strict';

	/**
	 * Bottle Value test suite
	 */
	describe('Bottle#value', function() {
		it('creates a mutable property on the container', function() {
			var bottle = new Bottle();
			var container = bottle.container;

			expect(container.mutable).not.toBeDefined();

			bottle.value('mutable', 'abc');
			expect(container.mutable).toBe('abc');

			container.mutable = 'xyz';
			expect(container.mutable).toBe('xyz');

			delete container.mutable;
			expect(container.mutable).not.toBeDefined();
		});
	});
}());