<a href="https://github.com/rfw/sloth.js"><img style="position: fixed; top: 0; right: 0; border: 0;" src="https://s3.amazonaws.com/github/ribbons/forkme_right_darkblue_121621.png" alt="Fork me on GitHub"></a>

# sloth.js

![sloth.js](logo.png)

_The lazy JavaScript iterator library._

`sloth.js` is a JavaScript library for working with lazy iterators, providing a
way to create, compose and perform various other operations on them — forming a
composable algebra of operations on iterators.

`sloth.js` will be slower than conventional operations for short operations
(though sometimes outperforms native implementations for some inexplicable
reason), but where it shines is consuming large amounts of data along a
pipeline, e.g. combining `map`, `filter` and `foldl` operations. This is 
ecause it doesn't allocate any space before actual iteration.

Inspired by Python's `itertools` module, Haskell's lazy list facilities
and Jeremy Ashkenas's Underscore.js.

`sloth.js` is freely distributable under the terms of the MIT license.

## <span class="heading">sloth.ify</span> `sloth.ify(xs)`

`sloth.ify` a sequence `xs`, returning an object usable with `sloth.js`
operations. Slothification is an idempotent operation, meaning it can be used
on a slothified variable multiple times without any issue.

### Terminology

#### Lazy

Lazy operations are run as the sequence is iterated, rather than immediately
when the function is called.

#### Strict

Strict operations run as soon as the function is called, allocating space for
it immediately. You may wish to run some strict operations (e.g. `reverse` and
`sort`) after forcing, as their in-place native equivalents will be faster.

#### Composable

Composable operations can have successive operations invoked on them, e.g.
`map().map().filter().nub()`.

#### Non-composable

Non-composable operations are found at the end of a `sloth.ify`ed chain,
usually culminating in a result.

## Maps, filters and folds

### <span class="heading">map</span> `map(f)`

`map` applies a function `f` across all elements of a sequence.

This is a lazy, composable operation.

    > sloth.ify([1, 2, 3]).
    ... map(function(x) { return x + 1; }).force();
    [ 2, 3, 4 ]

### <span class="heading">filter</span> `filter(f)`

`filter` selects elements from a sequence that are `true` when the predicate
`f` is applied to them.

This is a lazy, composable operation.

    > sloth.ify([1, 2, 3]).
    ... filter(function(x) { return x > 2; }).force();
    [ 3 ]

### <span class="heading">foldl</span> `foldl(f, acc=this.next())`

`foldl` is an implementation of the left-fold operation, also known as a
left-reduce or inject.

This is a strict, non-composable operation.

    > sloth.ify([1, 2, 3]).
    ... foldl(function(acc, x) { return acc + x; }, 1);
    [ 7 ]

### <span class="heading">foldr</span> `foldr(f, acc=this.next())`

`foldr` is an implementation of the right-fold operation, the reverse analog of
the `foldl` operation.

This operation may be slow due the fact the entire list must first be reversed.

This is a strict, non-composable operation.

    > sloth.ify([1, 2, 3]).
    ... foldr(function(x, acc) { return acc + x; }, 1);
    [ 7 ]

## Quantification

### <span class="heading">all</span> `all(f=`[`sloth.id`](#id)`)`

`all` checks if all values in the sequence are truthy or fulfill the predicate
`f` (universal quantification).

This is a partially strict non-composable operation.

    > sloth.ify([true, true, false]).all()
    false

### <span class="heading">any</span> `any(f=`[`sloth.id`](#id)`)`

`any` checks if any values in the sequence are truthy or fulfill the predicate
`f` (existential quantification).

This is a partially strict non-composable operation.

    > sloth.ify([true, true, false]).any()
    true

## Maxima and minima

### <span class="heading">max</span> `max(f=`[`sloth.cmp`](#cmp)`)`

`max` returns the maximum value of the sequence using the comparison function
`f`.

If you're looking for the maximum of an array, it is much more efficient to use
`Math.max.apply(Math, array)` (up to 40x(!!) faster).

This is a strict, non-composable operation.

    > sloth.ify([3, 4, 1]).max()
    4

### <span class="heading">min</span> `min(f=`[`sloth.cmp`](#cmp)`)`

`min` returns the minimum value of the sequence using the comparison function
`f`.

If you're looking for the minimum of an array, it is much more efficient to use
`Math.min.apply(Math, array)` (up to 40x(!!) faster).

This is a strict, non-composable operation.

    > sloth.ify([3, 4, 1]).min()
    1

## Taking and dropping

### <span class="heading">take</span> `take(n)`

`take` yields a sequence with only the first `n` elements of the original
sequence.

This is a lazy, composable operation.

    > sloth.ify([1, 2, 3]).take(2).force();
    [ 1, 2 ]

### <span class="heading">drop</span> `drop(n)`

`drop` yields a sequence without the first `n` elements of the original
sequence.

This is a lazy, composable operation.

    > sloth.ify([1, 2, 3]).drop(2).force();
    [ 3 ]

### <span class="heading">takeWhile</span> `takeWhile(f)`

`takeWhile` yields a sequence with only the first contiguous sequence of
elements that fulfill the predicate `f`.

This is a lazy, composable operation.

    > sloth.ify([1, 2, 3, 1, 2, 3]).
    ... takeWhile(function(x) { return x < 3; }).force();
    [ 1, 2 ]

### <span class="heading">dropWhile</span> `dropWhile(f)`

`dropWhile` yields a sequence without the first contiguous sequence of elements
that fulfill the predicate `f`.

This is a lazy, composable operation.

    > sloth.ify([1, 2, 3, 1, 2, 3]).
    ... dropWhile(function(x) { return x < 3; }).force();
    [ 3, 1, 2, 3 ]

## Set operations

### <span class="heading">union</span> `union(ys, f=`[`sloth.eq`](#eq)`)`

`union` yields a sequence with only the unique elements from this sequence and
`ys`, using the given predicate `f` for equality.

This will drain the `ys` iterator.

This can be slow due to the use of `nub`.

This is a lazy, composable operation.

    > sloth.ify([1, 2, 3, 3]).union([3, 4, 4, 5]).force();
    [ 1, 2, 3, 4, 5 ]

### <span class="heading">intersect</span> `intersect(ys, f=`[`sloth.eq`](#eq)`)`

`intersect` yields a sequence with only the unique elements present in this
sequence and `ys`, using the given predicate `f` for equality.

This will drain the `ys` iterator.

Again, this can be slow due to the use of `nub`.

This is a semi-strict composable operation, as it requires the first iterator
to be non-infinite.

    > sloth.ify([1, 2, 3, 3]).intersect([3, 4, 4, 5]).force();
    [ 3 ]

### <span class="heading">difference</span> `difference(ys, f=`[`sloth.eq`](#eq)`)`

`difference` yields a sequence with the elements of sequence `ys` removed from
this sequence, using the given predicate `f` for equality.

This will drain the `ys` iterator.

This does not return only unique elements, but the resulting sequence can be
`nub()`ed.

This is a semi-strict composable operation, as it requires the second iterator
to be non-infinite.

    > sloth.ify([1, 2, 3, 3]).difference([3, 4, 4, 5]).force();
    [ 1, 2 ]

### <span class="heading">symmetricDifference</span> `symmetricDifference(ys, f=`[`sloth.eq`](#eq)`)`

`symmetricDifference` yields a sequence of the elements present in neither this
sequence nor `ys`, using the given predicate `f` for equality.

This will drain the `ys` iterator.

This does not return only unique elements, but the resulting sequence can be
`nub()`ed.

This is a strict, composable operation.

    > sloth.ify([1, 2, 3, 3]).
    ... symmetricDifference([3, 4, 4, 5]).force();
    [ 1, 2, 4, 4, 5 ]

## Sequence utilities

### <span class="heading">each</span> `each(f)`

`each` acts as a for-each loop and iterates through all elements of the
sequence, applying the given function `f` to each. The current index is passed
as the second parameter to `f`.

[`sloth.StopIteration`](#StopIteration) can be thrown at any time to break out
of the loop.

This is a strict, non-composable operation.

    > sloth.ify([1, 2, 3, 3]).each(console.log);
    1 0
    2 1
    3 2
    3 3

### <span class="heading">concat</span> `concat(ys)`

`concat` joins this sequence with `ys`, end-to-end.

This will drain the `ys` iterator.

This is a lazy, composable operation.

    > sloth.ify([1, 2, 3]).concat([3, 4, 5]).force();
    [1, 2, 3, 3, 4, 5]

### <span class="heading">product</span> `product(ys, ...)`

`product` yields the Cartesian product of all the sequences passed in and this
sequence, equivalent to a series of nested loops.

This will completely drain all iterators.

This is a lazy, composable operation.

    > sloth.ify([1, 2]).product([3, 4]).force();
    [ [ 1, 3 ], [ 1, 4 ], [ 2, 3 ], [ 2, 4 ] ]

### <span class="heading">cycle</span> `cycle()`

`cycle` loops a list around itself infinitely.

This is a lazy, composable operation.

    > sloth.ify([1, 2]).cycle().take(6).force();
    [ 1, 2, 1, 2, 1, 2 ]

### <span class="heading">nub</span> `nub(f=`[`sloth.eq`](#eq)`)`

`nub` removes duplicate elements from the sequence using the given predicate
`f` for equality.

This is up to 10x slower than Underscore.js's `uniq`, but is more flexible in
its operation.

This is a lazy, composable operation.

    > sloth.ify([1, 2, 2, 3, 3]).nub().force();
    [ 1, 2, 3 ]

### <span class="heading">enumerate</span> `enumerate()`

`enumerate` takes each element and places it in an array with the index as the
first element.

This is a lazy, composable operaton.

    > sloth.ify([1, 2, 2, 3, 3]).enumerate().force();
    [ [ 0, 1 ], [ 1, 2 ], [ 2, 2 ], [ 3, 3 ], [ 4, 3 ] ]

### <span class="heading">reverse</span> `reverse()`

`reverse` yields the reverse iterator of this sequence.

This is a strict, composable operation.

    > sloth.ify([1, 2, 2, 3, 3]).reverse().force();
    [ 3, 3, 2, 2, 1 ]

### <span class="heading">sort</span> `sort(f=`[`sloth.cmp`](#cmp)`)`

`sort` sorts the sequence using the comparison function `f`.

This is a strict, composable operation.

    > sloth.ify([1, 4, 3, 5, 2]).sort().force();
    [ 1, 2, 3, 4, 5 ]

### <span class="heading">group</span> `group(f=`[`sloth.eq`](#eq)`)`

`group` groups the sequence into subsequences using the predicate function `f`.

This is a lazy, composable operation.

    > sloth.ify([1, 1, 2, 3, 4]).
    ... group().
    ... map(function(x) { return x.force() } ).force();
    [ [ 1, 1 ], [ 2 ], [ 3 ], [ 4 ] ]

### <span class="heading">tee</span> `tee(n=2)`

`tee` splits the sequence into `n` independent sequence iterators.

This may allocate a large amount of additional storage, and _will_ exhibit
unbounded growth on infinite sequences.

The original iterator should not be used.

This is a lazy, non-composable operation.

    > iters = sloth.ify([1, 2, 3, 4, 5]).tee();
    > iters[0].force();
    [ 1, 2, 3, 4, 5 ]
    > iters[1].force();
    [ 1, 2, 3, 4, 5 ]

### <span class="heading">zip</span> `zip(ys, ...)`

`zip` takes the sequences passed to it and yields a new sequence taking an
element from each element and placing it into an array. The length of the
resulting sequence is the length of the shortest sequence passed in.

This is somewhat more useful with JavaScript 1.7 destructuring assignment.

This is a lazy, composable operation.

    > sloth.ify([1, 2, 3]).zip([2, 3, 4], [3, 4, 5]).force();
    [ [ 1, 2, 3 ], [ 2, 3, 4 ], [ 3, 4, 5 ] ]

### <span class="heading">force</span> `force()`

`force` gets all the elements from the iterator and places them into an array.

This is a strict, non-composable operation.

    > sloth.ify([1, 2, 3]).force();
    [ 1, 2, 3 ]

## Advanced features
`__iterator__` implements the iterator protocol for
JavaScript 1.7.

## Additional slothifications

### <span class="heading">range</span> `range(b)` or `range(a=0, b=Infinity, step=1)`

Create a range. Comes in two variants:

* If only a single argument `a` is provided, an iterator for a range from 0 to
  `a - 1` by a step of 1.

* If all three arguments are specified, a range from `a` to `b - 1` is created
  by a step of `step`. If `b` is `null`, an infinite range is generated.

Note that the end of the range does not include `b` — this is influenced by
Python's `range` function.

### <span class="heading">repeat</span> `repeat(x, n=Infinity)`

Repeat an element `n` times.

## Iterators

A lazy iterator in `sloth.js` is defined as a function (usually a closure)
which can be repeatedly invoked to yield successive values of a sequence, until
the appropriate exception, [`sloth.StopIteration`](#StopIteration), is thrown
to indicate the end of the sequence.

### <span class="heading">iter</span> `iter(xs)`

`iter` creates an low-level iterator for various common data types.

### <span class="heading">iterArray</span> `iterArray(array)`

Create an iterator for an array. Note that this is the low-level iterator.

### <span class="heading">iterString</span> `iterString(string)`

Create an iterator for a string.  Note that this is the low-level iterator.

### <span class="heading">iterObject</span> `iterObject(string)`

Create an iterator for an object which yields pairs of keys and values. This
will immediately read in the object and generate a list of its keys and values
and, as such, won't reflect any future changes to the object.

### <span class="heading">iterNextable</span> `iterNextable(nextable)`

Create an iterator for an object with a .next() function (such as generators in
JavaScript 1.7).

## <span class="heading">StopIteration</span> `StopIteration`

`StopIteration` is an object which is thrown to indicate that the iterator has
no more data left to yield, i.e. an end-of-stream situation.

A common example of this reaching the end of an array in a traditional `for`
loop.

Some JavaScript engines (presently SpiderMonkey) support `StopIteration`
exceptions.

`StopIteration` instances must _not_ be instantiated --- it is a singleton
exception object which is designed to be thrown as is.

## Utility functions

### <span class="heading">id</span> `id(x)`

A function where, given a value, returns the value (á la Haskell).

### <span class="heading">cmp</span> `cmp(a, b)`

The default comparison function, combining both lexicographic and
numerical semantics.

### <span class="heading">eq</span> `eq(a, b)`

The default equality function, which returns the strict equality of
two values.

