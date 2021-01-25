var Discord = require('discord.js');
var auth = require('./auth.json');
var ci = require('./ci.js');
var gpt = require('./gpt.js');
var estat = require('./estat.js');
var confess = require('./confess.js');
var https = require('https');
const fuzzyset = require('fuzzyset.js');
const mongo = require('mongodb').MongoClient;
var schedule = require('node-schedule');
var rolereact = require('./rolereact.js');
var ffmpeg = require('ffmpeg');
const net = require('net');

/*
Guild PQ - 724719402498392097
Flag Race - 725081284539580496
*/

var timeoutObj;
var tervor = true;
const uri = auth.db;
//const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour:'numeric', minute:'numeric' };

// Initialize Discord Bot
const bot = new Discord.Client({ partials: ['MESSAGE', 'REACTION'] });
bot.login(auth.token);

//Bot startup. Gives a console confirmation, updates database with any new custom emojis, and populates custom emoji list
bot.on('ready', function (evt) {
    console.log(new Date(Date.now()).toLocaleDateString(undefined, options)+': Connected. Logged in as:' + bot.user.tag);    
	bot.user.setActivity("you ( ͡° ͜ʖ ͡°)", {type: "WATCHING"});
	bot.channels.fetch('598171272433631233').then(channel => channel.fetch('715627218297946183').then(message => console.log('bossing message cached')));
	bot.channels.fetch('608396146150342722').then(channel => channel.fetch('725103872770572378').then(message => console.log('activity message cached')));
  bot.channels.fetch('608396146150342722').then(channel => channel.fetch('725103824942923856').then(message => console.log('member message cached')));  
  //bot.channels.fetch('712713011797950606').then(channel => channel.send('<@&725081284539580496> FLAG SOON FLAG SOON FLAG SOON FLAG SOON '))
	estat.init(bot);
	gpt.init(bot);
	/*
	bot.guilds.cache.forEach((guild) => {
        console.log(" - " + guild.name);
	
        // List all channels
        guild.channels.cache.forEach((channel) => {
            console.log(` -- ${channel.name} - ${channel.id} - ${channel.type}`);
        });
    });
	*/
	
});


bot.on('message', (message) => {
  //console.log(message.content);

  //Logs DMs to the bot.  Sends confessions to confess file.
	if(message.channel.type == 'dm') {
		console.log(new Date(Date.now()).toLocaleDateString(undefined, options)+ ': '+message.content +' -- '+message.author.username);
    confess.confess(message, bot);
    return;
	}
	
  //Ignores message if the bot sends it. Prevents infinite loops
	if (message.author.bot) {
        return
    }
	
  //
  if(message.channel.id == '612690642589581424' || message.channel.id == '720003001485361213') {
      message.delete({ timeout: 600000 });
  }
  
  if(message.channel.id == '795768520017051659' && message.author.id != '752059488806240286') {
      message.delete({ timeout: 30000 });
  }
  795768520017051659
	//console.log(message.content);
	
	//Command list
	if (message.content.substring(0, 1) == '!') {
      var args = message.content.substring(1).split(' ');
      var cmd = args[0].toLowerCase();
	
      switch(cmd) {	
      //T E R V :DOG:
      case 'terv':
        if(tervor == false) {
          tervor = true;
        }
        break;
      
      //Emoji stats  		
			case 'estat':
				estat.estat(message, args, bot);
				break;
			
      //insults 	
			case 'insult':
			case 'i':
				ci.insult(message, args);
				break;
				
			//randomly generates insult from template
			case 'insult2':
			case 'i2':
				ci.insult2(message, args);
				break;
				
			//gives a coimpliment.
			case 'compliment':
			case 'c':
				ci.compliment(message, args);
				break;
			
      //rolls multiple sided die.  Rolls one(1) 100 sided die by default.
      case 'roll':
        if (args[1]) {
      		var dice = args[1].split('d');
      		if (dice.length == 1) {
      			message.channel.send(Math.ceil(Math.random()*dice[0]));
      		} else {
      			var i;
      			var msg = '';
      			for(i = 0; i< dice[0]; i++) {
      				msg = msg + ', ' + Math.ceil(Math.random()*dice[1]);
      			}
      			message.channel.send(msg.substring(2));
      		}		
      	} else {
      		message.channel.send(Math.ceil(Math.random()*100));
      	}
      	break;
      
      //Compiles a list of all custom emojis on server and sends them in multiple messages. 
      case 'emojilist':
      case 'elist':
        //maps all custom emojis to emojiList
      	const emojiList = message.guild.emojis.cache.map(e=>e.toString()).join(" ");
      	if(emojiList) {
          //sends 25 emojis at a time
      	  var arr = emojiList.split(" ");
          var r = [];
          while (arr.length) {
            r.push(arr.splice(0,25).join(" "))
          } 
          r.forEach(str => message.channel.send(str));
      	} else {
      		message.channel.send('No custom emojis on server');
      	}
      	break;      
      
      //Carry sign up 
      case 'carry':
        //Only posts in certain channels.  Botmster domain, Carries in Loona.  Carries in saku.
				if(message.channel.id == '612690642589581424' || message.channel.id == '712713011797950606' || message.channel.id == '598171272433631233' || message.channel.id ==     '720003001485361213') {
          //Checks for at least name of boss carrying.
					if(!args[1]) {
						message.channel.send('Specifiy what boss you are carrying.\nFormat: !carry [boss] [time from now] [slots(optional)]');
						return;
					}
          var notes = "none";
          //if only boss name specified, Defaults the rest.            
					if(!args[2]) {
						var timeleft = 'very soon';
            var spots = 5;
          //If a second argument exists and is numeric, takes it as spots available
					} else if(args[2] && isNumeric(args[2])) {
            var spots = args[2];
            var timeleft = 'very soon';
          } else {
            //If second argument exists and isnt numeric, takes it as time left. Specified as xdyhzm
						if(args[2].split('d')[1]) {
							var hrmin = args[2].split('d')[1];
							var days = args[2].split('d')[0];
						} else if (isNumeric(args[2].split('d')[0])) {
							var days = args[2].split('d')[0];
						} else {						
							var hrmin = args[2];						
						}
						if (hrmin) {
							if(hrmin.split('h')[1]) {
								var min = hrmin.split('h')[1];
								var hr = hrmin.split('h')[0];
							} else if (isNumeric(hrmin.split('h')[0])) {
								var hr = hrmin.split('h')[0];
							} else {
								var min = hrmin.split('h')[0];
							}
							if(min && min.split('m')[0]) {
								var mins = min.split('m')[0];
							}
						}
						var timeleft = 'in';
						if (days)
							timeleft = timeleft + ` ${days} days`;
						if (hr)
							timeleft = timeleft + ` ${hr} hours`;
						if (mins)
							timeleft = timeleft + ` ${mins} minutes`;
					
					
  					if(args[3] && isNumeric(args[3])) {
  						var spots = args[3];
              if(args[4]) {
                notes = args.slice(4,args.length).join(' ');
              }
  					} else {
  						var spots = 5;
  					}
         }
          if (message.channel.id == '720003001485361213') {
            message.channel.send(`${message.author} is carrying __**${args[1]}**__ ${timeleft}.`+
              `\nParty will be meeting at Saku HQ`+
  						`\n${spots} spots available in the party.` +
  						`\nHit the react below to reserve your spot!` +
              `\nNotes: ${notes}`)
  					.then(msg => {
  						msg.react('🤡');
  					}); 
          } else {           
  					message.channel.send(`${message.author} is carrying __**${args[1]}**__ ${timeleft}.`+
              `\nParty will be meeting at Ch 12 - Guild HQ (Elodin - Deep Forest Clearing)!`+
  						`\n${spots} spots available in the party.` +
  						`\nHit the react below to reserve your spot!` +
              `\nNotes: ${notes}`)
  					.then(msg => {
  						msg.react('🤡');
  					});	
          }	
				}
				break;
			
      case 'gpt':
				gpt.gpt(message, args, bot);
				break;
        
      case 'bet':
				gpt.bet(message, args, bot);
				break;
      	
			case 'embed1': 
				//break;
				const bossingEmbed = {
					color: 0x9900ff,
					title: 'Loonaverse Bossing!',	
					
					description: '__**Bossing Info**__\n'+
						':white_small_square: Do not ask for carries.  Carries will post in #carries when they are offering.  Sign up there.\n'+
						':white_small_square: In general, carry priority will go to mains over mules(may differ by carry).\n'+
						':white_small_square: To sign up to be notified of specific boss carries, see below.\n'+
						':white_small_square: If you\'re looking to form a non-carry party, react on the corresponding emojis to be added to each bossing channel.\n\n'+
						'__**React for Carries**__\n'+
						'🇲 Hard Magnus | 🇨 CRA | 🇱 Lomien | 🇬 Gollux\n\n'+
						'__**React for Boss Parties(non-carry)**__\n'+
						'🐍 CRA | 🍜 Lomien | 🦋 Lucid',
					
					
				};
        //bot.channels.fetch('598171272433631233').then(channel => channel.fetch('712737855796936787').then(msg => msg.edit(embed:exampleEmbed)));
        break;
				message.channel.send({ embed: bossingEmbed }).then(async function (msg) {
					await msg.react('🇲');
					await msg.react('🇨');
					await msg.react('🇱');
    	    await msg.react('🇬');
					await msg.react('🐍');
					await msg.react('🍜');
					await msg.react('🦋');
				});
				
				break;
        
      case 'embed2':
        break;
        const loonaEmbed = {
					color: 0x9900ff,
					title: 'Welcome to Loona!',	
					
					description: '__**Pick roles for your LOONA bias!**__\n'+
						'You may only have one role at a time. \n'+
            'Assigning a new role will overwrite your previous role. \n\n'+
            '__**React for Roles**__\n'+
						':bird:HaSeul  |  :bat:Choerry  |  :deer:ViVi  |  :rabbit:HeeJin\n '+
            ':owl:KimLip  |  :wolf:OliviaHye  |  :duck:Yves  |  :cat:HyunJin\n'+
            ':penguin:Chuu  |  :frog:YeoJin  |  :fish:JinSoul  |  :butterfly:GoWon\n'+
            ':x:Remove Role/Color\n\n',
            "image": {
                "url": "https://i.imgur.com/4wqeXxT.png"
            }				
				};

				message.channel.send({ embed: loonaEmbed }).then(async function (msg) {
					await msg.react('🐦');
          await msg.react('🦇');
					await msg.react('🦌');
					await msg.react('🐰');
					await msg.react('🦉');
          await msg.react('🐺');
					await msg.react('🦆');
					await msg.react('🐱');
          await msg.react('🐧');
          await msg.react('🐸');
          await msg.react('🐟');
          await msg.react('🦋');
          await msg.react('❌');
				});
				
				break;
        
      case 'embed3':
        break;
        const guildEmbed = {
					color: 0x9900ff,
					title: 'Please participate in guild activities!',	
					
					description: '__**Guild Activities**__\n'+						
						'**Guild PQ - Helps get skill points for guild skills.** \n' +
            'Every Saturday 2 hours before reset.\n\n'+
            '**Flag Race - Helps us get skill points for guild skills.**\n'+
            'Flag Race times: \n' +
            'UTC: 12PM, 7PM, 9PM, 10PM, 11PM. \n'+
            'PDT: 5AM, 12PM, 2PM, 3PM, 4PM. \n'+
            'EDT: 8AM, 3PM, 5PM, 6PM, 7PM. \n\n' +
						':white_small_square: To sign up to be notified of guild activities, see below.\n'+						
						'__**React for Notifications**__\n'+
						'🏳️ Flag Race | 👯 GPQ',
					
					
				};
        //bot.channels.fetch('598171272433631233').then(channel => channel.fetch('712737855796936787').then(msg => msg.edit(embed:exampleEmbed)));
        //break;
				message.channel.send({ embed: guildEmbed }).then(async function (msg) {
					await msg.react('🏳️');
					await msg.react('👯');
					await msg.react('👍');
				});
				
				break;
		}
    }
	
	  estat.regex(message);
	
    //if(message.author.id == '152364354719842304') {
    if(message.author.id == '229469957891686400') {
        if(tervor == true) {
          terv(message);
          tervor = false;
        }        
    }
    
    //if(message.author.id == '152364354719842304' && message.content.includes('popular')) {
    if(message.author.id == '168969427830833152' && message.content.includes('popular')) {
        prom(message);
    }
    
});


async function prom(message) {
    //2 P R O M D A T E S
    await message.react('2️⃣');
    await message.react('🇵'); //P
    await message.react('🇷'); //R
    await message.react('🇴'); //O
    await message.react('🇲'); //M
    await message.react('🇩'); //D
    await message.react('🇦'); //A
    await message.react('🇹'); //T
    await message.react('🇪'); //E
    await message.react('🇸'); //S
}

//T E R V :DOG:
async function terv(message) {
    await message.react('🇹');
    await message.react('🇪');
    await message.react('🇷');
    await message.react('🇻');
    await message.react('🐕');
}

//Checks if the argument is a number
function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}


//Send a GPQ Notice 24 hours ahead of time to #main
var gpq24hr = schedule.scheduleJob('30 2 * * 7', async function() {
	bot.channels.fetch('605240626262442008').then(channel => channel.send('<@&724719402498392097> Friendly reminder that GPQ will be taking place 24 hours from now! Sign off on the spreadsheet if you\'re coming! \nhttps://docs.google.com/spreadsheets/d/1qcAXIms2zfdDb2HhWF9ESbPLmTtH8vJ_jMxWPwEcDKs/edit#gid=0'))
});

//Send a GPQ Notice 30 minutes ahead of time to #main
var gpq30min = schedule.scheduleJob('0 2 * * 1', async function() {
	bot.channels.fetch('605240626262442008').then(channel => channel.send('<@&724719402498392097> Friendly reminder that GPQ will be happening in 30 minutes! Prepare your links, legion, equips, etc! @<186161400278679552> will start making parties now! \nhttps://docs.google.com/spreadsheets/d/1qcAXIms2zfdDb2HhWF9ESbPLmTtH8vJ_jMxWPwEcDKs/edit#gid=0'))
});

//Sends a Flag notice 5 minutes before each flag race
var flagprep = schedule.scheduleJob('55 11,18,20,21,22 * * *', async function() {
	bot.channels.fetch('605240626262442008').then(channel => channel.send('<@&725081284539580496>FLAG SOON FLAG SOON FLAG SOON FLAG SOON '))
});

//tts stuff
const server = net.createServer((socket) => {
  socket.on('data', (data) => {    
    var words = data.toString().replace(/(\r\n|\n|\r)/gm,"").replace(/ +/g,' ').split(" ");
    var id = words[0];
    words = words.slice(1).join('+');
    console.log(words);
    sendBind(id, words);
  });
  socket.write('SERVER: Hello! This is server speaking.<br>');
  socket.end('SERVER: Closing connection now.<br>');
}).on('error', (err) => {
  console.error(err);
});
// Open server on port 9001
server.listen(9001, () => {
  console.log('opened server on', server.address().port);
});

//sends tts though google translate api
sendBind = async function (id, message) {
  if(timeoutObj) {
    clearTimeout(timeoutObj);
  }
  bot.guilds.cache.each(guild => guild.members.fetch(id).then(user => {
      if(user.voice.channel) {
          user.voice.channel.join().then(connection => {
              connection.play(`https://translate.google.com.vn/translate_tts?ie=UTF-8&q=${message}&tl=en&client=tw-ob`);
          })
      }
  }));
  timeoutObj = setTimeout(() => {
    bot.voice.connections.each(connection => {
        connection.disconnect();
    })
  }, 300000);
}

//Updates the database when a new React is added to a message
bot.on('messageReactionAdd', async (react, user) => {
	if (react.partial) {
		// If the message this reaction belongs to was removed the fetching might result in an API error, which we need to handle
		try {
			await react.fetch();
		} catch (error) {
			console.log('Something went wrong when fetching the message: ', error);
			// Return as `reaction.message.author` may be undefined/null
			return;
		}
	}
  if(react.message.channel.type == 'dm') {
      return;
  }
	
  //bossing message
	if (react.message.id == '735373443276734535') {
		rolereact.addReact(react,user);
		return;
	}	
 
  if (react.message.id == '725209993879486495') {
		rolereact.activityAdd(react,user);
		return;
	}
  
  if (react.message.id == '725209663448023061') {
    rolereact.loonareact(react,user);
    return;
  }	
 
	if ((react.message.channel.id == '612690642589581424' || react.message.channel.id == '720003001485361213' || react.message.channel.id == '712713011797950606') && react.emoji.toString() == '🤡' && react.message.author == bot.user && user != bot.user) {
  		
		const lines = Number(react.message.content.split('\n').length);
    //react.message.channel.send(lines);
		const spots = Number(react.message.content.split('\n')[2].substring(0,1));
		if (lines < (spots+5)) {			
			const pos = lines - 4;
			react.message.edit(`${react.message.content}\n${pos}. ${user}`);
		} else if(lines == (spots+5)){
			react.message.edit(`${react.message.content}\n**WAITLIST**\n1. ${user}`);
		} else {
			const pos = lines - (spots + 5);
			react.message.edit(`${react.message.content}\n${pos}. ${user}`);
		}
	}
	
	if(!react.message.author.bot && !user.bot) {
		estat.addReact(react, user);
	}
});

//Updates the database when a new React is removed from a message
bot.on('messageReactionRemove', async (react, user) => {
	if (react.partial) {
		// If the message this reaction belongs to was removed the fetching might result in an API error, which we need to handle
		try {
			await react.fetch();
		} catch (error) {
			console.log('Something went wrong when fetching the message: ', error);
			// Return as `reaction.message.author` may be undefined/null
			return;
		}
	}
  if(react.message.channel.type == 'dm') {
      return;
  }
	
	if (react.message.id == '735373443276734535') {
		rolereact.removeReact(react,user);
		return;
	}	
  
  if (react.message.id == '725209993879486495') {
		rolereact.activityRemove(react,user);
		return;
	}	
	
	if ((react.message.channel.id == '612690642589581424' || react.message.channel.id == '720003001485361213' || react.message.channel.id == '712713011797950606') && react.emoji.toString() == '🤡' && react.message.author == bot.user && user != bot.user) {		
		var msgs = react.message.content.split('\n');
		//console.log(msgs + '\n'+ react.emoji.name);
		var line = 5;
		for(i = 5; i<msgs.length;i++) {
			if(msgs[i].includes(user)) {
				line = i;
				break;
			}
		}
		for(i = line; i<msgs.length-1;i++) {
			if(msgs[i+1] == '**WAITLIST**') {
				msgs[i] = `${msgs[i].split(" ")[0]} ${msgs[i+2].split(" ")[1]}`;
				i++;
			}
			else {
				msgs[i] = `${msgs[i].split(" ")[0]} ${msgs[i+1].split(" ")[1]}`;
			}
		}
		msgs.pop();
		if(msgs[msgs.length-1] == '**WAITLIST**') 
			msgs.pop()
		react.message.edit(msgs);
	}
	
	if(!react.message.author.bot && !user.bot) {
		estat.removeReact(react, user);
	}
});

//Updates the database when a new emoji is added to a server
bot.on('emojiCreate', (emoji) => {
	estat.emojiCreate(emoji);
});

//Updates the database when an emoji is removed from a server
bot.on('emojiDelete', (emoji) => {
	estat.emojiRemove(emoji);
});

//Updates the database when an emoji is changed in a server
bot.on('emojiUpdate', (oldemoji, newemoji) => {
	estat.emojiUpdate(oldemoji, newemoji);
});

bot.on('guildMemberAdd', (guildMember) => {
  console.log(guildMember.nickname);
  // guildMember.roles.add('775882300042248212');
   bot.channels.fetch('775878842455031818').then(channel => channel.send(`Welcome <@${guildMember.id}> to LOO??VERSE :crescent_moon: \n`+
   `Please read <#605244024730681364>, introduce yourself in <#605244047820324875>, and change your discord nickname to your IGN or preferred name.\n` +
   `We hope you enjoy your stay! #Goonaverse`));
});

//605240626262442008