var ChatBot = require ('./chatbot');
var assert = require("chai").assert;

function removeDuplicateWhitespace (x) {
    return x.replace (/ +/g, " ");
}

describe ("Bot test Suite", function (){
    it ("Split out punctuation", function () {
        assert.equal (removeDuplicateWhitespace (ChatBot.splitOutPunctuation ("")), "");
        assert.equal (removeDuplicateWhitespace (ChatBot.splitOutPunctuation (".")), " . ");
        assert.equal (removeDuplicateWhitespace (ChatBot.splitOutPunctuation ("?")), " ? ");
        assert.equal (removeDuplicateWhitespace (ChatBot.splitOutPunctuation ("!")), " ! ");
        assert.equal (removeDuplicateWhitespace (ChatBot.splitOutPunctuation ("This is a test")), "This is a test");
        assert.equal (removeDuplicateWhitespace (ChatBot.splitOutPunctuation ("This is a test.")), "This is a test . ");
        assert.equal (removeDuplicateWhitespace (ChatBot.splitOutPunctuation ("This is very strange. I have three fingers!")), "This is very strange . I have three fingers ! ");
        assert.equal (removeDuplicateWhitespace (ChatBot.splitOutPunctuation ("Is your name Bob? No, my name is Steve.")), "Is your name Bob ? No, my name is Steve . ");
    });
    it ("Filter non accepted characters", function () {
        assert.equal (ChatBot.filterNonAcceptedCharacters (""), "");
        assert.equal (ChatBot.filterNonAcceptedCharacters ("Blah $%@ hr#$"), "Blah  hr");
        assert.equal (ChatBot.filterNonAcceptedCharacters ("#$=="), "");
    });
    it ("Remove successive whitespace", function (){
        assert.equal (ChatBot.collapseSuccessiveWhitespaces (""), "");
        assert.equal (ChatBot.collapseSuccessiveWhitespaces ("  "), " ");
        assert.equal (ChatBot.collapseSuccessiveWhitespaces ("This  is a test  to see.  whether this    	  is working."),
                      "This is a test to see. whether this is working.");
    });
    it ('Initial greeting', function () {
        assert.equal (ChatBot.initialGreeting ([]), "Hello, anyone there?");
        assert.equal (ChatBot.initialGreeting (['Bob', 'Fred']), "Hello Bob and Fred!");
        assert.equal (ChatBot.initialGreeting (['Bob', 'Fred', 'Alice']), "Hello Bob, Fred and Alice!");
        assert.equal (ChatBot.initialGreeting (['Bob', 'Fred', 'Alice', 'Frank', 'Mary']), "Hello everyone!");;
        assert.equal (ChatBot.initialGreeting (['Bob']), "Hello Bob!");
    });
    it ("Tokenise the message text.", function () {
        assert.deepEqual (ChatBot.tokenise ("This is a test."), ['This', "is", "a", "test", "."]);
        assert.deepEqual (ChatBot.tokenise (""), []);
        assert.deepEqual (ChatBot.tokenise ("This message contains two sentances. Is one of them a question?"),
                          ["This", "message", "contains", "two", "sentances", ".", "Is", "one", "of", "them", "a", "question", "?"]);
    });
    it ('Parse Greeting', function () {
        assert.deepEqual (ChatBot.parseGreeting ([]),
                          {'Remaining': [],
                           'Parsed': undefined});
        assert.deepEqual (ChatBot.parseGreeting (["Hello", "there", "."]),
                          {'Remaining': [],
                           'Parsed': {'Type': ChatBot.GREETING,
                                      'Values': [{'Type': ChatBot.KEYWORD,
                                                  'Value': 'Hello'},
                                                 {'Type': ChatBot.OBJECT,
                                                  'Value': 'there'},
                                                 {'Type': ChatBot.TERMINAL,
                                                  'Value': '.'}]}});
        assert.deepEqual (ChatBot.parseGreeting (["Hello", "there", ".",
                                                  "Is", "one", "of", "them", "a", "question", "?"]),
                          {'Remaining': ["Is", "one", "of", "them", "a", "question", "?"],
                           'Parsed': {'Type': ChatBot.GREETING,
                                      'Values': [{'Type': ChatBot.KEYWORD,
                                                  'Value': 'Hello'},
                                                 {'Type': ChatBot.OBJECT,
                                                  'Value': 'there'},
                                                 {'Type': ChatBot.TERMINAL,
                                                  'Value': '.'}]}});
        assert.deepEqual (ChatBot.parseGreeting (['This', "is", "a", "test", "."]),
                          {'Remaining': ['This', "is", "a", "test", "."],
                           'Parsed': undefined});
        assert.deepEqual (ChatBot.parseGreeting ([]),
                          {'Remaining': [],
                           'Parsed': undefined});
        assert.deepEqual (ChatBot.parseGreeting (["Is", "one", "of", "them", "a", "question", "?"]),
                          {'Remaining': ["Is", "one", "of", "them", "a", "question", "?"],
                           'Parsed': undefined});
        assert.deepEqual (ChatBot.parseGreeting (["Is", "one", "of", "them", "a", "question", "?",
                                                  "Here", "is", "a", "statement", "."]),
                          {'Remaining': ["Is", "one", "of", "them", "a", "question", "?",
                                         "Here", "is", "a", "statement", "."],
                           'Parsed': undefined});
    });
    it ('Parse Statement', function () {
        assert.deepEqual (ChatBot.parseStatement ([]),
                          {'Remaining': [],
                           'Parsed': undefined});
        assert.deepEqual (ChatBot.parseStatement (["Hello", "there", "."]),
                          {'Remaining': [],
                           'Parsed': {'Type': ChatBot.STATEMENT,
                                      'Values': [{'Type': ChatBot.OBJECT,
                                                  'Value': 'Hello'},
                                                 {'Type': ChatBot.OBJECT,
                                                  'Value': 'there'},
                                                 {'Type': ChatBot.TERMINAL,
                                                  'Value': '.'}]}});
        assert.deepEqual (ChatBot.parseStatement (["Hello", "there", ".",
                                                   "Is", "one", "of", "them", "a", "question", "?"]),
                          {'Remaining': ["Is", "one", "of", "them", "a", "question", "?"],
                           'Parsed': {'Type': ChatBot.STATEMENT,
                                      'Values': [{'Type': ChatBot.OBJECT,
                                                  'Value': 'Hello'},
                                                 {'Type': ChatBot.OBJECT,
                                                  'Value': 'there'},
                                                 {'Type': ChatBot.TERMINAL,
                                                  'Value': '.'}]}});
        assert.deepEqual (ChatBot.parseStatement (['This', "is", "a", "test", "."]),
                          {'Remaining': [],
                           'Parsed': {'Type': ChatBot.STATEMENT,
                                      'Values': [{'Type': ChatBot.OBJECT,
                                                  'Value': 'This'},
                                                 {'Type': ChatBot.OBJECT,
                                                  'Value': 'is'},
                                                 {'Type': ChatBot.OBJECT,
                                                  'Value': 'a'},
                                                 {'Type': ChatBot.OBJECT,
                                                  'Value': 'test'},
                                                 {'Type': ChatBot.TERMINAL,
                                                  'Value': '.'}]}});
        assert.deepEqual (ChatBot.parseStatement (["Is", "one", "of", "them", "a", "question", "?"]),
                          {'Remaining': [],
                           'Parsed': {'Type': ChatBot.STATEMENT,
                                      'Values': [{'Type': ChatBot.OBJECT,
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
                                                  'Value': '?'}]}});
        assert.deepEqual (ChatBot.parseStatement (["Is", "one", "of", "them", "a", "question", "?",
                                                   "Here", "is", "a", "statement", "."]),
                          {'Remaining': ["Here", "is", "a", "statement", "."],
                           'Parsed': {'Type': ChatBot.STATEMENT,
                                      'Values': [{'Type': ChatBot.OBJECT,
                                                  'Value': "Is"},
                                                 {'Type': ChatBot.OBJECT,
                                                  'Value': "one"},
                                                 {'Type': ChatBot.OBJECT,
                                                  'Value': "of"},
                                                 {'Type': ChatBot.OBJECT,
                                                  'Value': "them"},
                                                 {'Type': ChatBot.OBJECT,
                                                  'Value': "a"},
                                                 {'Type': ChatBot.OBJECT,
                                                  'Value': "question"},
                                                 {'Type': ChatBot.TERMINAL,
                                                  'Value': "?"}]}});
    });
    it ('Parse Question', function () {
        assert.deepEqual (ChatBot.parseQuestion ([]),
                          {'Remaining': [],
                           'Parsed': undefined});
        assert.deepEqual (ChatBot.parseQuestion (["Hello", "there", "."]),
                          {'Remaining': ["Hello", "there", "."],
                           'Parsed': undefined});
        assert.deepEqual (ChatBot.parseQuestion (["Hello", "there", ".",
                                                  "Is", "one", "of", "them", "a", "question", "?"]),
                          {'Remaining': ["Hello", "there", ".",
                                         "Is", "one", "of", "them", "a", "question", "?"],
                           'Parsed': undefined});
        assert.deepEqual (ChatBot.parseQuestion (['This', "is", "a", "test", "."]),
                          {'Remaining': ['This', "is", "a", "test", "."],
                           'Parsed': undefined});
        assert.deepEqual (ChatBot.parseQuestion (["Is", "one", "of", "them", "a", "question", "?"]),
                          {'Remaining': [],
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
                                                  'Value': '?'}]}});
        assert.deepEqual (ChatBot.parseQuestion (["Is", "one", "of", "them", "a", "question", "?",
                                                  "Here", "is", "a", "statement", "."]),
                          {'Remaining': ["Here", "is", "a", "statement", "."],
                           'Parsed': {'Type': ChatBot.QUESTION,
                                      'Values': [{'Type': ChatBot.KEYWORD,
                                                  'Value': "Is"},
                                                 {'Type': ChatBot.OBJECT,
                                                  'Value': "one"},
                                                 {'Type': ChatBot.OBJECT,
                                                  'Value': "of"},
                                                 {'Type': ChatBot.OBJECT,
                                                  'Value': "them"},
                                                 {'Type': ChatBot.OBJECT,
                                                  'Value': "a"},
                                                 {'Type': ChatBot.OBJECT,
                                                  'Value': "question"},
                                                 {'Type': ChatBot.TERMINAL,
                                                  'Value': "?"}]}});
    });
});
