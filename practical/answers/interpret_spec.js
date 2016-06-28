var _         = require ('ramda');
var interpret = require ('./interpret.js');
var ChatBot   = require ('./chatbot.js');
var assert    = require("chai").assert;

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
    });
    it ("Score of sentences with one word difference is one", function () {
        assert.equal (interpret.score ({'Blah': 2, 'Hi': 2},
                                       {'Blah': 2, 'Hi': 1}), 1);
    });
});
