(function() {
    "use strict";

    // _The lazy JavaScript iterator library._
    //
    // `sloth.js` is a JavaScript library for working with lazy iterators,
    // providing a way to create, compose and perform various other operations
    // on them --- forming a composable algebra of operations on iterators.
    //
    // `sloth.js` will be slower than conventional operations for short
    // operations, but where it shines is consuming large amounts of data
    // along a pipeline, e.g. combining `map`, `filter` and `foldl` operations.
    // This is because it doesn't allocate any space before actual iteration
    // (however, for some inexplicable reason, it sometimes runs faster than
    // native code).
    //
    // Inspired by Python's `itertools` module, Haskell's lazy list facilities
    // and Jeremy Ashkenas's Underscore.js.
    //
    // `sloth.js` is freely distributable under the terms of the MIT license.
    var sloth = {
        // ## Slothification
        //
        // `sloth.ify` a sequence, making it usable with `sloth.js` operations.
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
            return sloth.wrapIter(sloth.iterify(xs));
        },

        // ## Wrapping
        //
        // Wrap an iterator with various fun utility functions, which can be
        // composed to yield lazy sequences.
        //
        // This function is _not_ idempotent! If `iter` is already wrapped,
        // invoking `wrapIter` on it will result in breakage.
        wrapIter: function(iter) {
            var _wrapped;
            return _wrapped = {
                // ## Maps, filters and folds

                // `map` applies a function across all elements of a sequence.
                //
                // This is a lazy, composable operation.
                map: function(f) {
                    return sloth.wrapIter(function() {
                        return f(iter());
                    });
                },

                // `filter` selects elements from a sequence that are `true`
                // when the predicate is applied to them.
                //
                // This is a lazy, composable operation.
                filter: function(f) {
                    return sloth.wrapIter(function() {
                        var value;
                        while(!f(value = iter()));
                        return value;
                    });
                },

                // `foldl` is an implementation of the left-fold operation,
                // also known as a left-reduce or inject.
                //
                // This is a strict, non-composable operation.
                foldl: function(f, acc) {
                    if(arguments.length == 1) acc = iter();

                    sloth.wrapIter(iter).each(function(x) {
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
                    var reverseIter = sloth.wrapIter(iter).reverse().next;

                    if(arguments.length == 1) acc = reverseIter();

                    sloth.wrapIter(reverseIter).each(function(x) {
                        acc = f(acc, x);
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
                            value = iter();
                        } catch(e) {
                            if(e === sloth.StopIteration) break;
                            throw e;
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
                            value = iter();
                        } catch(e) {
                            if(e === sloth.StopIteration) break;
                            throw e;
                        }
                        if(f(value)) return true;
                    }
                    return false;
                },

                // ## Maxima and minima

                // `max` returns the maximum value of the sequence using a
                // given comparison function.
                //
                // This is a strict, non-composable operation.
                max: function(f) {
                    if(typeof f === "undefined") f = sloth.cmp;

                    return sloth.wrapIter(iter).foldl(function(acc, x) {
                        return f(acc, x) > 0 ? acc : x;
                    });
                },

                // `max` returns the maximum value of the sequence using a
                // given comparison function.
                //
                // This is a strict, non-composable operation.
                min: function(f) {
                    if(typeof f === "undefined") f = sloth.cmp;

                    return sloth.wrapIter(iter).foldl(function(acc, x) {
                        return f(acc, x) < 0 ? acc : x;
                    });
                },

                // ## Taking and skipping

                // `take` yields a sequence with only the first _n_ elements of
                // the original sequence.
                //
                // This is a lazy, composable operation.
                take: function(n) {
                    return sloth.wrapIter(function() {
                        if(n == 0) throw sloth.StopIteration;
                        n--;
                        return iter();
                    });
                },

                // `skip` yields a sequence without the first _n_ elements of
                // the original sequence.
                //
                // This is a lazy, composable operation.
                skip: function(n) {
                    return sloth.wrapIter(function() {
                        while(n) {
                            iter();
                            n--;
                        }
                        return iter();
                    });
                },

                // `takeWhile` yields a sequence with only the first
                // contiguous sequence of elements that fulfill the predicate.
                //
                // This is a lazy, composable operation.
                takeWhile: function(f) {
                    var ended = false;

                    return sloth.wrapIter(function() {
                        var value = iter();
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
                    var value;
                    while(f(value = iter()));

                    var firstTaken = false;

                    return sloth.wrapIter(function() {
                        if(firstTaken) return iter();
                        firstTaken = true;
                        return value;
                    });
                },

                // ## Set operations

                // `union` yields a sequence with only the unique elements from
                // both sequences, using the given predicate for comparison.
                //
                // Similarly to `concat`, `ys` must be an iterator. This will
                // completely drain the `ys` iterator.
                //
                // Again, this can be slow due to the use of `nub`.
                //
                // This is a lazy, composable operation.
                union: function(ys, f) {
                    if(typeof f === "undefined") f = sloth.eq;

                    return sloth.wrapIter(iter)
                        .concat(ys)
                        .nub(f)
                },

                // `intersect` yields a sequence with only the unique elements
                // present in both sequences, using the given predicate for
                // comparison.
                //
                // Similarly to `concat`, `ys` must be an iterator. This will
                // completely drain the `ys` iterator.
                //
                // Yet again, this can be slow due to the use of `nub`.
                //
                // This is a semi-strict composable operation, as it requires
                // the first iterator to be non-infinite.
                intersect: function(ys, f) {
                    if(typeof f === "undefined") f = sloth.eq;

                    var seen = sloth.wrapIter(iter).nub().force();
                    var ysNubbed = sloth.wrapIter(ys).nub().next;

                    return sloth.wrapIter(function() {
                        var value;
                        var i;

                        while(value = ysNubbed()) {
                            for(i = 0; i < seen.length; ++i) {
                                if(f(seen[i], value)) return value;
                            }
                        }
                    });
                },

                // `difference` yields a sequence with the elements of sequence
                // B removed from sequence A.
                //
                // Similarly to `concat`, `ys` must be an iterator. This will
                // completely drain the `ys` iterator.
                //
                // This does not return only unique elements, but the resulting
                // sequence can be `nub()`ed.
                //
                // This is a semi-strict composable operation, as it requires
                // the second iterator to be non-infinite.
                difference: function(ys, f) {
                    if(typeof f === "undefined") f = sloth.eq;

                    var seen = sloth.wrapIter(ys).nub().force();

                    return sloth.wrapIter(function() {
                        var value;
                        var skip;
                        var i;

                        for(;;) {
                            value = iter()
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
                // Similarly to `concat`, `ys` must be an iterator. This will
                // completely drain the `ys` iterator.
                //
                // This does not return only unique elements, but the resulting
                // sequence can be `nub()`ed.
                //
                // This is a strict, composable operation.
                symmetricDifference: function(ys, f) {
                    if(typeof f === "undefined") f = sloth.eq;

                    var xsArray = sloth.wrapIter(iter).force().reverse();
                    var ysArray = sloth.wrapIter(ys).force().reverse();

                    var seen = sloth.wrapIter(sloth.iterArray(xsArray))
                        .intersect(sloth.iterArray(ysArray), f)
                        .force();

                    return sloth.wrapIter(function() {
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

                    for(;;) {
                        try {
                            value = iter();
                        } catch(e) {
                            if(e === sloth.StopIteration) break;
                            throw e;
                        }
                        f(value);
                    }
                },

                // `concat` joins two sequences to each other, end-to-end. Note
                // that the `ys` parameter must be an actual iterator and not a
                // `sloth.wrapIter`ed iterator (this can be taken from any
                // `sloth.wrapIter`ed iterator with `wrapped.next`).
                //
                // This will completely drain the `ys` iterator.
                //
                // This is a lazy, composable operation.
                concat: function(ys) {
                    var xsEnd = false;

                    return sloth.wrapIter(function() {
                        if(!xsEnd) {
                            try {
                                return iter();
                            } catch(e) {
                                if(e === sloth.StopIteration) {
                                    xsEnd = true;
                                    return ys();
                                }
                                throw e;
                            }
                        }

                        if(xsEnd) return ys();
                    });
                },

                // `cycle` loops a list around itself infinitely.
                //
                // This is a lazy, composable operation.
                cycle: function() {
                    var xs = [];
                    var xsIter = null;

                    return sloth.wrapIter(function() {
                        var value;

                        try {
                            value = (xsIter === null ? iter : xsIter)();
                        } catch(e) {
                            if(e === sloth.StopIteration) {
                                xsIter = sloth.iterArray(xs);
                                return xsIter();
                            }
                            throw e;
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
                    if(typeof f === "undefined") f = sloth.eq;
                    var seen = [];

                    return sloth.wrapIter(function() {
                        var value;
                        var skip;
                        var i;

                        for(;;) {
                            value = iter();
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

                // `reverse` reverses the underlying iterator.
                //
                // This is a strict, composable operation.
                reverse: function() {
                    var array = sloth.wrapIter(iter).force();
                    array.reverse();
                    return sloth.wrapIter(sloth.iterArray(array));
                },

                // `sort` sorts an array using a comparison function.
                //
                // This is a strict, composable operation.
                sort: function(f) {
                    if(typeof f === "undefined") f = sloth.cmp;

                    var array = sloth.wrapIter(iter).force();
                    array.sort(f);
                    return sloth.wrapIter(sloth.iterArray(array));
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
                            value = iter();
                        } catch(e) {
                            if(e === sloth.StopIteration) break;
                            throw e;
                        }
                        output.push(value);
                    }
                    return output;
                },

                // ## Advanced features

                // `next` holds the raw iterator function.
                next: iter,

                // `__iterator__` implements the iterator protocol for
                // JavaScript 1.7.
                __iterator__: function() {
                    return _wrapped;
                }
            }
        },

        // ## Iterators
        //
        // A lazy iterator in `sloth.js` is defined as a function (usually a
        // closure) which can be repeatedly invoked to yield successive values of a
        // sequence, until the appropriate exception, `sloth.StopIteration`, is
        // thrown to indicate the end of the sequence.

        // `iterify` creates an low-level iterator for various common data
        // types.
        iterify: function(xs) {
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

            throw new TypeError("cannot iterify object");
        },

        // Create an iterator for an array. Note that this is the low-level
        // iterator and needs to be `sloth.wrapIter`ed for useful things.
        iterArray: function(array) {
            var i = 0;

            return function() {
                if(i >= array.length) throw sloth.StopIteration;
                return array[i++];
            };
        },

        // Create an iterator for a string.  Note that this is the low-level
        // iterator and needs to be `sloth.wrapIter`ed for useful things.
        iterString: function(string) {
            var i = 0;

            return function() {
                if(i >= string.length) throw sloth.StopIteration;
                return string.charAt(i++);
            };
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
        // `sloth.wrapIter`ed for useful things.
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
        // Some JavaScript engines (presently SpiderMonkey) support
        // `StopIteration` exceptions.
        //
        // A common example of this reaching the end of an array in a
        // traditional `for` loop.
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
        },
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
