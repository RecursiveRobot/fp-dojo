/* Special thanks to:
 *  - https://github.com/MostlyAdequate/
 *  - https://scotch.io/tutorials/building-a-slack-bot-with-node-js-and-chuck-norris-super-powers
 *
 * For example code and guidance, upon which this utility library is
 * based in the case of the bot utilities and borrowed in the case of
 * the IO monad.
 */

var _ = require ('ramda');

// String -> Bool
function isChatMessage (message) {
    return message.type === 'message' && Boolean(message.text);
}

// String -> Bool
function isChannelConversation (message) {
    return typeof message.channel === 'string' &&
        message.channel[0] === 'C';
}

// Int -> Channel
function channelById (id) {
    return _.compose (_.head, _.filter (_.compose (eq (id), _.prop ('id'))));
};

// Bot -> IO [Channel]
function getBotsChannels (bot) {
    return new _.IO (function () {
        return bot.channels;
    });
}

// Channel -> String -> IO String
var replyBack = _.curry (function (channel, reply) {
    new _.IO (function (){
        self.postMessageToChannel (channel.name, reply, {as_user: true});
        return reply;
    });
});

// Int -> Message -> Bool
var isFromBotOfId = _.curry (function (botId, message) {
    return message.user = botId;
});

// a -> b -> bool
var eq = _.curry (function (a, b) {
    return a === b;
});

// IO Monad definition

var IO = function(f) {
    this.unsafePerformIO = f;
};

IO.of = function(x) {
    return new IO(function() {
        return x;
    });
};

IO.prototype.map = function(f) {
    return new IO(_.compose(f, this.unsafePerformIO));
};

IO.prototype.join = function() {
    return this.unsafePerformIO();
};

IO.prototype.chain = function(f) {
    return this.map(f).join();
};

IO.prototype.ap = function(a) {
    return this.chain(function(f) {
        return a.map(f);
    });
};

IO.prototype.inspect = function() {
    return 'IO('+inspect(this.unsafePerformIO)+')';
};

var unsafePerformIO = function(x) { return x.unsafePerformIO(); };
