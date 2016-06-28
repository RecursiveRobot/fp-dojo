var E = require('./curry_exercises');
var assert = require("chai").assert;

function removeDuplicateWhitespace (x) {
    return x.replace (/ +/g, " ");
}

describe("Curry Exercises", function(){
    it('Exercise 1', function(){
        assert.deepEqual(E.words("Jingle bells Batman smells"), ['Jingle', 'bells', 'Batman', 'smells']);
    });
    it('Exercise 1a', function(){
        assert.deepEqual(E.sentences(["Jingle bells Batman smells", "Robin laid an egg"]), [['Jingle', 'bells', 'Batman', 'smells'], ['Robin', 'laid', 'an', 'egg']]);
    });
    it('Exercise 2', function(){
        assert.deepEqual(E.filterQs(['quick', 'camels', 'quarry', 'over', 'quails']), ['quick', 'quarry', 'quails']);
    });
    it('Exercise 3', function(){
        assert.equal(E.max([323,523,554,123,5234]), 5234);
    });
    it ("Split out punctuation", function () {
        assert.equal (removeDuplicateWhitespace (E.splitOutPunctuation ("")), "");
        assert.equal (removeDuplicateWhitespace (E.splitOutPunctuation (".")), " . ");
        assert.equal (removeDuplicateWhitespace (E.splitOutPunctuation ("?")), " ? ");
        assert.equal (removeDuplicateWhitespace (E.splitOutPunctuation ("!")), " ! ");
        assert.equal (removeDuplicateWhitespace (E.splitOutPunctuation ("This is a test")), "This is a test");
        assert.equal (removeDuplicateWhitespace (E.splitOutPunctuation ("This is a test.")), "This is a test . ");
        assert.equal (removeDuplicateWhitespace (E.splitOutPunctuation ("This is very strange. I have three fingers!")), "This is very strange . I have three fingers ! ");
        assert.equal (removeDuplicateWhitespace (E.splitOutPunctuation ("Is your name Bob? No, my name is Steve.")), "Is your name Bob ? No, my name is Steve . ");
    });
    it ("Filter non accepted characters", function () {
        assert.equal (E.filterNonAcceptedCharacters (""), "");
        assert.equal (E.filterNonAcceptedCharacters ("Blah $%@ hr#$"), "Blah  hr");
        assert.equal (E.filterNonAcceptedCharacters ("#$=="), "");
    });
    it ("Remove successive whitespace", function (){
        assert.equal (E.collapseSuccessiveWhitespaces (""), "");
        assert.equal (E.collapseSuccessiveWhitespaces ("  "), " ");
        assert.equal (E.collapseSuccessiveWhitespaces ("This  is a test  to see.  whether this    	  is working."),
                      "This is a test to see. whether this is working.");
    });
    it ('Initial greeting', function () {
        assert.equal (E.initialGreeting ([]), "Hello, anyone there?");
        assert.equal (E.initialGreeting (['Bob', 'Fred']), "Hello Bob and Fred!");
        assert.equal (E.initialGreeting (['Bob', 'Fred', 'Alice']), "Hello Bob, Fred and Alice!");
        assert.equal (E.initialGreeting (['Bob', 'Fred', 'Alice', 'Frank', 'Mary']), "Hello everyone!");;
        assert.equal (E.initialGreeting (['Bob']), "Hello Bob!");
    });
    if (E.slice != undefined) {
        it('Curry Bonus 1', function(){
            assert.deepEqual(E.slice(1)(3)(['a', 'b', 'c']), ['b', 'c']);
        });
    }
    if (E.take != undefined) {
        it('Curry Bonus 2', function(){
            assert.deepEqual(E.take(2)(['a', 'b', 'c']), ['a', 'b']);
        });
    }
});
