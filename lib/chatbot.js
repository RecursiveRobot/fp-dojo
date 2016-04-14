var Util = require ('util');
var _ = require ('ramda');

// Tie bot to incoming messages and startup;
Util.repl (reply);
Util.startup (initialGreeting);

/* The slack bot we'll write will only understand bot-lang: a very
 * strict and highly simplified version of English. The core of
 * bot-lang is UnderstoodMessage.
 */

/* UnderstoodMessage is an array of ComplexObjects, defined as an
 * object with two fields: 'Type' and 'Values', where 'Values' is an
 * array of 'SimpleObjects'.
 *
 * It's a total hack (which is not perfect by any measure) for
 * representing a natural language. Except that our language will be
 * interpreted with very strict rules.
 *
 * e.g.
 * [{'Type': 'Greeting', 'Values':
 *      [{'Type': 'Keyword', 'Value': 'Hi'},
 *       {'Type': 'Object', 'Value': 'Edward'},
 *       {'Type': 'Terminator', 'Value': '.'}]}..]
 *
 * The UnderstoodMessage above consists of a single ComplexObject
 * which as it's values has three SimpleObjects.
 *
 * The types which our tree can hold are listed as follows:
 */
// These objects are complex and therefore have 'Values'
var GREETING = 'Greeting';
var STATEMENT = 'Statement';
var QUESTION = 'Question';

// These objects are simple and therefore have a 'Value'
var KEYWORD = 'Keyword';
var OBJECT = 'Object';
var TERMINAL = 'Terminal';

/*
 * String -> String -> String
 *
 * During the course of this exercise we will implement the pieces we
 * need to make our bot semi-literate.
 */
var reply = _.curry (function (userName, message) {
    return "";
});

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
var initialGreeting = function (userNames) {
    return "";
};

/* String -> UnderstoodMessage
 *
 * Part Two: implement parse.
 * Hint: use composition, and look at type signatures.
 */
function parse (messageText) {
    return {};
}

/* String -> [String]
 *
 * Rules:
 *  - Tokens are separated by spaces except in the case of punctuation.
 *  - Only alpha characters and punctuation is allowed in the token
 *    list.
 *  - Repeated spaces should be collapsed so that tokens separated by
 *    repeated tokens only create a single token.
 *
 * Part Three: implement tokenize
 */
function tokenise (messageText) {
    return [];
}

/* A parser returns a parsed object of the following schema:
 * {
 *   'Remaining': [String],
 *   'Parsed':    UnderstoodMessage
 * }
 *
 * If the parser didn't manage to parse anything then the 'Remaining'
 * should be the argument tokens and 'Parsed' should be undefined.
 *
 * If the parser did parse something then 'Parsed' should be an
 * UnderstoodMessage and 'Remaining' should have tokens removed
 * corresponding to what was parsed.
 */

/* [String] -> UnderstoodMessage
 *
 * Part four:
 * Hint: try each complex parser (parsers which read complex types)
 * and use the first one which has any result, if none do then we can
 * assume that we are at a Terminal.
 */
function parseTokens (tokens) {
    return [{'Type': TERMINAL, 'Values': undefined}];
}

var TERMINATOR_KEYWORDS = ['.', '!', ',', '?'];
var QUESTION_START_KEYWORDS = ['How', 'Where', 'What', 'Why'];

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
function parseQuestion (tokens) {
    if (Util.isOneOfIgnoreCase (QUESTION_START_KEYWORDS)) {
        var split = _.splitWhen (_.compose (_.not, Util.isOneOfIgnoreCase (TERMINATOR_KEYWORDS)), tokens);
        if (Util.isOneOfIgnoreCase (TERMINATOR_KEYWORDS, _.last (split[0]))) {
            return {'Remaining': split[1],
                    'Parsed': {'Type': QUESTION,
                               'Values':
                               [{'Type': KEYWORD,
                                 'Values': [split[0][0]]}]
                               + _.map (function (token) {return {'Type': OBJECT,
                                                                  'Value': [token]};})
                               + {'Type': TERMINAL,
                                  'Values': _.last (split [0])}}};
        }
    }
    return {'Remaining': tokens,
            'Parsed': undefined};
}

/* [String] -> {'Remaining': [String], 'Parsed': SimpleObject}
 *
 * Rule: Objects are collections of tokens delimeted by greeting,
 * statement or terminator keywords.
 *
 *       Del.         Del.
 *        v            v
 * e.g. ['Hi', 'Bob', '.']
 *               ^
 *             Object
 *
 * Part Four
 */
function parseObject (tokens) {
    return {'Type': OBJECT,
            'Value': 'Bob'};
}

var GREETING_KEYWORDS = ['Hi', 'Hello', 'Howzit', 'Hey'];

/* [String] -> {'Remaining': [String], 'Parsed': ComplexObject}
 *
 * Rule: A greeting starts with a greeting keyword and is followed by
 * an object and then a terminator.
 *
 * e.g. ['Hi', 'Bob', '.']
 *       ^^^^^^^^^^^^^^^^
 *           Greeting
 *
 * Part Five
 */
function parseGreeting (tokens) {
    return {'Type': 'Greeting', 'Values':
            [{'Type': 'Keyword', 'Value': 'Hi'},
             {'Type': 'Object', 'Value': 'Edward'},
             {'Type': 'Terminator', 'Value': '.'}]};
}

/* [String] -> {'Remaining': [String], 'Parsed': SimpleObject}
 *
 * Rule: A terminator is one of the Terminator keywords.
 *
 * e.g. ['.']
 *        ^
 *    Terminator
 *
 * Part Six
 */
function parseTerminal (tokens) {
    return {'Type': TERMINAL,
            'Value': '.'};
}

/* [String] -> {'Remaining': [String], 'Parsed': UnderstoodMessage}
 *
 * Rule: A statement is a series of non-keyword tokens which are
 * terminated but don't start with a keyword.
 *
 * e.g. ['This', 'is', 'a', 'statement']
 *       ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
 *                Statement
 *
 */
function parseStatement (tokens) {
    return {'Type': STATEMENT,
            'Values': [{'Type': OBJECT,
                        'Value': 'This'}]};
}

/* UnderstoodMessage -> String
 *
 * Part Seven: Implement evaluate by collecting the results of evaluating each
 * element of the UnderstoodMessage in a single string message to be
 * sent back to the user.
 */
function evaluate (understoodMessage) {
    return "";
}

/* (Reply, ComplexObject) -> String
 *
 * Part Eight: Implement respond using the appropriate evaluation
 * functions.
 */
function respond (reply, value) {
    if (value.Type == GREETING){
        return reply + "";
    } else if (value.Type == STATEMENT) {
        return reply + "";
    } else if (value.Type == QUESTION) {
        return reply + "";
    } else {
        return reply;
    }
}

/* Keep in mind that the following three functions should be pure.  It
 * limits your options (because we haven't accounted for 'state') but
 * if you make any of these impure then the entire program becomes
 * impure.
 */

/* ComplexObject -> String
 *
 * Part Nine: Implement the evaluate greeting method in any way you
 * please :)
 */
function evaluateGreeting (greeting) {
    return "";
}

/* ComplexObject -> String
 *
 * Part Ten: Implement the evaluate statement method in any way you
 * please :)
 */
function evaluateStatement (statement) {
    return "";
}

/* ComplexObject -> String
 *
 * Part Eleven: Implement the evaluate question method in any awy you
 * please :)
 */
function evaluateQuestion (question) {
    return "";
}
