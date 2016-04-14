var Util = require ('./util');
var ChatBot = require ('../lib/chatbot');

// Tie bot to incoming messages and startup;
Util.repl (ChatBot.reply);
Util.startup (ChatBot.initialGreeting);
