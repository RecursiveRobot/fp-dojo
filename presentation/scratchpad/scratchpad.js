// Uncurried..
function add(a, b) {
    return a + b;
}

var c = add(1, 2);
// 3


// Curried...
function addCurried(a, b) {
    return function(b) {
        return a + b;
    }
}

var d = addCurried(1)(2);
// 3

var add5 = addCurried(5);
// add5 :: int -> int
var e = add5(2);
// 7

// Ramda
var R = require('ramda');

function addition(a, b, c, d, e){
  return a + b + c + d + e;
}

var curriedAddition = R.curry(addition);

var f = curriedAddition(1)(2)(5)(3)(4);
// 15