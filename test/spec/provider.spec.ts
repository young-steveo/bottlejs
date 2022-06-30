import Bottle from '../../src/bottle'
import Provider from '../../src/provider';

/**
 * Bottle Provider test suite
 */
describe('Bottle#provider', function() {
    describe('when the same key is used twice', function() {
        let b: Bottle = new Bottle();
        beforeEach(function() {
            b = new Bottle();
            b.provider('same.name', class {
                $get() {
                    return function() { };
                }
            });
        });
        describe('when the service has not yet been instantiated', function() {
            it('doesn\'t log an error', function() {
                expect(() => b.provider('same.name', class { $get() {
                    return function() {}
                }})).not.toThrowError();
            });
        });
        describe('when the service has already been instantiated', function() {
            it('throws an error', function(){
                b.container.same.name();
                expect(() => b.provider('same.name', class { $get() {}})).toThrowError();
            });
        });
    });
    it('creates a provider instance on the container', function() {
        var b = new Bottle();
        var ThingProvider : new() => Provider<boolean> = class {
            $get() { return  true }
        };
        b.provider('Thing', ThingProvider);
        expect(b.container.ThingProvider instanceof ThingProvider).toBe(true);
    });
    it('lazily creates the provider when accessed', function() {
        var i = 0;
        var b = new Bottle();
        b.provider('Thing', class {
            constructor() { i = ++i; }
            $get() { return true }
        });

        expect(i).toBe(0);
        expect(b.container.ThingProvider).toBeDefined();
        expect(i).toBe(1);
    });
    it('uses the $get method to create services, and passes a container', function() {
        var b = new Bottle();
        var Thing = class {};
        b.provider('Thing', class {
            $get() {
                return new Thing();
            }
        });

        var provider = b.container.ThingProvider;
        jest.spyOn(provider, '$get');
        expect(b.container.Thing instanceof Thing).toBe(true);
        expect(provider.$get).toHaveBeenCalledWith(b.container);
    });
    describe('when $get throws an error', function() {
        let b: Bottle = new Bottle();
        let e = new Error();
        let thrower = (): string|never => { throw e }
        beforeEach(function() {
            b = new Bottle();
            e = new Error();
            b.provider('thrower', class {
                $get() { return thrower() }
            });
        });
        describe('getting the service from the container', function() {
            it('throws the error', function() {
                expect(function() { return b.container.thrower; }).toThrow(e);
            });
            it('continues to throw the error for subsequent requests', function() {
                expect(function() { return b.container.thrower; }).toThrow(e);
                expect(function() { return b.container.thrower; }).toThrow(e);
            });
            describe('when $get stops throwing an error', function() {
                beforeEach(function() {
                    thrower = () => 'OK';
                });
                it('no longer throws the error', function() {
                    expect(function() { return b.container.thrower; }).not.toThrow();
                });
                it('returns the service', function() {
                    expect(b.container.thrower).toBe('OK');
                });
            });
        });
    });

    it('lazily creates the service it provides', function() {
        var i = 0;
        var b = new Bottle();
        var Thing = class {
            constructor() {
                i++
            }
        }

        b.provider('Thing', class {
            $get() {
                return new Thing();
            }
        });
        expect(i).toBe(0);
        expect(b.container.Thing instanceof Thing).toBe(true);
        expect(i).toBe(1);
    });

    it('removes the provider after the service is accessed', function() {
        var b = new Bottle();
        b.provider('Thing', class {
            $get() {
                return 'test'
            }
        });
        expect(b.container.ThingProvider).toBeDefined();
        expect(b.container.Thing).toBeDefined();
        expect(b.container.ThingProvider).not.toBeDefined();
    });

    it('will nest bottle containers if the service name uses dot notation', function() {
        var b = new Bottle();
        var Thing = class {};
        b.provider('Util.Thing', class {
            $get() {
                return new Thing();
            }
        });
        expect(b.container.Util).toBeDefined();
        expect(b.container.Util.ThingProvider).toBeDefined();
        expect(b.container.Util.Thing).toBeDefined();
    });

    it('does not throw an error if a service is added to a nested bottle with initialized services', function() {
        var b = new Bottle();
        var Thing = class {};
        var ThingProvider = class {
            $get() {
                return new Thing();
            }
        };
        expect(() => {
            b.provider('Util.Thing', ThingProvider);
            expect(b.container.Util.Thing).toBeDefined();
            b.provider('Util.OtherThing', ThingProvider);
            expect(b.container.Util.OtherThing).toBeDefined();
        }).not.toThrowError();
    });

    it('Allows falsey values returned by $get to remain defined when accessed multiple times', function() {
        var b = new Bottle();
        var NullyProvider = class {
            $get() {
                return null
            }
        }
        var EmptyProvider = class {
            $get() {
                return ''
            }
        }
        var FalseyProvider = class {
            $get() {
                return false
            }
        }
        var ZeroProvider = class {
            $get() {
                return 0
            }
        }

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
// describe('Bottle#resetProviders', function() {
//     it('allows for already instantiated providers to be reset back to their registry', function() {
//         var i = 0;
//         var b = new Bottle();
//         var ThingProvider = class {
//             constructor() {
//                 i = ++i
//             }
//             $get() {
//                 return this;
//             }
//         }
//         b.provider('Thing', ThingProvider);
//         expect(b.container.Thing instanceof ThingProvider).toBe(true);
//         // Intentionally calling twice to prove the construction is cached until reset
//         expect(b.container.Thing instanceof ThingProvider).toBe(true);
//         b.resetProviders();
//         expect(b.container.Thing instanceof ThingProvider).toBe(true);
//         expect(i).toEqual(2);
//     });
//     it('allows for selectively resetting providers by name', function() {
//         var i = 0;
//         var j = 0;
//         var b = new Bottle();
//         var FirstProvider = class {
//             constructor() {
//                 i = ++i
//             }
//             $get() {
//                 return this;
//             }
//         }
//         var SecondProvider = class {
//             constructor() {
//                 j = ++j
//             }
//             $get() {
//                 return this;
//             }
//         }
//         b.provider('First', FirstProvider);
//         b.provider('Second', SecondProvider);
//         expect(b.container.First instanceof FirstProvider).toBe(true);
//         expect(b.container.Second instanceof SecondProvider).toBe(true);
//         expect(i).toEqual(1);
//         expect(j).toEqual(1);
//         b.resetProviders(['First']);
//         expect(b.container.First instanceof FirstProvider).toBe(true);
//         expect(b.container.Second instanceof SecondProvider).toBe(true);
//         expect(i).toEqual(2);
//         expect(j).toEqual(1);
//     });
//     it('allows for sub containers to re-initiate as well', function() {
//         var i = 0;
//         var b = new Bottle();
//         var ThingProvider = class {
//             constructor() {
//                 i = ++i
//             }
//             $get() {
//                 return this;
//             }
//         }
//         b.provider('Thing.Something', ThingProvider);
//         expect(b.container.Thing.Something instanceof ThingProvider).toBe(true);
//         // Intentionally calling twice to prove the construction is cached until reset
//         expect(b.container.Thing.Something instanceof ThingProvider).toBe(true);
//         b.resetProviders();
//         expect(b.container.Thing.Something instanceof ThingProvider).toBe(true);
//         expect(i).toEqual(2);
//     });
    // it('will not break if a nested container has multiple children', function() {
    //     var b = new Bottle();
    //     b.service('Thing.A', function() { this.name = 'A'; });
    //     b.service('Thing.B', function() { this.name = 'B'; });
    //     expect(b.container.Thing.A.name).toBe('A');
    //     expect(b.container.Thing.B.name).toBe('B');
    //     b.resetProviders();
    //     expect(b.container.Thing.A.name).toBe('A');
    //     expect(b.container.Thing.B.name).toBe('B');
    // });
    // it('allows for services with dependencies to be re-initiated with fresh instances', function() {
    //     var i = 0;
    //     var b = new Bottle();
    //     var Thing = function(dep) { this.dep = dep; };
    //     var Dep = function() { this.i = ++i; };
    //     var dep1 = new Dep();
    //     var dep2 = new Dep();
    //     var depStack = [dep1, dep2];
    //     b.service('Thing', Thing, 'Dep');
    //     b.factory('Dep', function() { return depStack.shift(); });
    //     expect(b.container.Thing instanceof Thing).toBe(true);
    //     expect(b.container.Thing.dep).toBe(dep1);
    //     b.resetProviders();
    //     expect(b.container.Thing instanceof Thing).toBe(true);
    //     expect(b.container.Thing.dep).toBe(dep2);
    // });
//});
