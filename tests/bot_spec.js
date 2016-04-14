var ChatBot = require ('../lib/chatbot');
var assert = require ('chai').assert;

describe ("Bot test Suite", function (){
    it ('Initial greeting', function () {
        assert.equal (ChatBot.initialGreeting ([], "Hello, anyone there?"));
        assert.equal (ChatBot.initialGreeting (['Bob', 'Fred']), "Hello Bob and Fred!");
        assert.equal (ChatBot.initialGreeting (['Bob', 'Fred', 'Alice'], "Hello Bob, Fred and Alice!"));
        assert.equal (ChatBot.initialGreeting (['Bob', 'Fred', 'Alice', 'Frank', 'Mary'], "Hello everyone!"));
    });
    it ("Tokenise the message text.", function () {
        assert.equal (ChatBot.tokenise ("This is a test.", ['This', "is", "a", "test", "."]));
        assert.equal (ChatBot.tokenise ("", []));
        assert.equal (ChatBot.tokenise ("This message contains two sentances. Is one of them a question?",
                                        ["This", "message", "contains", "two", "sentances.", "Is", "one", "of", "them", "a", "question", "?"]));
    });
    it ('Parse Greeting', function () {
        assert.equal (ChatBot.parseGreeting (['This', "is", "a", "test", "."],
                                             {'Remaining': ['This', "is", "a", "test", "."],
                                              'Parsed': undefined}));
        assert.equal (ChatBot.parseGreeting ([],
                                             {'Remaining': [],
                                              'Parsed': undefined}));
        assert.equal (ChatBot.parseGreeting (["Is", "one", "of", "them", "a", "question", "?"],
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
                                                                    {'Type': ChatBot.TERMINATOR,
                                                                     'Value': '?'}]}}));
        assert.equal (ChatBot.parseGreeting (["Is", "one", "of", "them", "a", "question", "?",
                                              "Here", "is", "a", "statement", "."],
                                             {'Remaining': ["Here", "is", "a", "statement", "."],
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
                                                                    {'Type': ChatBot.TERMINATOR,
                                                                     'Value': '?'}]}}));
    });
});
