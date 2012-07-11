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

        testJS17Iteration: function(test) {
            if(typeof StopIteration === "undefined") {
                test.expect(1);
                test.ok(true, "browser does not support JavaScript 1.7 iteration");
                test.done();
            } else {
                test.expect(4);
                var i = 1;
                for(var v in sloth.wrapIter(sloth.iterArray([1, 2, 3, 4]))) {
                    test.strictEqual(i++, v);
                }
                test.done();
            }
        },

        testIfyArray: function(test) {
            test.expect(5);
            var iter = sloth.ify([1, 2, 3, 4]).next;
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

        testIfyString: function(test) {
            test.expect(5);
            var iter = sloth.ify("test").next;
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

        testIfyGenerator: function(test) {
            if(typeof StopIteration === "undefined") {
                test.expect(1);
                test.ok(true, "browser does not support generators");
                test.done();
            } else {
                test.expect(4);
                eval("var gen = function() { for(;;) yield 1; };");
                var iter = sloth.ify(gen()).next;
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
            var iter = sloth.wrapIter(sloth.iterArray([1, 2, 3, 4])).map(function(x) { return x + 1; }).next;
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
            var iter = sloth.wrapIter(function() { return 1; }).map(function(x) { return x + 1; }).next;
            test.strictEqual(2, iter());
            test.strictEqual(2, iter());
            test.strictEqual(2, iter());
            test.strictEqual(2, iter());
            test.done();
        },

        testFilter: function(test) {
            test.expect(3);
            var iter = sloth.wrapIter(sloth.iterArray([1, 2, 3, 4])).filter(function(x) { return x > 2 }).next;
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
            var iter = sloth.wrapIter((function() {
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
            test.expect(8);
            var i = 0;
            sloth.wrapIter(sloth.iterArray([1, 2, 3, 4])).each(function(x, j) {
                test.strictEqual(i, j);
                test.strictEqual(++i, x);
            });
            test.done();
        },

        testForce: function(test) {
            test.expect(1);
            test.deepEqual([1, 2, 3, 4], sloth.wrapIter(sloth.iterArray([1, 2, 3, 4])).force());
            test.done();
        },

        testEnumerate: function(test) {
            test.expect(5);
            var iter = sloth.wrapIter(sloth.iterArray([1, 2, 3, 4])).enumerate().next;
            test.deepEqual([0, 1], iter());
            test.deepEqual([1, 2], iter());
            test.deepEqual([2, 3], iter());
            test.deepEqual([3, 4], iter());
            try {
                iter();
            } catch(e) {
                test.strictEqual(sloth.StopIteration, e);
            }
            test.done();
        },

        testReverse: function(test) {
            test.expect(5);
            var iter = sloth.wrapIter(sloth.iterArray([1, 2, 3, 4])).reverse().next;
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
            var iter = sloth.wrapIter(sloth.iterArray([1, 2, 10, 3])).sort().next;
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
            var iter = sloth.wrapIter(sloth.iterArray([1, 2, 3, 4])).sort(function(a, b) { return b - a; }).next;
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
            test.strictEqual(-8, sloth.wrapIter(sloth.iterArray([1, 2, 3, 4])).foldl(function(acc, x) { return acc - x; }));
            test.done();
        },

        testFoldlWithAcc: function(test) {
            test.expect(1);
            test.strictEqual(0, sloth.wrapIter(sloth.iterArray([1, 2, 3, 4])).foldl(function(acc, x) { return acc - x; }, 10));
            test.done();
        },

        testFoldlWithSingle: function(test) {
            test.expect(1);
            test.strictEqual(1, sloth.wrapIter(sloth.iterArray([1])).foldl(function(acc, x) { return acc - x; }));
            test.done();
        },

        testFoldlWithSingleAcc: function(test) {
            test.expect(1);
            test.strictEqual(9, sloth.wrapIter(sloth.iterArray([1])).foldl(function(acc, x) { return acc - x; }, 10));
            test.done();
        },

        testFoldr: function(test) {
            test.expect(1);
            test.strictEqual(-2, sloth.wrapIter(sloth.iterArray([1, 2, 3, 4])).foldr(function(acc, x) { return acc - x; }));
            test.done();
        },

        testFoldrWithAcc: function(test) {
            test.expect(1);
            test.strictEqual(0, sloth.wrapIter(sloth.iterArray([1, 2, 3, 4])).foldr(function(acc, x) { return acc - x; }, 10));
            test.done();
        },

        testFoldrWithSingle: function(test) {
            test.expect(1);
            test.strictEqual(1, sloth.wrapIter(sloth.iterArray([1])).foldr(function(acc, x) { return acc - x; }));
            test.done();
        },

        testFoldrWithSingleAcc: function(test) {
            test.expect(1);
            test.strictEqual(9, sloth.wrapIter(sloth.iterArray([1])).foldr(function(acc, x) { return acc - x; }, 10));
            test.done();
        },

        testAll: function(test) {
            test.expect(1);
            test.strictEqual(true, sloth.wrapIter(sloth.iterArray([true, true, true, true])).all());
            test.done();
        },

        testAllPredicated: function(test) {
            test.expect(1);
            test.strictEqual(true, sloth.wrapIter(sloth.iterArray([1, 2, 3, 4])).any(function(x) { return x >= 2; }));
            test.done();
        },

        testAllFalse: function(test) {
            test.expect(1);
            test.strictEqual(false, sloth.wrapIter(sloth.iterArray([true, false, true, true])).all());
            test.done();
        },

        testAllInfinite: function(test) {
            test.expect(1);
            test.strictEqual(false, sloth.wrapIter(function() { return false; }).all());
            test.done();
        },

        testAny: function(test) {
            test.expect(1);
            test.strictEqual(true, sloth.wrapIter(sloth.iterArray([true, false, false, false])).any());
            test.done();
        },

        testAnyFalse: function(test) {
            test.expect(1);
            test.strictEqual(false, sloth.wrapIter(sloth.iterArray([false, false, false, false])).any());
            test.done();
        },

        testAnyPredicated: function(test) {
            test.expect(1);
            test.strictEqual(true, sloth.wrapIter(sloth.iterArray([1, 2, 3, 4])).all(function(x) { return x >= 1; }));
            test.done();
        },

        testAnyInfinite: function(test) {
            test.expect(1);
            test.strictEqual(true, sloth.wrapIter(function() { return true; }).any());
            test.done();
        },

        testMax: function(test) {
            test.expect(1);
            test.strictEqual(4, sloth.wrapIter(sloth.iterArray([1, 2, 4, 3])).max());
            test.done();
        },

        testMaxComparator: function(test) {
            test.expect(1);
            test.strictEqual(1, sloth.wrapIter(sloth.iterArray([1, 2, 4, 3])).max(function(a, b) { return b - a; }));
            test.done();
        },

        testMin: function(test) {
            test.expect(1);
            test.strictEqual(1, sloth.wrapIter(sloth.iterArray([1, 2, 4, 3])).min());
            test.done();
        },

        testMinComparator: function(test) {
            test.expect(1);
            test.strictEqual(4, sloth.wrapIter(sloth.iterArray([1, 2, 4, 3])).min(function(a, b) { return b - a; }));
            test.done();
        },

        testTake: function(test) {
            test.expect(5);
            var iter = sloth.wrapIter((function() { var n = 1; return function() { return n++; }; })()).take(4).next;
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
            var iter = sloth.wrapIter((function() { var n = 1; return function() { return n++; }; })()).skip(4).next;
            test.strictEqual(5, iter());
            test.strictEqual(6, iter());
            test.strictEqual(7, iter());
            test.strictEqual(8, iter());
            test.done();
        },

        testTakeWhile: function(test) {
            test.expect(5);
            var iter = sloth.wrapIter(sloth.iterArray([1, 2, 3, 4, 5, 1])).takeWhile(function(x) { return x < 5 }).next;
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
            var iter = sloth.wrapIter(sloth.iterArray([4, 5, 6, 7, 4])).skipWhile(function(x) { return x < 5 }).next;
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

        testCycle: function(test) {
            test.expect(4);
            var iter = sloth.wrapIter(sloth.iterArray([1, 2])).cycle().next;
            test.strictEqual(1, iter());
            test.strictEqual(2, iter());
            test.strictEqual(1, iter());
            test.strictEqual(2, iter());
            test.done();
        },

        testConcat: function(test) {
            test.expect(5);
            var iter = sloth.wrapIter(sloth.iterArray([1, 2])).concat(sloth.iterArray([3, 4])).next;
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

        testTee: function(test) {
            test.expect(10);
            var iters = sloth.wrapIter(sloth.iterArray([1, 2, 3, 4])).tee();

            var iter = iters[0];
            test.strictEqual(1, iter());
            test.strictEqual(2, iter());
            test.strictEqual(3, iter());
            test.strictEqual(4, iter());
            try {
                iter()
            } catch(e) {
                test.strictEqual(sloth.StopIteration, e);
            }

            var iter = iters[1];
            test.strictEqual(1, iter());
            test.strictEqual(2, iter());
            test.strictEqual(3, iter());
            test.strictEqual(4, iter());
            try {
                iter()
            } catch(e) {
                test.strictEqual(sloth.StopIteration, e);
            }

            test.done();
        },

        testZip: function(test) {
            test.expect(5);
            var iter = sloth.wrapIter(sloth.iterArray([1, 2, 3, 4]))
                .zip(sloth.iterArray([1, 2, 3, 4, 5]), sloth.iterArray([2, 3, 4, 5, 6]))
                .next;

            test.deepEqual([1, 1, 2], iter());
            test.deepEqual([2, 2, 3], iter());
            test.deepEqual([3, 3, 4], iter());
            test.deepEqual([4, 4, 5], iter());
            try {
                iter()
            } catch(e) {
                test.strictEqual(sloth.StopIteration, e);
            }

            test.done();
        },

        testNub: function(test) {
            test.expect(6);
            var iter = sloth.wrapIter(sloth.iterArray([0, 1, 1, 2, 3, 4, 4, 4])).nub().next;
            test.strictEqual(0, iter());
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

        testNubPredicate: function(test) {
            test.expect(3);
            var iter = sloth.wrapIter(sloth.iterArray(["cat", "coffee", "dog"])).nub(function(x, y) { return x.charAt(0) == y.charAt(0); }).next;
            test.strictEqual("cat", iter());
            test.strictEqual("dog", iter());
            try {
                iter();
            } catch(e) {
                test.strictEqual(sloth.StopIteration, e);
            }
            test.done();
        },

        testUnion: function(test) {
            test.expect(8);
            var iter = sloth.wrapIter(sloth.iterArray([1, 1, 2, 3, 4, 4, 4]))
                .union(sloth.iterArray([3, 3, 4, 5, 6, 7, 7]))
                .next;
            test.strictEqual(1, iter());
            test.strictEqual(2, iter());
            test.strictEqual(3, iter());
            test.strictEqual(4, iter());
            test.strictEqual(5, iter());
            test.strictEqual(6, iter());
            test.strictEqual(7, iter());
            try {
                iter();
            } catch(e) {
                test.strictEqual(sloth.StopIteration, e);
            }
            test.done();
        },

        testUnionPredicate: function(test) {
            test.expect(4);
            var iter = sloth.wrapIter(sloth.iterArray(["cat", "coffee", "dog"]))
                .union(sloth.iterArray(["dish", "rabbit", "rock"]),
                       function(x, y) { return x.charAt(0) == y.charAt(0); })
                .next;
            test.strictEqual("cat", iter());
            test.strictEqual("dog", iter());
            test.strictEqual("rabbit", iter());
            try {
                iter();
            } catch(e) {
                test.strictEqual(sloth.StopIteration, e);
            }
            test.done();
        },

        testIntersect: function(test) {
            test.expect(3);
            var iter = sloth.wrapIter(sloth.iterArray([0, 1, 1, 2, 3, 4, 4, 4]))
                .intersect(sloth.iterArray([0, 3, 3, 5, 6, 7, 7]))
                .next;
            test.strictEqual(0, iter());
            test.strictEqual(3, iter());
            try {
                iter();
            } catch(e) {
                test.strictEqual(sloth.StopIteration, e);
            }
            test.done();
        },

        testIntersectPredicate: function(test) {
            test.expect(2);
            var iter = sloth.wrapIter(sloth.iterArray(["cat", "coffee", "dog"]))
                .intersect(sloth.iterArray(["dish", "rabbit", "rock"]),
                           function(x, y) { return x.charAt(0) == y.charAt(0); })
                .next;
            test.strictEqual("dish", iter());
            try {
                iter();
            } catch(e) {
                test.strictEqual(sloth.StopIteration, e);
            }
            test.done();
        },

        testDifference: function(test) {
            test.expect(5);
            var iter = sloth.wrapIter(sloth.iterArray([0, 1, 1, 2, 3, 4, 4, 4]))
                .difference(sloth.iterArray([3, 3, 4, 5, 6, 7, 7]))
                .next;
            test.strictEqual(0, iter());
            test.strictEqual(1, iter());
            test.strictEqual(1, iter());
            test.strictEqual(2, iter());
            try {
                iter();
            } catch(e) {
                test.strictEqual(sloth.StopIteration, e);
            }
            test.done();
        },

        testDifferencePredicate: function(test) {
            test.expect(3);
            var iter = sloth.wrapIter(sloth.iterArray(["cat", "coffee", "dog"]))
                .difference(sloth.iterArray(["dish", "rabbit", "rock"]),
                           function(x, y) { return x.charAt(0) == y.charAt(0); })
                .next;
            test.strictEqual("cat", iter());
            test.strictEqual("coffee", iter());
            try {
                iter();
            } catch(e) {
                test.strictEqual(sloth.StopIteration, e);
            }
            test.done();
        },

        testSymmetricDifference: function(test) {
            test.expect(8);
            var iter = sloth.wrapIter(sloth.iterArray([1, 1, 2, 3, 4, 4, 4]))
                .symmetricDifference(sloth.iterArray([3, 3, 4, 5, 6, 7, 7]))
                .next;
            test.strictEqual(1, iter());
            test.strictEqual(1, iter());
            test.strictEqual(2, iter());
            test.strictEqual(5, iter());
            test.strictEqual(6, iter());
            test.strictEqual(7, iter());
            test.strictEqual(7, iter());
            try {
                iter();
            } catch(e) {
                test.strictEqual(sloth.StopIteration, e);
            }
            test.done();
        },

        testSymmetricDifferencePredicate: function(test) {
            test.expect(5);
            var iter = sloth.wrapIter(sloth.iterArray(["cat", "coffee", "dog"]))
                .symmetricDifference(sloth.iterArray(["dish", "rabbit", "rock"]),
                           function(x, y) { return x.charAt(0) == y.charAt(0); })
                .next;
            test.strictEqual("cat", iter());
            test.strictEqual("coffee", iter());
            test.strictEqual("rabbit", iter());
            test.strictEqual("rock", iter());
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
        sloth = require(__dirname + '/../sloth.js');
        module.exports = tests;
    }
    if(typeof window !== "undefined") {
        sloth = window.sloth;
        window.tests = tests;
    }
})()

