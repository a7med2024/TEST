const Discord = require('discord.js');
const client = new Discord.Client();
const prefix = '-'//your prefix

client.on('ready', () => {
    console.log('I am ready!');
});

client.on('message', message => {
    if (message.content === 'ping') {
    	message.reply('pong');
  	}
});

client.on('message', message => {//Toxic Codes
    if (message.content.startsWith("-dick")) {//Toxic Codes

     //Toxic Codes//Toxic Codes//Toxic Codes

        let dicksize = ["=", "==", "===", "====", "=====", "======", "=======", "========", "=========", "=========="];//Toxic Codes
        let dickuser = message.mentions.users.first();//Toxic Codes

        if (!dickuser) {
            return message.channel.send('You must mention someone!');//Toxic Codes
        }//Toxic Codes

        message.channel.send(**${dickuser} Size: ** 8${dicksize[~~Math.floor(Math.random() * dicksize.length)]}D\nSized by **${message.author.tag}**);//Toxic Codes

    }//Toxic Codes
}); //Toxic Codes

client.on('message', message => {//Toxic Codes
    if (!message.content.startsWith(prefix)) return;//Toxic Codes
  if(!message.channel.guild) return message.reply(' This command only for servers ')//Toxic Codes
    let command = message.content.split(" ")[0];//Toxic Codes
    command = command.slice(prefix.length);//Toxic Codes
    if (command === "kill"){//Toxic Codes

   var sabotage = message.mentions.users.first();
   if(sabotage == message.author)return message.reply(**الانتحار مو زين و الله**);
    if(sabotage === client.user) return message.reply(** تبي تقتلني ؟ **);
  if (sabotage < 1) {
    message.delete();
    return message.channel.sendMessage('ضع شيئا للقتل، مثل ذكر مستخدم، أو استخدام رمز تعبيري');
  }
  if (!sabotage) return message.channel.send(Please Mention A Member to Kill ⚠)
  message.channel.send("▄︻̷̿┻̿═━一 ${sabotage")
  .then(msg =>{
  msg.edit(▄︻̷̿┻̿═━一 ${sabotage} 3⃣);//Toxic Codes
  setTimeout(function() {//Toxic Codes
    msg.edit(▄︻̷̿┻̿═━一 ${sabotage} 2⃣);//Toxic Codes
  }, 1000);//Toxic Codes
  setTimeout(function() {//Toxic Codes
    msg.edit(▄︻̷̿┻̿═━一 ${sabotage} 1⃣);
  }, 2000);
  setTimeout(function() {
    msg.edit(▄︻̷̿┻̿═━一 💥);
  }, 3000);
  setTimeout(function() {
    msg.edit(▄︻̷̿┻̿═━一 🔥);
  }, 4000);
  setTimeout(function() {
    msg.edit(▄︻̷̿┻̿═━一 💀);
  }, 5000);//Toxic Codes
  msg.delete(6000)//Toxic Codes
  message.delete()//Toxic Codes
  })//Toxic Codes
  message.channel.send("تم اخفاء الجريمة بنجاح :hole: ").then(msg => msg.delete(10000));//Toxic Codes
    }//Toxic Codes
});//Toxic Codes//Toxic Codes
//Toxic Codes

client.on('message', async message => {
    var command = message.content.toLowerCase().split(" ")[0];
    var name = '';// Toxic Codes
    var age = '';// Toxic Codes
    var fromwhere = '';// Toxic Codes
    var n3k4a = '';// Toxic Codes
    var filter = m => m.author.id === message.author.id;// Toxic Codes
    var subChannel = message.guild.channels.find(c => c.name === 'تقديم');// Toxic Codes
   
    if(command == prefix + 'تقديم') {// Toxic Codes
        if(message.author.bot) return;
        if(message.channel.type === 'dm') return;
 
        var modRole = message.guild.roles.find(r => r.name === '✿『 MC ┃ Builder 』✿');// Toxic Codes
       
        if(message.guild.member(message.author).roles.has(modRole.id)) return message.channel.send(':x: | معك الرتبة');// Toxic Codes
        if(!subChannel) return message.channel.send(':x: | يجب ان يتوفر روم اسمه `تقديم`');// Toxic Codes
       
        message.channel.send(':timer: | **اكتب اسمك الحقيقي الان من فضلك**').then(msgS => {
            message.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ['time'] }).then(collected => {
                name = collected.first().content;
                collected.first().delete();
                msgS.edit(':timer: | **من فضلك اكتب عمرك الان**').then(msgS => {
                    message.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ['time'] }).then(collected => {
                        age = collected.first().content;
                        collected.first().delete();
                        msgS.edit(':timer: | **من فضلك اكتب من اي بلد انت**').then(msgS => {
                            message.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ['time'] }).then(collected => {
                                fromwhere = collected.first().content;
                                collected.first().delete();
                                msgS.edit(':timer: | **من فضلك اكتب سبب تقديمك على الرتبة والمهارات اللتي لديك لتقديمها**').then(msgS => {
                                    message.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ['time'] }).then(collected => {
                                        n3k4a = collected.first().content;
                                        collected.first().delete();
                                       
                                        let embedS = new Discord.RichEmbed()
                                        .setAuthor(message.author.tag, message.author.avatarURL)
                                        .setThumbnail(message.author.avatarURL)
                                        .setDescription('**\n:no_entry: هل انت متأكد انك تريد التقديم؟**')
                                        .setColor('GREEN')
                                        .addField('الاسم', name, true)
                                        .addField('العمر', age, true)
                                        .addField('من وين', fromwhere, true)
                                        .addField('المهارات وسبب التقديم على الرتبة', n3k4a, true)
                                        .setTimestamp()
                                        .setFooter(message.guild.name, message.guild.iconURL)
                                       
                                        msgS.delete();
                                        message.channel.send(embedS).then(msgS => {
                                            msgS.react('✅').then(() => msgS.react('❎'))
                                           
                                            let yesSure = (reaction, user) => reaction.emoji.name === '✅'  && user.id === message.author.id;
                                            let no = (reaction, user) => reaction.emoji.name === '❎' && user.id === message.author.id;
                                           
                                            let yesSend = msgS.createReactionCollector(yesSure);
                                            let dontSend = msgS.createReactionCollector(no);
                                           
                                            yesSend.on('collect', r => {
                                                msgS.delete();
                                                message.channel.send(':white_check_mark: | تم تقديم طلبك بنجاح انتظر النتيجة في روم accept').then(msg => msg.delete(5000));
                                               
                                                let subMsg = new Discord.RichEmbed()
                                                .setAuthor(message.author.tag, message.author.avatarURL)
                                                .setColor('GREEN')
                                                .setThumbnail(message.author.avatarURL)
                                                .addField('الاسم', name)
                                                .addField('العمر', age)
                                                .addField('من وين', fromwhere)
                                                .addField('لماذا يريد التقديم', n3k4a)
                                                .addField('حسابه', message.author)
                                                .addField('ايدي حسابه', message.author.id, true)
                                               
                                                subChannel.send(subMsg).then(msgS => {
                                                    msgS.react('✅').then(() => msgS.react('❎'))
                                                   
                                                    let accept = (reaction, user) => reaction.emoji.name === '✅'  && user.id === 'ايدي الي يقبل الطلب'
                                                    let noAccept = (reaction, user) => reaction.emoji.name === '❎' && user.id === 'ايدي الي يقبل الطلب'
                                                   
                                                    let acceptRe = msgS.createReactionCollector(accept);
                                                    let noAcceptRe = msgS.createReactionCollector(noAccept);
                                                   
                                                    acceptRe.on('collect', r => {
                                                        msgS.delete();
                                                        message.author.send(`:white_check_mark: | تم قبولك اداري بسيرفر **${message.guild.name}**`);
                                                        message.guild.member(message.author).addRole(modRole.id);
                                                        message.guild.channels.find(r => r.name === 'تم-القبول-و-الرفض').send(`:white_check_mark: | تم قبولك [ <@${message.author.id}> ]`);
                                                    }).catch();
                                                    noAcceptRe.on('collect', r => {
                                                        msgS.delete();
                                                        message.author.send(`:x: | تم رفضك بسيرفر **${message.guild.name}**`);
                                                        message.guild.channels.find(r => r.name === 'تم-القبول-و-الرفض').send(`:x: | تم رفضك [ <@${message.author.id}> ]`);
                                                    }).catch();
                                                })
                                            });// Toxic Codes
                                            dontSend.on('collect', r => {
                                                msgS.delete();
                                                message.channel.send(':x: | تم الغاء تقديمك');// Toxic Codes
                                            });
                                        })
                                    })
                                })
                            })
                        })
                    })
                })
            })
        })
    }
});


// THIS  MUST  BE  THIS  WAY
client.login(process.env.BOT_TOKEN);
