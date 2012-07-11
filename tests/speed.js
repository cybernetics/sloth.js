(function() {
    var numbers = [];
    for(var i = 0; i < 1000; i++) {
        numbers.push(i);
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

    JSLitmus.test('underscore.map().filter()', function() {
        return _.filter(_.map(numbers, function(x) {
            return x + 1;
        }), function(x) {
            return x > 200;
        });
    });

    JSLitmus.test('sloth.ify().filter()', function() {
        return sloth.ify(numbers)
            .map(function(x) {
                return x + 1;
            })
            .filter(function(x) {
                return x > 200;
            })
            .force();
    });
})();

