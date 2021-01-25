var auth = require('./auth.json');
const mongo = require('mongodb').MongoClient;

const uri = auth.db;

exports.init = function(bot) {
	mongo.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, (err,client) => {
		const collection = client.db("loona_tracker").collection("gpoints");
		//updates server specific database
		bot.guilds.cache.forEach(guild => {
			guild.members.cache.forEach((member, memberid) => {
				if(!member.user.bot) {
					collection.updateOne(
						{'server': guild.id, 'id': memberid, 'level': 1}, 
						{$setOnInsert: {'points': 1000}},
						{upsert:true}
					)
				} else {
					collection.deleteOne(
						{'server': guild.id, 'id': memberid})
				}
			})
		})
		client.close();
	});
}

exports.gpt = function(message, args, bot) {
	if (args[1]) { 
		var ecmd = args[1].toLowerCase();
		switch(ecmd) {
			case 'help':
				message.channel.send(
				'```GPT Commands currently supported \n'+
				'***NAME must be a tagged user in these commands***\n'+
				'!gpt: Top 10 people with the most points on server \n'+
				'!gpt (name): Shows user\'s point balance.\n'+
				'!gpt give (name) (amount): Gives a user some points from your own balance\n'+
				'!gpt set (name) (amount): *ADMIN ONLY* Sets user\'s points to specified amount```'
				);
				break;
			
			case 'gift':
			case 'give':
				if(args[2] && args[3] && !isNaN(args[3]) && Math.sign(args[3]) == 1) {
					//console.log(Math.sign(args[3]));
					var usr = args[2].match(/<@\d{18}>/);
					var usr2 = args[2].match(/<@!\d{18}>/);
					if (usr || usr2) {
						if (usr) {
							var userid = args[2].substring(2, args[2].length-1);
						} else {
							var userid = args[2].substring(3, args[2].length-1);
						}
						//console.log('Step 1');
						mongo.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, (err,client) => {
							const collection = client.db("loona_tracker").collection("gpoints");
							collection.findOne({'id' : message.author.id, 'server': message.guild.id}, (err, result) => {
								if(result.points >= args[3]) {
									//console.log('Step 2');
									collection.updateOne(
										{'server': message.guild.id, 'id': message.author.id}, 
										{$inc: {'points': -Number(args[3])}},
										{upsert:true}
									);
									collection.updateOne(
										{'server': message.guild.id, 'id': userid}, 
										{$inc: {'points': Number(args[3])}},
										{upsert:true}
									);
									var msg = `${args[3]} points transferred. New GPoint Balances:\n`;
									collection.findOne({'id' : message.author.id, 'server': message.guild.id}, (err, result1) => {
										msg = msg + `${message.author}: ${result1.points}\n`;
										//console.log(msg + `${message.author}: ${results.points}`)
									});
									collection.findOne({'id' : userid, 'server': message.guild.id}, (err, result2) => {
										msg = msg + `${args[2]}: ${result2.points}\n`;
										message.channel.send(msg);
									});
									client.close();
									//message.channel.send(msg);
								} else {
									message.channel.send(`Not enough points. You only have ${result.points} points.`);
									client.close();
								}
							});
						});	
					} else {
						message.channel.send('Recipient not found.\n'+
											'Format !gpt give @user #points');
					}
				} else if (args[2]) {
					message.channel.send('Specify an amount of points to give!\n'+
											'Format !gpt give @user #points');
				} else {
					message.channel.send('Specify a recipient!\n'+
											'Format !gpt give @user #points');
				}
				break;
			
			case 'set':
				if(message.member.hasPermission("ADMINISTRATOR") && args[2] && args[3] && !isNaN(args[3]) && Math.sign(args[3]) == 1) {
					var usr = args[2].match(/<@\d{18}>/);
					var usr2 = args[2].match(/<@!\d{18}>/);
					if (usr || usr2) {
						if (usr) {
							var userid = args[2].substring(2, args[2].length-1);
						} else {
							var userid = args[2].substring(3, args[2].length-1);
						}
						mongo.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, (err,client) => {
							const collection = client.db("loona_tracker").collection("gpoints");
							collection.updateOne(
								{'server': message.guild.id, 'id': userid}, 
								{$set: {'points': Number(args[3])}},
								{upsert:true} 
							);
							message.channel.send(`${args[2]}\'s GPoint Balance: ${args[3]}\n`);
						client.close();
						});
					}
				}
				break;
			
			default:
				var usr = ecmd.match(/<@\d{18}>/);
				var usr2 = ecmd.match(/<@!\d{18}>/);
				if (usr || usr2) {
					if (usr) {
						var userid = ecmd.substring(2, ecmd.length-1);
					} else {
						var userid = ecmd.substring(3, ecmd.length-1);
					}
					/* bot.fetchUser(userid).then(function (user) {
						console.log(`estat user - ${user.username}`);
					}).catch (function () {
						console.log(`User ID ${userid} lookup unsuccessful`);
					}); */
					mongo.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, (err,client) => {
						const collection = client.db("loona_tracker").collection("gpoints");
						collection.findOne({'id' : userid, 'server': message.guild.id}, (err, result) => {
							message.channel.send(`${ecmd}\'s GPoint Balance: ${result.points}\n`);
						});		
					client.close();
					});
				}	
		}				
	} else {
		mongo.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, (err,client) => {
			const collection = client.db("loona_tracker").collection("gpoints");
			collection.
				find({'server' : message.guild.id}).
				sort({'points' : -1}).
				limit(10).
				project({'_id':0,'id':1,'points':1}).
				toArray(async function(err, results) {
					var msg = 'GPoint Leaderboard:\n';
					for(let x of results) {
						var usr = await bot.users.fetch(x.id);
						msg = msg + `${usr.username}: ${x.points}\n`;					
					}
					message.channel.send(msg);
			});
		
		client.close();
		});
	}
}

exports.bet = function(message, args, bot) { 
	if (args[1] && !isNaN(args[1]) && Math.sign(args[1]) == 1) {
		mongo.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, (err,client) => {
			const collection = client.db("loona_tracker").collection("gpoints");
			collection.findOne({'id' : message.author.id, 'server': message.guild.id}, (err, result) => {
				if(result.points >= args[1]) { 
					const userroll = Math.ceil(Math.random()*100);
					const houseroll = Math.ceil(Math.random()*(95)+5);
					var msg = `${message.author}'s roll: ${userroll}. \nHouse roll: ${houseroll}.`;
					if (userroll == houseroll) {
						msg = msg + `\nTied! Current Balance: ${result.points}`;
						client.close();
					} else if (userroll > houseroll) {
						msg = msg + `\nYou won ${args[1]} points!`+
						`\nCurrent Balance: ${result.points+Number(args[1])}`;
						collection.updateOne(
							{'server': message.guild.id, 'id': message.author.id}, 
							{$inc: {'points': Number(args[1])}},
							{upsert:true}
						);
						client.close();
					} else {
						msg = msg + `\nYou lost ${args[1]} points.`+
						`\nCurrent Balance: ${result.points-Number(args[1])}`;
						collection.updateOne(
							{'server': message.guild.id, 'id': message.author.id}, 
							{$inc: {'points': -Number(args[1])}},
							{upsert:true}
						);
						client.close();
					}
					message.channel.send(msg);					
				} else {
					message.channel.send(`Not enough points. You only have ${result.points} points.`);
				}
			})
		});
	} else {
		message.channel.send('Make a proper bet');
	}
}

exports.roll = function(message, args, bot) {
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
}

exports.incPoints = function (bot) {
	mongo.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, (err,client) => {
		const collection = client.db("loona_tracker").collection("gpoints");
		//updates server specific database
		bot.guilds.cache.forEach(guild => {
			guild.members.cache.forEach((member, memberid) => {
				if(!member.user.bot) {
					collection.updateOne(
						{'server': guild.id, 'id': memberid}, 
						{$inc: {'points': 1}},
						{upsert:true}
					)
				}
			})
		})
		client.close();
	});
}