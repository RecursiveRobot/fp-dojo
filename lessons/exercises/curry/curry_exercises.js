require('../../support');
var _ = require('ramda');

// Note: we've provided some starting points to make things easier.
// Replace the 'undefined' with code to implement the function.

// Exercise 1
//==============
// Refactor to remove all arguments by partially applying the function
// i.e. never use the keyword 'function'
// Note that the function _.split and many others in this exercise,
// are curried.

var words = function(str) {
    return _.split(' ', str);
}; // Starting point: var words = _.split (undefined)

// Exercise 1a
//==============
// Use map to make a new words fn that works on an array of strings.

var sentences = undefined;

// Starting point: var sentences = _.map (undefined)

// Exercise 2
//==============
// Refactor to remove all arguments by partially applying the functions

var filterQs = function(xs) {
    return filter(function(x){ return match(/q/i, x);  }, xs);
};

// Starting point: var filterQs = undefined (undefined (undefined))

// Exercise 3
//==============
// Use the helper function _keepHighest to refactor max to not reference any arguments

// LEAVE BE:
var _keepHighest = function(x,y){ return x >= y ? x : y; };

// REFACTOR THIS ONE:
var max = function(xs) {
    return reduce(function(acc, x){
        return _keepHighest(acc, x);
    }, 0, xs);
};

// Exercise 4
// ==========
// Implement a simple function to greet users

/* [String] -> String
 *
 * Part one: greet all the users in one message.
 * e.g. 1
 *  - userNames = ['Bob', 'Fred']
 *  - returns "Hello Bob and Fred!"
 * e.g. 2
 *  - userNames = ['Bob', 'Fred', 'Alice']
 *  - returns "Hello Bob, Fred and Alice!"
 * e.g. 3
 *  - userNames = []
 *  - returns "Hello, anyone there?"
 * e.g. 4
 *  - userNames = ['Bob', 'Fred', 'Alice', 'Frank', 'Mary']
 *  - returns "Hello everyone!"
 *  - Note: Any number of users >= 5 produces the same result
 */
function initialGreeting (userNames) {
    if (userNames.length == 0) {
        return undefined;
    } else if (userNames.length >= 5) {
        return undefined;
    } else if (userNames.length == 1) {
        return undefined;
    } else {
        return "Hello "
            + _.join (", ") (undefined)
            + " and " + undefined + "!";
    }
}

// Exercise 5
// ==========
// Implement a tokeniser function for English

// Some useful regular expressions:
var MATCH_WHITESPACE             = /[\t ]+/g;
var MATCH_PUNCTUATION            = /([.!?])/g;
var MATCH_NON_ACCEPTED_CHARACTER = /[^a-zA-Z.!? ]/g;

/* RegEx -> String -> String -> String -> String
 * Replace the given regular expressing with the given replacement
 * string in the given string.
 */
var regexReplace = _.curry (function (pattern, replaceWith, x) {
    return x.replace (pattern, replaceWith);
});

/* String -> String
 * Produce a new string from the given string in which the punctuation
 * will always be surrounded by whitespace.
 */
var splitOutPunctuation = function (toSplit) {
    return undefined;
};

/* String -> String
 * Produce a new string from the given string with non alpha
 * numeric/puncation characters present.
 */
var filterNonAcceptedCharacters = regexReplace (MATCH_NON_ACCEPTED_CHARACTER, '');

/* String -> String
 * Produce a new string from the given string in which there are no
 * successive white spaces.
 */
var collapseSuccessiveWhitespaces = function (toFilter) {
    return undefined;
};

/* String -> [String]
 *
 * Rules:
 *  - Tokens are separated by spaces except in the case of punctuation.
 *  - Only alpha characters and punctuation is allowed in the token
 *    list.
 *  - Repeated spaces should be collapsed so that tokens separated by
 *    repeated spaces only create a single token.
 *
 * Part Three: implement tokenize
 */
var tokenise = _.compose (_.filter (_.compose (_.not, _.equals (""))),
                          _.split (' '),
                          collapseSuccessiveWhitespaces);
//                        undefined, <- uncomment and implement
//                        undefined);

// Bonus 1:
// ============
// wrap array's slice to be functional and curried.
// [1,2,3].slice(0, 2)
var slice = undefined;


// Bonus 2:
// ============
// use slice to define a function "take" that takes n elements. Make it curried
var take = undefined;


module.exports = { words: words,
                   sentences: sentences,
                   filterQs: filterQs,
                   max: max,
                   slice: slice,
                   splitOutPunctuation: splitOutPunctuation,
                   filterNonAcceptedCharacters: filterNonAcceptedCharacters,
                   collapseSuccessiveWhitespaces: collapseSuccessiveWhitespaces,
                   tokenise: tokenise,
                   initialGreeting: initialGreeting,
                   take: take };
