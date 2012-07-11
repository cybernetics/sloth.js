(function() {
    "use strict";

    /*
     * sloth.js is a JavaScript library for working with lazy iterators,
     * providing a way to create, compose and perform various other operations
     * on them --- forming a composable algebra of operations on iterators.
     *
     * A lazy iterator in sloth.js is defined as a function (usually a closure)
     * which can be continually invoked to yield successive values of a
     * sequence, until the appropriate exception, `sloth.StopIteration`, is
     * thrown to indicate the end of the sequence.
     */
    var sloth = {
        /*
         * `StopIteration` is an object which is thrown to indicate that the
         * iterator has no more data left to yield, i.e. an end-of-stream
         * situation.
         *
         * A common example of this reaching the end of an array in a
         * traditional `for` loop.
         */
        StopIteration: {},

        /*
         * A function where, given a value, returns the value (a la Haskell).
         */
        id: function(x) {
            return x;
        },

        /*
         * The default comparison function, combining both lexicographic and
         * numerical semantics.
         */
        cmp: function(a, b) {
            return a < b ? -1 :
                   a > b ? 1 :
                   0;
        },

        /*
         * Create an iterator for an array. Note that this is the low-level
         * iterator and needs to be `sloth.wrap`ped for useful things.
         */
        iterArray: function(array) {
            var i = 0;

            return function() {
                if(i >= array.length) throw sloth.StopIteration;
                return array[i++];
            };
        },

        /*
         * Create an iterator for a string.  Note that this is the low-level
         * iterator and needs to be `sloth.wrap`ped for useful things.
         */
        iterString: function(string) {
            var i = 0;

            return function() {
                if(i >= string.length) throw sloth.StopIteration;
                return string.charAt(i++);
            };
        },

        /*
         * Create an iterator for a range. Comes in three variants:
         *
         * * If only a single argument `a` is provided, an iterator for a range
         *   from 0 to `a - 1` by a step of 1.
         *
         * * If the third argument, `step`, is left unspecified, the step
         *   defaults to 1.
         *
         * * If all three arguments are specified, a range from `a` to `b - 1`
         *   is created by a step of `step`.
         *
         * Note that the end of the range does not include `b` --- this is
         * influenced by Python's `range` function.
         *
         * Also note that this is the low-level iterator and needs to be
         * `sloth.wrap`ped for useful things.
         */
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

        /*
         * Wrap an iterator with various fun utility functions, which can be
         * composed to yield lazy sequences.
         */
        wrap: function(iter) {
            var _wrapped;
            return _wrapped = {
                /*
                 * `map` applies a function across all elements of a sequence.
                 *
                 * This is a lazy, composable operation.
                 */
                map: function(f) {
                    return sloth.wrap(function() {
                        return f(iter());
                    });
                },

                /*
                 * `filter` selects elements from a sequence that are `true`
                 * when the predicate is applied to them.
                 *
                 * This is a lazy, composable operation.
                 */
                filter: function(f) {
                    return sloth.wrap(function() {
                        var value;
                        while(!f(value = iter()));
                        return value;
                    });
                },

                /*
                 * `each` acts as a for-each loop and iterates through all
                 * elements of the sequence, applying the given function to
                 * each.
                 *
                 * `sloth.StopIteration` can be thrown at any time to break out
                 * of the loop.
                 *
                 * This is a strict, non-composable operation.
                 */
                each: function(f) {
                    for(;;) {
                        try {
                            var value = iter();
                        } catch(e) {
                            if(e === sloth.StopIteration) break;
                            throw e;
                        }
                        f(value);
                    }
                },

                /*
                 * `force` gets all the elements from the iterator and places
                 * them into an array.
                 *
                 * This is a strict, non-composable operation.
                 */
                force: function() {
                    var output = [];
                    sloth.wrap(iter).each(function(x) {
                        output.push(x);
                    });
                    return output;
                },

                /*
                 * `reverse` reverses the underlying iterator.
                 *
                 * This is a strict, composable operation.
                 */
                reverse: function() {
                    var array = sloth.wrap(iter).force();
                    array.reverse();
                    return sloth.wrap(sloth.iterArray(array));
                },

                /*
                 * `sort` sorts an array using a comparison function.
                 *
                 * This is a strict, composable operation.
                 */
                sort: function(f) {
                    if(typeof f === "undefined") f = sloth.cmp;

                    var array = sloth.wrap(iter).force();
                    array.sort(f);
                    return sloth.wrap(sloth.iterArray(array));
                },

                /*
                 * `foldl` is an implementation of the left-fold operation,
                 * also known as a left-reduce or inject.
                 *
                 * This is a strict, non-composable operation.
                 */
                foldl: function(f, acc) {
                    if(Array.prototype.reduce) {
                        // We can delegate to the native
                        // Array.prototype.reduce, if it's supported.
                        var array = sloth.wrap(iter).force();
                        return arguments.length == 1 ?
                               Array.prototype.reduce.call(array, f) :
                               Array.prototype.reduce.call(array, f, acc);
                    }

                    if(arguments.length == 1) acc = iter();

                    sloth.wrap(iter).each(function(x) {
                        acc = f(acc, x);
                    });
                    return acc;
                },

                /*
                 * `foldr` is an implementation of the right-fold operation,
                 * the reverse analog of `foldl` operation.
                 *
                 * This is a strict, non-composable operation.
                 */
                foldr: function(f, acc) {
                    // We can delegate to the native
                    // Array.prototype.reduceRight, if it's supported.
                    if(Array.prototype.reduceRight) {
                        var array = sloth.wrap(iter).force();
                        return arguments.length == 1 ?
                               Array.prototype.reduceRight.call(array, f) :
                               Array.prototype.reduceRight.call(array, f, acc);
                    }

                    var reverseIter = sloth.wrap(iter).reverse().next;

                    if(arguments.length == 1) acc = reverseIter();

                    sloth.wrap(reverseIter).each(function(x) {
                        acc = f(acc, x);
                    });
                    return acc;
                },

                /*
                 * `all` checks if all values in the sequence are truthy or
                 * fulfill the predicate (universal quantification).
                 *
                 * This is a partially strict non-composable operation.
                 */
                all: function(f) {
                    if(typeof f === "undefined") f = sloth.id;

                    for(;;) {
                        try {
                            var value = iter();
                        } catch(e) {
                            if(e === sloth.StopIteration) break;
                            throw e;
                        }
                        if(!f(value)) return false;
                    }
                    return true;
                },

                /*
                 * `any` checks if any values in the sequence are truthy or
                 * fulfill the predicate (existential quantification).
                 *
                 * This is a partially strict non-composable operation.
                 */
                any: function(f) {
                    if(typeof f === "undefined") f = sloth.id;

                    for(;;) {
                        try {
                            var value = iter();
                        } catch(e) {
                            if(e === sloth.StopIteration) break;
                            throw e;
                        }
                        if(f(value)) return true;
                    }
                    return false;
                },

                /*
                 * `max` returns the maximum value of the sequence using a
                 * given comparison function.
                 *
                 * This is a strict, non-composable operation.
                 */
                max: function(f) {
                    if(typeof f === "undefined") f = sloth.cmp;

                    return sloth.wrap(iter).foldl(function(acc, x) {
                        return f(acc, x) > 0 ? acc : x;
                    });
                },

                /*
                 * `max` returns the maximum value of the sequence using a
                 * given comparison function.
                 *
                 * This is a strict, non-composable operation.
                 */
                min: function(f) {
                    if(typeof f === "undefined") f = sloth.cmp;

                    return sloth.wrap(iter).foldl(function(acc, x) {
                        return f(acc, x) < 0 ? acc : x;
                    });
                },

                /*
                 * `take` yields a sequence with only the first _n_ elements of
                 * the original sequence.
                 *
                 * This is a lazy, composable operation.
                 */
                take: function(n) {
                    return sloth.wrap(function() {
                        if(n == 0) throw sloth.StopIteration;
                        n--;
                        return iter();
                    });
                },

                /*
                 * `skip` yields a sequence without the first _n_ elements of
                 * the original sequence.
                 *
                 * This is a lazy, composable operation.
                 */
                skip: function(n) {
                    return sloth.wrap(function() {
                        while(n) {
                            iter();
                            n--;
                        }
                        return iter();
                    });
                },

                /*
                 * `takeWhile` yields a sequence with only the first
                 * contiguous sequence of elements that fulfill the predicate.
                 *
                 * This is a lazy, composable operation.
                 */
                takeWhile: function(f) {
                    var ended = false;

                    return sloth.wrap(function() {
                        var value = iter();
                        ended = !f(value);
                        if(ended) throw sloth.StopIteration;
                        return value;
                    });
                },

                /*
                 * `skipWhile` yields a sequence without the first
                 * contiguous sequence of elements that fulfill the predicate.
                 *
                 * This is a lazy, composable operation.
                 */
                skipWhile: function(f) {
                    var value;
                    while(f(value = iter()));

                    var firstTaken = false;

                    return sloth.wrap(function() {
                        if(firstTaken) return iter();
                        firstTaken = true;
                        return value;
                    });
                },

                /*
                 * `concat` joins two sequences to each other, end-to-end. Note
                 * that the `ys` parameter must be an actual iterator and not a
                 * `sloth.wrap`ped iterator (this can be taken from any
                 * `sloth.wrap`ped iterator with `wrapped.next`).
                 *
                 * This is as lazy, composable operation.
                 */
                concat: function(ys) {
                    var xsEnd = false;

                    return sloth.wrap(function() {
                        if(xsEnd) return ys();
                        try {
                            return iter();
                        } catch(e) {
                            if(e === sloth.StopIteration) {
                                xsEnd = true;
                                return ys();
                            }
                            throw e;
                        }
                    });
                },

                /*
                 * `next` holds the raw iterator function.
                 */
                next: iter
            }
        }
    };

    module.exports = sloth;
})();
