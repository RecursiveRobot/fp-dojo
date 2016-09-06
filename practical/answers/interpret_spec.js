var _         = require ('ramda');
var interpret = require ('./interpret.js');
var ChatBot   = require ('./chatbot.js');
var assert    = require ("chai").assert;

var STATEMENT_ONE = {'Type': ChatBot.STATEMENT,
                     'Values': [{'Type': ChatBot.OBJECT,
                                 'Value': "Here"},
                                {'Type': ChatBot.OBJECT,
                                 'Value': "is"},
                                {'Type': ChatBot.OBJECT,
                                 'Value': "a"},
                                {'Type': ChatBot.OBJECT,
                                 'Value': "statement"},
                                {'Type': ChatBot.TERMINAL,
                                 'Value': "."}]};

describe ("Interpret test suite", function () {
    it ("Convert a complex object into a sentence", function () {
        assert.equal (interpret.toSentence (undefined),
                      "");
        assert.equal (interpret.toSentence ({'Type': ChatBot.STATEMENT,
                                             'Values': []}),
                      "");
        assert.equal (interpret.toSentence (STATEMENT_ONE),
                      "Here is a statement.");
    });
    it ("Score of two identical sentences is zero.", function () {
        assert.equal (interpret.score ({'Blah': 2, 'Hi': 1},
                                       {'Blah': 2, 'Hi': 1}), 0);
        assert.equal (interpret.score ({'This': 1, 'is': 1, 'a': 1, 'test': 1},
                                       {'This': 1, 'is': 1, 'a': 1, 'test': 1}), 0);
        assert.equal (interpret.score ({'Is': 1, 'that': 1, 'your': 1, 'real': 1, 'name': 1, '?': 1},
                                       {'Is': 1, 'that': 1, 'your': 1, 'real': 1, 'name': 1, '?': 1}), 0);
    });
    it ("Score of sentences with one word difference is one", function () {
        assert.equal (interpret.score ({'Blah': 2, 'Hi': 2},
                                       {'Blah': 2, 'Hi': 1}), 1);
        assert.equal (interpret.score ({'Is': 1, 'that': 1, 'your': 1, 'real': 1, 'name': 1, '?': 1},
                                       {'Is': 1, 'that': 1, 'your': 1, 'real': 1, 'name': 1}), 1);
    });
    it ("Best so far updated when there is no best match.", function () {
        assert.deepEqual (interpret.updateBest ({'Is': 1, 'that': 1, 'your': 1, 'real': 1, 'name': 1},
                                                {'bestMatch': undefined,
                                                 'bestScore': 0},
                                                {'wordCount': {'Is': 1, 'that': 1, 'your': 1, 'real': 1, 'name': 1},
                                                 'thisSentence': undefined,
                                                 'thatSentence': undefined}),
                          {"bestMatch": {'wordCount': {'Is': 1, 'that': 1, 'your': 1, 'real': 1, 'name': 1},
                                         'thisSentence': undefined,
                                         'thatSentence': undefined},
                           "bestScore": 0});
    });
    it ("Best so far updated when presented with a better match.", function () {
        assert.deepEqual (interpret.updateBest ({'Is': 1, 'that': 1, 'your': 1, 'real': 1, 'name': 1},
                                                {'bestMatch': {'wordCount': {'Blah': 2, 'Hi': 1},
                                                               'thisSentence': undefined,
                                                               'thatSentence': undefined},
                                                 'bestScore': interpret.score ({'Is': 1, 'that': 1, 'your': 1, 'real': 1, 'name': 1},
                                                                               {'Blah': 2, 'Hi': 1})},
                                                {'wordCount': {'Is': 1, 'that': 1, 'your': 1, 'real': 1, 'name': 1},
                                                 'thisSentence': undefined,
                                                 'thatSentence': undefined}),
                          {'bestMatch': {'wordCount': {'Is': 1, 'that': 1, 'your': 1, 'real': 1, 'name': 1},
                                         'thisSentence': undefined,
                                         'thatSentence': undefined},
                           'bestScore': 0});
    });
    it ("Count of words in a sentence object is accurate.", function () {
        assert.deepEqual (interpret.countWords (['This', 'is', 'a', 'test', 'sentence', 'a', 'test', 'sentence', '.']),
                          {'This': 1,
                           'is': 1,
                           'a': 2,
                           'test': 2,
                           'sentence': 2,
                           '.': 1});
    });
});
