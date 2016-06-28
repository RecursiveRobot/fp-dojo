require('../../support');
var _ = require('ramda');

console.log('add', map(add(2)));


// Exercise 1
//==============

var words = split(' ');

// Exercise 1a
//==============

var sentences = map(words);


// Exercise 2
//==============

var filterQs = filter(match(/q/i));


// Exercise 3
//==============
// Use the helper function _keepHighest to refactor max

var _keepHighest = function(x,y){ return x >= y ? x : y; }; // <- leave be

var max = reduce(_keepHighest, -Infinity);

// Exercise 4
// ==========

/* [String] -> String
 *
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
        return "Hello, anyone there?";
    } else if (userNames.length >= 5) {
        return "Hello everyone!";
    } else if (userNames.length == 1) {
        return "Hello " + _.head (userNames) + "!";
    } else {
        return "Hello "
            + _.join (", ") (_.slice (0, userNames.length - 1, userNames))
            + " and " +_.last (userNames) + "!";
    }
}

// Exercise 5
// ==========

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
var splitOutPunctuation = regexReplace (MATCH_PUNCTUATION, " $1 ");

/* String -> String
 * Produce a new string from the given string with non alpha
 * numeric/puncation characters present.
 */
var filterNonAcceptedCharacters = regexReplace (MATCH_NON_ACCEPTED_CHARACTER, '');

/* String -> String
 * Produce a new string from the given string in which there are no
 * successive white spaces.
 */
var collapseSuccessiveWhitespaces = regexReplace (MATCH_WHITESPACE, " ");

/* String -> [String]
 *
 * Rules:
 *  - Tokens are separated by spaces except in the case of punctuation.
 *  - Only alpha characters and punctuation is allowed in the token
 *    list.
 *  - Repeated spaces should be collapsed so that tokens separated by
 *    repeated spaces only create a single token.
 *
 */
var tokenise = _.compose (_.filter (_.compose (_.not, _.equals (""))),
                          _.split (' '),
                          collapseSuccessiveWhitespaces,
                          splitOutPunctuation,
                          filterNonAcceptedCharacters);

// Bonus 1:
// ============
// wrap array's slice to be functional and curried.
// //[1,2,3].slice(0, 2)
var slice = _.curry(function(start, end, xs){ return xs.slice(start, end); });


// Bonus 2:
// ============
// use slice to define a function "take" that takes n elements. make it curried
var take = slice(0);


module.exports = { words: words,
                   sentences: sentences,
                   filterQs: filterQs,
                   max: max,
                   slice: slice,
                   splitOutPunctuation: splitOutPunctuation,
                   filterNonAcceptedCharacters: filterNonAcceptedCharacters,
                   collapseSuccessiveWhitespaces: collapseSuccessiveWhitespaces,
                   tokenise: tokenise,
                   initialGreeting, initialGreeting,
                   take: take };
