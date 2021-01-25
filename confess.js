exports.confess = function(message, bot) {
    if (message.author == bot.user) {
            return
    }
  
    var args = message.content.split(' ');
    var cmd = args[0].toLowerCase();
    switch(cmd) {
        case 'help':
        case '!help':
            message.author.send('send (channel name) (message)```Sends a message to specified channel```');
            break;
        case 'send':
        case 's':
            if (args.length < 2){
                message.author.send('Specify a channel to send to.');
            } else if (args.length < 3) {
                message.author.send('Enter a message to send.');
            } else {
                checkForChannel(message, args[1], bot); 
            }
            break;
    }
}

function checkForChannel(msg, channelName, bot) {
    var sent = false;
    bot.guilds.cache.each(guild => {
        if(guild.member(msg.author)) {
            const channel = guild.channels.cache.find(chan => chan.name === channelName);
            if(channel && channel.type == 'text') {
                var msgArr = msg.content.split(' ');                
                if (msg.author.id == '456529391602892812') {
                  channel.send(msgArr.slice(2,msgArr.length).join(' ') + ' -- sent by <@456529391602892812> ')
                } else {
                  channel.send(msgArr.slice(2,msgArr.length).join(' '));
                }
                msg.react('706312633871106142');  
                sent = true;                              
            }
        }        
    });
    if (!sent) {
        msg.author.send('Matching channel not found.')
    }
}