const Discord = require("discord.js");

const YTDL = require("ytdl-core");
const Forecast = require('forecast');
const PREFIX="!";
require('date-utils')
const client = new Discord.Client();
var servers ={};
// Initialize
var forecast = new Forecast({
  service: 'forecast.io',
  key: '689b9900b27decd43b0b036707f7c167',
  units: 'celcius',
  cache: true,
  ttl: {
    minutes: 27,
    seconds: 45
    }
});

function play(connection, message){
  var server = servers[message.guild.id];

  server.dispatcher = connection.playStream(YTDL(server.queue[0], {filter: "audioonly"}));

  server.queue.shift();
  server.dispatcher.on("end",function(){
    if (server.queue[0]) play(connection,message);
    else connection.disconnect();
  });
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", function(message){
  if(message.author.equals(client.user)) return;

  if(!message.content.startsWith(PREFIX)) return;

  var args = message.content.substring(PREFIX.length).split(" ");

  switch(args[0].toLowerCase()){
    case "play":
      console.log('ha');
      if(!args[1]) {
        message.channel.send("링크 연결!!!!");
        return;
      }
      console.log('ha');
      if(!message.member.voiceChannel) {
        message.channel.send("보이스 채널에 접속하야 함");
        return;
      }

      if(!servers[message.guild.id]) servers[message.guild.id]={
        queue: []
      };

      var server = servers[message.guild.id];

      server.queue.push(args[1]);

      message.member.voiceChannel.join().then(function(connection){
       console.log('ha');
       play(connection, message);
     });

      if(!message.guild.voiceConnection) message.member.voiceChannel.join().then(function(connection){
        console.log('ha');
        play(connection, message);
      });
      break;

    case "skip":
      var server = servers[message.guild.id];

      if(server.dispatcher) server.dispatcher.end();

      break;

    case "stop":
      var server = servers[message.guild.id];
      if(message.guild.voiceConnection) message.guild.voiceConnection.disconnect();
    }
  });

client.on('message', msg => {
  if (msg.content === 'help') {
    msg.reply(' I AM Clementine. 지금 개발중이어서 기능이 별로 없어요. try : 아바타, ()날씨, (나에게)온도 등');

  }
  if (msg.content === '현재시간'||msg.content==='시간'||msg.content==='시각'||msg.content=='날자'||msg.content==='널짜'||msg.content==='날짜') {
    var dt = new Date();
    var d = dt.toFormat('YYYY-MM-DD HH24:MI:SS');

    msg.reply('현재시간 : '+d);
  }
});



client.on('message', msg => {
  if (msg.content === '날씨'||msg.content==='날시'||msg.content==='널씨') {
    forecast.get([37.2809, 127.4429], function(err, weather){
      if(err) return console.dir(err);
        msg.channel.sendMessage('현재 이천시 날씨 || 온도 : '+weather.currently.temperature+'도, 상태 : '+weather.currently.summary+', 예보 : '+weather.hourly.summary);
    });
  }
});

client.on('message', msg => {
  if (msg.content === 'Ansan 날씨') {
    forecast.get([37.3218, 126.8308], function(err, weather){
      if(err) return console.dir(err);
        msg.reply('현재 Ansan 날씨 || 온도 : '+weather.currently.temperature+'도, 상태 : '+weather.currently.summary+', 예보 : '+weather.hourly.summary);
    });
  }
});

client.on('message', msg=> {
if (msg.content==='Gamja weather'){
	forecast.get([37.8045,128.8553],function(err, weather){
		if(err) return console.dir(err);
			msg.channel.sendMessage('Gamja weather : '+ weather.currently.temperature+'degree , '+weather.currently.summary+', '+weather.hourly.summary);
});
}
});


client.on('message', msg => {
  if (msg.content === '온도') {
    forecast.get([37.2809, 127.4429], function(err, weather){
      if(err) return console.dir(err);
          msg.channel.sendMessage('이천시 온도 : '+weather.currently.temperature+'도');
    });
  }
});



client.on('message', msg => {
  if (msg.content === '@TEST') {
    msg.reply('TEST reply');
  }
});

client.on('message', message => {
  // If the message is "what is my avatar"
  if (message.content === '아바타') {
    // Send the user's avatar URL
    message.reply("당신은 프로필은 "+message.author.avatarURL);
  }
});

client.login('');
