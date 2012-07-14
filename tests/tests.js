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

        testIterObject: function(test) {
            test.expect(5);
            var iter = sloth.iterObject({a: 1, b: 2, c: 3, d: 4});
            test.deepEqual(["a", 1], iter());
            test.deepEqual(["b", 2], iter());
            test.deepEqual(["c", 3], iter());
            test.deepEqual(["d", 4], iter());
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
                var iter = sloth.iterNextable(gen());
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
                for(var v in new sloth.Slothified(sloth.iterArray([1, 2, 3, 4]))) {
                    test.strictEqual(i++, v);
                }
                test.done();
            }
        },

        testIfyFunction: function(test) {
            test.expect(4);
            var iter = sloth.ify(function() { return 1; }).next;
            test.strictEqual(1, iter());
            test.strictEqual(1, iter());
            test.strictEqual(1, iter());
            test.strictEqual(1, iter());
            test.done();
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

        testIfyObject: function(test) {
            test.expect(5);
            var iter = sloth.ify({a: 1, b: 2, c: 3, d: 4}).next;
            test.deepEqual(["a", 1], iter());
            test.deepEqual(["b", 2], iter());
            test.deepEqual(["c", 3], iter());
            test.deepEqual(["d", 4], iter());
            try {
                iter();
            } catch(e) {
                test.strictEqual(sloth.StopIteration, e);
            }
            test.done();
        },

        testIfySlothified: function(test) {
            test.expect(1);
            var iter = sloth.ify([1, 2, 3, 4]);
            test.strictEqual(sloth.ify(iter), iter);
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

        testRange: function(test) {
            test.expect(3);
            var iter = sloth.range(1, 5, 2).next;
            test.strictEqual(1, iter());
            test.strictEqual(3, iter());
            try {
                iter();
            } catch(e) {
                test.strictEqual(sloth.StopIteration, e);
            }
            test.done();
        },

        testRangeDefaultStep: function(test) {
            test.expect(5);
            var iter = sloth.range(1, 5).next;
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

        testRangeLeft: function(test) {
            test.expect(5);
            var iter = sloth.range(4).next;
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

        testRangeInfinite: function(test) {
            test.expect(4);
            var iter = sloth.range(0, null).next;
            test.strictEqual(0, iter());
            test.strictEqual(1, iter());
            test.strictEqual(2, iter());
            test.strictEqual(3, iter());
            test.done();
        },

        testRepeatFinite: function(test) {
            test.expect(5);
            var iter = sloth.repeat(0, 4).next;
            test.strictEqual(0, iter());
            test.strictEqual(0, iter());
            test.strictEqual(0, iter());
            test.strictEqual(0, iter());
            try {
                iter();
            } catch(e) {
                test.strictEqual(sloth.StopIteration, e);
            }
            test.done();
        },

        testRepeatInfinite: function(test) {
            test.expect(4);
            var iter = sloth.repeat(0).next;
            test.strictEqual(0, iter());
            test.strictEqual(0, iter());
            test.strictEqual(0, iter());
            test.strictEqual(0, iter());
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
            var iter = sloth.ify([1, 2, 3, 4])
                .map(function(x) { return x + 1; })
                .next;
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
            var iter = sloth.ify(function() { return 1; })
                .map(function(x) { return x + 1; })
                .next;
            test.strictEqual(2, iter());
            test.strictEqual(2, iter());
            test.strictEqual(2, iter());
            test.strictEqual(2, iter());
            test.done();
        },

        testFilter: function(test) {
            test.expect(3);
            var iter = sloth.ify([1, 2, 3, 4])
                .filter(function(x) { return x > 2 })
                .next;
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
            var iter = sloth.ify((function() {
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
            sloth.ify([1, 2, 3, 4]).each(function(x, j) {
                test.strictEqual(i, j);
                test.strictEqual(++i, x);
            });
            test.done();
        },

        testForce: function(test) {
            test.expect(1);
            test.deepEqual([1, 2, 3, 4], sloth.ify([1, 2, 3, 4]).force());
            test.done();
        },

        testEnumerate: function(test) {
            test.expect(5);
            var iter = sloth.ify([1, 2, 3, 4])
                .enumerate()
                .next;
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
            var iter = sloth.ify([1, 2, 3, 4])
                .reverse()
                .next;
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
            var iter = sloth.ify([1, 2, 10, 3])
                .sort()
                .next;
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
            var iter = sloth.ify([1, 2, 3, 4])
                .sort(function(a, b) { return b - a; })
                .next;
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

        testGroup: function(test) {
            test.expect(1);
            var groups = sloth.ify([9, 2, 3, 2, 4, 1, 1, 2])
                .group()
                .map(function(x) { return x.force(); } )
                .force();
            test.deepEqual([[9], [2, 2, 2], [3], [4], [1, 1]], groups);
            test.done();
        },

        testGroupAlternativeForce: function(test) {
            test.expect(1);
            var groups = sloth.ify([9, 2, 3, 2, 4, 1, 1, 2]).group().force();
            for(var i = 0; i < groups.length; ++i) {
                groups[i] = groups[i].force();
            }
            test.deepEqual([[9], [2, 2, 2], [3], [4], [1, 1]], groups);
            test.done();
        },

        testGroupPredicate: function(test) {
            test.expect(1);
            var groups = sloth.ify([{n:9}, {n:2}, {n:3}, {n:2}, {n:4}, {n:1}, {n:1}, {n:2}])
                .group(function(x, y) { return x.n == y.n; })
                .map(function(x) { return x.force(); } )
                .force();
            test.deepEqual([[{n:9}], [{n:2}, {n:2}, {n:2}], [{n:3}], [{n:4}], [{n:1}, {n:1}]], groups);
            test.done();
        },

        testFoldl: function(test) {
            test.expect(1);
            test.strictEqual(-8, sloth.ify([1, 2, 3, 4])
                .foldl(function(acc, x) { return acc - x; })
            );
            test.done();
        },

        testFoldlWithAcc: function(test) {
            test.expect(1);
            test.strictEqual(0, sloth.ify([1, 2, 3, 4])
                .foldl(function(acc, x) { return acc - x; }, 10)
            );
            test.done();
        },

        testFoldlWithSingle: function(test) {
            test.expect(1);
            test.strictEqual(1, sloth.ify([1])
                .foldl(function(acc, x) { return acc - x; })
            );
            test.done();
        },

        testFoldlWithSingleAcc: function(test) {
            test.expect(1);
            test.strictEqual(9, sloth.ify([1])
                .foldl(function(acc, x) { return acc - x; }, 10)
            );
            test.done();
        },

        testFoldr: function(test) {
            test.expect(1);
            test.strictEqual(-2, sloth.ify([1, 2, 3, 4])
                .foldr(function(x, acc) { return acc - x; })
            );
            test.done();
        },

        testFoldrWithAcc: function(test) {
            test.expect(1);
            test.strictEqual(0, sloth.ify([1, 2, 3, 4])
                .foldr(function(x, acc) { return acc - x; }, 10)
            );
            test.done();
        },

        testFoldrWithSingle: function(test) {
            test.expect(1);
            test.strictEqual(1, sloth.ify([1])
                .foldr(function(x, acc) { return acc - x; })
            );
            test.done();
        },

        testFoldrWithSingleAcc: function(test) {
            test.expect(1);
            test.strictEqual(9, sloth.ify([1])
                .foldr(function(x, acc) { return acc - x; }, 10)
            );
            test.done();
        },

        testAll: function(test) {
            test.expect(1);
            test.strictEqual(true, sloth.ify([true, true, true, true])
                .all()
            );
            test.done();
        },

        testAllPredicated: function(test) {
            test.expect(1);
            test.strictEqual(true, sloth.ify([1, 2, 3, 4])
                .any(function(x) { return x >= 2; })
            );
            test.done();
        },

        testAllFalse: function(test) {
            test.expect(1);
            test.strictEqual(false, sloth.ify([true, false, true, true])
                .all()
            );
            test.done();
        },

        testAllInfinite: function(test) {
            test.expect(1);
            test.strictEqual(false, sloth.ify(function() { return false; })
                .all()
            );
            test.done();
        },

        testAny: function(test) {
            test.expect(1);
            test.strictEqual(true, sloth.ify([true, false, false, false])
                .any()
            );
            test.done();
        },

        testAnyFalse: function(test) {
            test.expect(1);
            test.strictEqual(false, sloth.ify([false, false, false, false])
                .any()
            );
            test.done();
        },

        testAnyPredicated: function(test) {
            test.expect(1);
            test.strictEqual(true, sloth.ify([1, 2, 3, 4])
                .all(function(x) { return x >= 1; })
            );
            test.done();
        },

        testAnyInfinite: function(test) {
            test.expect(1);
            test.strictEqual(true, sloth.ify(function() { return true; })
                .any()
            );
            test.done();
        },

        testMax: function(test) {
            test.expect(1);
            test.strictEqual(4, sloth.ify([1, 2, 4, 3])
                .max()
            );
            test.done();
        },

        testMaxComparator: function(test) {
            test.expect(1);
            test.strictEqual(1, sloth.ify([1, 2, 4, 3])
                .max(function(a, b) { return b - a; })
            );
            test.done();
        },

        testMin: function(test) {
            test.expect(1);
            test.strictEqual(1, sloth.ify([1, 2, 4, 3])
                .min()
            );
            test.done();
        },

        testMinComparator: function(test) {
            test.expect(1);
            test.strictEqual(4, sloth.ify([1, 2, 4, 3])
                .min(function(a, b) { return b - a; })
            );
            test.done();
        },

        testTake: function(test) {
            test.expect(5);
            var iter = sloth.ify((function() { var n = 1; return function() { return n++; }; })())
                .take(4)
                .next;
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
            var iter = sloth.ify((function() { var n = 1; return function() { return n++; }; })())
                .skip(4)
                .next;
            test.strictEqual(5, iter());
            test.strictEqual(6, iter());
            test.strictEqual(7, iter());
            test.strictEqual(8, iter());
            test.done();
        },

        testTakeWhile: function(test) {
            test.expect(5);
            var iter = sloth.ify([1, 2, 3, 4, 5, 1])
                .takeWhile(function(x) { return x < 5 })
                .next;
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
            var iter = sloth.ify([4, 5, 6, 7, 4])
                .skipWhile(function(x) { return x < 5 })
                .next;
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
            var iter = sloth.ify([1, 2]).cycle().next;
            test.strictEqual(1, iter());
            test.strictEqual(2, iter());
            test.strictEqual(1, iter());
            test.strictEqual(2, iter());
            test.done();
        },

        testConcat: function(test) {
            test.expect(5);
            var iter = sloth.ify([1, 2])
                .concat([3, 4]).next;
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

        testProduct: function(test) {
            test.expect(5);
            var iter = sloth.ify([1, 2])
                .product([3, 4]).next;
            test.deepEqual([1, 3], iter());
            test.deepEqual([2, 3], iter());
            test.deepEqual([1, 4], iter());
            test.deepEqual([2, 4], iter());
            try {
                iter();
            } catch(e) {
                test.strictEqual(sloth.StopIteration, e);
            }
            test.done();
        },


        testTee: function(test) {
            test.expect(10);
            var iters = sloth.ify([1, 2, 3, 4]).tee();

            var iter = iters[0].next;
            test.strictEqual(1, iter());
            test.strictEqual(2, iter());
            test.strictEqual(3, iter());
            test.strictEqual(4, iter());
            try {
                iter()
            } catch(e) {
                test.strictEqual(sloth.StopIteration, e);
            }

            var iter = iters[1].next;
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
            var iter = sloth.ify([1, 2, 3, 4])
                .zip([1, 2, 3, 4, 5], [2, 3, 4, 5, 6])
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
            var iter = sloth.ify([0, 1, 1, 2, 3, 4, 4, 4])
                .nub()
                .next;
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
            var iter = sloth.ify(["cat", "coffee", "dog"])
                .nub(function(x, y) { return x.charAt(0) == y.charAt(0); })
                .next;
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
            var iter = sloth.ify([1, 1, 2, 3, 4, 4, 4])
                .union([3, 3, 4, 5, 6, 7, 7])
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
            var iter = sloth.ify(["cat", "coffee", "dog"])
                .union(["dish", "rabbit", "rock"],
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
            var iter = sloth.ify([0, 1, 1, 2, 3, 4, 4, 4])
                .intersect([0, 3, 3, 5, 6, 7, 7])
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
            var iter = sloth.ify(["cat", "coffee", "dog"])
                .intersect(["dish", "rabbit", "rock"],
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
            var iter = sloth.ify([0, 1, 1, 2, 3, 4, 4, 4])
                .difference([3, 3, 4, 5, 6, 7, 7])
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
            var iter = sloth.ify(["cat", "coffee", "dog"])
                .difference(["dish", "rabbit", "rock"],
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
            var iter = sloth.ify([1, 1, 2, 3, 4, 4, 4])
                .symmetricDifference([3, 3, 4, 5, 6, 7, 7])
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
            var iter = sloth.ify(["cat", "coffee", "dog"])
                .symmetricDifference(["dish", "rabbit", "rock"],
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
        }
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

