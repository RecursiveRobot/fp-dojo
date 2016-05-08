var ChatBot = require ('./chatbot');

console.log (ChatBot.initialGreeting ([]));

process.stdin.on ('data', function (text) {
    console.log (ChatBot.reply (text.toString ()));
});
