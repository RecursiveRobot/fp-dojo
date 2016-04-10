var _ = require ('ramda');

function isChatMessage (message) {
    return message.type === 'message' && Boolean(message.text);
}

function isChannelConversation (message) {
    return typeof message.channel === 'string' &&
        message.channel[0] === 'C';
}

function channelById (id) {
    return _.compose (_.head, _.filter (_.compose (eq (id), _.prop ('id'))));
};

function getBotsChannels (bot) {
    return new _.IO (function () {
        return bot.channels;
    });
}

var replyBack = _.curry (function (channel, reply) {
    new _.IO (function (){
        self.postMessageToChannel (channel.name, reply, {as_user: true});
        return reply;
    });
});

var isFromBotOfId = _.curry (function (botId, message) {
    return message.user = botId;
});

var eq = _.curry (function (a, b) {
    return a === b;
});
