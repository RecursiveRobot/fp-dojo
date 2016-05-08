/* Special thanks to:
 *  - https://github.com/MostlyAdequate/
 *  - https://scotch.io/tutorials/building-a-slack-bot-with-node-js-and-chuck-norris-super-powers
 *
 * For example code and guidance, upon which this utility library is
 * based in the case of the bot utilities and borrowed in the case of
 * the IO monad.
 */

var _ = require ('ramda');

// a -> b -> Bool
var eq = _.curry (function (a, b) {
    return a === b;
});

// String -> String -> Bool
var eqIgnoreCase =  _.curry (function (a, b) {
    return typeof a == 'string'
        && typeof b == 'string'
        && a.toLowerCase () == b.toLowerCase ();
});

// [String] -> String -> Bool
var isOneOfIgnoreCase = _.curry (function (xs, y) {
    return _.any (eqIgnoreCase (y), xs);
});

// x -> x
var trace = _.curry (function (message, x) {
    console.log (message + ", var = '" + x + "' with type: " + typeof x);
    return x;
});

module.exports = {isOneOfIgnoreCase: isOneOfIgnoreCase,
                  trace: trace};
