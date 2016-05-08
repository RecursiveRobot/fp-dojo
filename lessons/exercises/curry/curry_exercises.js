require('../../support');
var _ = require('ramda');

// Note: we've provided some starting points to make things easier.
// Replace the question marks with code to implement the function.

// Exercise 1
//==============
// Refactor to remove all arguments by partially applying the function
// i.e. never use the keyword 'function'
// Note that the function _.split and many others in this exercise,
// are curried.

var words = function(str) {
    return _.split(' ', str);
}; // Starting point: var words = _.split (???)

// Exercise 1a
//==============
// Use map to make a new words fn that works on an array of strings.

var sentences = undefined;

// Starting point: var sentences = _.map (???)

// Exercise 2
//==============
// Refactor to remove all arguments by partially applying the functions

var filterQs = function(xs) {
    return filter(function(x){ return match(/q/i, x);  }, xs);
};

// Starting point: var filterQs = ??? (??? (???))

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

  
// Bonus 1:
// ============
// wrap array's slice to be functional and curried.
// //[1,2,3].slice(0, 2)
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
                   take: take
                 };
