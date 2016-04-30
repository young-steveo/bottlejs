/* globals Bottle */
;(function() {
    'use strict';

    /**
     * Bottle List test suite
     */
    describe('Bottle#list', function() {
        it('will return an empty array if no container is provided', function() {
            expect(Bottle.list() instanceof Array).toBe(true);
            expect(Bottle.list().length).toBe(0);
        });
        it('will return a list of registered services from a passed container', function() {
            var b = new Bottle();
            b.service('A', function() {});
            b.service('B', function() {});

            var list = Bottle.list(b.container);
            expect(list.indexOf('A')).not.toBe(-1);
            expect(list.indexOf('B')).not.toBe(-1);
        });
        it('will exclude bottle methods from the returned list', function() {
            var b = new Bottle();
            b.service('A', function() {});
            b.service('B', function() {});

            var list = Bottle.list(b.container);
            expect(list.indexOf('$register')).toBe(-1);
            expect(list.indexOf('$list')).toBe(-1);
            expect(list.length).toBe(2);
        });
    });
    describe('prototype#list', function() {
        it('will return an empty array if no services have been registered', function() {
            var b = new Bottle();
            expect(b.list() instanceof Array).toBe(true);
            expect(b.list().length).toBe(0);
        });
        it('will return a list of registered services', function() {
            var b = new Bottle();
            b.service('A', function() {});
            b.service('B', function() {});

            var list = b.list();
            expect(list.indexOf('A')).not.toBe(-1);
            expect(list.indexOf('B')).not.toBe(-1);
        });
        it('will exclude bottle methods from the returned list', function() {
            var b = new Bottle();
            b.service('A', function() {});
            b.service('B', function() {});

            var list = b.list();
            expect(list.indexOf('$register')).toBe(-1);
            expect(list.indexOf('$list')).toBe(-1);
            expect(list.length).toBe(2);
        });
    });
    describe('container#$list', function() {
        it('will return an empty array if no services have been registered', function() {
            var b = new Bottle();
            expect(b.container.$list() instanceof Array).toBe(true);
            expect(b.container.$list().length).toBe(0);
        });
        it('will return a list of registered services', function() {
            var b = new Bottle();
            b.service('A', function() {});
            b.service('B', function() {});

            var list = b.container.$list();
            expect(list.indexOf('A')).not.toBe(-1);
            expect(list.indexOf('B')).not.toBe(-1);
        });
        it('will exclude bottle methods from the returned list', function() {
            var b = new Bottle();
            b.service('A', function() {});
            b.service('B', function() {});

            var list = b.container.$list();
            expect(list.indexOf('$register')).toBe(-1);
            expect(list.indexOf('$list')).toBe(-1);
            expect(list.length).toBe(2);
        });
        it('will work with nested bottles', function() {
            var b = new Bottle();
            b.service('test.A', function() {});
            b.service('test.B', function() {});

            var list = b.container.test.$list();
            expect(list.indexOf('A')).not.toBe(-1);
            expect(list.indexOf('B')).not.toBe(-1);
        });
    });
}());
