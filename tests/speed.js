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

