var ChatBot = require ('./chatbot');
var assert = require("chai").assert;

describe ("Bot test Suite", function (){
    it ('Initial greeting', function () {
        assert.equal (ChatBot.initialGreeting ([]), "Hello, anyone there?");
        assert.equal (ChatBot.initialGreeting (['Bob', 'Fred']), "Hello Bob and Fred!");
        assert.equal (ChatBot.initialGreeting (['Bob', 'Fred', 'Alice']), "Hello Bob, Fred and Alice!");
        assert.equal (ChatBot.initialGreeting (['Bob', 'Fred', 'Alice', 'Frank', 'Mary']), "Hello everyone!");
    });
    it ("Tokenise the message text.", function () {
        assert.deepEqual (ChatBot.tokenise ("This is a test."), (['This', "is", "a", "test", "."]));
        assert.deepEqual (ChatBot.tokenise (""), []);
        assert.deepEqual (ChatBot.tokenise ("This message contains two sentances. Is one of them a question?"),
                          (["This", "message", "contains", "two", "sentances", ".", "Is", "one", "of", "them", "a", "question", "?"]));
    });
    it ('Parse Question', function () {
        assert.deepEqual (ChatBot.parseQuestion (['This', "is", "a", "test", "."]),
                          ({'Remaining': ['This', "is", "a", "test", "."],
                            'Parsed': undefined}));
        assert.deepEqual (ChatBot.parseQuestion ([]),
                          ({'Remaining': [],
                            'Parsed': undefined}));
        assert.deepEqual (ChatBot.parseQuestion (["Is", "one", "of", "them", "a", "question", "?"]),
                          ({'Remaining': [],
                            'Parsed': {'Type': ChatBot.QUESTION,
                                       'Values': [{'Type': ChatBot.KEYWORD,
                                                   'Value': 'Is'},
                                                  {'Type': ChatBot.OBJECT,
                                                   'Value': 'one'},
                                                  {'Type': ChatBot.OBJECT,
                                                   'Value': 'of'},
                                                  {'Type': ChatBot.OBJECT,
                                                   'Value': 'them'},
                                                  {'Type': ChatBot.OBJECT,
                                                   'Value': 'a'},
                                                  {'Type': ChatBot.OBJECT,
                                                   'Value': 'question'},
                                                  {'Type': ChatBot.TERMINAL,
                                                   'Value': '?'}]}}));
        assert.deepEqual (ChatBot.parseQuestion (["Is", "one", "of", "them", "a", "question", "?",
                                                  "Here", "is", "a", "statement", "."]),
                          ({'Remaining': ["Here", "is", "a", "statement", "."],
                            'Parsed': {'Type': ChatBot.QUESTION,
                                       'Values': [{'Type': ChatBot.KEYWORD,
                                                   'Value': 'Is'},
                                                  {'Type': ChatBot.OBJECT,
                                                   'Value': 'one'},
                                                  {'Type': ChatBot.OBJECT,
                                                   'Value': 'of'},
                                                  {'Type': ChatBot.OBJECT,
                                                   'Value': 'them'},
                                                  {'Type': ChatBot.OBJECT,
                                                   'Value': 'a'},
                                                  {'Type': ChatBot.OBJECT,
                                                   'Value': 'question'},
                                                  {'Type': ChatBot.TERMINAL,
                                                   'Value': '?'}]}}));
    });
    it ('Parse Greeting', function () {
        assert.deepEqual (ChatBot.parseGreeting (['This', "is", "a", "test", "."]),
                          ({'Remaining': ['This', "is", "a", "test", "."],
                            'Parsed': undefined}));
        assert.deepEqual (ChatBot.parseGreeting ([]),
                          ({'Remaining': [],
                            'Parsed': undefined}));
        assert.deepEqual (ChatBot.parseGreeting (["Hi", "there", "nice", "day", "were", "having", "."]),
                          ({'Remaining': [],
                            'Parsed': {'Type': ChatBot.GREETING,
                                       'Values': [{'Type': ChatBot.KEYWORD,
                                                   'Value': 'Hi'},
                                                  {'Type': ChatBot.OBJECT,
                                                   'Value': 'there'},
                                                  {'Type': ChatBot.OBJECT,
                                                   'Value': 'nice'},
                                                  {'Type': ChatBot.OBJECT,
                                                   'Value': 'day'},
                                                  {'Type': ChatBot.OBJECT,
                                                   'Value': 'were'},
                                                  {'Type': ChatBot.OBJECT,
                                                   'Value': 'having'},
                                                  {'Type': ChatBot.TERMINAL,
                                                   'Value': '.'}]}}));
        assert.deepEqual (ChatBot.parseGreeting (["Hi", "there", "nice", "day", "were", "having", ".",
                                                  "Here", "is", "a", "statement", "."]),
                          ({'Remaining': ["Here", "is", "a", "statement", "."],
                            'Parsed': {'Type': ChatBot.GREETING,
                                       'Values': [{'Type': ChatBot.KEYWORD,
                                                   'Value': 'Hi'},
                                                  {'Type': ChatBot.OBJECT,
                                                   'Value': 'there'},
                                                  {'Type': ChatBot.OBJECT,
                                                   'Value': 'nice'},
                                                  {'Type': ChatBot.OBJECT,
                                                   'Value': 'day'},
                                                  {'Type': ChatBot.OBJECT,
                                                   'Value': 'were'},
                                                  {'Type': ChatBot.OBJECT,
                                                   'Value': 'having'},
                                                  {'Type': ChatBot.TERMINAL,
                                                   'Value': '.'}]}}));
    });
    it ('Parse Statement', function () {
        assert.deepEqual (ChatBot.parseStatement (['Is', "this", "a", "test", "?"]),
                          ({'Remaining': [],
                            'Parsed': {'Type': ChatBot.STATEMENT,
                                       'Values': [{'Type': ChatBot.OBJECT,
                                                   'Value': 'Is'},
                                                  {'Type': ChatBot.OBJECT,
                                                   'Value': 'this'},
                                                  {'Type': ChatBot.OBJECT,
                                                   'Value': 'a'},
                                                  {'Type': ChatBot.OBJECT,
                                                   'Value': 'test'},
                                                  {'Type': ChatBot.TERMINAL,
                                                   'Value': '?'}]}}));
        assert.deepEqual (ChatBot.parseStatement ([]),
                          ({'Remaining': [],
                            'Parsed': undefined}));
    });
});
