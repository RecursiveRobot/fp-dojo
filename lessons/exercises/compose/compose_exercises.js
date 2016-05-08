require('../../support');
var _ = require('ramda');
var accounting = require('accounting');

// Note: we've provided some starting points to make things easier.
// Replace the question marks with code to implement the function.

// Example Data
var CARS = [
    {name: "Ferrari FF", horsepower: 660, dollar_value: 700000, in_stock: true},
    {name: "Spyker C12 Zagato", horsepower: 650, dollar_value: 648000, in_stock: false},
    {name: "Jaguar XKR-S", horsepower: 550, dollar_value: 132000, in_stock: false},
    {name: "Audi R8", horsepower: 525, dollar_value: 114200, in_stock: false},
    {name: "Aston Martin One-77", horsepower: 750, dollar_value: 1850000, in_stock: true},
    {name: "Pagani Huayra", horsepower: 700, dollar_value: 1300000, in_stock: false}
];

// Exercise 1:
// ============
// use _.compose() to rewrite the function below. Hint: _.prop() is curried.

// NOTE: _.prop is a function which takes the name of a property on an
// object and an object and returns the property of the object by that
// name.
// i.e. prop :: String -> Object -> a
var isLastInStock = function(cars) {
    var reversed_cars = _.last(cars);
    return _.prop('in_stock', reversed_cars);
};

// Starting point: var isLastInStock = _.compose (_.prop (???), ???)

// Exercise 2:
// ============
// use _.compose(), _.prop() and _.head() to retrieve the name of the first car
var nameOfFirstCar = undefined;

// Starting point: var nameOfFirstCar = _.compose (???, ???)

// Exercise 3:
// ============
// Use the helper function _average to refactor averageDollarValue as a composition
var _average = function(xs) { return reduce(add, 0, xs) / xs.length; }; // <- leave be

var averageDollarValue = function(cars) {
    var dollar_values = map(function(c) { return c.dollar_value; }, cars);
    return _average(dollar_values);
};

// Starting point: var averageDollarValue = _.compose (???, _.map (???))


// Exercise 4:
// ============
// Write a function: sanitizeNames() using compose that takes an array of cars and returns a list of lowercase and underscored names: e.g: sanitizeNames([{name: "Ferrari FF"}]) //=> ["ferrari_ff"].
//
// NOTE: Ramda includes a function called 'toLower' which might be
// helpful here.
//
// You can get to the ramda documentation here:
// http://ramdajs.com/0.20.1/docs (latest at time of writing this)

var _underscore = replace(/\W+/g, '_'); //<-- leave this alone and use to sanitize

var sanitizeNames = undefined;


// Bonus 1:
// ============
// Refactor availablePrices with compose.

var availablePrices = function(cars) {
    var available_cars = _.filter(_.prop('in_stock'), cars);
    return available_cars.map(function(x){
        return accounting.formatMoney(x.dollar_value);
    }).join(', ');
};


// Bonus 2:
// ============
// Refactor to pointfree. Hint: you can use _.flip()

var fastestCar = function(cars) {
    var sorted = _.sortBy(function(car){ return car.horsepower; }, cars);
    var fastest = _.last(sorted);
    return fastest.name + ' is the fastest';
};

module.exports = { CARS: CARS,
                   isLastInStock: isLastInStock,
                   nameOfFirstCar: nameOfFirstCar,
                   fastestCar: fastestCar,
                   averageDollarValue: averageDollarValue,
                   availablePrices: availablePrices,
                   sanitizeNames: sanitizeNames };
