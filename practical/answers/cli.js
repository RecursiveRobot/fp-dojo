var ChatBot     = require ('./chatbot');
var Interpreter = require ('./interpret');

console.log (ChatBot.initialGreeting ([]));

process.stdin.on ('data', function (text) {
    console.log (ChatBot.reply (Interpreter.replySentence, text.toString ()));
});
