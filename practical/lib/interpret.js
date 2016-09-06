var _   = require ('ramda');
var Bot = require ('./chatbot');
var fs  = require ('fs');

/* ComplexObject -> String
 * Convert a complex object back into a string representation of the
 * object it came from.
 */
function toSentence (sentenceObject) {
    if (sentenceObject == undefined) return "";
    var values = sentenceObject.Values;
    var last   = values.length > 0 ? (_.last (sentenceObject.Values)).Value : "";
    return _.join (" ", _.map (_.prop ('Value'),
                               Bot.sliceAllButLast (values)))
        + last;
}

/* Association -> Association -> Int
 * Scores the similarity between the two given Assocations.
 */
var score = _.curry (function (wordCountX, wordCountY) {
    var allKeys          = _.concat (Object.keys (wordCountY),
                                     _.difference (Object.keys (wordCountX),
                                                   Object.keys (wordCountY)));
    var combineCounts    = _.reduce (function (x, y) {return x + y;}, 0);
    var countDifferences = (_.map (function (prop) {
        var valY = wordCountY[prop] ? wordCountY[prop] : 0;
        var valX = wordCountX[prop] ? wordCountX[prop] : 0;
        return Math.pow (valY - valX, 2);
    }, allKeys));
    return Math.sqrt (combineCounts (countDifferences));
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
    var newScore = score (suppliedCount, testObject.wordCount);
    if (newScore < bestSoFar.bestScore || bestSoFar.bestMatch == undefined) {
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
    var contentToSearch = type == Bot.GREETING ? aggregatedContent.greetings :
            type == Bot.STATEMENT ? aggregatedContent.statements :
            aggregatedContent.questions;
    var words = _.map (_.prop ('Value'), sentenceObject.Values);
    var updateBestOnCurrentObject = updateBest (countWords ({}, words));
    var bestSentence = (_.reduce (updateBestOnCurrentObject,
                                  {bestMatch: undefined, bestScore: 0},
                                  contentToSearch)).bestMatch;
    return toSentence (bestSentence.nextSentence);
});

/* ComplexObject -> WordCount
 * Produce the word count of a given complex object (case insensitive.)
 * Indicates that the object can have this association many times.
 */
var countWords = _.reduce (accumulateCount);

/* WordCount -> String -> WordCount
 * Increment the word count at the index defined by the given word.
 */
function accumulateCount (acc, word) {
    // Cheating a little bit here because JS doesn't have any
    // libraries for persistent data structures
    var count = acc[word];
    if (count == undefined) {
        acc[word] = 1;
    } else {
        acc[word] = count + 1;
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
    var fileContents = fs.readFileSync(filePath, 'utf8')
            .replace(/\n/g, ' ');
    return parseFile (fileContents.toString ());
}

/* Association is
 * {'wordCount':    WordCount,
 *  'thisSentence': ComplexObject,
 *  'nextSentence': ComplexObject}
 */
var constructAssociation = _.curry (function (wordCount, thisSentence, nextSentence) {
    return {'wordCount':    wordCount,
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
    var object     = objects[0];
    var following  = objects[1];
    var wordCount  = countWords ({}, _.map (_.prop ('Value'), object.Values));
    var questions  = (object.Type == Bot.QUESTION)  ?
            _.concat (content.questions,
                      constructAssociation (wordCount,
                                            object, following)) :
            content.questions;
    var statements = (object.Type == Bot.STATEMENT) ?
            _.concat (content.statements,
                      constructAssociation (wordCount,
                                            object, following)) :
            content.statements ;
    var greetings  = (object.Type == Bot.GREETING)  ?
            _.concat (content.greetings,
                      constructAssociation (wordCount,
                                            object, following)) :
            content.greetings;
    
    return {'questions':  questions,
            'statements': statements,
            'greetings':  greetings};
});

/* String -> AggregatedContent
 * Parse the given file contents into it's sentences according to the
 * bot-lang rules.
 */
function parseFile (fileContents) {
    var parsedContent       = {questions:  [],
                               statements: [],
                               greetings:  []};
    var tokens              = Bot.parseTokens (Bot.tokenise (fileContents));
    var tokensWithFollowing = _.zip (tokens, _.tail (tokens));
    return _.reduce (accumulateToParsed, parsedContent, tokensWithFollowing);
}

var book = undefined;

replyBook = function () {
    if (book == undefined) {
        var book = readFile ("Book.txt");
    };
    return book;
};

module.exports = {replySentence :
                  function (sentence) {
                      return bestMatch (replyBook (), sentence);},
                  toSentence    : toSentence,
                  score         : score,
                  updateBest    : updateBest,
                  countWords    : countWords,
                  parseFile     : parseFile};
