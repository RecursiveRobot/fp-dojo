'use strict';

var Util = require ('util');
var Bot = require ('slackbots');

var settings = {
    token: 'xoxb-33507943538-ulJHRTV2kV25pFz4ccNsh6Wh',
    name: 'fp'};

var bot = new Bot (settings);

bot.on ('message', undefined);
bot.on ('start', undefined);

