/* Special thanks to:
 *  - https://github.com/MostlyAdequate/
 *  - https://scotch.io/tutorials/building-a-slack-bot-with-node-js-and-chuck-norris-super-powers
 *
 * For example code and guidance, upon which this utility library is
 * based in the case of the bot utilities and borrowed in the case of
 * the IO monad.
 */

var _ = require ('ramda');
var Bot = require ('slackbots');

var BOT_NAME = 'fp';

var settings = {
    token: 'xoxb-33507943538-ulJHRTV2kV25pFz4ccNsh6Wh',
    name: BOT_NAME};

var bot = new Bot (settings);

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
    return IO.of (function () {
        return bot.channels;
    });
}

// Message -> String -> ();
var repl = _.curry (function (bot, f) {
    var replyer = function (message) {
        var channel = getBotsChannels (bot).map (_.compose (_.head, _.filter (eq (message.channel))));
        channel.chain (function (channel) {
            replyBack (bot, channel, f (message));});
    };
    bot.onMessage (function (message) {
        replyer (message).unsafePerformIO ();});
}) (bot);

// ([String] -> String) -> ();
var startup = _.curry (function (bot, f) {
    IO.of (function () {
        replyBack (bot, bot.channels[0], f (bot.users));
    }).unsafePerformIO ();
}) (bot);

// Channel -> String -> IO String;
var replyBack = _.curry (function (bot, channel, reply) {
    return IO.of (function (){
        bot.postMessageToChannel (channel.name, reply, {as_user: true});
        return reply;
    });
});

// Int -> Message -> Bool
var isFromBotOfId = _.curry (function (botId, message) {
    return message.user = botId;
});

// a -> b -> Bool
var eq = _.curry (function (a, b) {
    return a === b;
});

// String -> String -> Bool
var eqIgnoreCase =  _.curry (function (a, b) {
    return a.toLowerCase () == b.toLowerCase ();
});

// [String] -> String -> Bool
var isOneOfIgnoreCase = _.curry (function (xs, y) {
    return _.any (eqIgnoreCase (y), xs);
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

// IO Monad definition;

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

// Maybe;
var Maybe = function(x) {
    this.__value = x;
};

Maybe.of = function(x) {
    return new Maybe(x);
};

Maybe.prototype.isNothing = function(f) {
    return (this.__value === null || this.__value === undefined);
};

Maybe.prototype.map = function(f) {
    return this.isNothing() ? Maybe.of(null) : Maybe.of(f(this.__value));
};

Maybe.prototype.chain = function(f) {
    return this.map(f).join();
};

Maybe.prototype.ap = function(other) {
    return this.isNothing() ? Maybe.of(null) : other.map(this.__value);
};

Maybe.prototype.join = function() {
    return this.isNothing() ? Maybe.of(null) : this.__value;
};

Maybe.prototype.inspect = function() {
    return 'Maybe('+inspect(this.__value)+')';
};

module.exports = reply, startup, botname;
