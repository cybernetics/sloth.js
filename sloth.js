(function() {
    "use strict";

    // _The lazy JavaScript iterator library._
    //
    // `sloth.js` is a JavaScript library for working with lazy iterators,
    // providing a way to create, compose and perform various other operations
    // on them --- forming a composable algebra of operations on iterators.
    //
    // `sloth.js` will be slower than conventional operations for short
    // operations (though sometimes outperforms native implementations for some
    // inexplicable reason), but where it shines is consuming large amounts of
    // data along a pipeline, e.g. combining `map`, `filter` and `foldl`
    // operations. This is because it doesn't allocate any space before actual
    // iteration.
    //
    // Inspired by Python's `itertools` module, Haskell's lazy list facilities
    // and Jeremy Ashkenas's Underscore.js.
    //
    // `sloth.js` is freely distributable under the terms of the MIT license.
    var sloth = {
        // ## Slothification
        //
        // `sloth.ify` a sequence, making it usable with `sloth.js` operations.
        // Slothification is an idempotent operation, meaning it can be used
        // on a slothified variable multiple times without any issue.
        //
        // ### Terminology
        //
        // #### Lazy
        //
        // Lazy operations are run as the sequence is iterated, rather than
        // immediately when the function is called.
        //
        // #### Strict
        //
        // Strict operations run as soon as the function is called, allocating
        // space for it immediately. You may wish to run some strict operations
        // (e.g. `reverse` and `sort`) after forcing, as their in-place
        // native equivalents will be faster.
        //
        // #### Composable
        //
        // Composable operations can have successive operations invoked on
        // them, e.g. `map().map().filter().nub()`.
        //
        // #### Non-composable
        //
        // Non-composable operations are found at the end of a `sloth.ify`ed
        // chain, usually culminating in a result.
        ify: function(xs) {
            if(xs.slothified) return xs;
            return new sloth.Slothified(sloth.iterify(xs));
        },

        Slothified: (function() {
            var Slothified = function(iter) {
                this.next = iter;
            };

            Slothified.prototype = {
                // Mark the object as a `sloth.ify`ed.
                slothified: true,

                // ## Maps, filters and folds

                // `map` applies a function across all elements of a sequence.
                //
                // This is a lazy, composable operation.
                map: function(f) {
                    var _this = this;

                    return new sloth.Slothified(function() {
                        return f(_this.next());
                    });
                },

                // `filter` selects elements from a sequence that are `true`
                // when the predicate is applied to them.
                //
                // This is a lazy, composable operation.
                filter: function(f) {
                    var _this = this;

                    return new sloth.Slothified(function() {
                        var value;
                        while(!f(value = _this.next()));
                        return value;
                    });
                },

                // `foldl` is an implementation of the left-fold operation,
                // also known as a left-reduce or inject.
                //
                // This is a strict, non-composable operation.
                foldl: function(f, acc) {
                    if(arguments.length == 1) acc = this.next();

                    this.each(function(x) {
                        acc = f(acc, x);
                    });
                    return acc;
                },

                // `foldr` is an implementation of the right-fold operation,
                // the reverse analog of `foldl` operation.
                //
                // This operation may be slow due the fact the entire list must
                // first be reversed.
                //
                // This is a strict, non-composable operation.
                foldr: function(f, acc) {
                    var reverseIter = new sloth.Slothified(this.next)
                        .reverse()
                        .next;

                    if(arguments.length == 1) acc = reverseIter();

                    new sloth.Slothified(reverseIter).each(function(x) {
                        acc = f(x, acc);
                    });
                    return acc;
                },

                // ## Quantification

                // `all` checks if all values in the sequence are truthy or
                // fulfill the predicate (universal quantification).
                //
                // This is a partially strict non-composable operation.
                all: function(f) {
                    if(typeof f === "undefined") f = sloth.id;
                    var value;

                    for(;;) {
                        try {
                            value = this.next();
                        } catch(e) {
                            if(e !== sloth.StopIteration) throw e;
                            break;
                        }
                        if(!f(value)) return false;
                    }
                    return true;
                },

                // `any` checks if any values in the sequence are truthy or
                // fulfill the predicate (existential quantification).
                //
                // This is a partially strict non-composable operation.
                any: function(f) {
                    if(typeof f === "undefined") f = sloth.id;
                    var value;

                    for(;;) {
                        try {
                            value = this.next();
                        } catch(e) {
                            if(e !== sloth.StopIteration) throw e;
                            break;
                        }
                        if(f(value)) return true;
                    }
                    return false;
                },

                // ## Maxima and minima

                // `max` returns the maximum value of the sequence using a
                // given comparison function.
                //
                // If you're looking for the maximum of an array, it is much
                // more efficient to use `Math.max.apply(Math, array)` (up to
                // 40x(!!) faster).
                //
                // This is a strict, non-composable operation.
                max: function(f) {
                    if(typeof f === "undefined") f = sloth.cmp;

                    return this.foldl(function(acc, x) {
                        return f(acc, x) > 0 ? acc : x;
                    });
                },

                // `min` returns the minimum value of the sequence using a
                // given comparison function.
                //
                // If you're looking for the minimum of an array, it is much
                // more efficient to use `Math.min.apply(Math, array)` (up to
                // 40x(!!) faster).
                //
                // This is a strict, non-composable operation.
                min: function(f) {
                    if(typeof f === "undefined") f = sloth.cmp;

                    return this.foldl(function(acc, x) {
                        return f(acc, x) < 0 ? acc : x;
                    });
                },

                // ## Taking and skipping

                // `take` yields a sequence with only the first _n_ elements of
                // the original sequence.
                //
                // This is a lazy, composable operation.
                take: function(n) {
                    var _this = this;

                    return new sloth.Slothified(function() {
                        if(n === 0) throw sloth.StopIteration;
                        n--;
                        return _this.next();
                    });
                },

                // `skip` yields a sequence without the first _n_ elements of
                // the original sequence.
                //
                // This is a lazy, composable operation.
                skip: function(n) {
                    var _this = this;

                    return new sloth.Slothified(function() {
                        while(n) {
                            _this.next();
                            n--;
                        }
                        return _this.next();
                    });
                },

                // `takeWhile` yields a sequence with only the first
                // contiguous sequence of elements that fulfill the predicate.
                //
                // This is a lazy, composable operation.
                takeWhile: function(f) {
                    var _this = this;

                    var ended = false;

                    return new sloth.Slothified(function() {
                        var value = _this.next();
                        ended = !f(value);
                        if(ended) throw sloth.StopIteration;
                        return value;
                    });
                },

                // `skipWhile` yields a sequence without the first
                // contiguous sequence of elements that fulfill the predicate.
                //
                // This is a lazy, composable operation.
                skipWhile: function(f) {
                    var _this = this;

                    var value;
                    while(f(value = this.next()));

                    var firstTaken = false;

                    return new sloth.Slothified(function() {
                        if(firstTaken) return _this.next();
                        firstTaken = true;
                        return value;
                    });
                },

                // ## Set operations

                // `union` yields a sequence with only the unique elements from
                // both sequences, using the given predicate for comparison.
                //
                // This will drain the `ys` iterator.
                //
                // This can be slow due to the use of `nub`.
                //
                // This is a lazy, composable operation.
                union: function(ys, f) {
                    if(typeof f === "undefined") f = sloth.eq;

                    return this.concat(ys).nub(f);
                },

                // `intersect` yields a sequence with only the unique elements
                // present in both sequences, using the given predicate for
                // comparison.
                //
                // This will drain the `ys` iterator.
                //
                // Yet again, this can be slow due to the use of `nub`.
                //
                // This is a semi-strict composable operation, as it requires
                // the first iterator to be non-infinite.
                intersect: function(ys, f) {
                    if(typeof f === "undefined") f = sloth.eq;

                    var seen = this.nub(f).force();
                    var ysNubbed = sloth.ify(ys).nub().next;

                    return new sloth.Slothified(function() {
                        var value;
                        var i;

                        for(;;) {
                            value = ysNubbed();

                            for(i = 0; i < seen.length; ++i) {
                                if(f(seen[i], value)) return value;
                            }
                        }
                    });
                },

                // `difference` yields a sequence with the elements of sequence
                // B removed from sequence A.
                //
                // This will drain the `ys` iterator.
                //
                // This does not return only unique elements, but the resulting
                // sequence can be `nub()`ed.
                //
                // This is a semi-strict composable operation, as it requires
                // the second iterator to be non-infinite.
                difference: function(ys, f) {
                    var _this = this;

                    if(typeof f === "undefined") f = sloth.eq;

                    var seen = sloth.ify(ys).nub().force();

                    return new sloth.Slothified(function() {
                        var value;
                        var skip;
                        var i;

                        for(;;) {
                            value = _this.next();
                            skip = false;

                            for(i = 0; i < seen.length; ++i) {
                                if(f(seen[i], value)) {
                                    skip = true;
                                    break;
                                }
                            }
                            if(!skip) return value;
                        }
                    });
                },

                // `symmetricDifference` yields a sequence of the elements
                // present in neither sequence.
                //
                // This will drain the `ys` iterator.
                //
                // This does not return only unique elements, but the resulting
                // sequence can be `nub()`ed.
                //
                // This is a strict, composable operation.
                symmetricDifference: function(ys, f) {
                    var _this = this;
                    if(typeof f === "undefined") f = sloth.eq;

                    var xsArray = this.force().reverse();
                    var ysArray = sloth.ify(ys).force().reverse();

                    var seen = new sloth.Slothified(sloth.iterArray(xsArray))
                        .intersect(sloth.iterArray(ysArray), f)
                        .force();

                    return new sloth.Slothified(function() {
                        var value;
                        var skip;
                        var i;

                        for(;;) {
                            if(xsArray.length) {
                                value = xsArray.pop();
                            } else if(ysArray.length) {
                                value = ysArray.pop();
                            } else {
                                throw sloth.StopIteration;
                            }

                            skip = false;
                            for(i = 0; i < seen.length; ++i) {
                                if(f(seen[i], value)) {
                                    skip = true;
                                    break;
                                }
                            }
                            if(!skip) return value;
                        }
                    });
                },

                // ## Sequence utilities

                // `each` acts as a for-each loop and iterates through all
                // elements of the sequence, applying the given function to
                // each.
                //
                // `sloth.StopIteration` can be thrown at any time to break out
                // of the loop.
                //
                // This is a strict, non-composable operation.
                each: function(f) {
                    var value;
                    var i = 0;

                    for(;;) {
                        try {
                            value = this.next();
                        } catch(e) {
                            if(e !== sloth.StopIteration) throw e;
                            break;
                        }
                        f(value, i++);
                    }
                },

                // `concat` joins two sequences to each other, end-to-end.
                //
                // This will drain the `ys` iterator.
                //
                // This is a lazy, composable operation.
                concat: function(ys) {
                    var _this = this;

                    var xsEnd = false;
                    var ysIter = sloth.ify(ys).next;

                    return new sloth.Slothified(function() {
                        if(!xsEnd) {
                            try {
                                return _this.next();
                            } catch(e) {
                                if(e !== sloth.StopIteration) throw e;
                                xsEnd = true;
                                return ysIter();
                            }
                        }

                        if(xsEnd) return ysIter();
                    });
                },

                // `product` yields the Cartesian product of a series of
                // sequences.
                //
                // This will completely drain all iterators.
                //
                // This is a strict, composable operation (until someone
                // figures out a lazy version).
                product: function() {
                    var arrays = Array.prototype.slice.call(arguments);
                    arrays.unshift(this);
                    var i;

                    for(i = 0; i < arrays.length; ++i) {
                        arrays[i] = sloth.ify(arrays[i]).force();
                    }

                    // The following code is downright disgusting, so
                    // annotations will be provided in the form of Haskell
                    // code.
                    //
                    //     product arrays = foldl f [[]] arrays
                    return new sloth.Slothified(sloth.iterArray(new sloth.Slothified(sloth.iterArray(arrays)).foldl(function(accs, xs) {
                        //         where f accs xs = foldl (g accs) [] xs
                        return new sloth.Slothified(sloth.iterArray(xs)).foldl(function(acc, x) {
                            //               g accs acc x = acc ++ (zs x accs)
                            return new sloth.Slothified(sloth.iterArray(acc)).concat(
                                //               zs x = map (h x) accs
                                sloth.iterArray(new sloth.Slothified(sloth.iterArray(accs)).map(function(ys) {
                                    //               h x ys = ys ++ [x]
                                    return new sloth.Slothified(sloth.iterArray(ys))
                                        .concat(sloth.iterArray([x]))
                                        .force();
                                }).force())
                            ).force();
                        }, []);
                    }, [[]])));
                },

                // `cycle` loops a list around itself infinitely.
                //
                // This is a lazy, composable operation.
                cycle: function() {
                    var _this = this;

                    var xs = [];
                    var xsIter = null;

                    return new sloth.Slothified(function() {
                        var value;

                        try {
                            value = (xsIter === null ? _this.next : xsIter)();
                        } catch(e) {
                            if(e !== sloth.StopIteration) throw e;
                            xsIter = sloth.iterArray(xs);
                            return xsIter();
                        }

                        if(xsIter === null) xs.push(value);
                        return value;
                    });
                },

                // `nub` removes duplicate elements from the sequence using
                // the given predicate for comparison.
                //
                // This is up to 10x slower than Underscore.js's `uniq`, but is
                // more flexible in its operation.
                //
                // This is a lazy, composable operation.
                nub: function(f) {
                    var _this = this;

                    if(typeof f === "undefined") f = sloth.eq;
                    var seen = [];

                    return new sloth.Slothified(function() {
                        var value;
                        var skip;
                        var i;

                        for(;;) {
                            value = _this.next();
                            skip = false;
                            for(i = 0; i < seen.length; ++i) {
                                if(f(seen[i], value)) skip = true;
                            }
                            if(skip) continue;
                            seen.push(value);
                            return value;
                        }
                    });
                },

                // `enumerate` takes each element and places it in an array
                // with the index as the first element.
                //
                // This is a lazy, composable operaton.
                enumerate: function() {
                    var _this = this;

                    var i = 0;
                    return new sloth.Slothified(function() {
                        return [i++, _this.next()];
                    });
                },

                // `reverse` reverses the sequence.
                //
                // This is a strict, composable operation.
                reverse: function() {
                    var array = this.force();
                    var n = array.length;

                    return new sloth.Slothified(function() {
                        if(n == 0) throw sloth.StopIteration;
                        return array[--n];
                    });
                },

                // `sort` sorts the sequence using a comparison function.
                //
                // This is a strict, composable operation.
                sort: function(f) {
                    if(typeof f === "undefined") f = sloth.cmp;

                    var array = this.force();
                    array.sort(f);
                    return new sloth.Slothified(sloth.iterArray(array));
                },

                // `tee` splits the sequence into two independent sequence
                // iterators.
                //
                // This may allocate a large amount of additional storage, and
                // _will_ exhibit unbounded growth on infinite sequences.
                //
                // The original iterator should not be used.
                //
                // This is a lazy, non-composable operation.
                tee: function() {
                    var _this = this;

                    var left = [];
                    var right = [];

                    var makeIter = function(queue) {
                        return function() {
                            var value;

                            if(!queue.length) {
                                value = _this.next();

                                left.unshift(value);
                                right.unshift(value);
                            }

                            return queue.pop();
                        };
                    };

                    return [makeIter(left), makeIter(right)];
                },

                // `zip` takes the sequences passed to it and yields a new
                // sequence taking an element from each element and placing it
                // into an array. The length of the resulting sequence is the
                // length of the shortest sequence passed in.
                //
                // This is somewhat more useful with JavaScript 1.7
                // destructuring assignment.
                //
                // This is a lazy, composable operation.
                zip: function() {
                    var iters = Array.prototype.slice.call(arguments);
                    iters.unshift(this);
                    var i;

                    for(i = 0; i < iters.length; ++i) {
                        iters[i] = sloth.ify(iters[i]).next;
                    }

                    return new sloth.Slothified(function() {
                        var i;
                        var output = [];

                        for(i = 0; i < iters.length; ++i) {
                            output.push(iters[i]());
                        }

                        return output;
                    });
                },

                // `force` gets all the elements from the iterator and places
                // them into an array.
                //
                // This is a strict, non-composable operation.
                force: function() {
                    var output = [];
                    var value;

                    for(;;) {
                        try {
                            value = this.next();
                        } catch(e) {
                            if(e !== sloth.StopIteration) throw e;
                            break;
                        }
                        output.push(value);
                    }
                    return output;
                },

                // ## Advanced features

                // `__iterator__` implements the iterator protocol for
                // JavaScript 1.7.
                __iterator__: function() {
                    return this;
                }
            };

            return Slothified;
        })(),

        // ## Iterators
        //
        // A lazy iterator in `sloth.js` is defined as a function (usually a
        // closure) which can be repeatedly invoked to yield successive values
        // of a sequence, until the appropriate exception,
        // `sloth.StopIteration`, is thrown to indicate the end of the
        // sequence.

        // `iterify` creates an low-level iterator for various common data
        // types.
        iterify: function(xs) {
            // Check if the object is a function (and therefore can be used as
            // an iterator).
            if(xs && xs.constructor && xs.call && xs.apply) {
                return xs;
            }

            // Check if the object is a generator (JavaScript 1.7 only).
            if(typeof xs.next !== "undefined") {
                return sloth.iterGenerator(xs);
            }

            // Check if the object is a `String`.
            if(typeof xs.substring !== "undefined") {
                return sloth.iterString(xs);
            }

            // Check if the object is an `Array`.
            if(Object.prototype.toString.call(xs) === "[object Array]") {
                return sloth.iterArray(xs);
            }

            return sloth.iterObject(xs);
        },

        // Create an iterator for an array. Note that this is the low-level
        // iterator and needs to be `new sloth.Slothified`ed for useful things.
        iterArray: function(array) {
            var i = 0;

            return function() {
                if(i >= array.length) throw sloth.StopIteration;
                return array[i++];
            };
        },

        // Create an iterator for a string.  Note that this is the low-level
        // iterator and needs to be `new sloth.Slothified`ed for useful things.
        iterString: function(string) {
            var i = 0;

            return function() {
                if(i >= string.length) throw sloth.StopIteration;
                return string.charAt(i++);
            };
        },

        // Create an iterator for an object which yields pairs of keys and
        // values. This will immediately read in the object and generate a
        // list of its keys and values and, as such, won't reflect any changes
        // to the object.
        iterObject: function(obj) {
            var items = [];
            for(var k in obj) {
                if(!Object.prototype.hasOwnProperty.call(obj, k)) continue;
                items.push([k, obj[k]]);
            }
            return sloth.iterArray(items);
        },

        // Create an iterator for a generator (JavaScript 1.7 only).
        iterGenerator: function(generator) {
            return function() {
                return generator.next();
            };
        },

        // Create an iterator for a range. Comes in three variants:
        //
        // * If only a single argument `a` is provided, an iterator for a range
        //   from 0 to `a - 1` by a step of 1.
        //
        // * If the third argument, `step`, is left unspecified, the step
        //   defaults to 1.
        //
        // * If all three arguments are specified, a range from `a` to `b - 1`
        //   is created by a step of `step`.
        //
        // Note that the end of the range does not include `b` --- this is
        // influenced by Python's `range` function.
        //
        // Also note that this is the low-level iterator and needs to be
        // `new sloth.Slothified`ed for useful things.
        iterRange: function(a, b, step) {
            if(arguments.length == 1) {
                b = a;
                a = 0;
                step = 1;
            } else if(typeof step === "undefined") {
                step = 1;
            }

            return function() {
                if(a >= b) throw sloth.StopIteration;
                return (a += step) - step;
            };
        },

        // ### StopIteration
        //
        // `StopIteration` is an object which is thrown to indicate that the
        // iterator has no more data left to yield, i.e. an end-of-stream
        // situation.
        //
        // A common example of this reaching the end of an array in a
        // traditional `for` loop.
        //
        // Some JavaScript engines (presently SpiderMonkey) support
        // `StopIteration` exceptions.
        //
        // `StopIteration` instances must _not_ be instantiated --- it is a
        // singleton exception object which is designed to be thrown as is.
        StopIteration: typeof StopIteration !== "undefined" ?
                       StopIteration :
                       {},

        // ## Utility functions

        // A function where, given a value, returns the value (a la Haskell).
        id: function(x) {
            return x;
        },

        // The default comparison function, combining both lexicographic and
        // numerical semantics.
        cmp: function(a, b) {
            return a < b ? -1 :
                   a > b ? 1 :
                   0;
        },

        // The default equality function, which returns the strict equality of
        // two values.
        eq: function(a, b) {
            return a === b;
        }
    };

    // ## Finale

    // Export `sloth.js` appropriately for Node.js and the browser.
    if(typeof module !== "undefined" && module.exports) {
        module.exports = sloth;
    }
    if(typeof window !== "undefined") {
        window.sloth = sloth;
    }
})();
