(function() {
    "use strict";

    /*
     * sloth.js is a JavaScript library for working with lazy iterators,
     * providing a way to create, compose and perform various other operations
     * on them.
     *
     * A lazy iterator in sloth.js is defined as a function (usually a closure)
     * which can be continually invoked to yield successive values of a
     * sequence, until the appropriate exception, `sloth.StopIteration`, is
     * thrown to indicate the end of the sequence.
     *
     * TODO: Implement `take(n)`, `skip(n)`, `takeWhile(f)`, `skipWhile(f)`,
     *       `max(f)`, `min(f)`; unit tests for `all(f)` and `any(f)`.
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
         * Create an iterator from an array.
         */
        iterArray: function(array) {
            var index = 0;

            return function() {
                if(index >= array.length) throw sloth.StopIteration;
                return array[index++];
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
                 * This is a lazy operation.
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
                 * This is a lazy operation.
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
                 * This is a strict operation.
                 */
                each: function(f) {
                    for(;;) {
                        try {
                            var value = iter();
                        } catch(e) {
                            if(e == sloth.StopIteration) break;
                            throw e;
                        }
                        f(value);
                    }
                },

                /*
                 * `unwrap` gets all the elements from the iterator and places
                 * them into an array.
                 *
                 * This is a strict operation.
                 */
                unwrap: function(f) {
                    var output = [];
                    sloth.wrap(iter).each(function(x) {
                        output.push(x);
                    });
                    return output;
                },


                /*
                 * `reverse` reverses the underlying iterator.
                 *
                 * This is a "lazy" operation that requires strict (i.e.
                 * non-infinite) iterator semantics.
                 */
                reverse: function() {
                    var array = sloth.wrap(iter).unwrap();
                    array.reverse();
                    return sloth.wrap(sloth.iterArray(array));
                },

                /*
                 * `foldl` is an implementation of the left-fold operation,
                 * also known as a left-reduce or inject.
                 *
                 * This is a strict operation.
                 */
                foldl: function(f, acc) {
                    if(typeof acc === 'undefined') acc = iter();
                    sloth.wrap(iter).each(function(x) {
                        acc = f(acc, x);
                    });
                    return acc;
                },

                /*
                 * `foldr` is an implementation of the right-fold operation,
                 * the reverse analog of `foldl` operation.
                 *
                 * This is a strict operation.
                 */
                foldr: function(f, acc) {
                    iter = sloth.wrap(iter).reverse().next;

                    if(typeof acc === 'undefined') acc = iter();
                    sloth.wrap(iter).each(function(x) {
                        acc = f(acc, x);
                    });
                    return acc;
                },

                /*
                 * `all` checks if all values in the sequence are truthy or
                 * fulfill the predicate (universal quantification).
                 *
                 * This is a strict operation.
                 */
                all: function(f) {
                    if(typeof f === "undefined") f = sloth.id;

                    iter = sloth.wrap(iter).map(f).next;

                    for(;;) {
                        try {
                            var value = iter();
                        } catch(e) {
                            if(e == sloth.StopIteration) break;
                            throw e;
                        }
                        if(!value) return false;
                    }
                    return true;
                },

                /*
                 * `any` checks if any values in the sequence are truthy or
                 * fulfill the predicate (existential quantification).
                 *
                 * This is a strict operation.
                 */
                any: function(f) {
                    if(typeof f === "undefined") f = sloth.id;

                    iter = sloth.wrap(iter).map(f).next;

                    for(;;) {
                        try {
                            var value = iter();
                        } catch(e) {
                            if(e == sloth.StopIteration) break;
                            throw e;
                        }
                        if(value) return true;
                    }
                    return false;
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
