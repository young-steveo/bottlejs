/* globals Bottle */
;(function() {
    'use strict';

    /**
     * Bottle Middleware test suite
     */
    describe('Bottle#middleware', function() {
        it('middleware get executed every time a service is accessed', function() {
            var b = new Bottle();
            var count = 0;
            b.service('Thing', function() { this.name = 'Thing'; });
            b.middleware('Thing', function(service, next) {
                count++;
                next();
            });
            expect(count).toBe(0);
            expect(b.container.Thing).toBeDefined();
            expect(count).toBe(1);
            expect(b.container.Thing).toBeDefined();
            expect(count).toBe(2);
        });
        it('middleware get the service as the first param', function() {
            var b = new Bottle();
            b.service('Thing', function() { this.name = 'Thing'; });
            b.middleware('Thing', function(service, next) {
                service.name = 'Something New';
                next();
            });
            expect(b.container.Thing.name).toBe('Something New');
        });

        it('generic middleware run for all services', function() {
            var b = new Bottle();
            b.service('Thing1', function() { this.name = 'Thing1'; });
            b.service('Thing2', function() { this.name = 'Thing2'; });
            b.middleware(function(service, next) {
                service.name = 'Changed';
                next();
            });
            expect(b.container.Thing1.name).toBe('Changed');
            expect(b.container.Thing2.name).toBe('Changed');
        });

        it('can handle dot notation keys', function() {
            var b = new Bottle();
            b.service('Util.Thing', function() { this.name = 'Util Thing'; });
            b.middleware('Util.Thing', function(service, next) {
                service.name = 'Middleware Thing';
                next();
            });
            expect(b.container.Util.Thing.name).toBe('Middleware Thing');
        });

        it('can handle deeply nested dot notation keys', function() {
            var b = new Bottle();
            b.service('Util.A.B.C.Thing', function() { this.name = 'Util Thing'; });
            b.middleware('Util.A.B.C.Thing', function(service, next) {
                service.name = 'Middleware Thing';
                next();
            });
            expect(b.container.Util.A.B.C.Thing.name).toBe('Middleware Thing');
        });

        it('can register middleware before the service', function() {
            var b = new Bottle();
            b.middleware('Util.A.B.C.Thing', function(service, next) {
                service.name = 'Middleware Thing';
                next();
            });
            b.service('Util.A.B.C.Thing', function() { this.name = 'Util Thing'; });
            expect(b.container.Util.A.B.C.Thing.name).toBe('Middleware Thing');
        });

        it('throw error when next(err)', function() {
            var b = new Bottle();
            b.service('Thing', function() { this.name = 'Thing'; });
            b.middleware('Thing', function(service, next) {
                next(new Error('Thing error'));
            });
            expect(function () {
                expect(b.container.Thing.name).toBe('Thing');
            }).toThrow(new Error('Thing error'));
        });
    });
}());
