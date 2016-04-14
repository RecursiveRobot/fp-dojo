var ChatBot = require ('../lib/chatbot');
var util = require ('util');

console.log (ChatBot.initialGreeting ([]));

process.stdin.on ('data', function (text) {
    console.log (ChatBot.reply (text));
});
