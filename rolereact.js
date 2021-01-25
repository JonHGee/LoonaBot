let loonaroles = ['608367331889905692','608367602842075146','608364574210785321', '608367203431088144', '608367406762426368', '608367258334527502', '608367702347612213', '608366811242561536', '608367090889392150','608367802893467678','608367485842096148','608368025808404499']

//Bossing Add
exports.addReact = function(react, user) {  
	//console.log(`${react.message.author.username}'s message "${react.message.content}" gained a reaction!`)
	//Lomien Carry
  if(react.emoji.toString() == '🇱') {
		react.message.guild.members.fetch(user).then(usr => {
			usr.roles.add('712739550463655957');
		});			
	}
  //Hmag Carry
	if(react.emoji.toString() == '🇲') {
		react.message.guild.members.fetch(user).then(usr => {
			usr.roles.add('712739591953580080');
		});			
	}
  //CRA Carry
	if(react.emoji.toString() == '🇨') {
		react.message.guild.members.fetch(user).then(usr => {
			usr.roles.add('759290091633508362');
		});			
	}
  //Gollux Carry
  if(react.emoji.toString() == '🇬') {
		react.message.guild.members.fetch(user).then(usr => {
			usr.roles.add('735369730432696332');
		});			
	}
  //CRA
	/*if(react.emoji.toString() == '🐍') {
		react.message.guild.members.fetch(user).then(usr => {
			usr.roles.add('705163957639315504');
		});			
	}*/
  //Lomien
	if(react.emoji.toString() == '🍜') {
		react.message.guild.members.fetch(user).then(usr => {
			usr.roles.add('705164150166519869');
		});			
	}
  //Lucid
	if(react.emoji.toString() == '🦋') {
		react.message.guild.members.fetch(user).then(usr => {
			usr.roles.add('705164193032306778');
		});			
	}
	return;
  
}

//Bossing Remove
exports.removeReact = function(react, user) {  
	//console.log(`${react.message.author.username}'s message "${react.message.content}" gained a reaction!`)
	//Lomien Carry
  if(react.emoji.toString() == '🇱') {
		react.message.guild.members.fetch(user).then(usr => {
			usr.roles.remove('712739550463655957');
		});			
	}
  //Hmag Carry
	if(react.emoji.toString() == '🇲') {
		react.message.guild.members.fetch(user).then(usr => {
			usr.roles.remove('712739591953580080');
		});			
	}
  //CRA Carry
	if(react.emoji.toString() == '🇨') {
		react.message.guild.members.fetch(user).then(usr => {
			usr.roles.remove('759290091633508362');
		});			
	}
  //Gollux Carry
  if(react.emoji.toString() == '🇬') {
		react.message.guild.members.fetch(user).then(usr => {
			usr.roles.remove('735369730432696332');
		});			
	}
  //CRA
  /*
	if(react.emoji.toString() == '🐍') {
		react.message.guild.members.fetch(user).then(usr => {
			usr.roles.remove('705163957639315504');
		});			
	}
 */
  //Lomien
	if(react.emoji.toString() == '🍜') {
		react.message.guild.members.fetch(user).then(usr => {
			usr.roles.remove('705164150166519869');
		});			
	}
  //Lucid
	if(react.emoji.toString() == '🦋') {
		react.message.guild.members.fetch(user).then(usr => {
			usr.roles.remove('705164193032306778');
		});			
	}
	return;	
}

exports.activityAdd = function(react,user) {
  //flag race
  if(react.emoji.toString() == '🏳️') {
		react.message.guild.members.fetch(user).then(usr => {
			usr.roles.add('725081284539580496');
		});			
	}
  //gpq
	if(react.emoji.toString() == '👯') {
		react.message.guild.members.fetch(user).then(usr => {
			usr.roles.add('724719402498392097');
		});			
	}
}

exports.activityRemove = function(react, user) { 
  //flag race
  if(react.emoji.toString() == '🏳️') {
		react.message.guild.members.fetch(user).then(usr => {
			usr.roles.remove('725081284539580496');
		});			
  }
  //gpq
	if(react.emoji.toString() == '👯') {
		react.message.guild.members.fetch(user).then(usr => {
			usr.roles.remove('724719402498392097');
		});			
	}
}

exports.loonareact = function(react,user) {
  if(react.id) {
    react.remove();
    return;
  }
  
  react.message.guild.members.fetch(user).then(usr => {
    usr.roles.cache.filter(role => loonaroles.includes(role.id)).map(role => role.id).forEach(loonarole =>usr.roles.remove(loonarole));
  });	
  react.message.reactions.cache.get(react.emoji.toString()).users.remove(user);
  
  //HaSeul
  if(react.emoji.toString() == '🐦'){
		react.message.guild.members.fetch(user).then(usr => {
			usr.roles.add('608367203431088144');
		});			
	}
  //Choerry
  if(react.emoji.toString() == '🦇'){
		react.message.guild.members.fetch(user).then(usr => {
			usr.roles.add('608367485842096148');
		});			
	}
  //ViVi
	if(react.emoji.toString() == '🦌'){
		react.message.guild.members.fetch(user).then(usr => {
			usr.roles.add('608367331889905692');
		});			
	}
  //HeeJin
  if(react.emoji.toString() =='🐰'){ 
		react.message.guild.members.fetch(user).then(usr => {
			usr.roles.add('608366811242561536');
		});			
	}
  //KimLip
	if(react.emoji.toString() == '🦉'){
		react.message.guild.members.fetch(user).then(usr => {
			usr.roles.add('608367406762426368');
		});			
	}
  //OliviaHye
  if(react.emoji.toString() == '🐺'){
		react.message.guild.members.fetch(user).then(usr => {
			usr.roles.add('608368025808404499');
		});			
	}
  //Yves
	if(react.emoji.toString() == '🦆'){
		react.message.guild.members.fetch(user).then(usr => {
			usr.roles.add('608367602842075146');
		});			
	}
  //HyunJin
	if(react.emoji.toString() == '🐱'){
		react.message.guild.members.fetch(user).then(usr => {
			usr.roles.add('608367090889392150');
		});			
	}
  //Chuu
  if(react.emoji.toString() == '🐧'){
		react.message.guild.members.fetch(user).then(usr => {
			usr.roles.add('608367702347612213');
		});			
	}
  //YeoJin
  if(react.emoji.toString() == '🐸'){
		react.message.guild.members.fetch(user).then(usr => {
			usr.roles.add('608367258334527502');
		});			
	}
  //JinSoul
  if(react.emoji.toString() == '🐟'){
		react.message.guild.members.fetch(user).then(usr => {
			usr.roles.add('608364574210785321');
		});			
	}
  //GoWon
  if(react.emoji.toString() == '🦋'){
		react.message.guild.members.fetch(user).then(usr => {
			usr.roles.add('608367802893467678');
		});			
	}
}