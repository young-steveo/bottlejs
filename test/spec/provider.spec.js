/* globals Bottle */
;(function() {
    'use strict';

    /**
     * Bottle Provider test suite
     */
    describe('Bottle#provider', function() {
        describe('when the same key is used twice', function() {
            beforeEach(function() {
                this.b = new Bottle();
                spyOn(console, 'error');
                this.b.provider('same.name', function() {
                    this.$get = function() {
                        return function() { };
                    };
                });
            });
            describe('when the service has not yet been instantiated', function() {
                it('doesn\'t log an error', function() {
                    this.b.provider('same.name', function() { });
                    expect(console.error).not.toHaveBeenCalled();
                });
            });
            describe('when the service has already been instantiated', function() {
                beforeEach(function() {
                    this.b.container.same.name();
                });
                it('logs an error', function(){
                    this.b.provider('same.name', function(){ });
                    expect(console.error).toHaveBeenCalled();
                });
            });
        });
        it('creates a provider instance on the container', function() {
            var b = new Bottle();
            var ThingProvider = function() { };
            b.provider('Thing', ThingProvider);
            expect(b.container.ThingProvider instanceof ThingProvider).toBe(true);
        });
        it('lazily creates the provider when accessed', function() {
            var i = 0;
            var b = new Bottle();
            b.provider('Thing', function() { i = ++i; });

            expect(i).toBe(0);
            expect(b.container.ThingProvider).toBeDefined();
            expect(i).toBe(1);
        });
        it('uses the $get method to create services, and passes a container', function() {
            var b = new Bottle();
            var Thing = function() {};
            var ThingProvider = function() { this.$get = function() { return new Thing(); }; };
            b.provider('Thing', ThingProvider);

            var provider = b.container.ThingProvider;
            spyOn(provider, '$get').and.callThrough();
            expect(b.container.Thing instanceof Thing).toBe(true);
            expect(provider.$get).toHaveBeenCalledWith(b.container);
        });
        describe('when $get throws an error', function() {
            beforeEach(function() {
                this.b = new Bottle();
                this.e = new Error();
                this.$getSpy = jasmine.createSpy().and.throwError(this.e);
                var $getSpy = this.$getSpy;
                this.b.provider('thrower', function() {
                    this.$get = $getSpy;
                });
            });
            describe('getting the service from the container', function() {
                it('throws the error', function() {
                    var context = this;
                    expect(function() { return context.b.container.thrower; }).toThrow(this.e);
                });
                it('continues to throw the error for subsequent requests', function() {
                    var context = this;
                    expect(function() { return context.b.container.thrower; }).toThrow(this.e);
                    expect(function() { return context.b.container.thrower; }).toThrow(this.e);
                });
                describe('when $get stops throwing an error', function() {
                    beforeEach(function() {
                        this.value = 'OK';
                        this.$getSpy.and.returnValue(this.value);
                    });
                    it('no longer throws the error', function() {
                        var context = this;
                        expect(function() { return context.b.container.thrower; }).not.toThrow();
                    });
                    it('returns the service', function() {
                        expect(this.b.container.thrower).toBe(this.value);
                    });
                });
            });
        });

        it('lazily creates the service it provides', function() {
            var i = 0;
            var b = new Bottle();
            var Thing = function() { i++; };
            var ThingProvider = function() { this.$get = function() { return new Thing(); }; };

            b.provider('Thing', ThingProvider);
            expect(i).toBe(0);
            expect(b.container.Thing instanceof Thing).toBe(true);
            expect(i).toBe(1);
        });

        it('removes the provider after the service is accessed', function() {
            var b = new Bottle();
            b.provider('Thing', function() { this.$get = function() { return 'test'; }; });
            expect(b.container.ThingProvider).toBeDefined();
            expect(b.container.Thing).toBeDefined();
            expect(b.container.ThingProvider).not.toBeDefined();
        });

        it('will nest bottle containers if the service name uses dot notation', function() {
            var b = new Bottle();
            var Thing = function() {};
            var ThingProvider = function() { this.$get = function() { return new Thing(); }; };
            b.provider('Util.Thing', ThingProvider);
            expect(b.container.Util).toBeDefined();
            expect(b.container.Util.ThingProvider).toBeDefined();
            expect(b.container.Util.Thing).toBeDefined();
        });

        it('Allows falsey values returned by $get to remain defined when accessed multiple times', function() {
            var b = new Bottle();
            var NullyProvider = function() { this.$get = function() { return null; }; };
            var EmptyProvider = function() { this.$get = function() { return ''; }; };
            var FalseyProvider = function() { this.$get = function() { return false; }; };
            var ZeroProvider = function() { this.$get = function() { return 0; }; };

            b.provider('Nully', NullyProvider);
            b.provider('Empty', EmptyProvider);
            b.provider('Falsey', FalseyProvider);
            b.provider('Zero', ZeroProvider);

            expect(b.container.Nully).toBe(null);
            expect(b.container.Nully).toBe(null);
            expect(b.container.Empty).toBe('');
            expect(b.container.Empty).toBe('');
            expect(b.container.Falsey).toBe(false);
            expect(b.container.Falsey).toBe(false);
            expect(b.container.Zero).toBe(0);
            expect(b.container.Zero).toBe(0);
        });
    });
    describe('Bottle#resetProviders', function() {
        it('allows for already instantiated providers to be reset back to their registry', function() {
            var i = 0;
            var b = new Bottle();
            var ThingProvider = function() { i = ++i; this.$get = function() { return this; }; };
            b.provider('Thing', ThingProvider);
            expect(b.container.Thing instanceof ThingProvider).toBe(true);
            // Intentionally calling twice to prove the construction is cached until reset
            expect(b.container.Thing instanceof ThingProvider).toBe(true);
            b.resetProviders();
            expect(b.container.Thing instanceof ThingProvider).toBe(true);
            expect(i).toEqual(2);
        });
        it('allows for sub containers to re-initiate as well', function() {
            var i = 0;
            var b = new Bottle();
            var ThingProvider = function() { i = ++i; this.$get = function() { return this; }; };
            b.provider('Thing.Something', ThingProvider);
            expect(b.container.Thing.Something instanceof ThingProvider).toBe(true);
            // Intentionally calling twice to prove the construction is cached until reset
            expect(b.container.Thing.Something instanceof ThingProvider).toBe(true);
            b.resetProviders();
            expect(b.container.Thing.Something instanceof ThingProvider).toBe(true);
            expect(i).toEqual(2);
        });
        it('allows for services with dependencies to be re-initiated with fresh instances', function() {
            var i = 0;
            var b = new Bottle();
            var Thing = function(dep) { this.dep = dep; };
            var Dep = function() { this.i = ++i; };
            var dep1 = new Dep();
            var dep2 = new Dep();
            var depStack = [dep1, dep2];
            b.service('Thing', Thing, 'Dep');
            b.factory('Dep', function() { return depStack.shift(); });
            expect(b.container.Thing instanceof Thing).toBe(true);
            expect(b.container.Thing.dep).toBe(dep1);
            b.resetProviders();
            expect(b.container.Thing instanceof Thing).toBe(true);
            expect(b.container.Thing.dep).toBe(dep2);
        });
    });
}());
