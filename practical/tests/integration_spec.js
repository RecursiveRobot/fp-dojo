var _         = require ('ramda');
var interpret = require ('../interpret.js');
var ChatBot   = require ('../chatbot.js');
var assert    = require ("chai").assert;

var SENTENCE_ONE = "This eBook is for the use of anyone anywhere at no cost and with almost no restrictions whatsoever.";
var REPLY_SENTENCE_ONE = "\nYou may copy it give it away or reuse it under the terms of the Project Gutenberg License included with this eBook or online at www.";

var SENTENCE_TWO       = "Look at old Sorreltop run will you?";
var REPLY_SENTENCE_TWO = "\nHes bound to get under it too.";

describe ("Some sentances from the book should be replied to with their subsequent sentences.", function () {
    this.timeout(15000);
    it ("Sentance one is replied to by sentence two.", function () {
        assert.equal (ChatBot.reply (interpret.replySentence, SENTENCE_ONE),   REPLY_SENTENCE_ONE);
    });
    
    it ("Another sentence is replied to by it's following sentence", function () {
        assert.equal (ChatBot.reply (interpret.replySentence, SENTENCE_TWO),   REPLY_SENTENCE_TWO);
    });
});
