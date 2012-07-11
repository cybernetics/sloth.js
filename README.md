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

## Example

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

## Performance

Despite its name, `sloth.js` isn't (usually) that slow! On most common
browsers, it performs on par with Underscore.js for most functions.

Below are some of the benchmarks on a variety of browsers.

![Chrome 20.0.1132.43 on Linux x86_64](http://chart.apis.google.com/chart?chtt=sloth.js%20Test%20Suite%7COps/sec%20%28Chrome%2020.0.1132.43%20on%20Linux%20x86_64%29&chts=000000,10&cht=bhg&chd=t:16957,19435,18521,16493,18322,9866,339,98,99,25,77,24,2515,5230,86041,21010,6110,9735&chds=0,86041&chxt=x&chxl=0:|0|86K&chsp=0,1&chm=tunderscore.each%28%29%2817K%29,000000,0,0,10|tsloth.ify%28%29.each%28%29%2819.4K%29,000000,0,1,10|tunderscore.reduce%28%29%2818.5K%29,000000,0,2,10|tsloth.ify%28%29.foldl%28%29%2816.5K%29,000000,0,3,10|tunderscore.reduceRight%28%29%2818.3K%29,000000,0,4,10|tsloth.ify%28%29.foldr%28%29%289.9K%29,000000,0,5,10|tunderscore.uniq%28%29%28339%29,000000,0,6,10|tsloth.ify%28%29.nub%28%29%2898%29,000000,0,7,10|tunderscore.intersection%28%29%2899%29,000000,0,8,10|tsloth.ify%28%29.intersect%28%29%2825%29,000000,0,9,10|tunderscore.union%28%29%2877%29,000000,0,10,10|tsloth.ify%28%29.union%28%29%2824%29,000000,0,11,10|tunderscore.zip%28%29%282.5K%29,000000,0,12,10|tsloth.ify%28%29.zip%28%29%285.2K%29,000000,0,13,10|tunderscore.max%28%29%2886K%29,000000,0,14,10|tsloth.ify%28%29.max%28%29%2821K%29,000000,0,15,10|tunderscore.map%28%29.filter%28%29.reduce%28%29%286.1K%29,000000,0,16,10|tsloth.ify%28%29.map%28%29.filter%28%29.foldl%28%29%289.7K%29,000000,0,17,10&chbh=15,0,5&chs=250x430)

![Firefox 13.0.1 on Linux x86_64](http://chart.apis.google.com/chart?chtt=sloth.js%20Test%20Suite|Ops/sec%20%28Firefox%2013.0.1%20on%20Linux%20x86_64%29&chts=000000,10&cht=bhg&chd=t:5947,6237,6416,10525,6441,5879,164,73,54,19,41,18,801,4044,122565,12947,1905,6252&chds=0,122565&chxt=x&chxl=0:|0|122.6K&chsp=0,1&chm=tunderscore.each%28%29%285.9K%29,000000,0,0,10|tsloth.ify%28%29.each%28%29%286.2K%29,000000,0,1,10|tunderscore.reduce%28%29%286.4K%29,000000,0,2,10|tsloth.ify%28%29.foldl%28%29%2810.5K%29,000000,0,3,10|tunderscore.reduceRight%28%29%286.4K%29,000000,0,4,10|tsloth.ify%28%29.foldr%28%29%285.9K%29,000000,0,5,10|tunderscore.uniq%28%29%28164%29,000000,0,6,10|tsloth.ify%28%29.nub%28%29%2873%29,000000,0,7,10|tunderscore.intersection%28%29%2854%29,000000,0,8,10|tsloth.ify%28%29.intersect%28%29%2819%29,000000,0,9,10|tunderscore.union%28%29%2841%29,000000,0,10,10|tsloth.ify%28%29.union%28%29%2818%29,000000,0,11,10|tunderscore.zip%28%29%28801%29,000000,0,12,10|tsloth.ify%28%29.zip%28%29%284K%29,000000,0,13,10|tunderscore.max%28%29%28122.6K%29,000000,0,14,10|tsloth.ify%28%29.max%28%29%2812.9K%29,000000,0,15,10|tunderscore.map%28%29.filter%28%29.reduce%28%29%281.9K%29,000000,0,16,10|tsloth.ify%28%29.map%28%29.filter%28%29.foldl%28%29%286.3K%29,000000,0,17,10&chbh=15,0,5&chs=250x430)

![Opera 9.80 on Linux x86_64](http://chart.apis.google.com/chart?chtt=sloth.js%20Test%20Suite%7COps/sec%20%28Opera%209.80%20on%20Linux%20x86_64%29&chts=000000,10&cht=bhg&chd=t:6488,2363,5644,2416,5663,1419,84,72,28,19,21,18,722,2069,55028,3309,1850,2619&chds=0,55028&chxt=x&chxl=0:|0|55K&chsp=0,1&chm=tunderscore.each%28%29%286.5K%29,000000,0,0,10|tsloth.ify%28%29.each%28%29%282.4K%29,000000,0,1,10|tunderscore.reduce%28%29%285.6K%29,000000,0,2,10|tsloth.ify%28%29.foldl%28%29%282.4K%29,000000,0,3,10|tunderscore.reduceRight%28%29%285.7K%29,000000,0,4,10|tsloth.ify%28%29.foldr%28%29%281.4K%29,000000,0,5,10|tunderscore.uniq%28%29%2884%29,000000,0,6,10|tsloth.ify%28%29.nub%28%29%2872%29,000000,0,7,10|tunderscore.intersection%28%29%2828%29,000000,0,8,10|tsloth.ify%28%29.intersect%28%29%2819%29,000000,0,9,10|tunderscore.union%28%29%2821%29,000000,0,10,10|tsloth.ify%28%29.union%28%29%2818%29,000000,0,11,10|tunderscore.zip%28%29%28722%29,000000,0,12,10|tsloth.ify%28%29.zip%28%29%282.1K%29,000000,0,13,10|tunderscore.max%28%29%2855K%29,000000,0,14,10|tsloth.ify%28%29.max%28%29%283.3K%29,000000,0,15,10|tunderscore.map%28%29.filter%28%29.reduce%28%29%281.9K%29,000000,0,16,10|tsloth.ify%28%29.map%28%29.filter%28%29.foldl%28%29%282.6K%29,000000,0,17,10&chbh=15,0,5&chs=250x430)

![MSIE 8.0 on Windows NT](http://chart.apis.google.com/chart?chtt=sloth.js%20Test%20Suite%7COps/sec%20%28MSIE%208.0%20on%20Windows%20NT%29&chts=000000,10&cht=bhg&chd=t:426,482,353,477,338,259,1,2,0,1,0,1,55,143,23081,595,133,267&chds=0,23081&chxt=x&chxl=0:|0|23.1K&chsp=0,1&chm=tunderscore.each%28%29%28426%29,000000,0,0,10|tsloth.ify%28%29.each%28%29%28482%29,000000,0,1,10|tunderscore.reduce%28%29%28353%29,000000,0,2,10|tsloth.ify%28%29.foldl%28%29%28477%29,000000,0,3,10|tunderscore.reduceRight%28%29%28338%29,000000,0,4,10|tsloth.ify%28%29.foldr%28%29%28259%29,000000,0,5,10|tunderscore.uniq%28%29%281%29,000000,0,6,10|tsloth.ify%28%29.nub%28%29%282%29,000000,0,7,10|tunderscore.intersection%28%29%280%29,000000,0,8,10|tsloth.ify%28%29.intersect%28%29%281%29,000000,0,9,10|tunderscore.union%28%29%280%29,000000,0,10,10|tsloth.ify%28%29.union%28%29%281%29,000000,0,11,10|tunderscore.zip%28%29%2855%29,000000,0,12,10|tsloth.ify%28%29.zip%28%29%28143%29,000000,0,13,10|tunderscore.max%28%29%2823.1K%29,000000,0,14,10|tsloth.ify%28%29.max%28%29%28595%29,000000,0,15,10|tunderscore.map%28%29.filter%28%29.reduce%28%29%28133%29,000000,0,16,10|tsloth.ify%28%29.map%28%29.filter%28%29.foldl%28%29%28267%29,000000,0,17,10&chbh=15,0,5&chs=250x430)

Some browsers perform better, others worse. Unfortunately, `max()` (and, by
extension, `min()`) really is that slow, due to the nature of the sequences in
`sloth.js`.

