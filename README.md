# `sloth.js`

          `""==,,__  
            `"==..__"=..__ _    _..-==""_
                 .-,`"=/ /\ \""/_)==""``
                ( (    | | | \/ |
                 \ '.  |  \;  \ /
                  |  \ |   |   ||
             ,-._.'  |_|   |   ||
            .\_/\     -'   ;   Y
           |  `  |        /    |-.
           '. __/_    _.-'     /'
       jgs        `'-.._____.-'

`sloth.js` is a lazy iterator library for JavaScript that simplifies operations
for querying JavaScript collections by supplying simple, composable functions
for them (á la Underscore.js).

It borrows heavily from functional programming concepts (especially Haskell)
and, with its lazy properties, `sloth.js` provides highly efficient composed
operations for collections via a simple iterator protocol.

## Examples

Assume we want to find the average price of all vegetables in the following
array:

    > var foods = [
        { name: "cucumber", type: "vegetable",  price: 2.40 },
        { name: "apple",    type: "fruit",      price: 1.00 },
        { name: "potato",   type: "vegetable",  price: 3.40 },
        { name: "chocolate",type: "delicious",  price: 5.00 },
    ];

    > var stats = sloth.ify(foods).
    ... filter(function(x) { return x.type === "vegetable"; }).
    ... map(function(x) { return x.price; }).
    ... foldl(function(acc, x) {
    ...     return {
    ...         total: acc.total + x,
    ...         count: acc.count + 1
    ...     };
    ... }, {
    ...    total: 0,
    ...    count: 0
    ... });

    > stats.total / stats.count
    2.9

And presto, done!

