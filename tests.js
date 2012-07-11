(function() {
    var tests = {
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

        testIterString: function(test) {
            test.expect(5);
            var iter = sloth.iterString("test");
            test.strictEqual("t", iter());
            test.strictEqual("e", iter());
            test.strictEqual("s", iter());
            test.strictEqual("t", iter());
            try {
                iter();
            } catch(e) {
                test.strictEqual(sloth.StopIteration, e);
            }
            test.done();
        },

        testIterGenerator: function(test) {
            if(typeof StopIteration === "undefined") {
                test.expect(1);
                test.ok(true, "browser does not support generators");
                test.done();
            } else {
                test.expect(4);
                eval("var gen = function() { for(;;) yield 1; };");
                var iter = sloth.iterGenerator(gen());
                test.strictEqual(1, iter());
                test.strictEqual(1, iter());
                test.strictEqual(1, iter());
                test.strictEqual(1, iter());
                test.done();
            }
        },

        testCmpNumber: function(test) {
            test.expect(3);
            test.ok(sloth.cmp(2, 10) < 0);
            test.ok(sloth.cmp(10, 2) > 0);
            test.ok(sloth.cmp(2, 2) == 0);
            test.done();
        },

        testIterRange: function(test) {
            test.expect(3);
            var iter = sloth.iterRange(1, 5, 2);
            test.strictEqual(1, iter());
            test.strictEqual(3, iter());
            try {
                iter();
            } catch(e) {
                test.strictEqual(sloth.StopIteration, e);
            }
            test.done();
        },

        testIterRangeDefaultStep: function(test) {
            test.expect(5);
            var iter = sloth.iterRange(1, 5);
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

        testIterRangeOpen: function(test) {
            test.expect(5);
            var iter = sloth.iterRange(4);
            test.strictEqual(0, iter());
            test.strictEqual(1, iter());
            test.strictEqual(2, iter());
            test.strictEqual(3, iter());
            try {
                iter();
            } catch(e) {
                test.strictEqual(sloth.StopIteration, e);
            }
            test.done();
        },

        testCmpString: function(test) {
            test.expect(3);
            test.ok(sloth.cmp("t", "te") < 0);
            test.ok(sloth.cmp("te", "t") > 0);
            test.ok(sloth.cmp("t", "t") == 0);
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

        testForce: function(test) {
            test.expect(1);
            test.deepEqual([1, 2, 3, 4], sloth.wrap(sloth.iterArray([1, 2, 3, 4])).force());
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

        testSort: function(test) {
            test.expect(5);
            var iter = sloth.wrap(sloth.iterArray([1, 2, 10, 3])).sort().next;
            test.strictEqual(1, iter());
            test.strictEqual(2, iter());
            test.strictEqual(3, iter());
            test.strictEqual(10, iter());
            try {
                iter();
            } catch(e) {
                test.strictEqual(sloth.StopIteration, e);
            }
            test.done();
        },

        testSortCompareFunction: function(test) {
            test.expect(5);
            var iter = sloth.wrap(sloth.iterArray([1, 2, 3, 4])).sort(function(a, b) { return b - a; }).next;
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

        testAllPredicated: function(test) {
            test.expect(1);
            test.strictEqual(true, sloth.wrap(sloth.iterArray([1, 2, 3, 4])).any(function(x) { return x >= 2; }));
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

        testAnyPredicated: function(test) {
            test.expect(1);
            test.strictEqual(true, sloth.wrap(sloth.iterArray([1, 2, 3, 4])).all(function(x) { return x >= 1; }));
            test.done();
        },

        testAnyInfinite: function(test) {
            test.expect(1);
            test.strictEqual(true, sloth.wrap(function() { return true; }).any());
            test.done();
        },

        testMax: function(test) {
            test.expect(1);
            test.strictEqual(4, sloth.wrap(sloth.iterArray([1, 2, 4, 3])).max());
            test.done();
        },

        testMaxComparator: function(test) {
            test.expect(1);
            test.strictEqual(1, sloth.wrap(sloth.iterArray([1, 2, 4, 3])).max(function(a, b) { return b - a; }));
            test.done();
        },

        testMin: function(test) {
            test.expect(1);
            test.strictEqual(1, sloth.wrap(sloth.iterArray([1, 2, 4, 3])).min());
            test.done();
        },

        testMinComparator: function(test) {
            test.expect(1);
            test.strictEqual(4, sloth.wrap(sloth.iterArray([1, 2, 4, 3])).min(function(a, b) { return b - a; }));
            test.done();
        },

        testTake: function(test) {
            test.expect(5);
            var iter = sloth.wrap((function() { var n = 1; return function() { return n++; }; })()).take(4).next;
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

        testSkip: function(test) {
            test.expect(4);
            var iter = sloth.wrap((function() { var n = 1; return function() { return n++; }; })()).skip(4).next;
            test.strictEqual(5, iter());
            test.strictEqual(6, iter());
            test.strictEqual(7, iter());
            test.strictEqual(8, iter());
            test.done();
        },

        testTakeWhile: function(test) {
            test.expect(5);
            var iter = sloth.wrap(sloth.iterArray([1, 2, 3, 4, 5, 1])).takeWhile(function(x) { return x < 5 }).next;
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

        testSkipWhile: function(test) {
            test.expect(5);
            var iter = sloth.wrap(sloth.iterArray([4, 5, 6, 7, 4])).skipWhile(function(x) { return x < 5 }).next;
            test.strictEqual(5, iter());
            test.strictEqual(6, iter());
            test.strictEqual(7, iter());
            test.strictEqual(4, iter());
            try {
                iter();
            } catch(e) {
                test.strictEqual(sloth.StopIteration, e);
            }
            test.done();
        },

        testConcat: function(test) {
            test.expect(5);
            var iter = sloth.wrap(sloth.iterArray([1, 2])).concat(sloth.iterArray([3, 4])).next;
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
    };

    var sloth;

    if(typeof module !== "undefined" && module.exports) {
        sloth = require('./sloth.js');
        module.exports = tests;
    }
    if(typeof window !== "undefined") {
        sloth = window.sloth;
        window.tests = tests;
    }
})()
