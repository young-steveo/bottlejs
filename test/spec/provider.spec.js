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

        it('does not log an error if a service is added to a nested bottle with initialized services', function() {
            var b = new Bottle();
            var Thing = function() {};
            var ThingProvider = function() { this.$get = function() { return new Thing(); }; };
            spyOn(console, 'error');
            b.provider('Util.Thing', ThingProvider);
            expect(b.container.Util.Thing).toBeDefined();
            b.provider('Util.OtherThing', ThingProvider);
            expect(b.container.Util.OtherThing).toBeDefined();
            expect(console.error).not.toHaveBeenCalled();
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
        it('allows for selectively resetting providers by name', function() {
          var i = 0;
          var j = 0;
          var b = new Bottle();
          var FirstProvider = function() { i = ++i; this.$get = function() { return this; }; };
          var SecondProvider = function() { j = ++j; this.$get = function() { return this; }; };
          b.provider('First', FirstProvider);
          b.provider('Second', SecondProvider);
          expect(b.container.First instanceof FirstProvider).toBe(true);
          expect(b.container.Second instanceof SecondProvider).toBe(true);
          expect(i).toEqual(1);
          expect(j).toEqual(1);
          b.resetProviders(['First']);
          expect(b.container.First instanceof FirstProvider).toBe(true);
          expect(b.container.Second instanceof SecondProvider).toBe(true);
          expect(i).toEqual(2);
          expect(j).toEqual(1);
        });
        it('allows to propagate the reset to the providers that depend on the selected service names', function() {
          var i = 0;
          var j = 0;
          var k = 0;
          var l = 0;
          var b = new Bottle();
          var FirstService= function() { i = ++i; };
          var SecondProvider = function() {
              j = ++j;
              this.$get = function(container) { return { _first: container.First }; };
          };
          var ThirdFactory = function(container) { k = ++k; return { _first: container.First };  };
          b.factory('Zero', function () { l = ++l; return 0; });
          b.service('First', FirstService, 'Zero');
          b.provider('Second', SecondProvider);
          b.factory('Third', ThirdFactory);
          expect(b.container.Second._first instanceof FirstService).toBe(true);
          expect(b.container.Third._first instanceof FirstService).toBe(true);
          expect(i).toEqual(1);
          expect(j).toEqual(1);
          expect(k).toEqual(1);
          expect(l).toEqual(1);
          b.resetProviders(['First'], true);
          expect(b.container.Second._first instanceof FirstService).toBe(true);
          expect(b.container.Third._first instanceof FirstService).toBe(true);
          expect(i).toEqual(2);
          expect(j).toEqual(2);
          expect(k).toEqual(2);
          expect(l).toEqual(1);
          b.resetProviders(['Zero'], true);
          expect(b.container.Second._first instanceof FirstService).toBe(true);
          expect(b.container.Third._first instanceof FirstService).toBe(true);
          expect(i).toEqual(3);
          expect(j).toEqual(3);
          expect(k).toEqual(3);
          expect(l).toEqual(2);
        });
        it('will cleanup service dependents if a service is redefined', function() {
          var i = 0;
          var j = 0;
          var k = 0;
          var b = new Bottle();
          var FirstService= function() { i = ++i; };
          var SecondService = function() { j = ++j; };
          var ThirdService = function() { k = ++k; };
          b.service('First', FirstService);
          b.service('Thing.Second', SecondService, 'First');
          b.service('Third', ThirdService, 'Thing.Second');
          expect(b.container.First instanceof FirstService).toBe(true);
          expect(b.container.Thing.Second instanceof SecondService).toBe(true);
          expect(b.container.Third instanceof ThirdService).toBe(true);
          expect(i).toEqual(1);
          expect(j).toEqual(1);
          expect(k).toEqual(1);
          b.resetProviders(['Thing.Second'], true);
          // Redefined to have no dependencies
          b.service('Thing.Second', SecondService);
          expect(b.container.First instanceof FirstService).toBe(true);
          expect(b.container.Thing.Second instanceof SecondService).toBe(true);
          expect(b.container.Third instanceof ThirdService).toBe(true);
          expect(i).toEqual(1);
          expect(j).toEqual(2);
          expect(k).toEqual(2);
          // No propagation will happen given that no service depends on First anymore
          b.resetProviders(['First'], true);
          expect(b.container.First instanceof FirstService).toBe(true);
          expect(b.container.Thing.Second instanceof SecondService).toBe(true);
          expect(b.container.Third instanceof ThirdService).toBe(true);
          expect(i).toEqual(2);
          expect(j).toEqual(2);
          expect(k).toEqual(2);
        });
        it('allows for deep sub containers to re-initiate as well', function() {
            var i = 0;
            var b = new Bottle();
            var ThingProvider = function() { i = ++i; this.$get = function() { return this; }; };
            b.provider('Thing.In.Something', ThingProvider);
            expect(b.container.Thing.In.Something instanceof ThingProvider).toBe(true);
            // Intentionally calling twice to prove the construction is cached until reset
            expect(b.container.Thing.In.Something instanceof ThingProvider).toBe(true);
            b.resetProviders();
            expect(b.container.Thing.In.Something instanceof ThingProvider).toBe(true);
            expect(i).toEqual(2);
        });
        it('will not break if a nested container has multiple children', function() {
            var b = new Bottle();
            b.service('Thing.A', function() { this.name = 'A'; });
            b.service('Thing.B', function() { this.name = 'B'; });
            expect(b.container.Thing.A.name).toBe('A');
            expect(b.container.Thing.B.name).toBe('B');
            b.resetProviders();
            expect(b.container.Thing.A.name).toBe('A');
            expect(b.container.Thing.B.name).toBe('B');
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
