(function() {
    var numbers = [];
    for(var i = 0; i < 1000; i++) {
        numbers.push(i);
    }

    var randoms = []; var RANDOM_MAX = 500;
    for(var i = 0; i < 1000; i++) {
        randoms.push(Math.floor(Math.random() * i * RANDOM_MAX));
    }

    var randoms2 = []; var RANDOM_MAX = 500;
    for(var i = 0; i < 1000; i++) {
        randoms2.push(Math.floor(Math.random() * i * RANDOM_MAX));
    }

    JSLitmus.test('underscore.each()', function() {
        var output = [];
        _.each(numbers, function(x) {
            output.push(x + 2);
        });
        return output;
    });

    JSLitmus.test('sloth.ify().each()', function() {
        var output = [];
        sloth.ify(numbers).each(function(x) {
            output.push(x + 2);
        });
        return output;
    });

    JSLitmus.test('underscore.reduce()', function() {
        return _.reduce(numbers, function(acc, x) {
            return acc + x;
        }, 10);
    });

    JSLitmus.test('sloth.ify().foldl()', function() {
        return sloth.ify(numbers)
            .foldl(function(acc, x) {
                return acc + x;
            }, 10);
    });

    JSLitmus.test('underscore.reduceRight()', function() {
        return _.reduceRight(numbers, function(acc, x) {
            return acc + x;
        }, 10);
    });

    JSLitmus.test('sloth.ify().foldr()', function() {
        return sloth.ify(numbers)
            .foldr(function(acc, x) {
                return acc + x;
            }, 10);
    });

    JSLitmus.test('underscore.uniq()', function() {
        return _.uniq(randoms);
    });

    JSLitmus.test('sloth.ify().nub()', function() {
        return sloth.ify(randoms)
            .nub()
            .force();
    });

    JSLitmus.test('underscore.intersection()', function() {
        return _.intersection(randoms, randoms2);
    });

    JSLitmus.test('sloth.ify().intersect()', function() {
        return sloth.ify(randoms)
            .intersect(sloth.ify(randoms2).next)
            .force();
    });

    JSLitmus.test('underscore.union()', function() {
        return _.union(randoms, randoms2);
    });

    JSLitmus.test('sloth.ify().union()', function() {
        return sloth.ify(randoms)
            .union(sloth.ify(randoms2).next)
            .force();
    });

    JSLitmus.test('underscore.zip()', function() {
        return _.zip(randoms, randoms2);
    });

    JSLitmus.test('sloth.ify().zip()', function() {
        return sloth.ify(randoms)
            .zip(sloth.ify(randoms2).next)
            .force();
    });

    JSLitmus.test('underscore.map().max()', function() {
        return _.max(_.map(randoms, function(x) { return x + 1; }));
    });

    JSLitmus.test('sloth.ify().map().max()', function() {
        return sloth.ify(randoms)
            .map(function(x) { return x + 1; })
            .max();
    });

    JSLitmus.test('underscore.map().filter().reduce()', function() {
        return _.reduce(_.filter(_.map(numbers, function(x) {
            return x + 1;
        }), function(x) {
            return x > 200;
        }), function(acc, x) {
            return acc + x;
        }, 10);
    });

    JSLitmus.test('sloth.ify().map().filter().foldl()', function() {
        return sloth.ify(numbers)
            .map(function(x) {
                return x + 1;
            })
            .filter(function(x) {
                return x > 200;
            })
            .foldl(function(acc, x) {
                return acc + x;
            });
    });
})();

