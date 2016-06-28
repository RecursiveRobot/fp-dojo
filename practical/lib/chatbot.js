var _               = require ('ramda');
var Util            = require ('../lib/util');
var curry_exercises = require ('../../lessons/exercises/curry/curry_exercises.js');

/* NOTE:
 * The exercises appear out of order in this file.
 * To begin, search for the comment 'Part one'
 * To continue with the practical simply search for 'Part two' etc.
 */

/* NOTE: (as with the exercises)
 * We've provided some starting points to make things easier.
 * Replace the 'undefined' with code to implement the function.
 */

/* The chat bot we'll write will only understand bot-lang: a very
 * strict and highly simplified version of English. The core of
 * bot-lang is UnderstoodMessage.
 */

/* UnderstoodMessage is an array of ComplexObjects
 * (i.e. [ComplexObject]), defined as an object with two fields:
 * 'Type' and 'Values', where 'Values' is an array of 'SimpleObjects'.
 *
 * It's a total hack (which is not perfect by any measure) for
 * representing a natural language. And our language will be
 * interpreted with very strict rules.
 *
 * e.g.
 * [{'Type': 'Greeting', 'Values':
 *      [{'Type': 'Keyword', 'Value': 'Hi'},
 *       {'Type': 'Object', 'Value': 'Edward'},
 *       {'Type': 'Terminal', 'Value': '.'}]}..]
 *
 * The UnderstoodMessage above consists of a single ComplexObject
 * which as it's values has three SimpleObjects.
 *
 * The types which our tree can hold are listed as follows:
 */
// These objects are complex and therefore have 'Values'
var GREETING  = 'Greeting';
var STATEMENT = 'Statement';
var QUESTION  = 'Question';

// These objects are simple and therefore have a 'Value'
var KEYWORD  = 'Keyword';
var OBJECT   = 'Object';
var TERMINAL = 'Terminal';

/* (String, ComplexObject) -> String
 *
 * Part Eight: Implement respond using the appropriate evaluation
 * functions.
 */
var respond = _.curry (function (interpreter, reply, value) {
    if (value.Type == GREETING || value.Type == STATEMENT || value.Type == QUESTION){
        return reply + "\n" + interpreter (value);
    } else {
        return reply;
    }
});

/* (ComplexObject -> String) -> [ComplexObject] -> String
 *
 * Collect the results of evaluating each element of the
 * [ComplexObject] in a single string message to be sent back to the
 * user.
 */
var evaluate = _.curry (function (interpreter, xs) {
    return _.reduce (respond (interpreter), "", xs);
});

var tokenise = curry_exercises.tokenise;

/* A parser returns a parsed object of the following schema:
 * {
 *   'Remaining': [String],
 *   'Parsed':    ComplexObject
 * }
 *
 * If the parser didn't manage to parse anything then the 'Remaining'
 * should be the argument tokens and 'Parsed' should be undefined.
 *
 * If the parser did parse something then 'Parsed' should be an
 * [ComplexObject] and 'Remaining' should have tokens removed
 * corresponding to what was parsed.
 */
var TERMINAL_KEYWORDS = ['.', '!', '?'];
var QUESTION_START_KEYWORDS = ['How', 'Where', 'What', 'Why', 'Is'];

/* [String] -> {'Remaining': [String], 'Parsed': ComplexObject}
 *
 * Rule: A question is a series of tokens terminated by a terminator
 * and beginning with a question start keyword
 *
 * e.g. ['How', 'does', 'this', 'thing', 'work', '?']
 *       ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
 *                       Question
 *
 * This one is given :)
 */
var parseQuestion = parseTerminated (QUESTION, QUESTION_START_KEYWORDS);

var GREETING_START_KEYWORDS = ['Hi', 'Hello', 'Howzit', 'Hey'];

/* [String] -> {'Remaining': [String], 'Parsed': ComplexObject}
 *
 * Rule: A greeting starts with a greeting keyword and is followed by
 * an object and then a terminator.
 *
 * e.g. ['Hi', 'Bob', '.']
 *       ^^^^^^^^^^^^^^^^
 *           Greeting
 */
var parseGreeting  = parseTerminated (GREETING, GREETING_START_KEYWORDS);

/* [String] -> {'Remaining': [String], 'Parsed': [ComplexObject]}
 *
 * Rule: A statement is a series of non-keyword tokens which are
 * terminated but don't start with a keyword in
 * particular. i.e. questions and greetings can be statements.
 *
 * e.g. ['This', 'is', 'a', 'statement', '.']
 *       ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
 *                   Statement
 */
function parseStatement (tokens) {
    var splittedUpToTerminal = splitUpToTerminal (tokens);
    var tokensUpToTerminal   = splittedUpToTerminal[0];
    if (Util.isOneOfIgnoreCase (TERMINAL_KEYWORDS, _.last (tokensUpToTerminal))) {
        return {'Remaining': splittedUpToTerminal[1],
                'Parsed': constructComplexObject (tokensUpToTerminal, STATEMENT, OBJECT)};
    }
    return {'Remaining': tokens,
            'Parsed': undefined};
};

/* [String] -> [ComplexObject]
 *
 * Part One:
 * Hint: try each complex parser (parsers which read complex types)
 * and use the first one which has any result, if none do then we can
 * return an empty list, because we couldn't parse anything.
 *
 * Further Hint: Use recursion.
 */
function parseTokens (tokens) {
    var firstDefined = _.compose (_.head, _.dropWhile (_.compose (_.equals (undefined), _.prop ('Parsed'))));
    var parsed = firstDefined ([undefined]);
    if (parsed == undefined) {
        undefined;
    }
    return _.concat ([parsed.Parsed], parseTokens (undefined));
}

/* String -> [ComplexObject]
 *
 * Part Two:
 * Hint: use composition, and look at type signatures.
 */
var parse = undefined; // Starting point: _.compose (undefined, undefined);

/* (ComplexObject -> String) -> String -> String
 *
 * During the course of this exercise we will implement the pieces we
 * need to make our bot semi-literate.
 */
var reply = _.curry (function (interpreter, sentence) {
    return _.compose (evaluate (interpreter), parse) (sentence);
});

var initialGreeting = curry_exercises.initialGreeting;

/* [String] -> [[String], [String]]
 * Split the given string list at the first occurance of a terminal
 * keyword token and keep the token which was split on.
 */
function splitUpToTerminal (xs) {
    if (xs.length == 0) return [[], []];
    var split = _.splitWhen (Util.isOneOfIgnoreCase (TERMINAL_KEYWORDS), xs);
    return [_.append (split[1][0], split[0]), _.slice (1, split[1].length, split[1])];
}

/* [String] -> [String]
 * Produce the given list without the last element.
 */
function sliceAllButLast (xs) {
    return _.slice (0, xs.length - 1, xs);
}

/* String -> Object
 * Produce an object simple type type from the given string for the
 * object value.
 */
function constructObject (value) {
    return {'Type': OBJECT,
            'Value': value};
}

/* [String] -> ComplexObject
 * Construct a complex object from the tokens which comprise it.
 */
function constructComplexObject (tokens, type, typeOfFirst) {
    var keyword  = tokens[0];
    var objects  = _.map (constructObject, _.tail (sliceAllButLast (tokens)));
    var terminal = tokens[tokens.length - 1];
    var firstType = typeOfFirst ? typeOfFirst : KEYWORD;
    return {'Type': type,
            'Values':
            _.concat (_. concat ([{'Type': firstType,
                                   'Value': keyword}],
                                 objects),
                      [{'Type': TERMINAL,
                        'Value': terminal}])};
}

/* String -> [String] -> [String] -> {'Remaining': [String], 'Parsed': ComplexObject}
 * Parse a statement of type, type matching a keyword from keywords
 * and ending with a TERMINAL keyword.
 */
function parseTerminated (type, keywords) {
    return function (tokens) {
        if (Util.isOneOfIgnoreCase (keywords, _.head (tokens))) {
            var splittedUpToTerminal = splitUpToTerminal (tokens);
            var tokensUpToTerminal   = splittedUpToTerminal[0];
            if (Util.isOneOfIgnoreCase (TERMINAL_KEYWORDS, _.last (tokensUpToTerminal))) {
                return {'Remaining': splittedUpToTerminal[1],
                        'Parsed': constructComplexObject (tokensUpToTerminal, type)};
            }
        };
        return {'Remaining': tokens,
                'Parsed': undefined};
    };
}

module.exports = {initialGreeting: initialGreeting,
                  tokenise: tokenise,
                  parseGreeting: parseGreeting,
                  parseQuestion: parseQuestion,
                  parseStatement: parseStatement,
                  parseTokens: parseTokens,
                  sliceAllButLast: sliceAllButLast,
                  constructObject: constructObject,
                  constructComplexObject: constructComplexObject,
                  reply: reply,
                  parse: parse,
                  splitUpToTerminal: splitUpToTerminal,
                  GREETING: GREETING,
                  STATEMENT: STATEMENT,
                  QUESTION: QUESTION,
                  KEYWORD: KEYWORD,
                  OBJECT: OBJECT,
                  TERMINAL: TERMINAL};
