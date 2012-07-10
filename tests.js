var sloth = require('./sloth.js')

module.exports = {
    testIterArray: function(test) {
        test.expect(5);
        var iter = sloth.iterArray([1, 2, 3, 4]);
        test.strictEqual(1, iter());
        test.strictEqual(2, iter());
        test.strictEqual(3, iter());
        test.strictEqual(4, iter());
        try {
            iter();
        } catch(e) {
            test.strictEqual(sloth.StopIteration, e);
        }
        test.done();
    },

    testMap: function(test) {
        test.expect(5);
        var iter = sloth.wrap(sloth.iterArray([1, 2, 3, 4])).map(function(x) { return x + 1; }).next;
        test.strictEqual(2, iter());
        test.strictEqual(3, iter());
        test.strictEqual(4, iter());
        test.strictEqual(5, iter());
        try {
            iter();
        } catch(e) {
            test.strictEqual(sloth.StopIteration, e);
        }
        test.done();
    },

    testMapInfinite: function(test) {
        test.expect(4);
        var iter = sloth.wrap(function() { return 1; }).map(function(x) { return x + 1; }).next;
        test.strictEqual(2, iter());
        test.strictEqual(2, iter());
        test.strictEqual(2, iter());
        test.strictEqual(2, iter());
        test.done();
    },

    testFilter: function(test) {
        test.expect(3);
        var iter = sloth.wrap(sloth.iterArray([1, 2, 3, 4])).filter(function(x) { return x > 2 }).next;
        test.strictEqual(3, iter());
        test.strictEqual(4, iter());
        try {
            iter();
        } catch(e) {
            test.strictEqual(sloth.StopIteration, e);
        }
        test.done();
    },

    testFilterInfinite: function(test) {
        test.expect(2);
        var iter = sloth.wrap((function() {
            var n = 0;
            return function() {
                return n++;
            };
        })()).filter(function(x) { return x > 2 }).next;
        test.strictEqual(3, iter());
        test.strictEqual(4, iter());
        test.done();
    },

    testEach: function(test) {
        test.expect(4);
        var i = 0;
        sloth.wrap(sloth.iterArray([1, 2, 3, 4])).each(function(x) {
            test.strictEqual(++i, x);
        });
        test.done();
    },

    testUnwrap: function(test) {
        test.expect(1);
        test.deepEqual([1, 2, 3, 4], sloth.wrap(sloth.iterArray([1, 2, 3, 4])).unwrap());
        test.done();
    },

    testReverse: function(test) {
        test.expect(5);
        var iter = sloth.wrap(sloth.iterArray([1, 2, 3, 4])).reverse().next;
        test.strictEqual(4, iter());
        test.strictEqual(3, iter());
        test.strictEqual(2, iter());
        test.strictEqual(1, iter());
        try {
            iter();
        } catch(e) {
            test.strictEqual(sloth.StopIteration, e);
        }
        test.done();
    },

    testFoldl: function(test) {
        test.expect(1);
        test.strictEqual(-8, sloth.wrap(sloth.iterArray([1, 2, 3, 4])).foldl(function(acc, x) { return acc - x; }));
        test.done();
    },

    testFoldlWithAcc: function(test) {
        test.expect(1);
        test.strictEqual(0, sloth.wrap(sloth.iterArray([1, 2, 3, 4])).foldl(function(acc, x) { return acc - x; }, 10));
        test.done();
    },

    testFoldlWithSingle: function(test) {
        test.expect(1);
        test.strictEqual(1, sloth.wrap(sloth.iterArray([1])).foldl(function(acc, x) { return acc - x; }));
        test.done();
    },

    testFoldlWithSingleAcc: function(test) {
        test.expect(1);
        test.strictEqual(9, sloth.wrap(sloth.iterArray([1])).foldl(function(acc, x) { return acc - x; }, 10));
        test.done();
    },

    testFoldr: function(test) {
        test.expect(1);
        test.strictEqual(-2, sloth.wrap(sloth.iterArray([1, 2, 3, 4])).foldr(function(acc, x) { return acc - x; }));
        test.done();
    },

    testFoldrWithAcc: function(test) {
        test.expect(1);
        test.strictEqual(0, sloth.wrap(sloth.iterArray([1, 2, 3, 4])).foldr(function(acc, x) { return acc - x; }, 10));
        test.done();
    },

    testFoldrWithSingle: function(test) {
        test.expect(1);
        test.strictEqual(1, sloth.wrap(sloth.iterArray([1])).foldr(function(acc, x) { return acc - x; }));
        test.done();
    },

    testFoldrWithSingleAcc: function(test) {
        test.expect(1);
        test.strictEqual(9, sloth.wrap(sloth.iterArray([1])).foldr(function(acc, x) { return acc - x; }, 10));
        test.done();
    },

    testAll: function(test) {
        test.expect(1);
        test.strictEqual(true, sloth.wrap(sloth.iterArray([true, true, true, true])).all());
        test.done();
    },

    testAllFalse: function(test) {
        test.expect(1);
        test.strictEqual(false, sloth.wrap(sloth.iterArray([true, false, true, true])).all());
        test.done();
    },

    testAllInfinite: function(test) {
        test.expect(1);
        test.strictEqual(false, sloth.wrap(function() { return false; }).all());
        test.done();
    },

    testAny: function(test) {
        test.expect(1);
        test.strictEqual(true, sloth.wrap(sloth.iterArray([true, false, false, false])).any());
        test.done();
    },

    testAnyFalse: function(test) {
        test.expect(1);
        test.strictEqual(false, sloth.wrap(sloth.iterArray([false, false, false, false])).any());
        test.done();
    },

    testAnyInfinite: function(test) {
        test.expect(1);
        test.strictEqual(true, sloth.wrap(function() { return true; }).any());
        test.done();
    }
};

