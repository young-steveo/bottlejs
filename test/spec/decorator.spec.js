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

        it('can handle dot notation keys', function() {
            var b = new Bottle();
            b.service('Util.Thing', function() { this.name = 'Util Thing'; });
            b.decorator('Util.Thing', function(Service) {
                Service.name = 'Util FooBar';
                return Service;
            });
            expect(b.container.Util.Thing.name).toBe('Util FooBar');
        });

        it('will decorate deeply nested services', function() {
            var b = new Bottle();
            b.service('Util.A.B.C.Thing', function() { this.name = 'Util'; });
            b.decorator('Util.A.B.C.Thing', function(Service) {
                Service.name = 'Util Deep FooBar';
                return Service;
            });
            expect(b.container.Util.A.B.C.Thing.name).toBe('Util Deep FooBar');
        });

        it('will allow decorators to be defined before services', function() {
            var b = new Bottle();
            b.decorator('Util.A.B.C.Thing', function(Service) {
                Service.name = 'Util Deep FooBar';
                return Service;
            });
            b.service('Util.A.B.C.Thing', function() { this.name = 'Util'; });
            expect(b.container.Util.A.B.C.Thing.name).toBe('Util Deep FooBar');
        });
    });
    describe('container#$decorator', function() {
        it('will add a decorator for every provider if no key is passed', function() {
            var b = new Bottle();
            b.service('ns.Thing', function() { this.name = 'Thing'; });
            b.service('ns.Prop', function() { this.name = 'Prop'; });
            b.container.ns.$decorator(function(Service) {
                Service.name = 'FooBar';
                return Service;
            });
            expect(b.container.ns.Thing.name).toBe('FooBar');
            expect(b.container.ns.Prop.name).toBe('FooBar');
        });

        it('will add a decorator for a single type if a name is passed', function() {
            var b = new Bottle();
            b.service('ns.Thing', function() { this.name = 'Thing'; });
            b.service('ns.Prop', function() { this.name = 'Prop'; });
            b.container.ns.$decorator('Thing', function(Service) {
                Service.name = 'FooBar';
                return Service;
            });
            expect(b.container.ns.Thing.name).toBe('FooBar');
            expect(b.container.ns.Prop.name).toBe('Prop');
        });

        it('can handle dot notation keys', function() {
            var b = new Bottle();
            b.service('ns.Util.Thing', function() { this.name = 'Util Thing'; });
            b.container.ns.$decorator('Util.Thing', function(Service) {
                Service.name = 'Util FooBar';
                return Service;
            });
            expect(b.container.ns.Util.Thing.name).toBe('Util FooBar');
        });

        it('will decorate deeply nested services', function() {
            var b = new Bottle();
            b.service('ns.Util.A.B.C.Thing', function() { this.name = 'Util'; });
            b.container.ns.$decorator('Util.A.B.C.Thing', function(Service) {
                Service.name = 'Util Deep FooBar';
                return Service;
            });
            expect(b.container.ns.Util.A.B.C.Thing.name).toBe('Util Deep FooBar');
        });
    });
}());
