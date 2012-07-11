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

![Chrome 20.0.1132.43 on Linux x86_64](http://chart.apis.google.com/chart?chtt=sloth.js%20Test%20Suite%7COps/sec%20%28Chrome%2020.0.1132.43%20on%20Linux%20x86_64%29&chts=000000,10&cht=bhg&chd=t:17359,18862,19144,17389,19472,10060,301,96,98,24,77,25,2759,5230,15218,10334,6353,9904&chds=0,19472&chxt=x&chxl=0:|0|19.5K&chsp=0,1&chm=tunderscore.each%28%29%2817.4K%29,000000,0,0,10|tsloth.ify%28%29.each%28%29%2818.9K%29,000000,0,1,10|tunderscore.reduce%28%29%2819.1K%29,000000,0,2,10|tsloth.ify%28%29.foldl%28%29%2817.4K%29,000000,0,3,10|tunderscore.reduceRight%28%29%2819.5K%29,000000,0,4,10|tsloth.ify%28%29.foldr%28%29%2810.1K%29,000000,0,5,10|tunderscore.uniq%28%29%28301%29,000000,0,6,10|tsloth.ify%28%29.nub%28%29%2896%29,000000,0,7,10|tunderscore.intersection%28%29%2898%29,000000,0,8,10|tsloth.ify%28%29.intersect%28%29%2824%29,000000,0,9,10|tunderscore.union%28%29%2877%29,000000,0,10,10|tsloth.ify%28%29.union%28%29%2825%29,000000,0,11,10|tunderscore.zip%28%29%282.8K%29,000000,0,12,10|tsloth.ify%28%29.zip%28%29%285.2K%29,000000,0,13,10|tunderscore.map%28%29.max%28%29%2815.2K%29,000000,0,14,10|tsloth.ify%28%29.map%28%29.max%28%29%2810.3K%29,000000,0,15,10|tunderscore.map%28%29.filter%28%29.reduce%28%29%286.4K%29,000000,0,16,10|tsloth.ify%28%29.map%28%29.filter%28%29.foldl%28%29%289.9K%29,000000,0,17,10&chbh=15,0,5&chs=250x430)
![Firefox 13.0.1 on Linux x86_64](http://chart.apis.google.com/chart?chtt=sloth.js%20Test%20Suite%7COps/sec%20%28Firefox%2013.0.1%20on%20Linux%20x86_64%29&chts=000000,10&cht=bhg&chd=t:5947,5858,6306,10668,6353,6169,163,73,53,18,42,18,739,3804,4785,6615,1880,6259&chds=0,10668&chxt=x&chxl=0:|0|10.7K&chsp=0,1&chm=tunderscore.each%28%29%285.9K%29,000000,0,0,10|tsloth.ify%28%29.each%28%29%285.9K%29,000000,0,1,10|tunderscore.reduce%28%29%286.3K%29,000000,0,2,10|tsloth.ify%28%29.foldl%28%29%2810.7K%29,000000,0,3,10|tunderscore.reduceRight%28%29%286.4K%29,000000,0,4,10|tsloth.ify%28%29.foldr%28%29%286.2K%29,000000,0,5,10|tunderscore.uniq%28%29%28163%29,000000,0,6,10|tsloth.ify%28%29.nub%28%29%2873%29,000000,0,7,10|tunderscore.intersection%28%29%2853%29,000000,0,8,10|tsloth.ify%28%29.intersect%28%29%2818%29,000000,0,9,10|tunderscore.union%28%29%2842%29,000000,0,10,10|tsloth.ify%28%29.union%28%29%2818%29,000000,0,11,10|tunderscore.zip%28%29%28739%29,000000,0,12,10|tsloth.ify%28%29.zip%28%29%283.8K%29,000000,0,13,10|tunderscore.map%28%29.max%28%29%284.8K%29,000000,0,14,10|tsloth.ify%28%29.map%28%29.max%28%29%286.6K%29,000000,0,15,10|tunderscore.map%28%29.filter%28%29.reduce%28%29%281.9K%29,000000,0,16,10|tsloth.ify%28%29.map%28%29.filter%28%29.foldl%28%29%286.3K%29,000000,0,17,10&chbh=15,0,5&chs=250x430)
![Opera 9.80 on Linux x86_64](http://chart.apis.google.com/chart?chtt=sloth.js%20Test%20Suite%7COps/sec%20%28Opera%209.80%20on%20Linux%20x86_64%29&chts=000000,10&cht=bhg&chd=t:6366,2407,5751,2541,5637,1427,84,73,28,18,21,18,723,1994,4641,2170,1819,2687&chds=0,6366&chxt=x&chxl=0:|0|6.4K&chsp=0,1&chm=tunderscore.each%28%29%286.4K%29,000000,0,0,10|tsloth.ify%28%29.each%28%29%282.4K%29,000000,0,1,10|tunderscore.reduce%28%29%285.8K%29,000000,0,2,10|tsloth.ify%28%29.foldl%28%29%282.5K%29,000000,0,3,10|tunderscore.reduceRight%28%29%285.6K%29,000000,0,4,10|tsloth.ify%28%29.foldr%28%29%281.4K%29,000000,0,5,10|tunderscore.uniq%28%29%2884%29,000000,0,6,10|tsloth.ify%28%29.nub%28%29%2873%29,000000,0,7,10|tunderscore.intersection%28%29%2828%29,000000,0,8,10|tsloth.ify%28%29.intersect%28%29%2818%29,000000,0,9,10|tunderscore.union%28%29%2821%29,000000,0,10,10|tsloth.ify%28%29.union%28%29%2818%29,000000,0,11,10|tunderscore.zip%28%29%28723%29,000000,0,12,10|tsloth.ify%28%29.zip%28%29%282K%29,000000,0,13,10|tunderscore.map%28%29.max%28%29%284.6K%29,000000,0,14,10|tsloth.ify%28%29.map%28%29.max%28%29%282.2K%29,000000,0,15,10|tunderscore.map%28%29.filter%28%29.reduce%28%29%281.8K%29,000000,0,16,10|tsloth.ify%28%29.map%28%29.filter%28%29.foldl%28%29%282.7K%29,000000,0,17,10&chbh=15,0,5&chs=250x430)
![MSIE 8.0 on Windows NT](http://chart.apis.google.com/chart?chtt=sloth.js%20Test%20Suite%7COps/sec%20%28MSIE%208.0%20on%20Windows%20NT%29&chts=000000,10&cht=bhg&chd=t:467,483,380,489,367,266,1,3,0,1,0,1,60,144,373,270,130,263&chds=0,489&chxt=x&chxl=0:|0|489&chsp=0,1&chm=tunderscore.each%28%29%28467%29,000000,0,0,10|tsloth.ify%28%29.each%28%29%28483%29,000000,0,1,10|tunderscore.reduce%28%29%28380%29,000000,0,2,10|tsloth.ify%28%29.foldl%28%29%28489%29,000000,0,3,10|tunderscore.reduceRight%28%29%28367%29,000000,0,4,10|tsloth.ify%28%29.foldr%28%29%28266%29,000000,0,5,10|tunderscore.uniq%28%29%281%29,000000,0,6,10|tsloth.ify%28%29.nub%28%29%283%29,000000,0,7,10|tunderscore.intersection%28%29%280%29,000000,0,8,10|tsloth.ify%28%29.intersect%28%29%281%29,000000,0,9,10|tunderscore.union%28%29%280%29,000000,0,10,10|tsloth.ify%28%29.union%28%29%281%29,000000,0,11,10|tunderscore.zip%28%29%2860%29,000000,0,12,10|tsloth.ify%28%29.zip%28%29%28144%29,000000,0,13,10|tunderscore.map%28%29.max%28%29%28373%29,000000,0,14,10|tsloth.ify%28%29.map%28%29.max%28%29%28270%29,000000,0,15,10|tunderscore.map%28%29.filter%28%29.reduce%28%29%28130%29,000000,0,16,10|tsloth.ify%28%29.map%28%29.filter%28%29.foldl%28%29%28263%29,000000,0,17,10&chbh=15,0,5&chs=250x430)

