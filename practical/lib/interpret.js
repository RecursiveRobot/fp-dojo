var _    = require ('ramda');
var Util = require ('chatbot');
var fs   = require('fs');

/* ComplexObject -> String
 * Convert a complex object back into a string representation of the
 * object it came from.
 */
function toSentence (sentenceObject) {
    var values = sentenceObject.Values;
    return values.Keyword + _.join (" ", _.map (_.prop ('Value'))) + values.Terminal;
}

/* Association -> Association -> Int
 * Scores the similarity between the two given Assocations.
 */
var score = _.curry (function (x, y) {
    var wordCountX     = x.wordCount;
    var wordCountY     = y.wordCount;
    var combineCounts  = _.reduce (function (x, y) {return x + y;}, 0);
    var combinedCounts = combineCounts (_.map (function (prop) {
        var valY = wordCountY[prop] ? wordCountY[prop] : 0;
        var valX = wordCountX[prop] ? wordCountX[prop] : 0;
        return Math.pow (valY - valX, 2);
    }), Object.keys (wordCountY) + _.difference (Object.keys (wordCountX),
                                                 Object.keys (wordCountX)));
});

/* WordCount is
 * {String: Int*}
 * Note: The star indicates that this property, value realationship
 * repeats in the object.
 */

/* WordCount -> {'bestMatch': Association, 'bestScore': Int} -> Association -> {'bestMatch': Association, 'bestScore': Int}
 * Updates the best match if the given Association is a better match
 * than what was previously recorded for the supplied WordCount to
 * be matched.
 */
var updateBest = _.curry (function (suppliedCount, bestSoFar, testObject) {
    var newScore = score (suppliedCount, bestSoFar.wordCount);
    if (newScore > bestSoFar. bestScore) {
        return {'bestMatch': testObject, 'bestScore': newScore};
    }
    return bestSoFar;
});

/* AggregatedContent -> ComplexObject -> String
 * Produce the complex object which follows the best match for the
 * given agggregated content.
 */
var bestMatch = _.curry (function (aggregatedContent, sentenceObject) {
    var type = sentenceObject.Type;
    var contentToSearch = type == Util.GREETING ? aggregatedContent.greetings :
            type == Util.STATEMENT ? (aggregatedContent.statements
                                      + aggregatedContent.questions) :
            aggregatedContent.statements;
    var updateBestOnCurrentObject = updateBest (countWords (sentenceObject));
    return toSentence (_. reduce (updateBestOnCurrentObject, {best: undefined, bestScore: 0},
                                  contentToSearch));
});

/* EnglishContent -> [ComplexObject] -> EnglishContent
 * Associate another complex object to a following complex object in
 * the given content object.
 */
var associate = _.curry (function (content, association) {
    var passibleContent = content (association[0]); // TODO: complete
    return _.curry (function () {
        return ;
    });
});

/* ComplexObject -> WordCount
 * Produce the word count of a given complex object (case insensitive.)
 * * Indicates that the object can have this association many times.
 */
var countWords = _.curry (function (sentenceObject) {
    return _.reduce (accumulateCount, {});
});

/* WordCount -> String -> WordCount
 * Increment the word count at the index defined by the given word.
 */
function accumulateCount (acc, word) {
    // Cheating a little bit here because JS doesn't have any
    // libraries for persistent data structures
    var count = acc[word];
    if (acc == undefined) {
        acc[word] = 1;
    } else {
        acc[word]++;
    };
    return acc;
}

/* A dictionary of responses which the bot could make.
 */
var replyBook = undefined;

/* String -> ()
 * IMPURE: function which simply returns all of the lines of text in a
 * file.
 */
function readFile (filePath) {
    fs.readFile(filePath, function (error, fileContents) {
        if (error) {
            console.log ("Couldn't open the vocabulary file. The bots answers might not make sence.");
            return;
        };
        replyBook = parseFile (fileContents);
    });
}

/* Association is
 * {'wordCount':    WordCount,
 *  'thisSentence': ComplexObject,
 *  'nextSentence': ComplexObject}
 */
var constructAssociation = _.curry (function (wordCount, thisSentence, nextSentence) {
    return {'wordCount': wordCount,
            'thisSentence': thisSentence,
            'nextSentence': nextSentence};
});

/*
 * AggregatedContent is
 * {'questions':  [Association],
 *  'statements': [Association],
 *  'greetings':  [Association]}
 */

/* aggregatedContent -> [ComplexObject, ComplexObject] -> AggregatedContent
 * Combine the next complex object into the given AggregatedContent
 * creating a combined AggregatedContent.
 */
var accumulateToParsed = _.curry (function (content, objects) {
    var object     = objects[1];
    var following  = objects[2];
    var wordCount  = countWords (content);
    var questions  = (object.Type == Util.QUESTION)  ?
            content.questions  : content.questions  + constructAssociation (wordCount,
                                                                            object, following);
    var statements = (object.Type == Util.STATEMENT) ?
            content.statements : content.statements + constructAssociation (wordCount,
                                                                            object, following);
    var greetings  = (object.Type == Util.GREETING)  ?
            content.greetings  : content.greetings  + constructAssociation (wordCount,
                                                                            object, following);
    
    return {'questions':  questions,
            'statements': statements,
            'greetings':  greetings};
});

/* String -> AggregatedContent
 * Parse the given file contents into it's sentences according to the
 * bot-lang rules.
 */
function parseFile (fileContents) {
    var parsedContent = {questions:  [],
                         statements: [],
                         greetings:  []};
    var tokes = Util.parseTokens (Util.tokenise (fileContents));
    return _.reduce (accumulateToParsed, parsedContent);
}

readFile ();
module.exports = {replySentence: bestMatch (replyBook)};
