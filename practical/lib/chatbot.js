var Util = require ('../lib/util');
var _ = require ('ramda');

/* NOTE:
 * The exercises appear out of order in this file.
 * To begin, search for the comment 'Part one'
 * To continue with the practical simply search for 'Part two' etc.
 */

/* NOTE: (as with the exercises)
 * We've provided some starting points to make things easier.
 * Replace the question marks with code to implement the function.
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
// These objects are complex and therefore have 'Values';
var GREETING  = 'Greeting';
var STATEMENT = 'Statement';
var QUESTION  = 'Question';

// These objects are simple and therefore have a 'Value';
var KEYWORD  = 'Keyword';
var OBJECT   = 'Object';
var TERMINAL = 'Terminal';

/* (String, ComplexObject) -> String
 *
 * Part Eight: Implement respond using the appropriate evaluation
 * functions.
 */
var respond = _.curry (function (reply, value) {
    if (value.Type == GREETING){
        return reply + evaluateGreeting (value);
    } else if (value.Type == STATEMENT) {
        return reply + evaluateStatement (value);
    } else if (value.Type == QUESTION) {
        return reply + evaluateQuestion (value);
    } else {
        return reply;
    }
});

/* [ComplexObject] -> String
 *
 * Part Six: Implement evaluate by collecting the results of evaluating each
 * element of the [ComplexObject] in a single string message to be
 * sent back to the user.
 *
 * Hint: Use reduce and the functions which follow.
 */
var evaluate = _.reduce (respond, "");

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
// Some useful regular expressions:
var MATCH_WHITESPACE             = / +/g;
var MATCH_PUNCTUATION            = /([.!?])/g;
var MATCH_NON_ACCEPTED_CHARACTER = /[^a-zA-Z.!? ]/g;

var splitOutPunctuation = function (toSplit) {
    return ???;
};

var filterNonAcceptedCharacters = function (toFilter) {
    return regexReplace (MATCH_NON_ACCEPTED_CHARACTERS, '');
};

var collapseSuccessiveWhitespaces = function (toFilter) {
    return ???;
};

var regexReplace = _.curry (function (pattern, replaceWith, x) {
    return x.replace (pattern, replaceWith);
});

var tokenise = _.compose (_.filter (_.compose (_.not, _.equals (""))),
                          _.split (' '),
                          collapseSuccessiveWhitespaces,
                          ???,
                          ???);

/* [String] -> [ComplexObject]
 *
 * Part four:
 * Hint: try each complex parser (parsers which read complex types)
 * and use the first one which has any result, if none do then we can
 * return an empty list, because we couldn't parse anything.
 *
 * Further Hint: Use recursion.
 */
function parseTokens (tokens) {
    var firstDefined = _.compose (_.head, _.dropWhile (_.compose (_.equals (undefined), _.prop ('Parsed'))));
    var parsed = firstDefined ([parseQuestion (tokens),
                                parseGreeting (tokens),
                                parseStatement (tokens)]);
    if (parsed == undefined) {
        return [];
    }
    return _.concat ([parsed.Parsed], parseTokens (parsed.Remaining));
}

/* String -> [ComplexObject]
 *
 * Part Two: implement parse.
 * Hint: use composition, and look at type signatures.
 */
var parse = _.compose (???, ???);

/* String -> String
 *
 * During the course of this exercise we will implement the pieces we
 * need to make our bot semi-literate.
 */
var reply = _.compose (evaluate, parse);

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
        return ???;
    } else if (userNames.length >= 5) {
        return ???;
    } else if (userNames.length == 1) {
        return ???;
    } else {
        return "Hello "
            + _.join (", ") (???)
            + " and " + ??? + "!";
    }
}

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

/* [String] -> [String] -> [[String], [String]]
 * Split the given expression at the first instance of a keyword equal
 * to keywords ignoring case.
 */
function splitAtOneOfIgnoringCase (keywords) {
    return _.splitWhen (Util.isOneOfIgnoreCase (keywords));
}

/* String -> [String] -> [String] -> {'Remaining': [String], 'Parsed': ComplexObject}
 * Parse a statement of type, type matching a keyword from keywords
 * and ending with a TERMINAL keyword.
 */
function parseTerminated (type, keywords) {
    return function (tokens) {
        if (Util.isOneOfIgnoreCase (keywords) (_.head (tokens))) {
            var split = splitAtOneOfIgnoringCase (TERMINAL_KEYWORDS) (tokens);
            var splitWithTerminal = [_.append (split[1][0], split[0]), _.slice (1, split[1].length, split[1])];
            if (Util.isOneOfIgnoreCase (TERMINAL_KEYWORDS) (_.last (splitWithTerminal[0]))) {
                return {'Remaining': splitWithTerminal[1],
                        'Parsed': {'Type': type,
                                   'Values':
                                   _.concat ([{'Type': KEYWORD,
                                               'Value': splitWithTerminal[0][0]}]) (_.concat (_.map (function (token) {return {'Type': OBJECT,
                                                                                                                               'Value': token};},
                                                                                                     _.slice (1, splitWithTerminal[0].length - 1, splitWithTerminal[0])))
                                                                                    ([{'Type': TERMINAL,
                                                                                       'Value': _.last (splitWithTerminal [0])}]))}};
            }
        }
        return {'Remaining': tokens,
                'Parsed': undefined};
    };
}

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
 *
 * Part Four
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
 *
 * Part Five
 */
function parseStatement (tokens) {
    var split = splitAtOneOfIgnoringCase (TERMINAL_KEYWORDS) (tokens);
    var splitWithTerminal = [_.append (split[1][0], split[0]), _.slice (1, split[1].length, split[1])];
    if (Util.isOneOfIgnoreCase (TERMINAL_KEYWORDS) (_.last (splitWithTerminal[0]))) {
        return {'Remaining': splitWithTerminal[1],
                'Parsed': {'Type': STATEMENT,
                           'Values':
                           _.concat (_.map (function (token) {return {'Type': OBJECT,
                                                                      'Value': token};},
                                            _.slice (0, splitWithTerminal[0].length - 1,
                                                     splitWithTerminal[0]))) ([{'Type': TERMINAL,
                                                                                'Value': _.last (splitWithTerminal [0])}])}};
    }
    return {'Remaining': tokens,
            'Parsed': undefined};
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
    return "Found greeting";
}

/* ComplexObject -> String
 *
 * Part Ten: Implement the evaluate statement method in any way you
 * please :)
 */
function evaluateStatement (statement) {
    return "Found statement";
}

/* ComplexObject -> String
 *
 * Part Eleven: Implement the evaluate question method in any awy you
 * please :)
 */
function evaluateQuestion (question) {
    return "Evaluate question";
}

module.exports = {initialGreeting: initialGreeting,
                  tokenise: tokenise,
                  parseGreeting: parseGreeting,
                  parseQuestion: parseQuestion,
                  parseStatement: parseStatement,
                  reply: reply,
                  GREETING: GREETING,
                  STATEMENT: STATEMENT,
                  QUESTION: QUESTION,
                  KEYWORD: KEYWORD,
                  OBJECT: OBJECT,
                  TERMINAL: TERMINAL};
