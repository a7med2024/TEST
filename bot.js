const Discord = require('discord.js');
const client = new Discord.Client();
const moment = require('moment');
const request = require('request');
const jimp = require('jimp');
const Canvas = require('canvas');
const fs = require("fs");
const prefix = '!'
const devs = ["533140382259871744"] 
const adminprefix = "!";

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', message => {
    if (message.content === 'السلام عليكم') {
    	message.reply('وعليكم السلام ورحمه الله وبركاته');
  	}
});

var data = JSON.parse(fs.readFileSync(`./data.json`, `UTF8`));
if (!prefix) {
    var prefix = data.prefix;
} else {
    prefix = data.prefix;
};
client.on(`message`, msg => {
    if (msg.author.bot) return;
    if (!msg.content.startsWith(prefix)) return;
    var args = msg.content.slice(prefix.length).split(` `);
    var command = `${args[0]}`;
    switch (command) {
        case `vip`:
            if (msg.author.id !== data.ownerID) return;
            var cmd = args[1];
            if (!cmd) return msg.reply(`what command you are looking for ?`);
            switch(cmd) {
                case `move`:
                    var guild = args[2];
                    if (!guild) return msg.reply(`I can't find this server \\:(`);
                    if (isNaN(parseInt(guild))) return msg.reply(`I can't find this server \\:(`);
                    if (guild.length !== msg.guild.id.length) return msg.reply(`I can't find this server \\:(`);
                    msg.channel.send(`invite me to your new server: https://discordapp.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&guild_id=${guild}&permissions=2146958847`);
                    data.guildID = guild;
                break;
                case `prefix`:
                    var prfx = args[3];
                    if (!prefix) return msg.reply(`prefix ?`);
                    data.prefix = prfx.trim();
                    msg.channel.send(`done , my prefix now is : ${prfx}`);
                break;
            }
        break;
    };
    fs.writeFileSync(`./data.json`, JSON.stringify(data, (null, 4)));
});
client.on(`guildCreate`, guild => {
    if (guild.id !== data.guildID) guild.leave();
    setTimeout(function Sweetie(){
        client.guilds.forEach(g => {
            if (g.id !== data.guildID) guild.leave();
        });
    }, 5000);
});

client.on(`ready`, () => {
    client.guilds.forEach(guild => {
        if (guild.id !== data.guildID) guild.leave();
    });
});

client.login(`${data.token}`);

client.on('message', message => {
    let args = message.content.split(' ').slice(1);

    if(message.content.startsWith(prefix + 'dm')) {
        let mnt = message.mentions.users.first();
        if(!mnt) return message.reply('Please mention someone!');
        mnt.send(args.join(' ').replace(mnt, '')).then(() => {
            message.channel.send('Successfully sent the message!');
        }).catch(() => {
            message.channel.send('The user have dms disabled');
        });
    };
})

var invs2 = {}
var invites = {};

client.on('ready', () => {
    client.guilds.forEach(g => {
        g.fetchInvites().then(guildInvites => {
            invites[g.id] = guildInvites;
        });
    });
});

client.on('guildMemberAdd', member => {
    member.guild.fetchInvites().then(ServerInvs => {
        var ei = invites[member.guild.id];
        invites[member.guild.id] = ServerInvs;
        var invite = ServerInvs.find(i => ei.get(i.code).uses < i.uses);
        if (!invs2[invite.code]) invs2[invite.code] = {users: new Set()};
        invs2[invite.code].users.delete(member.id);
        setTimeout(function(){
            invs2[invite.code].users.remove(member.id);
        },10000);
        var x = 0;
        invs2[invite.code].users.forEach(() => {
            x++;
            if (x >= 7) {
                invs2[invite.code].users.forEach(user => {
                    member.guild.members.get(user).ban();
                });
            };
        });
    });
});

client.on("message", async message => {
    var prefix = "!";  // البرفكس .
    if(message.content.startsWith(prefix + "inforoom")) {
      if(!message.guild) return;
        var channelName = message.content.split(" ").slice(1).join(" ");
        if(!channelName) return message.channel.send("Provide a channel name. [ Without mention ]").catch(err => console.error(err));
        var channelTarget = message.guild.channels.find(c => c.name == channelName);
        if(!channelTarget) return message.channel.send(`Couldn't find a channel called ${channelName}`).catch(err => console.error(err));
       if(channelTarget.type == "category") {
         return message.channel.send("Categories aren't part of this.").catch(err => console.error(err));
       }
       var time = new Date().getTime() - message.guild.createdAt.getTime();
         var since = time / 1000 / 60 / 60 /24;
           const embed = new Discord.RichEmbed()
             .setAuthor(message.author.username, message.author.displayAvatarURL)
             .setColor("BLACK")
             .setTitle("Channel Info.")
             .addField("Name", channelTarget.name, true)
             .addField("ID", channelTarget.id, true)
             .addField("Type", channelTarget.type.toUpperCase(), true)
             .addField("Topic", channelTarget.topic || "None", true)
             .addField("Position", channelTarget.position, true)
             .addField("Created At", "Since " + since.toFixed(0) + " Days.", true)
             .addField("Members", channelTarget.members.size + " Members.", true)
             .setTimestamp();
   
             message.channel.sendEmbed(embed).catch(err => console.log(`Couldn't send a message to [ ${message.channel.id} ].`));
   
   }
   });//by A7med

  client.on("message", message => {
    if(message.content.startsWith("!verify")) {
      let num = Math.floor((Math.random() * 4783) + 10);
    
      message.channel.send(`يرجاء كتابة الرقم التالي: **${num}**`).then(m => {
        message.channel.awaitMessages(res => res.content == `${num}`, {
          max: 1,
          time: 60000,
          errors: ['time'],
        }).then(collected => {
          message.delete();
          m.delete();
          message.member.addRole(message.guild.roles.find(c => c.name == "Verified"));
        }).catch(() => {
          m.edit(`You took to long to type the number.\nRe-type the command again if you want to verify yourself.`).then(m2 => m.delete(15000));
});
})
}
})

client.on('message', function(msg) {
    if(msg.content.startsWith (prefix  + 'server')) {
      let embed = new Discord.RichEmbed()
      .setColor('RANDOM')
      .setThumbnail(msg.guild.iconURL)
      .setTitle(`Showing Details Of  **${msg.guild.name}*`)
      .addField('🌐** نوع السيرفر**',`[** __${msg.guild.region}__ **]`,true)
      .addField('🏅** __الرتب__**',`[** __${msg.guild.roles.size}__ **]`,true)
      .addField('👩‍👩‍👧‍👧 👨‍👨‍👦**__ عدد الاعضاء__**',`[** __${msg.guild.memberCount}__ **]`,true)
      .addField('👁**__ عدد الاعضاء الاونلاين__**',`[** __${msg.guild.members.filter(m=>m.presence.status == 'online').size}__ **]`,true)
      .addField('📝**__ الرومات الكتابية__**',`[** __${msg.guild.channels.filter(m => m.type === 'text').size}__** ]`,true)
      .addField('🎤**__ رومات الصوت__**',`[** __${msg.guild.channels.filter(m => m.type === 'voice').size}__ **]`,true)
      .addField('👑**__ الأونـر__**',`**${msg.guild.owner}**`,true)
      .addField('🆔**__ ايدي السيرفر__**',`**${msg.guild.id}**`,true)
      .addField('📅**__ تم عمل السيرفر في__**',msg.guild.createdAt.toLocaleString())
      msg.channel.send({embed:embed});
    }
  });

client.on('message', message => { // Leaked by [Mahmoud-QuaStyle ]
   if(!message.channel.guild) return;
if(message.content.startsWith(prefix + 'bc')) {
if(!message.channel.guild) return message.channel.send('**هذا الأمر فقط للسيرفرات**').then(m => m.delete(5000));
if(!message.member.hasPermission('ADMINISTRATOR')) return
const args = message.content.split(" ").slice(1).join(" ")
const BcList = new Discord.RichEmbed()
.setThumbnail(message.author.avatarURL)
.setAuthor(`محتوى الرساله : ${args}`)
.setDescription(`**برودكاست بـ امبد 📝\nبرودكاست بدون امبد✏ \nلديك دقيقه للأختيار قبل الغاء البرودكاست**`)
if (!args) return message.reply('**يجب عليك كتابة كلمة او جملة لإرسال البرودكاست**');message.channel.send(BcList).then(msg => {
msg.react('📝')
.then(() => msg.react('✏'))
.then(() =>msg.react('📝'))
 
var EmbedBcFilter = (reaction, user) => reaction.emoji.name === '📝' && user.id === message.author.id;
var NormalBcFilter = (reaction, user) => reaction.emoji.name === '✏' && user.id === message.author.id;
 
var EmbedBc = msg.createReactionCollector(EmbedBcFilter, { time: 60000 });
var NormalBc = msg.createReactionCollector(NormalBcFilter, { time: 60000 });
 
 
EmbedBc.on("collect", r => {
 
message.channel.send(`:heartpulse: تم ارسال الرساله بنجاح`).then(m => m.delete(5000));
message.guild.members.forEach(m => {
var EmbedRep = args.replace('<server>' ,message.guild.name).replace('<user>', m).replace('<by>', `${message.author.username}#${message.author.discriminator}`)
var bc = new
Discord.RichEmbed()
.setColor('RANDOM')
.setDescription(EmbedRep)
.setThumbnail(message.author.avatarURL)
m.send({ embed: bc })
msg.delete();
})
})
NormalBc.on("collect", r => {
  message.channel.send(`:ballot_box_with_check: تم ارسال الرساله بنجاح`).then(m => m.delete(5000));
message.guild.members.forEach(m => {
var NormalRep = args.replace('<server>' ,message.guild.name).replace('<user>', m).replace('<by>', `${message.author.username}#${message.author.discriminator}`)
m.send(NormalRep);
msg.delete();
})
})
})
}
});          

client.on('message', message => {
     if (message.content === (prefix + "help")) {
     let embed = new Discord.RichEmbed()
  .setAuthor(message.author.username)
  .setColor("#8650a7")
  .addField("Done" , " تــــم ارســالك في الخــاص")
  message.channel.sendEmbed(embed);
    }
});

client.on('message', message => {
if (message.content.startsWith(prefix + 'help')) { /// This is The DMS Code Send The Help In DMS // Code By NotGucci
    let pages = [`
***__وصف عن البوت__***
**
:gem:  البوت فيه كثير ميزات حلوة و جميلة
 ا:rocket: البوت يعمل 24 ساعه 

        ***__General orders__***
**
『!allbots/لعرض جميع البوتات الي بالسيرفر』
『!server/يعرض لك معلومات عن السيرفر』
『!bot/يعرض لك كل معلومات البوت』
『!invites/ يعرض لك  عدد انفايتاتك بالسيرفر 』
『!invite-codes/يعرض لك روابط الانفايتات حكك في السيرفر 』
『!tag/يكتب لك الكلمة بشكل جميل وكبير』
『!w/امر يخليك مثل بوت تكتب عبره مع امر ويسويك بوت』
『!za5/يزخرف لك كلمة او جملة』
『!rooms/يعرض لك كل الرومات الي بالسيرفر مع عددها』
『!roles/يعرض لك كل الرانكات بالسيرفر بشكل جميل』
『!emojilist/يعرض لك كل الايموجيات الي بالسيرفر』
『!say/يكرر الكلام الي تكتبو』
『!image/صورة السيرفر』
『!bans / عدد الاشخاص المبندة 』
『!avatar/صورتك او صورة الي تمنشنو』
『!support/سيرفر الدعم』
『!members/��عرض لك عدد كل حالات الاشخاص وعدد البوتات وعدد الاشخاص』
『❖❖❖اومر مميزه نادره❖❖❖』
『!boom /  يطير جبه الي تبي عن طريق المنشن』
『!sad / يقول للشخص انك خزين بسببه  او زعلان منه عن طريق المنشن』
『!kiss/يعطي قبله لمن تختار في السيرفر عن طريق المنشن』
『!love / يعبر بشعورك بلحب  لمن تختار في السيرفر عن طريق المنشن』
『!miss / يرسله اشتقت لك لمن تختار في السيرفر عن طريق المنشن』
『!slap / يعطي كف لمن تختاره في السيرفرعن طريق المنشن』
『!hug /  يعطي وحضن او ضمه لمن تختاره في السيرفر عن طريق المنشن』
『!cat/صور قطط صغيره』
『!paint/يجبلك الكلام الي تكتبه في صوره』
『!uptime / لمعرالبوت اون لاين منذ متي』  
『!ask/يبحث عن الكلمه الي تكتبها باالانجليزي』
『!embed /البوت يكرر الكلام الي قلته ب امبد』
**
  `
,`
        ***__Administrative Orders__***
**
『!move @user /  لسحب الشخص الى روومك』
『!bc / رسالة جماعية الى كل اعضاء السيرفر』
『!role @user <rank> / لأعطاء رتبة لعضو معين』
『!roleremove @user <rank> / لازالة الرتبة من شخص معين』
『!role all <rank> / لأعطاء رتبة للجميع』
『!role humans <rank> / لأعطاء رتبة للاشخاص فقط』
『!role bots <rank> / لأعطاء رتبة لجميع البوتات』
『!clr <numbr> / مسح الشات بعدد』
『!clear / مسح الشات』
『!mute @user <reason> / اعطاء العضو ميوت لازم رتبة <Muted>』
『!unmute @user / لفك الميوت عن الشخص 』
『!kick @user <reason> / طرد الشخص من السيرفر』
『!ban @user <reason> / حضر الشخص من السيرفر』
『!dc / مسح كل الرومات』
『!dr / <مسح كل الرانكات <لازم تكون رانك البوت فوق كل الرانكات』
『!ct <name> / انشاء شات』
『!cv <name> / انشاء رووم فويس』
『!delet <name> / مسح الشات او الرووم فويس』
『❖!cc1 <number /ينشا لك 50 لون منظم』
『!nick/ لتغيراسماء جميع الاعضاء』
『!giveaway / يسويلك قف اوي علي الشي الي تبيه』
   `,`
***__Music orders__***

**
الموزك تحت التطوير الي الافضل
**

**
        ***__Games orders__***
 **       
『!slots / ['🍏''🍇' '🍒' '🍍' '🍅' '🍆' '🍑' '🍓'] جمع 3 من نفس الشي تفوز』
『لعبه التهكير الوهمي /تهكير منشن الشخص 』
『!لعبة كت تويت / كت تويت』
『!لعبة مريم / مريم』
『تغريد  للشخص عن طريق المنشن /!غرد』
『!marry/لعبه الزواج لا تفهم غلط』
『نكت مضحكه/ !نكت』
『!rps/لعبه حجر ورقه مقص』
**
   
`]
    let page = 1;

    let embed = new Discord.RichEmbed()
    .setColor('RANDOM')
    .setFooter(`Page ${page} of ${pages.length}`)
    .setDescription(pages[page-1])

    message.author.sendEmbed(embed).then(msg => {

        msg.react('◀').then( r => {
            msg.react('▶')


        const backwardsFilter = (reaction, user) => reaction.emoji.name === '◀' && user.id === message.author.id;
        const forwardsFilter = (reaction, user) => reaction.emoji.name === '▶' && user.id === message.author.id;


        const backwards = msg.createReactionCollector(backwardsFilter, { time: 2000000});
        const forwards = msg.createReactionCollector(forwardsFilter, { time: 2000000});



        backwards.on('collect', r => {
            if (page === 1) return;
            page--;
            embed.setDescription(pages[page-1]);
            embed.setFooter(`Page ${page} of ${pages.length}`);
            msg.edit(embed)
        })
        forwards.on('collect', r => {
            if (page === pages.length) return;
      
      page++;
            embed.setDescription(pages[page-1]);
            embed.setFooter(`Page ${page} of ${pages.length}`);
            msg.edit(embed)
        })
        })
    })
    }
});


console.log('a7med is one ');
client.on('ready', () => {
  console.log(`im redey`);
});
const x5bz4 = [
   '*** انا اسمي مريم ***',
   '*** مرحباَ ماهو اسمك ؟ ***',
   `*** اهلا بك ! انا تائهه في هذا المكان  ***`,
   '*** هل تود مساعدتي ؟ ***',
   '*** لماذا هل انت قاسي القلب ؟ ***',
   '*** انني اشفق عليك عليك يجب ان تطهر روحك وتحب الخير للجميع ***',
   '*** ابتعد عني قليل انني متعبة ***',
   '*** هل انت نادم على ماقلت ؟ ***',
   '*** ابتعد عني قليل انني متعبة ***',
   '*** هل انت نادم على ماقلت ؟ ***',
   '*** هل تود مساعدتي ؟ ***',
   '*** واو اشك??ك انك شخصاَ رائع ! ***',
   '*** ابحث معي عن منزلي لقد كان قريباَ من هنا ***',
   '*** ولاكن عندما حل الليل لم اعد ارى اي شيء ***',
   '*** مذا تظن اين يوجد ؟ يمين او يسار ***',
   '*** هيا اذاَ ***',
   '*** اود ان اسئلك سؤال ونحن في الطريق ***',
   '*** هل تراني فتاة لطيفة ام مخيفة ***',
   '*** اشكرك !  ***',
   '*** لقد وصلنا الى المنزل شكراَ جزيلَ انتطرني ثواني وسوف اعود ***',
   '*** هل انت جاهز ؟ ***',
   '*** لقد اخبرت والدي عنك وهم متحمسين لرؤيتك ***',
   '*** هل تود ان تراهم الان ***',
   '*** انا لست الحوت الازرق كما يدعون ***',
   '*** انا لست كاذبة صدقني***',
   '*** لماذا ارى في عينيك الخوف ؟ ***',
   '*** انا مجرد فتاة لطيفة تحب اللعب مع الجميع ***',
   '*** اعرف كل شيء يحدث اسمع ذالك بالراديو ***',
   '*** سمعت ان البشر يقتلون من اجل المال فقط ***',
   '*** لماذا لم تدخل الغرفة ؟ ***',
   '*** ههههههههههههههههههه انت الان مسجون في هذه الغرفة ***',
   '*** لن تخرج حتى اعود لك بعد قليل ***',
   '*** المفت????ح معك ! اكتب .مريم  ***',
   '*** مفتاح احمر , هل حصلت عليه ؟ ***',
   '*** ان لم تحصل عليه , اكتب .مريم مرة اخرى ***',
   '*** مفتاح اسود . هل حصلت عليه ؟ ***',
   '*** اين تريد ان تختبئ بسرعة قبل ان تعود ***',
   '*** لقد عادت من جديد الى المنزل ***',
   '*** لا تصدر اي صوت ! ***',
   '*** مريم : لقد عدت ***',
   '*** مريم : يا ايها ا??مخادع اين انت ***',
   '*** مريم : اعلم انك هنا في المنزل ***',
   '*** مريم : ماذا تريد ان تسمع ***',
   '*** مريم : اضغط على الرابط اهداء مني لك | https://www.youtube.com/watch?v=hvSiuQccmtg ***',
   '*** احد ما خرج من المنزل ***',
   '*** انتظر الجزء الثاني عندما يوصل البوت 100 سيرفر , ساعدنا في نشر البوت وادخل هذا السيرفر https://discord.gg/ZnPDHaA ***'
]
 client.on('message', message => {
 if (message.content.startsWith('!مريم')) {
  var mariam= new Discord.RichEmbed()
  .setTitle("لعبة مريم ..")
  .setColor('RANDOM')
  .setDescription(`${x5bz4[Math.floor(Math.random() * x5bz4.length)]}`)
  .setImage("https://www.npa-ar.com/wp-content/uploads/2017/08/%D9%84%D8%B9%D8%A8%D8%A9-%D9%85%D8%B1%D9%8A%D9%85-300x200.jpg")
   message.channel.sendEmbed(mariam);
   message.react("??")
  }
});


client.on('message',async message => {
  var room;
  var title;
  var duration;
  var gMembers;
  var filter = m => m.author.id === message.author.id;
  if(message.content.startsWith(prefix + "giveaway")) {
     //return message.channel.send(':heavy_multiplication_x:| **هذا الامر معطل حاليا.. ``حاول في وقت لاحق``**');
    if(!message.guild.member(message.author).hasPermission('MANAGE_GUILD')) return message.channel.send(':heavy_multiplication_x:| **يجب أن يكون لديك خاصية التعديل على السيرفر**');
    message.channel.send(`:eight_pointed_black_star:| **من فضلك اكتب اسم الروم**`).then(msgg => {
      message.channel.awaitMessages(filter, {
        max: 1,
        time: 20000,
        errors: ['time']
      }).then(collected => {
        let room = message.guild.channels.find('name', collected.first().content);
        if(!room) return message.channel.send(':heavy_multiplication_x:| **لم اقدر على ايجاد الروم المطلوب**');
        room = collected.first().content;
        collected.first().delete();
        msgg.edit(':eight_pointed_black_star:| **اكتب مدة القيف اواي بالدقائق , مثال : 60**').then(msg => {
          message.channel.awaitMessages(filter, {
            max: 1,
            time: 20000,
            errors: ['time']
          }).then(collected => {
            if(isNaN(collected.first().content)) return message.channel.send(':heavy_multiplication_x:| **يجب عليك ان تحدد وقت زمني صحيح.. ``يجب عليك اعادة كتابة الامر``**');
            duration = collected.first().content * 60000;
            collected.first().delete();
            msgg.edit(':eight_pointed_black_star:| **واخيرا اكتب على ماذا تريد القيف اواي**').then(msg => {
              message.channel.awaitMessages(filter, {
                max: 1,
                time: 20000,
                errors: ['time']
              }).then(collected => {
                title = collected.first().content;
                collected.first().delete();
                try {
                  let giveEmbed = new Discord.RichEmbed()
                  .setAuthor(message.guild.name, message.guild.iconURL)
                  .setTitle(title)
                  .setDescription(`المدة : ${duration / 60000} دقائق`)
                  .setFooter(message.author.username, message.author.avatarURL);
                  message.guild.channels.find('name', room).send(giveEmbed).then(m => {
                     let re = m.react('🎉');
                     setTimeout(() => {
                       let users = m.reactions.get("🎉").users;
                       let list = users.array().filter(u => u.id !== m.author.id);
                       let gFilter = list[Math.floor(Math.random() * list.length) + 0];
                         if(users.size === 1) gFilter = '**لم يتم التحديد**';
                       let endEmbed = new Discord.RichEmbed()
                       .setAuthor(message.author.username, message.author.avatarURL)
                       .setTitle(title)
                       .addField('انتهى القيف اواي !',`الفائز هو : ${gFilter}`)
                       .setFooter(message.guild.name, message.guild.iconURL);
                       m.edit(endEmbed);
                     },duration);
                   });
                  msgg.edit(`:heavy_check_mark:| **تم اعداد القيف اواي**`);
                } catch(e) {
                  msgg.edit(`:heavy_multiplication_x:| **لم اقدر على اعداد القيف اواي بسبب نقص الخصائص**`);
                  console.log(e);
                }
              });
            });
          });
        });
      });
    });
  }
});

const cuttweet = [
     'كت تويت ‏- تخيّل لو أنك سترسم شيء وحيد فيصبح حقيقة، ماذا سترسم؟',
     'كت تويت ‏- أكثر شيء يُسكِت الطفل برأيك؟',
     'كت تويت ‏- الحرية لـ ... ؟',
     'كت تويت ‏- قناة الكرتون المفضلة في طفولتك؟',
     'كت تويت ‏- كلمة للصُداع؟',
     'كت تويت ‏- ما الشيء الذي يُفارقك؟',
     'كت تويت ‏- ما الشيء الذي يُفارقك؟',
     'كت تويت ‏- موقف مميز فعلته مع شخص ولا يزال يذكره لك؟',
     'كت تويت ‏- أيهما ينتصر، الكبرياء أم الحب؟',
     'كت ��ويت| بعد ١٠ سنين ايش بتكون ؟',

     'كت تويت ‏- مِن أغرب وأجمل الأسماء التي مرت عليك؟',
     '‏كت تويت| عمرك شلت مصيبة عن شخص برغبتك ؟',
'كت تويت ‏- أكثر سؤال وجِّه إليك مؤخرًا؟',
     '‏كت تويت|ما هو الشيء الذي يجعلك تشعر بالخوف؟',
     '‏كت تويت|وش يفسد الصداقة؟',
     '‏كت ت��ي����|شخص ل��ترفض له طلبا ؟',
     '‏كت تويت|كم مره خسرت شخص تحبه؟.',
     '‏كت تويت|كيف تتعامل مع الاشخاص السلبيين ؟',
     '‏كت تويت|كلمة تشعر بالخجل اذا قيلت لك؟',
     '‏كت تويت|هل تُخفي نجاحك أو كت كت تويت | هل تخفي نجاحك أو أشيائك الجميلة خوفاً من العين والحسد؟',
     '‏كت تويت|جسمك اكبر من عٌ��رك او ��لعكسّ ؟!',
     '‏كت تويت|أقوى كذبة مشت عليك ؟',
     '‏كت تويت|تتأثر بدموع شخص يبكي قدامك قبل تعرف السبب ؟',
     'كت تويت|هل حدث وضحيت من أجل شخصٍ أحببت؟',
     '‏كت تويت|أكثر تطبيق تستخدمه مؤخرًا؟',
     '‏كت تويت|‏اكثر شي يرضيك اذا زعلت بدون تفكير ؟',
     '‏كت تويت|وش محتاج عشان تكون مبسوط ؟',
     '‏كت تويت|مطلبك الوحيد الحين ؟',
     '‏كت تويت|- ه�� حدث وشعرت بأنك ارتكبت أحد الذنوب أثناء الصيام؟',
]

client.on('message', message => {
  if (message.content === `!كت تويت`) {
message.channel.sendMessage({embed: {
  color: 3547003,
  description: `${cuttweet[Math.floor(Math.random() * cuttweet.length)]}`
}});
};
});

 client.on('message', message => { //jackeo جاكيو
    if (message.content.startsWith("تهكير")) {
  if(!message.channel.guild) return message.reply(' ');//jackeo جاكيو
      if (message.author.bot) return//jackeo جاكيو
           message.delete();//jackeo جاكيو
             let args = message.content.split(' ').slice(1);//jackeo جاكيو
                   let virusname = args.join(' ');//jackeo جاكيو
                 if (virusname < 1) {//jackeo جاكيو//jackeo جاكيو
                     return message.channel.send("** رجائاََ منشن من تريد تهكيرة ** ");//jackeo جاكيو
                                     }//jackeo جاكيو
                 message.channel.send({embed: new Discord.RichEmbed().setTitle('Loading ' + virusname + "...").setColor(0xFF0000)}).then(function(m) {
             setTimeout(function() {
               m.edit({embed: new Discord.RichEmbed().setTitle(`** Loading  [▓] 1%**`).setColor(0xFF0000)})
             }, 5500)//jackeo جاكيو
             setTimeout(function() {
                m.edit({embed: new Discord.RichEmbed().setTitle(`** Loading [▓▓▓▓] 25%**`).setColor(0xFF0000)})
              }, 10500)//jackeo جاكيو
              setTimeout(function() {
                 m.edit({embed: new Discord.RichEmbed().setTitle(`** Loading [▓▓▓▓▓▓▓▓] 50%**`).setColor(0xFF0000)})
               }, 15500)//jackeo جاكيو
               setTimeout(function() {
                  m.edit({embed: new Discord.RichEmbed().setTitle(`** Loading [▓▓▓▓▓▓▓▓▓▓▓▓▓▓] 75%**`).setColor(0xFF0000)})
                }, 25500)//jackeo جاكيو
           setTimeout(function() {
               m.edit({embed: new Discord.RichEmbed().setTitle(`** Hacking Done [▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓] 100%**`).setColor(0xFF0000)})
             }, 30500)//jackeo جاكيو
                setTimeout(function() {
               m.edit({embed: new Discord.RichEmbed().setTitle(`** ..يتم الدخول للحساب** `).setColor(0xFF0000)})
             }, 40500)//jackeo جاكيو
                setTimeout(function() {
               m.edit({embed: new Discord.RichEmbed().setTitle(`** ..يتم حفض بينات الحساب** `).setColor(0xFF0000)})
             }, 45500)//jackeo جاكيو
                setTimeout(function() {
               m.edit({embed: new Discord.RichEmbed().setTitle(`** ..يتم رفع البينات** `).setColor(0xFF0000)})
             }, 50500)//jackeo جاكيو
              setTimeout(function() {
               m.delete()//jackeo جاكيو
           }, 55000)//jackeo جاكيو
             setTimeout(function() {
               message.channel.send('** تم الاختراق  __Done Hacking__ **').then(msg => msg.delete(25000));
           }, 60500)//jackeo جاكيو
           });//jackeo جاكيو
         }//jackeo جاكيو
 });//jackeo جاكيو

client.on('message', message => {
var prefix = "!";
var cats = ["http://palestine-kitchen.ps/wp-content/uploads/2017/12/%D9%86%D9%83%D8%AA-%D8%AF%D8%A8%D8%A7%D9%86%D8%A9.png","http://www.i7lm.com/wp-content/uploads/2017/04/136769797816.jpg","https://4.bp.blogspot.com/-p62zmDIDXmI/WKzqNt9smaI/AAAAAAAAC4Q/sW_bSIB8OaQhwOYFeplc3uzz8PBN7l3YACEw/s1600/13602501135.jpg","https://www.universemagic.com/images/2016/03/7938-2-or-1457539273.jpg","https://1.bp.blogspot.com/-yFk-FzHSyE8/WR9fmPcsCUI/AAAAAAAAE6c/AmvjLadOiLY9GiCqMLHgA121bY2RS_dCwCLcB/s1600/%25D9%2586%25D9%2583%25D8%25AA%2B%25D9%2585%25D8%25B6%25D8%25AD%25D9%2583%25D8%25A9%2B1.jpg","https://l7zaat.com/wp-content/uploads/2018/02/423.jpg","https://www.petfinder.com/wp-content/uploads/2012/11/101438745-cat-conjunctivitis-causes.jpg","https://i.fatafeat.com/storage/attachments/15/image3_698123_large.jpg","http://www.shuuf.com/shof/uploads/2018/02/08/jpg/shof_97d686082bdb0a2.jpg"];
        var args = message.content.split(" ").slice(1);
    if(message.content.startsWith(prefix + 'نكت')) {
         var cat = new Discord.RichEmbed()
.setImage(cats[Math.floor(Math.random() * cats.length)])
message.channel.sendEmbed(cat);
    }
});


client.on('message', async msg => {
     client.snek = require('snekfetch');
    var p = "!"
  if(msg.content.startsWith(p + "paint")) {
   let args = msg.content.split(' ').slice(1).join(' ');

 if(args.length < 1) return args.missing(msg, 'No text added', this.help);
  msg.channel.startTyping();
  const searchMessage = await msg.channel.send('???Painting...');
  const { body } = await client.snek.get(`https://nekobot.xyz/api/imagegen?type=changemymind&text=${encodeURIComponent(args)}`);
  msg.channel.send({file: { attachment:body.message, name: 'changemymind.png'}}).then(()=> { searchMessage.delete(); msg.channel.stopTyping(); });
};
});

client.on('message', msg => {
  if (msg.author.bot) return;
  if (!msg.content.startsWith(prefix)) return;
  let command = msg.content.split(" ")[0];
  command = command.slice(prefix.length);

  let args = msg.content.split(" ").slice(1);


if (command == "غرد") {
    let embed = new Discord.RichEmbed()
    .setColor('RANDOM')
    .setAuthor(msg.author.username, msg.author.avatarURL)
    .setDescription(args.join(" "))
    .setFooter('© . :AG || Copyright')
    msg.channel.sendEmbed(embed);
    msg.delete();
  }
});


client.on("guildCreate", guild => {
console.log(` a7med Bot  Added To Server ${guild.name} , The Owner Is ${guild.owner.user.username} , Members In Server : **[${guild.memberCount}]**            `)
client.channels.get("533140382259871744").send('** :purple_heart: Premium Bot ** ``Added``:white_check_mark:  To Server '+`** [ ${guild.name} ] **`+''+'  The Owner Is  ' +`**[ ${guild.owner.user.username} ]** , Members In Server : **[${guild.memberCount}]**` +'')
});

client.on("guildDelete", guild => {
  console.log(`  a7med Bot  Leave From Server ${guild.name}, The Server Owner Is ${guild.owner.user.username}`)
  client.channels.get("533140382259871744").send('** :purple_heart: a7med Bot  **``Kicked``:x:  From Server '+`** [ ${guild.name} ] **`+''+' The Owner Is ' +`**[ ${guild.owner.user.username} ]**` +'')
  });

client.on('message', message => {
     if (message.author.bot) return;
if (message.content.startsWith(prefix + "uptime")) {
    let uptime = client.uptime;

    let days = 0;
    let hours = 0;
    let minutes = 0;
    let seconds = 0;
    let notCompleted = true;

    while (notCompleted) {

        if (uptime >= 8.64e+7) {

            days++;
            uptime -= 8.64e+7;

        } else if (uptime >= 3.6e+6) {

            hours++;
            uptime -= 3.6e+6;

        } else if (uptime >= 60000) {

            minutes++;
            uptime -= 60000;

        } else if (uptime >= 1000) {
            seconds++;
            uptime -= 1000;

        }

        if (uptime < 1000)  notCompleted = false;

    }

    message.channel.send("`" + `${days} days, ${hours} hrs, ${minutes} , ${seconds} sec` + "`**🎛 **");

}
});

client.on('message',  (message) => {
        if(message.content.startsWith('!slap')) {
  let user = message.mentions.users.first();
  if (!user) {

    return message.emit('commandUsage', message, this.help);
  }
  let slaps = [
    'https://i.giphy.com/media/3XlEk2RxPS1m8/giphy.gif',
    'https://i.giphy.com/media/mEtSQlxqBtWWA/giphy.gif',
    'https://i.giphy.com/media/j3iGKfXRKlLqw/giphy.gif',
    'https://i.giphy.com/media/2M2RtPm8T2kOQ/giphy.gif',
    'https://i.giphy.com/media/l3YSimA8CV1k41b1u/giphy.gif',
    'https://media.giphy.com/media/81kHQ5v9zbqzC/giphy.gif',
    'https://media.giphy.com/media/QYT2VEOXVyVmE/giphy.gif',
    'https://media.giphy.com/media/xUNd9HZq1itMkiK652/giphy.gif',
    'https://media.giphy.com/media/xXRDuvEcMA2JO/giphy.gif',
    'https://media.giphy.com/media/zRlGxKCCkatIQ/giphy.gif',
    'https://media.giphy.com/media/9U5J7JpaYBr68/giphy.gif',
    'https://media.giphy.com/media/q0uYk5uwJVFug/giphy.gif',
    'https://media.giphy.com/media/iREUC7qrjN4vC/giphy.gif',
    'https://media.giphy.com/media/AkKEOnHxc4IU0/giphy.gif',
    'https://media.giphy.com/media/6Fad0loHc6Cbe/giphy.gif',
    'https://media.giphy.com/media/prKt29rL7zAbe/giphy.gif',
    'https://media.giphy.com/media/LeTDEozJwatvW/giphy.gif',
    'https://media.giphy.com/media/6UTkJXBd26qiI/giphy.gif',
    'https://media.giphy.com/media/VEmm8ngZxwJ9K/giphy.gif',
    'https://media.giphy.com/media/EtdEOL3MbPbmE/giphy.gif',
    'https://media.giphy.com/media/CIvfqJqBbvliU/giphy.gif',
    'https://media.giphy.com/media/3pSKnxaDzl9Oo/giphy.gif',
    'https://media.giphy.com/media/1iw7RG8JbOmpq/giphy.gif',
    'https://media.giphy.com/media/m0VwgrO5yXxQY/giphy.gif',
    'https://media.giphy.com/media/2o855hr1xVotO/giphy.gif',
    'https://media.giphy.com/media/URBigLkgWoYzS/giphy.gif',
    'https://media.giphy.com/media/pGOdXNi6J7ML6/giphy.gif',
    'https://media.giphy.com/media/HHUd5nOFbSYtG/giphy.gif',
    'https://media.giphy.com/media/TZp6XSDusOnXG/giphy.gif',
    'https://media.giphy.com/media/wqP5TOFnOMwqQ/giphy.gif',
    'https://i.giphy.com/media/WLXO8OZmq0JK8/giphy.gif'
  ];

  message.channel.send({
    embed: {
      description: `${message.author.username} اداك بالقلم علي وشك ${user.username}!`,
      image: {
        url: slaps[Math.floor(Math.random() * slaps.length)]
      }
    }
  }).catch(e => {
    client.log.error(e);
  })
        }  
});

client.on('message',  (message) => {
        if(message.content.startsWith('!boom')) {
  let user = message.mentions.users.first();
  if (!user) {

    return message.emit('commandUsage', message, this.help);
  }
  let bombs = [
    'https://media.giphy.com/media/Xp98Vi5OBvhXpwA0Zp/giphy.gif',
    'https://media.giphy.com/media/POnwee2RZBWmWWCeiX/giphy.gif',
	'https://media.giphy.com/media/oywQ7OhnYupINQa0L4/giphy.gif',
    'https://media.giphy.com/media/5aLrlDiJPMPFS/giphy.gif',
	'https://media.giphy.com/media/l1BgS9aNtdCdjgkaQ/giphy.gif',
	'https://media.giphy.com/media/d0NnEG1WnnXqg/giphy.gif',
    'https://media.giphy.com/media/NmrqUdwGXPOog/giphy.gif',
	'https://media.giphy.com/media/dpnfPvaCIHBrW/giphy.gif',
	'https://media.giphy.com/media/mks5DcSGjhQ1a/giphy.gif',
    'https://media.giphy.com/media/8wfoaIjVc0FBaLu5xH/giphy.gif',
	'https://media.giphy.com/media/xThtanBNixj1O1m5oY/giphy.gif',
	'https://media.giphy.com/media/fdGkCOiM0oOqI/giphy.gif',
    'https://media.giphy.com/media/c862b2dAhJXYA/giphy.gif',
	'https://media.giphy.com/media/CepTYjGRbV1ba/giphy.gif',
	'https://media.giphy.com/media/sRGCQ7INgSD0qbTqB5/giphy.gif',
    'https://media.giphy.com/media/ZJYOwl8SbFsic/giphy.gif',
	'https://media.giphy.com/media/3oEhmKspQX9EN48HNm/giphy.gif',
	'https://media.giphy.com/media/l1KVcAP6jvP9r4MaA/giphy.gif',
    'https://media.giphy.com/media/j2mY6orBJqAdG/giphy.gif',
	'https://media.giphy.com/media/3oz8xEqn8AGAQbR0yY/giphy.gif',
	'https://media.giphy.com/media/l4lQW9KfRQscU0ds4/giphy.gif',
    'https://media.giphy.com/media/XathaB5ILqSME/giphy.gif',
	'https://media.giphy.com/media/26AHvF2p5pridaSf6/giphy.gif',
	'https://media.giphy.com/media/Nlur5uO8GkjC0/giphy.gif',
    'https://media.giphy.com/media/l1J3preURPiwjRPvG/giphy.gif',
	'https://media.giphy.com/media/8cdZit2ZcjTri/giphy.gif',
	'https://media.giphy.com/media/3o7btNa0RUYa5E7iiQ/giphy.gif',
    'https://media.giphy.com/media/V88pTEefkoOFG/giphy.gif',
    'https://media.giphy.com/media/rfWAomOTPeOo8/giphy.gif'
  ];

  message.channel.send({
    embed: {
      description: `${message.author.username} لقد تم تطير الجبه بنجاح  جبهتك طارت ${user.username}!`,
      image: {
        url: bombs[Math.floor(Math.random() * bombs.length)]
      }
    }
  }).catch(e => {
    client.log.error(e);
  })
        }  
});


client.on('message',  (message) => {
        if(message.content.startsWith('!sad')) {
  let user = message.mentions.users.first();
  if (!user) {

    return message.emit('commandUsage', message, this.help);
  }
  let sads = [
    'https://media.giphy.com/media/3oriO4SMR6ThimOQbS/giphy.gif',
    'https://media.giphy.com/media/QhCAwDXZ0BltK/giphy.gif',
	'https://media.giphy.com/media/Q8FaD6GjQ97jO/giphy.gif',
    'https://media.giphy.com/media/9Y5BbDSkSTiY8/giphy.gif',
	'https://media.giphy.com/media/VqcflcXbbud2M/giphy.gif',
	'https://media.giphy.com/media/3UkLhoyi553r2/giphy.gif',
    'https://media.giphy.com/media/3UkLhoyi553r2/giphy.gif',
	'https://media.giphy.com/media/Txh1UzI7d0aqs/giphy.gif',
	'https://media.giphy.com/media/GyNeHf5IrpQNG/giphy.gif',
    'https://media.giphy.com/media/lKWlXRBGltz2g/giphy.gif',
	'https://media.giphy.com/media/NTY1kHmcLsCsg/giphy.gif',
	'https://media.giphy.com/media/vzpy2NjOKdeyk/giphy.gif',
    'https://media.giphy.com/media/jRtGjzkm8JbRC/giphy.gif',
	'https://media.giphy.com/media/iyfeJqd6NLNK0/giphy.gif',
	'https://media.giphy.com/media/z2ug5EHHBuFaM/giphy.gif',
    'https://media.giphy.com/media/wIhfELB4LvDhe/giphy.gif',
	'https://media.giphy.com/media/5bukWFXJ6pn5S/giphy.gif',
	'https://media.giphy.com/media/13RfBpyqVyvIME/giphy.gif',
    'https://media.giphy.com/media/CL2Y9t4YQbp2U/giphy.gif',
	'https://media.giphy.com/media/3ov9ka1OzbTGjQtCXC/giphy.gif',
	'https://media.giphy.com/media/l3vR11Mr4XpqhtSHm/giphy.gif',
    'https://media.giphy.com/media/l2R08A0HfJkV2lwQg/giphy.gif',
	'https://media.giphy.com/media/3o6YghZV15YGZoOtIk/giphy.gif',
	'https://media.giphy.com/media/8LM1P6bkXTyhy/giphy.gif',
    'https://media.giphy.com/media/l4FGooziZSanyKS3u/giphy.gif',
	'https://media.giphy.com/media/4TnZKIJHMhjKh3mIB1/giphy.gif',
	'https://media.giphy.com/media/l0HlyXP3OkdhvO61G/giphy.gif',
    'https://media.giphy.com/media/SXCQWrsob9TGg/giphy.gif',
    'https://media.giphy.com/media/6nYwftjsGdKgOXB5C4/giphy.gif'
  ];

  message.channel.send({
    embed: {
      description: `${message.author.username} حزين بسببك او زعلان منك ${user.username}!`,
      image: {
        url: sads[Math.floor(Math.random() * sads.length)]
      }
    }
  }).catch(e => {
    client.log.error(e);
  })
        }  
});

client.on('message',  (message) => {
        if(message.content.startsWith('!hug')) {
  let user = message.mentions.users.first();
  if (!user) {

    return message.emit('commandUsage', message, this.help);
  }
  let hugs = [
    'https://media.giphy.com/media/od5H3PmEG5EVq/giphy.gif',
    'https://media.giphy.com/media/13YrHUvPzUUmkM/giphy.gif',
    'https://media.giphy.com/media/wnsgren9NtITS/giphy.gif',
    'https://media.giphy.com/media/qscdhWs5o3yb6/giphy.gif',
    'https://media.giphy.com/media/hi0VuTUqLrmuc/giphy.gif',
	'https://media.giphy.com/media/xJlOdEYy0r7ZS/giphy.gif',
	'https://media.giphy.com/media/7WQQXPg6o3YNa/giphy.gif',
	'https://media.giphy.com/media/LWTxLvp8G6gzm/giphy.gif',
	'https://media.giphy.com/media/xZshtXrSgsRHy/giphy.gif',
	'https://media.giphy.com/media/BXrwTdoho6hkQ/giphy.gif',
	'https://media.giphy.com/media/10BcGXjbHOctZC/giphy.gif',
	'https://media.giphy.com/media/49mdjsMrH7oze/giphy.gif',
	'https://media.giphy.com/media/xUPGcgtKxm4PADy3Cw/giphy.gif',
	'https://media.giphy.com/media/JTjSlqiz63j5m/giphy.gif',
	'https://media.giphy.com/media/aD1fI3UUWC4/giphy.gif',
	'https://media.giphy.com/media/5eyhBKLvYhafu/giphy.gif',
	'https://media.giphy.com/media/ddGxYkb7Fp2QRuTTGO/giphy.gif',
	'https://media.giphy.com/media/pXQhWw2oHoPIs/giphy.gif',
	'https://media.giphy.com/media/ZRI1k4BNvKX1S/giphy.gif',
	'https://media.giphy.com/media/ZQN9jsRWp1M76/giphy.gif',
	'https://media.giphy.com/media/s31WaGPAmTP1e/giphy.gif',
	'https://media.giphy.com/media/wSY4wcrHnB0CA/giphy.gif',
	'https://media.giphy.com/media/aVmEsdMmCTqSs/giphy.gif',
	'https://media.giphy.com/media/C4gbG94zAjyYE/giphy.gif',
	'https://media.giphy.com/media/ArLxZ4PebH2Ug/giphy.gif',
	'https://media.giphy.com/media/kFTKQfjK4ysZq/giphy.gif',
	'https://media.giphy.com/media/vVA8U5NnXpMXK/giphy.gif',
	'https://media.giphy.com/media/2q2qHJu838EyQ/giphy.gif',
	'https://media.giphy.com/media/q3kYEKHyiU4kU/giphy.gif',
	'https://media.giphy.com/media/3ZnBrkqoaI2hq/giphy.gif',
	'https://media.giphy.com/media/ExQqjagJBoECY/giphy.gif',
    'https://media.giphy.com/media/3o6Yg5fZCGeFArIcbm/giphy.gif'
  ];

  message.channel.send({
    embed: {
      description: `${message.author.username} اداك حضن او ضمه ${user.username}!`,
      image: {
        url: hugs[Math.floor(Math.random() * hugs.length)]
      }
    }
  }).catch(e => {
    client.log.error(e);
  })
        }  
});


client.on('message',  (message) => {
        if(message.content.startsWith('!kiss')) {
  let user = message.mentions.users.first();
  if (!user) {

    return message.emit('commandUsage', message, this.help);
  }
  let kiss = [
    'https://media.giphy.com/media/dP8ONh1mN8YWQ/giphy.gif',
    'https://media.giphy.com/media/CzCi6itPr3yBa/giphy.gif',
    'https://media.giphy.com/media/hnNyVPIXgLdle/giphy.gif',
    'https://media.giphy.com/media/bGm9FuBCGg4SY/giphy.gif',
	'https://media.giphy.com/media/G3va31oEEnIkM/giphy.gif',
	'https://media.giphy.com/media/G3va31oEEnIkM/giphy.gif',
    'https://media.giphy.com/media/BaEE3QOfm2rf2/giphy.gif',
	'https://media.giphy.com/media/OSq9souL3j5zW/giphy.gif',
	'https://giphy.com/gifs/kiss-anime-nISHppsUAzosMhttps://media.giphy.com/media/nISHppsUAzosM/giphy.gif',
	'https://media.giphy.com/media/ll5leTSPh4ocE/giphy.gif',
	'https://media.giphy.com/media/10r6oEoT6dk7E4/giphy.gif',
	'https://media.giphy.com/media/YC4QEtFmz64sE/giphy.gif',
	'https://media.giphy.com/media/KH1CTZtw1iP3W/giphy.gif',
	'https://media.giphy.com/media/flmwfIpFVrSKI/giphy.gif',
	'https://media.giphy.com/media/Z21HJj2kz9uBG/giphy.gif',
	'https://media.giphy.com/media/mGAzm47irxEpG/giphy.gif',
	'https://media.giphy.com/media/JynbO9pnGxPrO/giphy.gif',
	'https://media.giphy.com/media/7z1xs4Fl9Kb8A/giphy.gif',
	'https://media.giphy.com/media/EP9YxsbmbplIs/giphy.gif',
	'https://media.giphy.com/media/q7MxQyarcDHDW/giphy.gif',
	'https://media.giphy.com/media/uSHX6qYv1M7pC/giphy.gif',
	'https://media.giphy.com/media/EVODaJHSXZGta/giphy.gif',
	'https://media.giphy.com/media/EVODaJHSXZGta/giphy.gif',
	'https://media.giphy.com/media/fHtb1JPbfph72/giphy.gif',
	'https://media.giphy.com/media/pwZ2TLSTouCQw/giphy.gif',
	'https://media.giphy.com/media/DfzHC09hY64Gk/giphy.gif',
	'https://media.giphy.com/media/l0MYB8Ory7Hqefo9a/giphy.gif',
	'https://media.giphy.com/media/Y9iiZdUaNRF2U/giphy.gif',
	'https://media.giphy.com/media/CTo4IKRN4l4SA/giphy.gif',
	'https://media.giphy.com/media/jR22gdcPiOLaE/giphy.gif',
    'https://media.giphy.com/media/pFg4Ko6pXqQVy/giphy.gif'
  ];

  message.channel.send({
    embed: {
      description: `${message.author.username}اداك قبله ا�� بوسه ${user.username}!`,
      image: {
        url: kiss[Math.floor(Math.random() * kiss.length)]
      }
    }
  }).catch(e => {
    client.log.error(e);
  })
        }  
});


client.on('message',  (message) => {
        if(message.content.startsWith('!miss')) {
  let user = message.mentions.users.first();
  if (!user) {

    return message.emit('commandUsage', message, this.help);
  }
  let misss = [
    'https://media.giphy.com/media/3o6vXUgk6M0h07MnuM/giphy.gif',
    'https://media.giphy.com/media/NfOD0Bv11XnhK/giphy.gif',
    'https://media.giphy.com/media/2Jl7a8ixNlNHa/giphy.gif',
    'https://media.giphy.com/media/WkNXHaiV9HLji/giphy.gif',
    'https://media.giphy.com/media/3DiUM4dGYyali/giphy.gif',
    'https://media.giphy.com/media/17CdXoPQo7Un6/giphy.gif',
    'https://media.giphy.com/media/pjgaGMqsNhjhe/giphy.gif',
    'https://media.giphy.com/media/qdhgMbi5mwS9W/giphy.gif',
    'https://media.giphy.com/media/xTgJVYEHoVzpe/giphy.gif',
    'https://media.giphy.com/media/o1UKv4TutEOUo/giphy.gif',
    'https://media.giphy.com/media/3o6QLcNZgGKvFBluKs/giphy.gif',
    'https://media.giphy.com/media/to8AmZ3lEUhqg/giphy.gif',
    'https://media.giphy.com/media/3o6QKXms0mJznYVkm4/giphy.gif',
    'https://media.giphy.com/media/148LYpgc9AIUdW/giphy.gif',
    'https://media.giphy.com/media/4MDnmxVxCZcYM/giphy.gif',
    'https://media.giphy.com/media/5XHHIFJZpQsXS/giphy.gif',
    'https://media.giphy.com/media/3o7TKzEQfYQ7inapoI/giphy.gif',
    'https://media.giphy.com/media/l2Je61TcDeJ4ZOIyk/giphy.gif',
    'https://media.giphy.com/media/3o6Mb3mYI1yuqEwgFi/giphy.gif',
    'https://media.giphy.com/media/mfAGXwxCd3D8Y/giphy.gif',
    'https://media.giphy.com/media/l0HlFinR4G1JvptjG/giphy.gif',
    'https://media.giphy.com/media/9iVgOohm2SKT6/giphy.gif',
    'https://media.giphy.com/media/26gsj4kyT3LwhPufK/giphy.gif',
    'https://media.giphy.com/media/116mAogyorg84U/giphy.gif',
    'https://media.giphy.com/media/l2ZDOR1uY9yo6MJyM/giphy.gif',
    'https://media.giphy.com/media/l2ZDWLIIZLhLiuMSs/giphy.gif',
    'https://media.giphy.com/media/OT89Nuhy3GAFbW359x/giphy.gif',
    'https://media.giphy.com/media/82AkGaEtqrybM2RFSh/giphy.gif',
    'https://media.giphy.com/media/1o1ouZSWwFVwysKcnm/giphy.gif',
    'https://media.giphy.com/media/8mqyDwYRdzdRof6fzu/giphy.gif',
    'https://media.giphy.com/media/3oriO0bDWiobwAWqGY/giphy.gif'
  ];

  message.channel.send({
    embed: {
      description: `${message.author.username} اشتاق اليك كثيرا  ${user.username}!`,
      image: {
        url: misss[Math.floor(Math.random() * misss.length)]
      }
    }
  }).catch(e => {
    client.log.error(e);
  })
        }  
});


client.on('message',  (message) => {
        if(message.content.startsWith('!love')) {
  let user = message.mentions.users.first();
  if (!user) {

    return message.emit('commandUsage', message, this.help);
  }
  let loves = [
    'https://media.giphy.com/media/YDB4EF3U6i6IM/giphy.gif',
    'https://media.giphy.com/media/l41JWw65TcBGjPpRK/giphy.gif',
    'https://media.giphy.com/media/3o6gDZ9unSrDk3EuR2/giphy.gif',
    'https://media.giphy.com/media/ymkLJAxVz2la/giphy.gif',
    'https://media.giphy.com/media/ZOln4JxCoZay4/giphy.gif',
    'https://media.giphy.com/media/l0K4kWJir91VEoa1W/giphy.gif',
    'https://media.giphy.com/media/X3FmqQ7ehoCBy/giphy.gif',
    'https://media.giphy.com/media/VlzUkJJzvz0UU/giphy.gif',
    'https://media.giphy.com/media/NbPJFUS6Vkx7q/giphy.gif',
    'https://media.giphy.com/media/wDEWXcisSjrQQ/giphy.gif',
    'https://media.giphy.com/media/xT8qBuhwq0OyL7UkdW/giphy.gif',
    'https://media.giphy.com/media/gfvxlwRKH1y5q/giphy.gif',
    'https://media.giphy.com/media/PuTSgeacS3Z7i/giphy.gif',
    'https://media.giphy.com/media/l49JBwneyflgjm5zO/giphy.gif',
    'https://media.giphy.com/media/QKUA2bIAgjFgk/giphy.gif',
    'https://media.giphy.com/media/T3Uzzre7Ap0mk/giphy.gif',
    'https://media.giphy.com/media/3oeSB6pawq6G99xCXS/giphy.gif',
    'https://media.giphy.com/media/iKIgD5j0I3hMQ/giphy.gif',
    'https://media.giphy.com/media/hhHcFH0xAduCs/giphy.gif',
    'https://media.giphy.com/media/3o7qDJKIO5rSeyHhvO/giphy.gif',
    'https://media.giphy.com/media/92bGINsmjAuUE/giphy.gif',
    'https://media.giphy.com/media/bErElGdAHUmoE/giphy.gif',
    'https://media.giphy.com/media/jQqU9dCKUOdri/giphy.gif',
    'https://media.giphy.com/media/10uJ0IFxlCA06I/giphy.gif',
    'https://media.giphy.com/media/bMLGNRoAy0Yko/giphy.gif',
    'https://media.giphy.com/media/3osxYcry2fDfqyhOQ8/giphy.gif',
    'https://media.giphy.com/media/3ohs84a6AyArTscVsk/giphy.gif',
    'https://media.giphy.com/media/3o6Zt6D0wctP0kpuwg/giphy.gif',
    'https://media.giphy.com/media/4zmFt0xpke8AU/giphy.gif',
    'https://media.giphy.com/media/l3vR9O3vpOCDRo8rC/giphy.gif',
    'https://media.giphy.com/media/13sgibUDaaaEU0/giphy.gif'
  ];

  message.channel.send({
    embed: {
      description: `${message.author.username} :heart:  يعبر لك عن حبه الحقيقي   ${user.username}!`,
      image: {
        url: loves[Math.floor(Math.random() * loves.length)]
      }
    }
  }).catch(e => {
    client.log.error(e);
  })
        }  
});



var cats = [

"https://static.pexels.com/photos/104827/cat-pet-animal-domestic-104827.jpeg",
"https://www.petfinder.com/wp-content/uploads/2012/11/101438745-cat-conjunctivitis-causes.jpg",
"http://www.i-love-cats.com/images/2015/04/12/cat-wallpaper-38.jpg",
"https://www.aspca.org/sites/default/files/cat-care_urine-marking_main-image.jpg",
"https://vignette1.wikia.nocookie.net/houseofnight/images/8/8b/Cats.jpg/revision/latest?cb=20130812053537",
"https://images.pexels.com/photos/1022158/pexels-photo-1022158.jpeg?cs=srgb&dl=adorable-animal-animal-photography-1022158.jpg&fm=jpg",
"https://images.pexels.com/photos/248280/pexels-photo-248280.jpeg?cs=srgb&dl=adorable-animal-animal-photography-248280.jpg&fm=jpg",
"https://images.pexels.com/photos/156934/pexels-photo-156934.jpeg?cs=srgb&dl=adorable-animal-cat-156934.jpg&fm=jpg",
"https://images.pexels.com/photos/385960/pexels-photo-385960.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
"https://images.pexels.com/photos/39255/cat-favorite-relaxation-rest-39255.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
"https://images.pexels.com/photos/569170/pexels-photo-569170.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
"https://images.pexels.com/photos/735423/pexels-photo-735423.jpeg?cs=srgb&dl=adorable-animal-animal-photography-735423.jpg&fm=jpg",
"https://images.pexels.com/photos/923360/pexels-photo-923360.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
"https://images.pexels.com/photos/96938/pexels-photo-96938.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
"https://images.pexels.com/photos/225406/pexels-photo-225406.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
"https://s-media-cache-ak0.pinimg.com/originals/f0/3b/76/f03b7614dfadbbe4c2e8f88b69d12e04.jpg",
"http://www.rd.com/wp-content/uploads/sites/2/2016/04/15-cat-wants-to-tell-you-attention.jpg"
]
    client.on('message', message => {
        var args = message.content.split(" ").slice(1);
    if(message.content.startsWith(prefix + 'cat')) {
         var cat = new Discord.RichEmbed()
.setImage(cats[Math.floor(Math.random() * cats.length)])
message.channel.sendEmbed(cat);
    }
});

const fetch = require('snekfetch');
 client.on('message', message => {
if (message.content.startsWith('!ask')) {
      let args = message.content.split(' ').slice(1).join(' ');
    const hexcols = [0xFFB6C1, 0x4C84C0, 0xAD1A2C, 0x20B046, 0xF2E807, 0xF207D1, 0xEE8419];
    if (!args) {
        return message.reply('add a urban search, u pleb!');
    }
    fetch.get('http://api.urbandictionary.com/v0/define?term=' + args).then(res => {
        if (res.body.list[0] === undefined) {
            return message.channel.send('**»Error**: Couldnt find the word');
        }
        const definition = res.body.list[0].definition;
        const word = res.body.list[0].word;
        const Author = res.body.list[0].author;
        const exam = res.body.list[0].example;
        const thumup = res.body.list[0].thumbs_up;
        const thumdown = res.body.list[0].thumbs_down;
        const embed = new Discord.RichEmbed()
    .setColor(hexcols[~~(Math.random() * hexcols.length)])
    .setTitle(`This is the info for the word: **${word}**`)
    .addField('definition:', `${definition}`)
    .addField('Author:', `${Author}`)
    .addField('Example:', `${exam}`)
    .addField('Rating', `👍 ${thumup} 👎 ${thumdown}`, true)
    .setThumbnail('https://cdn.discordapp.com/attachments/486250425817890821/486526624112705617/ce5fb05919818916b5f598f3ee18afaa.png');
        message.channel.send({embed}).catch(e => console.log(e));
    }).catch(err => {
        if (err) {
            console.log(err);
        }

    });
};
  });

client.on("message", function(message) {
	var prefix = "!";
   if(message.content.startsWith(prefix + "rps")) {
    let messageArgs = message.content.split(" ").slice(1).join(" ");
    let messageRPS = message.content.split(" ").slice(2).join(" ");
    let arrayRPS = ['**# - Rock**','**# - Paper**','**# - Scissors**'];
    let result = `${arrayRPS[Math.floor(Math.random() * arrayRPS.length)]}`;
    var RpsEmbed = new Discord.RichEmbed()
    .setAuthor(message.author.username)
    .setThumbnail(message.author.avatarURL)
    .addField("Rock","🇷",true)
    .addField("Paper","🇵",true)
    .addField("Scissors","🇸",true)
    message.channel.send(RpsEmbed).then(msg => {
        msg.react(' 🇷')
        msg.react("🇸")
        msg.react("🇵")
.then(() => msg.react('🇷'))
.then(() =>msg.react('🇸'))
.then(() => msg.react('🇵'))
let reaction1Filter = (reaction, user) => reaction.emoji.name === '🇷' && user.id === message.author.id;
let reaction2Filter = (reaction, user) => reaction.emoji.name === '🇸' && user.id === message.author.id;
let reaction3Filter = (reaction, user) => reaction.emoji.name === '🇵' && user.id === message.author.id;
let reaction1 = msg.createReactionCollector(reaction1Filter, { time: 12000 });
	    
let reaction2 = msg.createReactionCollector(reaction2Filter, { time: 12000 });
let reaction3 = msg.createReactionCollector(reaction3Filter, { time: 12000 });
reaction1.on("collect", r => {
        message.channel.send(result)
})
reaction2.on("collect", r => {
        message.channel.send(result)
})
reaction3.on("collect", r => {
        message.channel.send(result)
})

    })
}
});


  client.on('message', message => {
      if(message.content.startsWith ("!marry")) {
      if(!message.channel.guild) return message.reply('** This command only for servers **')
      var proposed = message.mentions.members.first()
     
      if(!message.mentions.members.first()) return message.reply(' 😏 **لازم تطلب ايد وحدة**').catch(console.error);
      if(message.mentions.users.size > 1) return message.reply(' 😳 **ولد ما يصحلك الا حرمة وحدة كل مرة**').catch(console.error);
       if(proposed === message.author) return message.reply(`**خنثى ؟ **`);
        if(proposed === client.user) return message.reply(`** تبي تتزوجني؟ **`);
              message.channel.send(`**${proposed} 
 بدك تقبلي عرض الزواج من ${message.author} 
 العرض لمدة 15 ثانية  
 اكتبي موافقة او لا**`)

const filter = m => m.content.startsWith("موافقة");
message.channel.awaitMessages(filter, { max: 1, time: 15000, errors: ['time'] })
.then(collected =>{ 
    message.channel.send(` **${message.author} و ${proposed} الف الف مبروك الله , يرزقكم الذرية الصالحة** `);
})

   const filte = m => m.content.startsWith("لا");
message.channel.awaitMessages(filte, { max: 1, time: 15000, errors: ['time'] })
.then(collected =>{ 
   message.channel.send(`  **${message.author} تم رفض عرضك** `);
})
        
  }
});
  



  client.on('message', message => {
if(message.content.startsWith("!slots")) {
  let slot1 = ['🍏', '🍇', '🍒', '🍍', '🍅', '🍆', '🍑', '🍓'];
  let slots1 = `${slot1[Math.floor(Math.random() * slot1.length)]}`;
  let slots2 = `${slot1[Math.floor(Math.random() * slot1.length)]}`;
  let slots3 = `${slot1[Math.floor(Math.random() * slot1.length)]}`;
  let we;
  if(slots1 === slots2 && slots2 === slots3) {
    we = "Win!"
  } else {
    we = "Lose!"
  }
  message.channel.send(`${slots1} | ${slots2} | ${slots3} - ${we}`)
}
});


client.on('message', message => {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  let command = message.content.split(" ")[0];
  command = command.slice(prefix.length);

  let args = message.content.split(" ").slice(1);

// !say
  if (command === "say") {
          message.delete()
    message.channel.sendMessage(args.join(" ")).catch(console.error);
  }
  
 

if (command == "embed") {
    let say = new Discord.RichEmbed()
    .setDescription(args.join("  "))
    .setColor(0x23b2d6)
    message.channel.sendEmbed(say);
    message.delete();
  }


});


client.on('message', message => {
     if (message.content === "!ping") {
      const embed = new Discord.RichEmbed()
 
  .setColor("#FF0000")
  .addField('``سرعة أتصال الــبوت`` ' , `${Date.now() - message.createdTimestamp}` + ' ms`')
                 .setFooter(` A7med Bot
 .`, 'https://aladdintravel.com/wp-content/uploads/2014/11/pinterest-logo-2-1074x1067.png')

  message.channel.sendEmbed(embed);
    }
});


client.on('message',message => {
         if (!message.content.startsWith(prefix)) return;
var cont = message.content.slice(prefix.length).split(" ");

  var args = cont.slice(1);
       if (message.content.startsWith("!nick")) {
   let nickmention = message.mentions.users.first()
    if (message.mentions.users.size === 0) {
        if (message.member.permissions.has("CHANGE_NICKNAME")) {
            let nickchange = args.slice(0).join(" ");
            if (args[0] === undefined) {
                message.channel.send("**ضع الاسم الذي تريده**")
                return;
            }
            message.guild.members.get(message.author.id).setNickname(nickchange).catch(err => {
                message.channel.send("Error: " + err)
                return;
            });
            message.channel.send("✅ **Changed your nickname to:** `" + nickchange + "`")
            return;
        } else {
            message.channel.send("You don't have permission to change your username. 😕")
            return;
        }
        return; 
    }
    if (message.member.permissions.has("MANAGE_NICKNAMES", "ADMINISTRATOR")) {
        let nickchange = args.slice(1).join(" ");
        if (args[0] === undefined) {
            message.channel.send("**ضع اسم**")
            return;
        }
        message.guild.members.get(nickmention.id).setNickname(nickchange).catch(err => {
            message.channel.send("Error: " + err);
            return;
        });
        message.channel.send("Nick of " + nickmention + " (" + nickmention.username + "!" + nickmention.discriminator + ") changed to: `" + nickchange + "`")
  
     }
    } 
});

 client.on("message", (message) => {
                        if (message.channel.type === "dm") {
                    if (message.author.id === client.user.id) return;
                    let yumz = new Discord.RichEmbed()
                                .setTimestamp()
                                .setTitle("Direct Message To The Bot")
                                .addField(`Sent By:`, `<@${message.author.id}>`)
                                .setColor("RANDOM")
                                .setThumbnail(message.author.displayAvatarURL)
                                .addField(`Message: `, `\n\n\`\`\`${message.content}\`\`\``)
                                .setFooter(`DM Bot Messages | DM Logs`)
                            client.users.get("533140382259871744").send(yumz)
                        }
            });

client.on('message', msg => {
  if(msg.content === '!hide') {
    msg.guild.channels.forEach(c => {
      c.overwritePermissions(msg.guild.id, {
        SEND_MESSAGES: false,
        READ_MESSAGES: false
      })
    })
    msg.channel.send('.')
  }
})

client.on('message', msg => {
  if(msg.content === '!show') {
    msg.guild.channels.forEach(c => {
      c.overwritePermissions(msg.guild.id, {
        SEND_MESSAGES: true,
        READ_MESSAGES: true
      })
    })
    msg.channel.send('.')
  }
})

client.on('message', message => { 
    if(message.content === prefix + 'cc1') {
                         if(!message.channel.guild) return message.channel.send('**This Commnad only For Servers !**');
         if(!message.member.hasPermission('ADMINISTRATOR')) return    message.channel.send('**You Dont Have** `ADMINISTRATOR` **premission**').then(msg => msg.delete(6000))
      message.guild.createRole({
                  name: "1",
                    color: "#050000",
                    permissions: []
     })
           message.guild.createRole({
                  name: "2",
                    color: "#262726",
                    permissions: []
     })
                message.guild.createRole({
                  name: "3",
                    color: "#333433",
                    permissions: []
     })
                     message.guild.createRole({
                  name: "4",
                    color: "#454545",
                    permissions: []
     })
                     message.guild.createRole({
                  name: "5",
                    color: "#565656",
                    permissions: []
     })
                     message.guild.createRole({
                  name: "6",
                    color: "#646464",
                    permissions: []
     })
                     message.guild.createRole({
                  name: "7",
                    color: "#787878",
                    permissions: []
     })
                     message.guild.createRole({
                  name: "8",
                    color: "#8d8c8c",
                    permissions: []
     })
                     message.guild.createRole({
                  name: "8",
                    color: "#9a9a9a",
                    permissions: []
     })
                     message.guild.createRole({
                  name: "9",
                    color: "#afaeae",
                    permissions: []
     })
                     message.guild.createRole({
                  name: "10",
                    color: "#bcbbbb",
                    permissions: []
     })
                     message.guild.createRole({
                  name: "11",
                    color: "#8504fa",
                    permissions: []
     })
                     message.guild.createRole({
                  name: "12",
                    color: "#7607dd",
                    permissions: []
     })
                     message.guild.createRole({
                  name: "13",
                    color: "#6a05c8",
                    permissions: []
     })
                          message.guild.createRole({
                  name: "14",
                    color: "#6006b4",
                    permissions: []
     })
                          message.guild.createRole({
                  name: "15",
                    color: "#5a07a8",
                    permissions: []
     })
                               message.guild.createRole({
                  name: "16",
                    color: "#4c078d",
                    permissions: []
     })
                                    message.guild.createRole({
                  name: "17",
                    color: "#43067c",
                    permissions: []
     })
                                    message.guild.createRole({
                  name: "18",
                    color: "#360564",
                    permissions: []
     })
                                    message.guild.createRole({
                  name: "19",
                    color: "#270349",
                    permissions: []
     })
                                    message.guild.createRole({
                  name: "20",
                    color: "#fa04a1",
                    permissions: []
     })
                                    message.guild.createRole({
                  name: "21",
                    color: "#ef069b",
                    permissions: []
     })
                                    message.guild.createRole({
                  name: "22",
                    color: "#c30781",
                    permissions: []
     })
                                    message.guild.createRole({
                  name: "23",
                    color: "#a80871",
                    permissions: []
     })
                                    message.guild.createRole({
                  name: "24",
                    color: "#970966",
                    permissions: []
     })
                                    message.guild.createRole({
                  name: "25",
                    color: "#7f0956",
                    permissions: []
     })
                                    message.guild.createRole({
                  name: "26",
                    color: "#6e094b",
                    permissions: []
     })
                                    message.guild.createRole({
                  name: "27",
                    color: "#4e0735",
                    permissions: []
     })
                                    message.guild.createRole({
                  name: "28",
                    color: "#f80854",
                    permissions: []
     })
                                    message.guild.createRole({
                  name: "29",
                    color: "#db064a",
                    permissions: []
     })
                                         message.guild.createRole({
                  name: "30",
                    color: "#ca0745",
                    permissions: []
     })
                                         message.guild.createRole({
                  name: "31",
                    color: "#af083d",
                    permissions: []
     })
                                         message.guild.createRole({
                  name: "32",
                    color: "#940834",
                    permissions: []
     })
                                         message.guild.createRole({
                  name: "33",
                    color: "#7f062c",
                    permissions: []
     })
                                         message.guild.createRole({
                  name: "34",
                    color: "#6b0424",
                    permissions: []
     })
                                         message.guild.createRole({
                  name: "35",
                    color: "#f8071e",
                    permissions: []
     })
                                         message.guild.createRole({
                  name: "36",
                    color: "#d6071b",
                    permissions: []
     })
                                         message.guild.createRole({
                  name: "37",
                    color: "#b60516",
                    permissions: []
     })
                                         message.guild.createRole({
                  name: "38",
                    color: "#a80515",
                    permissions: []
     })
                                         message.guild.createRole({
                  name: "39",
                    color: "#8d0512",
                    permissions: []
     })
                                         message.guild.createRole({
                  name: "40",
                    color: "#7f0410",
                    permissions: []
     })
                                         message.guild.createRole({
                  name: "41",
                    color: "#6b030d",
                    permissions: []
     })
                                         message.guild.createRole({
                  name: "42",
                    color: "#06bcf3",
                    permissions: []
     })
                                         message.guild.createRole({
                  name: "43",
                    color: "#099dca",
                    permissions: []
     })
                                         message.guild.createRole({
                  name: "44",
                    color: "#098db6",
                    permissions: []
     })
                                         message.guild.createRole({
                  name: "45",
                    color: "#057a9e",
                    permissions: []
     })
                                         message.guild.createRole({
                  name: "46",
                    color: "#06637f",
                    permissions: []
     })
                                         message.guild.createRole({
                  name: "47",
                    color: "#054e64",
                    permissions: []
     })
                                         message.guild.createRole({
                  name: "48",
                    color: "#044255",
                    permissions: []
     })
                                         message.guild.createRole({
                  name: "49",
                    color: "#02dff8",
                    permissions: []
     })
                                         message.guild.createRole({
                  name: "50",
                    color: "#03c5db",
                    permissions: []
     })
 
          message.channel.sendMessage({embed: new Discord.RichEmbed()
     .setColor('#502faf').setAuthor(`${message.author.username}'`, message.author.avatarURL).setDescription('``تم انشاءالالوان``')});
    }
    });

client.on('message', message => {
            let args = message.content.split(' ').slice(1);
            if(message.content.split(' ')[0] == `${prefix}لون`){
            const embedd = new Discord.RichEmbed()
            .setFooter('Requested by '+message.author.username, message.author.avatarURL)
            .setDescription(`**لا يوجد لون بهذا الأسم ** ❌ `)
            .setColor(`ff0000`)
           
            if(!isNaN(args) && args.length > 0)
           
           
            if    (!(message.guild.roles.find("name",`${args}`))) return  message.channel.sendEmbed(embedd);
           
           
            var a = message.guild.roles.find("name",`${args}`)
             if(!a)return;
            const embed = new Discord.RichEmbed()
           
            .setFooter('Requested by '+message.author.username, message.author.avatarURL)
            .setDescription(`**Done , تم تغير لونك . ✅ **`)
           
            .setColor(`${a.hexColor}`)
            message.channel.sendEmbed(embed);
            if (!args)return;
            setInterval(function(){})
               let count = 0;
               let ecount = 0;
            for(let x = 1; x < 201; x++){
           
            message.member.removeRole(message.guild.roles.find("name",`${x}`))
           
            }
             message.member.addRole(message.guild.roles.find("name",`${args}`));
           
           
            }
            });


const sWlc = {}
client.on('message', message => {
var prefix = "!";
if(message.channel.type === "dm") return;
if(message.author.bot) return;
  if(!sWlc[message.guild.id]) sWlc[message.guild.id] = {
    channel: "chat"
}
const channel = sWlc[message.guild.id].channel
  if (message.content.startsWith(prefix + "setwelcomer")) {
    if(!message.member.hasPermission(`MANAGE_GUILD`)) return;
    let newChannel = message.content.split(' ').slice(1).join(" ")
    if(!newChannel) return message.reply(`**${prefix}setwelcomer <channel name>**`)
    sWlc[message.guild.id].channel = newChannel
    message.channel.send(`**${message.guild.name}'s channel has been changed to ${newChannel}**`);
  }
});

client.on("guildMemberAdd", member => {
      if(!sWlc[member.guild.id]) sWlc[member.guild.id] = {
    channel: "chat"
  }
  const channel = sWlc[member.guild.id].channel
    const sChannel = sWlc[member.guild.id].channel
    let welcomer = member.guild.channels.find('name', sChannel);
    let memberavatar = member.user.avatarURL
      if (!welcomer) return;
      if(welcomer) {
         moment.locale('ar-ly');
         var h = member.user;
        let heroo = new Discord.RichEmbed()
        .setColor('RANDOM')
        .setThumbnail(h.avatarURL)
        .setAuthor(h.username,h.avatarURL)
        .addField(': تاريخ دخولك الدسكورد',`${moment(member.user.createdAt).format('D/M/YYYY h:mm a')} **\n** \`${moment(member.user.createdAt).fromNow()}\``,true)            
         .addField(': تاريخ دخولك السيرفر',`${moment(member.joinedAt).format('D/M/YYYY h:mm a ')} \n\`\`${moment(member.joinedAt).startOf(' ').fromNow()}\`\``, true)      
         .setFooter(`${h.tag}`,"https://images-ext-2.discordapp.net/external/JpyzxW2wMRG2874gSTdNTpC_q9AHl8x8V4SMmtRtlVk/https/orcid.org/sites/default/files/files/ID_symbol_B-W_128x128.gif")
     welcomer.send({embed:heroo});          
         
      var Canvas = require('canvas')
      var jimp = require('jimp')
     const w = ['swlc.png'];
      
              let Image = Canvas.Image,
                  canvas = new Canvas(557, 241),
                  ctx = canvas.getContext('2d');
  
              fs.readFile(`${w[Math.floor(Math.random() * w.length)]}`, function (err, Background) {
                  if (err) return console.log(err)
                  let BG = Canvas.Image;
                  let ground = new Image;
                  ground.src = Background;
                  ctx.drawImage(ground, 0, 0, 557, 241);
      
      })
      
                      let url = member.user.displayAvatarURL.endsWith(".webp") ? member.user.displayAvatarURL.slice(5, -20) + ".gif" : member.user.displayAvatarURL;
                      jimp.read(url, (err, ava) => {
                          if (err) return console.log(err);
                          ava.getBuffer(jimp.MIME_PNG, (err, buf) => {
                              if (err) return console.log(err);
      
                                    ctx.font = '30px Arial Bold';
                              ctx.fontSize = '20px';
                              ctx.fillStyle = "#FFFFFF";
                                ctx.fillText(member.user.username, 245, 150);
                              
                              //NAMEً
                              ctx.font = '30px Arial';
                              ctx.fontSize = '28px';
                              ctx.fillStyle = "#FFFFFF";
      ctx.fillText(`welcome to server`, 245, 80);
    
                              //AVATARً
                              let Avatar = Canvas.Image;
                              let ava = new Avatar;
                              ava.src = buf;
                              ctx.beginPath();
                 ctx.arc(120.8, 120.5, 112.3, 0, Math.PI*2, true);
                   ctx.closePath();
                   
                                 ctx.clip();

                        ctx.drawImage(ava, 7, 8, 227, 225);
                              ctx.closePath();

                            
    welcomer.sendFile(canvas.toBuffer())
      
      
      
      })
      })
      
      }
      });



client.on('message', message => {
    if(message.channel.type === 'dm') {
        var guildID = '533625461083996191'; // <=============== ايدي السيرفر حقك
        if(message.content.includes('discord.gg/')) {
            var member = client.guilds.find(g => g.id === guildID).members.find(m => m.id === message.author.id);
            member.ban({ reason: 'ADS In Private.' }).catch();
        }
    }
});


client.on('message', message => {
	var prefix = "!";
    if(message.content.startsWith(prefix + 'new')) {
        let args = message.content.split(' ').slice(1).join(' ');
        let support = message.guild.roles.find("name","Support Team");
        let ticketsStation = message.guild.channels.find("name", "tickets");
        if(!args) {
            return message.channel.send('الرجاء كتابة سبب التذكرة');
        };
                if(!support) {
                    return message.channel.send('**Please make sure that `Support Team` role exists and it\'s not duplicated.**');
                };
            if(!ticketsStation) {
                message.guild.createChannel("Ticket", "category");
            };
                message.guild.createChannel(`𝑻𝑰𝑪𝑲𝑬𝑻`, "text").then(ticket => {
                    message.delete()
                        message.channel.send(`تم انشاء تذكرتك. [ ${ticket} ]`);
                    ticket.setParent(ticketsStation);
                    ticketsStation.setPosition(1);
                        ticket.overwritePermissions(message.guild.id, {
                            SEND_MESSAGES: false,
                            READ_MESSAGES: false
                        });
                            ticket.overwritePermissions(support.id, {
                                SEND_MESSAGES: true,
                                READ_MESSAGES: true
                            });
                                ticket.overwritePermissions(message.author.id, {
                                    SEND_MESSAGES: true,
                                    READ_MESSAGES: true
                                });
                    let embed = new Discord.RichEmbed()
                                .setTitle('**تذكرة جديدة.**')
                                .setColor("RANDOM")
                                .setThumbnail(`${message.author.avatarURL}`)
                                .addField('سبب التذكرة', args)
                                .addField('صاحب التذكرة', message.author)
                                .addField('الروم', `<#${message.channel.id}>`);

                                ticket.sendEmbed(embed);
                }) .catch();
    }
    if(message.content.startsWith(prefix + 'close')) {
            if(!message.member.hasPermission("ADMINISTRATOR")) return;
        if(!message.channel.name.startsWith("𝑻𝑰𝑪𝑲𝑬𝑻")) {
            return;
        };  
                let embed = new Discord.RichEmbed()
                    .setAuthor("هل تريد فعلآ اغلاق التذكرة ؟.")
                    .setColor("RANDOM");
                    message.channel.sendEmbed(embed) .then(codes => {

                    
                        const filter = msg => msg.content.startsWith(prefix + 'close');
                        message.channel.awaitMessages(response => response.content === prefix + 'close', {
                            max: 1,
                            time: 20000,
                            errors: ['time']
                        })
                        .then((collect) => {
                            message.channel.delete();
                        }) .catch(() => {
                            codes.delete()
                                .then(message.channel.send('**Operation has been cancelled.**')) .then((c) => {
                                    c.delete(4000);
                                })
                                    
                            
                        })


                    })


            
    }
});

client.on("message", message => {
            if(message.content.startsWith("!تقديم")) {
        if(!message.channel.guild) return;
                if(message.author.bot) return;
        let channel = message.guild.channels.find("name", "التقديمات")
            if(!channel) return message.reply("**لانشاء روم التقديمات !room1 من فضلك اكتب الامر**")
            if(channel) {
            message.channel.send( message.member + ', **:timer:**').then( (m) =>{
              m.edit( message.member + ', **اسمك الحقيقى  ✍**' )
              m.channel.awaitMessages( m1 => m1.author == message.author,{ maxMatches: 1, time: 60*1000 } ).then ( (m1) => {
                  m1 = m1.first();
                  var name = m1.content;
                  m1.delete();
                  m.edit(message.member + ', **:timer:**').then( (m) =>{
                      m.edit( message.member + ', **عندك كام سنة 🎓**' )
                      setTimeout(() => {
                        m.delete()
                      }, 10000);
                      m.channel.awaitMessages( m2 => m2.author == message.author,{ maxMatches: 1, time: 60*1000 } ).then ( (m2) => {
                          m2 = m2.first();
                          var age = m2.content;
                          m2.delete()
                          message.channel.send( message.member + ', **:timer:**').then( (m) =>{
                            m.edit( message.member + ', **هل تتفاعل في الرتبه🎙**' )
                            setTimeout(() => {
                              m.delete()
                            }, 10000);
                            m.channel.awaitMessages( m1 => m1.author == message.author,{ maxMatches: 1, time: 60*1000 } ).then ( (m3) => {
                                m3 = m3.first();
                                var ask = m3.content;
                                m3.delete();
                                message.channel.send( message.member + ', **:timer:**').then( (m) =>{
                                  m.edit( message.member + ', **هل ستحترم القوانين ؟ 📑**' )
                                  setTimeout(() => {
                                    m.delete()
                                  }, 10000);
                                  m.channel.awaitMessages( m1 => m1.author == message.author,{ maxMatches: 1, time: 60*1000 } ).then ( (m4) => {
                                      m4 = m4.first();
                                      var ask2 = m4.content;
                                      m4.delete();
                                      message.channel.send( message.member + ', **:timer:**').then( (m) =>{
                                        m.edit( message.member + ', **لماذا يجب علينا ان نقبلك ؟ اعطنا سبباً وجيهاً 🤔**' )
                                        m.channel.awaitMessages( m1 => m1.author == message.author,{ maxMatches: 1, time: 60*1000 } ).then ( (m5) => {
                                            m5 = m5.first();
                                            var ask3 = m5.content;
                                            m5.delete();
                      m.edit(message.member + ', **....جارى جمع البيانات**').then( (mtime)=>{
                        setTimeout(() => {
                          let embed = new Discord.RichEmbed()
                        .setColor('RANDOM')
                        .setTitle(`**تقديم على رتبه** [__**${message.guild.name}**__]`)
                        .addField('**`الاسم`**', `${name}` , true)
                        .addField('**`العمر`**', `${age}` , true)
                        .addField('**`هل سيتفاعل ؟`**',`${ask}`)
                        .addField('**`هل سيحترم القوانين ؟`**',`${ask2}`)
                        .addField('**`لماذا يجب علينا قبوله ؟`**',`${ask3}`)
                        .setFooter(message.author.username,'https://images-ext-2.discordapp.net/external/JpyzxW2wMRG2874gSTdNTpC_q9AHl8x8V4SMmtRtlVk/https/orcid.org/sites/default/files/files/ID_symbol_B-W_128x128.gif')
                        channel.send(embed)
                        }, 2500);
                        setTimeout(() => {
                          mtime.delete()
                        }, 3000);
 
                  })
                })
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
}
        });


client.on('message', message=>{
            if(message.content.startsWith("!room1")) {
            if(!message.channel.guild) return;
                if(message.author.bot) return;
                if(!message.member.hasPermission('ADMINISTRATOR')) return message.reply("**تحتاج الى `MANAGE_CHANNELS`**");
                message.guild.createChannel("التقديمات", "text").then(c =>{
                    c.overwritePermissions(message.guild.id, {
                        SEND_MESSAGES: false
 
                          })
                })
    message.channel.send("**✅ تم انشاء روم التقديمات بنجاح**")
            }
            })
    client.on('message',async message => {
  let mention = message.mentions.members.first();
  let role = message.content.split(" ").slice(2).join(" ");
  let mySupport = message.guild.roles.find('name',role);
  if(message.content.startsWith("!قبول")) {
    let acRoom = message.guild.channels.find('name', 'القبول-الرفض');
    if(!acRoom) return message.reply("!!setac من فضلك انشاء روم **القبول-ال��فض** او اكتب الامر");
    if(acRoom) {
    if(!message.guild.member(message.author).hasPermission("MANAGE_ROLES")) return;
    if(!mention) return message.reply('منشن شخص');
    if(!role) return message.reply('ادخل اسم رتبة');
    if(!mySupport) return message.reply('هذه الرتبة غير موجودة');
    if(mention.roles.has(mySupport)) return message.reply('هذا الشخص معه الرتبة مسبقا');
 
    mention.addRole(mySupport).then(() => {
      acRoom.send(`**[ ${mySupport} ] واعطائك رتبة ${mention} تم بنجاح قبولك**`);
    });
  }
}
});
client.on('message',async message => {
  let mention = message.mentions.members.first();
  if(message.content.startsWith("!رفض")) {
  if(!message.channel.guild) return;
  let acRoom = message.guild.channels.find('name', 'القبول-الرفض');
  if(!acRoom) return message.reply("!!setac من فضلك انشاء روم **القبول-الرفض** او اكتب الامر");
  if(!message.guild.member(message.author).hasPermission("MANAGE_ROLES")) return;
  if(!mention) return message.reply("منشن شخص");
 
  acRoom.send(`**${mention} تم رفضك للاسف**`)
  }
});
          client.on('message', message=>{
            if(message.content.startsWith("!room2")) {
         if(!message.channel.guild) return;
                if(message.author.bot) return;
                if(!message.member.hasPermission('ADMINISTRATOR')) return message.reply("**تحتاج الى `MANAGE_CHANNELS`**");
                message.guild.createChannel("القبول-الرفض", "text").then(c =>{
                    c.overwritePermissions(message.guild.id, {
                        SEND_MESSAGES: false
 
                          })
                })
    message.channel.send("**✅ تم انشاء روم القبول والرفض بنجاح**")
            }
})




client.on('message', message => {
  if (message.content.startsWith(prefix + 'linkbot')) {
    var mentionned = message.mentions.users.first();
    var mrx;
      if(mentionned){
          var mrx = mentionned; } else {
          var mrx = message.author;
      }
      if(!mentionned.bot) return message.reply("الشخص الذي منشنته ليس بوت");
      if(!mentionned) return message.reply("منشن البوت");
      let alpha = new Discord.RichEmbed()
      .setColor('RANDOM')
      .setTitle(`Link Bot`)
      .setURL(`https://discordapp.com/oauth2/authorize?client_id=${mrx.id}&scope=bot&permissions=8`)
      .setThumbnail(mrx.avatarURL)
      .setFooter(`- Requested By: ${message.author.tag}`)
      message.channel.sendEmbed(alpha);
  }
});

client.on('message' , async (message) => {
 if (message.content.startsWith(prefix + 'w')) {
  const args = message.content.substring(prefix.length).split(' ');

 message.delete();
args.shift() 
let msg = args.join(' ') 
message.channel.createWebhook(message.author.username, message.author.avatarURL) 
    .then(wb => {
        const user = new Discord.WebhookClient(wb.id, wb.token) 
        user.send(msg); 
        user.delete() 
    })
    .catch(console.error)
 }
});

client.on('message', message => {
     if (message.author.bot) return;
    if (message.content.startsWith("رابط")) {
        message.channel.createInvite({
        thing: true,
        maxUses: 5,
        maxAge: 86400,
    }).then(invite =>
      message.author.sendMessage(invite.url)
    )
    const embed = new Discord.RichEmbed()
        .setColor("RANDOM")
          .setDescription(" تم أرسال الرابط برسالة خاصة ")
           .setAuthor(client.user.username, client.user.avatarURL)
                 .setAuthor(client.user.username, client.user.avatarURL)
                .setFooter('طلب بواسطة: ' + message.author.tag)

      message.channel.sendEmbed(embed).then(message => {message.delete(10000)})
              const Embed11 = new Discord.RichEmbed()
        .setColor("RANDOM")
        
    .setDescription(" مدة الرابط :يوم  عدد استخدامات الرابط : 5 ")
      message.author.sendEmbed(Embed11)
    }
});

client.on('message', msg => {
	var prefix = "!";
  if (msg.author.bot) return;
  if (!msg.content.startsWith(prefix)) return;
  let command = msg.content.split(" ")[0];
  command = command.slice(prefix.length);
  let args = msg.content.split(" ").slice(1);

    if(command === "مسح") {
        const emoji = client.emojis.find("name", "wastebasket")
    let textxt = args.slice(0).join("");
    if(msg.member.hasPermission("MANAGE_MESSAGES")) {
    if (textxt == "") {
        msg.delete().then
    msg.channel.send("***```Supply A Number 👌```***").then(m => m.delete(3000));
} else {
    msg.delete().then
    msg.delete().then
    msg.channel.bulkDelete(textxt);
        msg.channel.send("```Cleard: " + textxt + "\n Messages```").then(m => m.delete(3000));
        }    
    }
}
});

client.on('message' , async message => {
	  var prefix = "!";
         if(message.content.startsWith(prefix + "emoji")) {
            let args = message.content.split(" ").slice(1);
    if (args.length < 1) {
      message.channel.send('You must provide some text to emojify!');
  }
  
  message.channel.send(
      args.join(' ')
          .split('')
          .map(c => codes[c] || c)
          .join('')
  );
  };
  });

client.on('message', message => {
     if(!message.channel.guild) return;
var prefix = "!";
                if(message.content.startsWith(prefix + 'allbots')) {

    
    if (message.author.bot) return;
    let i = 1;
        const botssize = message.guild.members.filter(m=>m.user.bot).map(m=>`${i++} - <@${m.id}>`);
          const embed = new Discord.RichEmbed()
          .setAuthor(message.author.tag, message.author.avatarURL)
          .setDescription(`**Found ${message.guild.members.filter(m=>m.user.bot).size} bots in this Server**
${botssize.join('\n')}`)
.setFooter(client.user.username, client.user.avatarURL)
.setTimestamp();
message.channel.send(embed)

}


});


client.on("message",function(message) {
	var prefix = "!";
    if(message.content.startsWith(prefix + 'bot')) {
        var uptime = client.uptime;
 
    var days = 0;
    var hours = 0;
    var minutes = 0;
    var seconds = 0;
    var notCompleted = true;
 
    while (notCompleted) {
 
        if (uptime >= 8.64e+7) {
 
            days++;
            uptime -= 8.64e+7;
 
        } else if (uptime >= 3.6e+6) {
 
            hours++;
            uptime -= 3.6e+6;
 
        } else if (uptime >= 60000) {
 
            minutes++;
            uptime -= 60000;
 
        } else if (uptime >= 1000) {
            seconds++;
            uptime -= 1000;
 
        }
 
        if (uptime < 1000)  notCompleted = false;
 
    }
 
var v1 = new Discord.RichEmbed()
  v1.setTimestamp(new Date())
  v1.setColor("#6a109d")
  v1.setDescription('***__ انتظر .. جاري الحصول علي البيانات __***')
  v1.setFooter("! | A7mEd TeaM |")
var heroo = new Discord.RichEmbed()
.setColor('#6a109d')
.setTimestamp(new Date())
.setThumbnail(client.user.avatarURL)
.setTitle('A7med Bot Info')
.setURL('https://discordapp.com/oauth2/authorize?client_id=471464656242737183&permissions=2080898225&scope=bot')
.setAuthor(client.user.username,client.user.avatarURL)
.addField("**البرفكس** :",`**[ ${prefix} ]**`,true)
.addField("**السيرفرات** :","**[ "+client.guilds.size+" ]**",true)
.addField("**القنوات** :","**[ "+client.channels.size+" ]**",true)
.addField("**المستخدمين** :","**[ "+client.users.size+" ]**",true)
.addField("**اسم البوت** : ","**[ "+client.user.username+" ]**",true)
.addField("**ايدي البوت **:","**[ "+client.user.id+" ]**",true)
.addField("**الحجم المستخدم** :",`**[ ${(process.memoryUsage().rss / 1048576).toFixed()}MB ]**`,true)
.addField("**موعد الاقلاع** :",`**[** **Days:** \`${days}\` **Hours:** \`${hours}\` **Minutes:** \`${minutes}\` **Seconds:** \`${seconds}\` **]**`,true)
.setFooter("Sliver team  |");
  message.channel.send({embed:v1}).then(m => {
      setTimeout(() => {
         m.edit({embed:heroo});
      },3000);
  });
}
});

client.on('message', message => {
	var prefix = "!";
if(!message.channel.guild) return;
if(message.content.startsWith(prefix + 'اسحب')) {
 if (message.member.hasPermission("MOVE_MEMBERS")) {
 if (message.mentions.users.size === 0) {
 return message.channel.send("``لاستخدام الأمر اكتب هذه الأمر : " +prefix+ "move [USER]``")
}
if (message.member.voiceChannel != null) {
 if (message.mentions.members.first().voiceChannel != null) {
 var authorchannel = message.member.voiceChannelID;
 var usermentioned = message.mentions.members.first().id;
var embed = new Discord.RichEmbed()
 .setTitle("Succes!")
 .setColor("#000000")
 .setDescription(`لقد قمت بسحب <@${usermentioned}> الى الروم الصوتي الخاص بك✅ `)
var embed = new Discord.RichEmbed()
.setTitle(`You are Moved in ${message.guild.name}`)
 .setColor("RANDOM")
.setDescription(`**<@${message.author.id}> Moved You To His Channel!\nServer --> ${message.guild.name}**`)
 message.guild.members.get(usermentioned).setVoiceChannel(authorchannel).then(m => message.channel.send(embed))
message.guild.members.get(usermentioned).send(embed)
} else {
message.channel.send("``لا تستطيع سحب "+ message.mentions.members.first() +" `يجب ان يكون هذه العضو في روم صوتي`")
}
} else {
 message.channel.send("**``يجب ان تكون في روم صوتي لكي تقوم بسحب العضو أليك``**")
}
} else {
message.react("❌")
 }}});

client.on("message", async message => {
            if(!message.channel.guild) return;
            var prefix = "!";
        if(message.content.startsWith(prefix + 'invites')) {
        var nul = 0
        var guild = message.guild
        await guild.fetchInvites()
            .then(invites => {
             invites.forEach(invite => {
                if (invite.inviter === message.author) {
                     nul+=invite.uses
                    }
                });
            });
          if (nul > 0) {
              console.log(`\n${message.author.tag} has ${nul} invites in ${guild.name}\n`)
              var embed = new Discord.RichEmbed()
                  .setColor("#000000")
                    .addField(`${message.author.username}`, `لقد قمت بدعوة **${nul}** شخص`)
                          message.channel.send({ embed: embed });
                      return;
                    } else {
                       var embed = new Discord.RichEmbed()
                        .setColor("#000000")
                        .addField(`${message.author.username}`, `لم تقم بدعوة أي شخص لهذة السيرفر`)

                       message.channel.send({ embed: embed });
                        return;
                    }
        }
        if(message.content.startsWith(prefix + 'invite-codes')) {
let guild = message.guild
message.channel.send(":postbox: **لقد قمت بأرسال جميع روابط الدعوات التي قمت بأنشائها في الخاص**")
guild.fetchInvites()
.then(invites => {
invites.forEach(invite => {
if (invite.inviter === message.author) {
codes.push(`discord.gg/${invite.code}`)
}
})
}).then(m => {
if (codes.length < 0) {
    var embed = new Discord.RichEmbed()
.setColor("#000000")
.addField(`Your invite codes in ${message.guild.name}`, `You currently don't have any active invites! Please create an invite and start inviting, then you will be able to see your codes here!`)
message.author.send({ embed: embed });
return;
} else {
    var embed = new Discord.RichEmbed()
.setColor("#000000")
.addField(`Your invite codes in ${message.guild.name}`, `Invite Codes:\n${codes.join("\n")}`)
message.author.send({ embed: embed });
return;
}
})
}

});


client.on('message', message => {
	var prefix = "!";
if (message.content.startsWith(prefix + 'tag')) {
    let args = message.content.split(" ").slice(1);
if(!args[0]) return message.reply('مرجو كتابة نص الدي تريد');  

    figlet(args.join(" "), (err, data) => {
              message.channel.send("```" + data + "```")
           })
}
});

client.on('message', message => {
	 var prefix = "!";
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  let command = message.content.split(" ")[0];
  command = command.slice(prefix.length);

  let args = message.content.split(" ").slice(1);
  
 

if (command == "za5") {
    let say = new Discord.RichEmbed()
        .setTitle('Text emboss :')
   message.channel.send(`\n ${zalgo(args.join(' '))}`);
  }

});

client.on("message", message => {
	var prefix = "!";
	var args = message.content.split(' ').slice(1); 
	var msg = message.content.toLowerCase();
	if( !message.guild ) return;
	if( !msg.startsWith( prefix + 'role' ) ) return;
	if(!message.member.hasPermission('MANAGE_ROLES')) return message.channel.send(' **__ليس لديك صلاحيات__**');
	if( msg.toLowerCase().startsWith( prefix + 'roleremove' ) ){
		if( !args[0] ) return message.reply( '**:x: يرجى وضع الشخص المراد سحب منه الرتبة**' );
		if( !args[1] ) return message.reply( '**:x: يرجى وضع الرتبة المراد سحبها من الشخص**' );
		var role = msg.split(' ').slice(2).join(" ").toLowerCase(); 
		var role1 = message.guild.roles.filter( r=>r.name.toLowerCase().indexOf(role)>-1 ).first(); 
		if( !role1 ) return message.reply( '**:x: يرجى وضع الرتبة المراد سحبها من الشخص**' );if( message.mentions.members.first() ){
			message.mentions.members.first().removeRole( role1 );
			return message.reply('**:white_check_mark: [ '+role1.name+' ] رتبة [ '+args[0]+' ] تم سحب من **');
		}
		if( args[0].toLowerCase() == "all" ){
			message.guild.members.forEach(m=>m.removeRole( role1 ))
			return	message.reply('**:white_check_mark: [ '+role1.name+' ] تم سحب من الكل رتبة**');
		} else if( args[0].toLowerCase() == "bots" ){
			message.guild.members.filter(m=>m.user.bot).forEach(m=>m.removeRole(role1))
			return	message.reply('**:white_check_mark: [ '+role1.name+' ] تم سحب من البوتات رتبة**');
		} else if( args[0].toLowerCase() == "humans" ){
			message.guild.members.filter(m=>!m.user.bot).forEach(m=>m.removeRole(role1))
			return	message.reply('**:white_check_mark: [ '+role1.name+' ] تم سحب من البشريين رتبة**');
		} 	
	} else {
		if( !args[0] ) return message.reply( '**:x: يرجى وضع الشخص المراد اعطائها الرتبة**' );
		if( !args[1] ) return message.reply( '**:x: يرجى وضع الرتبة المراد اعطائها للشخص**' );
		var role = msg.split(' ').slice(2).join(" ").toLowerCase(); 
		var role1 = message.guild.roles.filter( r=>r.name.toLowerCase().indexOf(role)>-1 ).first(); 
		if( !role1 ) return message.reply( '**:x: يرجى وضع الرتبة المراد اعطائها للشخص**' );if( message.mentions.members.first() ){
			message.mentions.members.first().addRole( role1 );
			return message.reply('**:white_check_mark: [ '+role1.name+' ] رتبة [ '+args[0]+' ] تم اعطاء **');
		}
		if( args[0].toLowerCase() == "all" ){
			message.guild.members.forEach(m=>m.addRole( role1 ))
			return	message.reply('**:white_check_mark: [ '+role1.name+' ] تم اعطاء الكل رتبة**');
		} else if( args[0].toLowerCase() == "bots" ){
			message.guild.members.filter(m=>m.user.bot).forEach(m=>m.addRole(role1))
			return	message.reply('**:white_check_mark: [ '+role1.name+' ] تم اعطاء البوتات رتبة**');
		} else if( args[0].toLowerCase() == "humans" ){
			message.guild.members.filter(m=>!m.user.bot).forEach(m=>m.addRole(role1))
			return	message.reply('**:white_check_mark: [ '+role1.name+' ] تم اعطاء البشريين رتبة**');
		} 
	} 
});

client.on('message', message => {
    if (message.content === "!rooms") {
        if (message.author.bot) return
                      if (!message.guild) return;

        var channels = message.guild.channels.map(channels => `${channels.name}, `).join(' ')
        const embed = new Discord.RichEmbed()
        .setColor('RANDOM')
        .addField(`${message.guild.name}`,`**Rooms:white_check_mark:**`)
        .addField(':arrow_down: Rooms Number. :heavy_check_mark:',`** ${message.guild.channels.size}**`)
        
.addField(':arrow_down:Rooms  Name. :heavy_check_mark::',`**[${channels}]**`)
        message.channel.sendEmbed(embed);
    }
});

var AsciiTable = require('ascii-data-table').default
client.on('message', message =>{

    if(message.content == "!roles"){
        var 
        ros=message.guild.roles.size,
        data = [['Rank', 'RoleName']]
        for(let i =0;i<ros;i++){
            if(message.guild.roles.array()[i].id !== message.guild.id){
         data.push([i,`${message.guild.roles.filter(r => r.position == ros-i).map(r=>r.name)}`])
        }}
        let res = AsciiTable.table(data)

        message.channel.send(`**\`\`\`xl\n${res}\`\`\`**`);
    }
});


client.on('message', async message => {
  let args = message.content.split(" ");
  if(message.content.startsWith(prefix + "اسكت")) {
    if(!message.member.hasPermission("MUTE_MEMBERS")) return message.channel.send('').then(msg => {
      msg.delete(3500);
      message.delete(3500);
    });
 
    if(!message.guild.member(client.user).hasPermission("MUTE_MEMBERS")) return message.channel.send('').then(msg => {
      msg.delete(3500);
      message.delete(3500);
    });
 
    let mention = message.mentions.members.first();//kinggamer حقوق الفا كودز و
    if(!mention) return  message.channel.send('').then(msg => { //kinggamer حقوق الفا كودز و
      msg.delete(3500);
      message.delete(3500);
    });
 
    if(mention.id === message.author.id) return message.channel.send('**:x:You Cannot give mute to your self**').then(msg => {
      msg.delete(3500);
      message.delete(3500); //kinggamer حقوق الفا كودز و
    });
   
    if(mention.hasPermission('ADMINISTRATOR')) return message.channel.send(`**:x: لا يمكن آعطاء ميوت لادارة السيرفر**`); //kinggamer حقوق الفا كودز و
 
    if(message.guild.member(mention).roles.find('name', 'Muted')) return message.channel.send(`**:information_source: ${mention.user.username} Already Muted**`);
 
   
    if(mention.position >= message.guild.member(message.author).positon) return message.channel.send('You Donot Have Permission **Muted_Members** ').then(msg => {
      msg.delete(3500);
      message.delete(3500);
    });
   
    if(mention.positon >= message.guild.member(client.user).positon) return message.channel.send('I Donot Have Permission **Muted_Members**').then(msg => {
      msg.delete(3500);
      message.delete(3500); //kinggamer حقوق الفا كودز و
    });
   
    let duration = args[2];
    if(!duration) message.channel.send(`**:hash: You Can Use ${prefix}mute @user Time Reason**`).then(msg => {
      msg.delete(3500);
      message.delete(3500);
    });
 
    if(isNaN(duration))  message.channel.send('').then(msg => {
      msg.delete(3500);
      message.delete(3500);
    });
 
    let reason = message.content.split(" ").slice(3).join(" ");
    if(!reason) reason = " [ **لم يذكر لماذا** ] ";
 
    let thisEmbed = new Discord.RichEmbed()
    .setAuthor(mention.user.username, mention.user.avatarURL)
    .setTitle('**تم آعطائك ميوت**')
    .addField('**__السيرفر__**',[ message.guild.name ]) //kinggamer حقوق الفا كودز و
    .addField('**__تم آعطائك ميوت بواسطة__**', [ message.author ])
    .addField('**__آلسبب__**',reason)
    .addField('**__وقت الميوت__**',duration)
 
    let role = message.guild.roles.find('name', 'Muted') || message.guild.roles.get(r => r.name === 'Muted');
    if(!role) try {
      message.guild.createRole({
        name: "Muted",
        permissions: 0 //kinggamer حقوق الفا كودز و
      }).then(r => {
        message.guild.channels.forEach(c => {
          c.overwritePermissions(r , {
            SEND_MESSAGES: false, //kinggamer حقوق الفا كودز و
            READ_MESSAGES_HISTORY: false,
            ADD_REACTIONS: false
          });
        });
      }); //kinggamer حقوق الفا كودز و
    } catch(e) {
      console.log(e.stack);
    }
    mention.addRole(role).then(() => {
      mention.send(thisEmbed);
      message.channel.send(`**:white_check_mark: ${mention.user.username}  Muted! :zipper_mouth:  **  `);
      mention.setMute(true); //kinggamer حقوق الفا كودز و
    });
    setTimeout(() => {
      if(duration === 0) return;
      mention.setMute(false);
      mention.removeRole(role)
    },duration * 60000); //kinggamer حقوق الفا كودز و
  }
});
client.on('message', async message => {
    let mention = message.mentions.members.first();
let command = message.content.split(" ")[0];
     command = command.slice(prefix.length);
    let args = message.content.split(" ").slice(1);  //kinggamer حقوق الفا كودز و
if(command === `تكلم`) {2
  if(!message.member.hasPermission("MUTE_MEMBERS")) return message.channel.sendMessage("**You Donot HavePermission Mute_Members**").then(m => m.delete(5000));
if(!message.guild.member(client.user).hasPermission("MUTE_MEMBERS")) return message.reply("**I donot Have Permission Mute_Members**").then(msg => msg.delete(6000))
 
  let kinggamer = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
     if(!kinggamer) return message.channel.send('').then(msg => {
      msg.delete(3500);
      message.delete(3500); //kinggamer حقوق الفا كودز و
    });
 
  let role = message.guild.roles.find (r => r.name === "Muted");
 
  if(!role || !kinggamer.roles.has(role.id)) return message.channel.sendMessage(`**:information_source:${mention.user.username} لقد تم فك الميوت عنه مسبقا**`)
 
  await kinggamer.removeRole(role) //kinggamer حقوق الفا كودز و
  message.channel.sendMessage(`**:white_check_mark: ${mention.user.username}  Unmuted! **`);
 
  return;
 
  }
 
});

 
client.on('guildCreate', guild => {
  var embed = new Discord.RichEmbed()
  .setColor(0x5500ff)
  .setDescription(`**شكراً لك لإضافه البوت الى سيرفرك**`)
      guild.owner.send(embed)
});

client.on("message", message => {
    const prefix = "!"
              
          if(!message.channel.guild) return;
   if(message.author.bot) return;
      if(message.content === prefix + "image"){ 
          const embed = new Discord.RichEmbed()
  
      .setTitle(`This is  ** ${message.guild.name} **  Photo !`)
  .setAuthor(message.author.username, message.guild.iconrURL)
    .setColor(0x164fe3)
    .setImage(message.guild.iconURL)
    .setURL(message.guild.iconrURL)
                    .setTimestamp()

   message.channel.send({embed});
      }
  });

 client.on('message',function(message) {
  if (message.author.bot) return;
var prefix = "!";
                  if(!message.channel.guild) return;

                    if (message.content === prefix + "members") {
 const embed = new Discord.RichEmbed()

    .setDescription(`**Members info :sparkles:
:green_heart: online:   ${message.guild.members.filter(m=>m.presence.status == 'online').size}
:heart:  dnd:       ${message.guild.members.filter(m=>m.presence.status == 'dnd').size}
:yellow_heart:  idle:     ${message.guild.members.filter(m=>m.presence.status == 'idle').size}
:diamond_shape_with_a_dot_inside:   membersCount:  ${message.guild.memberCount - message.guild.members.filter(m=>m.user.bot).size}
:bulb: bots: ${message.guild.members.filter(m=>m.user.bot).size} **`)
         message.channel.send({embed});

    }
      });  

	  client.on('message', message => {
        let args = message.content.split(" ").slice(1).join(" ")
        let men = message.mentions.users.first()
        if(message.content.startsWith(prefix + "roll")){
            if(!args) return message.channel.send("الرجاء اختيار رقم")
            message.channel.send(Math.floor(Math.random() * args))
        }
    });

client.on('message', message => {
	var prefix = "!"
  if (message.author.x5bz) return;
  if (!message.content.startsWith(prefix)) return;

  let command = message.content.split(" ")[0];
  command = command.slice(prefix.length);

  let args = message.content.split(" ").slice(1);

  if (command == "باند") {
               if(!message.channel.guild) return message.reply('** This command only for servers**');
         
  if(!message.guild.member(message.author).hasPermission("BAN_MEMBERS")) return message.reply("**You Don't Have ` BAN_MEMBERS ` Permission**");
  if(!message.guild.member(client.user).hasPermission("BAN_MEMBERS")) return message.reply("**I Don't Have ` BAN_MEMBERS ` Permission**");
  let user = message.mentions.users.first();
  let reason = message.content.split(" ").slice(2).join(" ");
  /*let b5bzlog = client.channels.find("name", "5bz-log");
  if(!b5bzlog) return message.reply("I've detected that this server doesn't have a 5bz-log text channel.");*/
  if (message.mentions.users.size < 1) return message.reply("**منشن شخص**");
  if(!reason) return message.reply ("**اكتب سبب الطرد**");
  if (!message.guild.member(user)
  .bannable) return message.reply("**لايمكنني طرد شخص اعلى من رتبتي يرجه اعطاء البوت رتبه عالي**");

  message.guild.member(user).ban(7, user);

  const banembed = new Discord.RichEmbed()
  .setAuthor(`BANNED!`, user.displayAvatarURL)
  .setColor("RANDOM")
  .setTimestamp()
  .addField("**User:**",  '**[ ' + `${user.tag}` + ' ]**')
  .addField("**By:**", '**[ ' + `${message.author.tag}` + ' ]**')
  .addField("**Reason:**", '**[ ' + `${reason}` + ' ]**')
  message.channel.send({
    embed : banembed
  })
}
});

client.on('message', message => {
	var prefix = "!"
  if (message.author.x5bz) return;
  if (!message.content.startsWith(prefix)) return;

  let command = message.content.split(" ")[0];
  command = command.slice(prefix.length);

  let args = message.content.split(" ").slice(1);

  if (command == "كيك") {
               if(!message.channel.guild) return message.reply('** This command only for servers**');
         
  if(!message.guild.member(message.author).hasPermission("KICK_MEMBERS")) return message.reply("**You Don't Have ` KICK_MEMBERS ` Permission**");
  if(!message.guild.member(client.user).hasPermission("KICK_MEMBERS")) return message.reply("**I Don't Have ` KICK_MEMBERS ` Permission**");
  let user = message.mentions.users.first();
  let reason = message.content.split(" ").slice(2).join(" ");
  if (message.mentions.users.size < 1) return message.reply("**منشن شخص**");
  if(!reason) return message.reply ("**اكتب سبب الطرد**");
  if (!message.guild.member(user)
  .kickable) return message.reply("**لايمكنني طرد شخص اعلى من رتبتي يرجه اعطاء البوت رتبه عالي**");

  message.guild.member(user).kick();

  const kickembed = new Discord.RichEmbed()
  .setAuthor(`KICKED!`, user.displayAvatarURL)
  .setColor("RANDOM")
  .setTimestamp()
  .addField("**User:**",  '**[ ' + `${user.tag}` + ' ]**')
  .addField("**By:**", '**[ ' + `${message.author.tag}` + ' ]**')
  .addField("**Reason:**", '**[ ' + `${reason}` + ' ]**')
  message.channel.send({
    embed : kickembed
  })
}
});


client.on('message', message => {
    if (message.content.startsWith("!bans")) {
        message.guild.fetchBans()
        .then(bans => message.channel.send(`${bans.size} عدد اشخاص المبندة من السيرفر `))
  .catch(console.error);
}
});

client.on('message', message => {
    if (message.content.startsWith("!avatar")) {
if(!message.channel.guild) return;
        var mentionned = message.mentions.users.first();
    var client;
      if(mentionned){
          var client = mentionned; } else {
          var client = message.author;
      }
        const embed = new Discord.RichEmbed()
                           .addField('Requested by:', "<@" + message.author.id + ">")
        .setColor(000000)
        .setImage(`${client.avatarURL}`)
      message.channel.sendEmbed(embed);
    }
});

client.on('message', message => {
     if (message.content === "!support") {
     let embed = new Discord.RichEmbed()
  .setAuthor(message.author.username)
  .setColor("#9B59B6")
  .addField(" ** :gear: Server Support :gear: **" , "  **https://discord.gg/u6Pbz7S**")
     
     
  message.channel.sendEmbed(embed);
    }
});

client.on('message', omar => {
var prefix = "!";
if(omar.content.split(' ')[0] == prefix + 'dc') {  // delete all channels
if (!omar.channel.guild) return;
if(!omar.guild.member(omar.author).hasPermission("MANAGE_CHANNELS")) return omar.reply("**You Don't Have ` MANAGE_CHANNELS ` Permission**");
if(!omar.guild.member(client.user).hasPermission("MANAGE_CHANNELS")) return omar.reply("**I Don't Have ` MANAGE_CHANNELS ` Permission**");
omar.guild.channels.forEach(m => {
m.delete();
});// omar jedol / Codes
}// omar jedol / Codes
if(omar.content.split(' ')[0] == prefix + 'dr') { // delete all roles
if (!omar.channel.guild) return;
if(!omar.guild.member(omar.author).hasPermission("MANAGE_ROLES_OR_PERMISSIONS")) return omar.reply("**You Don't Have ` MANAGE_ROLES_OR_PERMISSIONS ` Permission**");
if(!omar.guild.member(client.user).hasPermission("MANAGE_ROLES_OR_PERMISSIONS")) return omar.reply("**I Don't Have ` MANAGE_ROLES_OR_PERMISSIONS ` Permission**");
omar.guild.roles.forEach(m => {
m.delete();
});// omar jedol / Codes
omar.reply("`تم حذف جميع الرتب بنجاح`")
}// omar jedol / Codes
});

client.on('message', message => {
	var prefix = "!";
   if(!message.channel.guild) return;
if(message.content.startsWith(prefix + 'clear')) {
if(!message.channel.guild) return message.channel.send('**This Command is Just For Servers**').then(m => m.delete(5000));
if(!message.member.hasPermission('MANAGE_MESSAGES')) return      message.channel.send('**You Do not have permission** `MANAGE_MESSAGES`' );
let args = message.content.split(" ").join(" ").slice(2 + prefix.length);
let request = `Requested By ${message.author.username}`;
message.channel.send(`**Are You sure you want to clear the chat?**`).then(msg => {
msg.react('✅')
.then(() => msg.react('❌'))
.then(() =>msg.react('✅'))

let reaction1Filter = (reaction, user) => reaction.emoji.name === '✅' && user.id === message.author.id;
let reaction2Filter = (reaction, user) => reaction.emoji.name === '❌' && user.id === message.author.id;

let reaction1 = msg.createReactionCollector(reaction1Filter, { time: 12000 });
let reaction2 = msg.createReactionCollector(reaction2Filter, { time: 12000 });
reaction1.on("collect", r => {
message.channel.send(`Chat will delete`).then(m => m.delete(5000));
var msg;
        msg = parseInt();

      message.channel.fetchMessages({limit: msg}).then(messages => message.channel.bulkDelete(messages)).catch(console.error);
      message.channel.sendMessage("", {embed: {
        title: "`` Chat Deleted ``",
        color: 0x06DF00,
        footer: {

        }
      }}).then(msg => {msg.delete(3000)});

})
reaction2.on("collect", r => {
message.channel.send(`**Chat deletion cancelled**`).then(m => m.delete(5000));
msg.delete();
})
})
}
});

client.on("message", (message) => {
if (message.content.startsWith("!ct")) {
            if (!message.member.hasPermission('MANAGE_CHANNELS')) return message.reply("You Don't Have `MANAGE_CHANNELS` Premissions ");
        let args = message.content.split(" ").slice(1);
    message.guild.createChannel(args.join(' '), 'text');
message.channel.sendMessage('تـم إنـشاء روم كـتابـي')

}
});


client.on("message", (message) => {
if (message.content.startsWith("!cv")) {
            if (!message.member.hasPermission('MANAGE_CHANNELS')) return message.reply("You Don't Have `MANAGE_CHANNELS` Premissions ");
        let args = message.content.split(" ").slice(1);
    message.guild.createChannel(args.join(' '), 'voice');
    message.channel.sendMessage('تـم إنـشاء روم صـوتي')
    
}
});


client.on("message", (message) => {
    if (message.content.startsWith('!delet')) {
        if (!message.member.hasPermission('MANAGE_CHANNELS')) return message.reply("You Don't Have `MANAGE_CHANNELS` Premissions ");

        let args = message.content.split(' ').slice(1);
        let channel = message.client.channels.find('name', args.join(' '));
        if (!channel) return message.reply('**There is no room like this name -_-**').catch(console.error);
        channel.delete()
    }
});  

client.on('message', message => {
    var argresult = message.content.split(` `).slice(1).join(' ');
      if (!devs.includes(message.author.id)) return;
     
  if (message.content.startsWith(adminprefix + 'pl')) {
    client.user.setGame(argresult);
      message.channel.sendMessage(`**:white_check_mark:   ${argresult}**`)
  } else
    if (message.content === (adminprefix + "Percie")) {
    message.guild.leave();        
  } else  
  if (message.content.startsWith(adminprefix + 'wt')) {// لجعل البوت في حاله الواتشنق
  client.user.setActivity(argresult, {type:'WATCHING'});
      message.channel.sendMessage(`**:white_check_mark:   ${argresult}**`)
  } else
  if (message.content.startsWith(adminprefix + 'setprefix')) {//لتغير البريفكس
  client.user.setPrefix(argresult).then
      message.channel.send(`**Prefix Changed :white_check_mark: ${argresult}** `)
  } else
  if (message.content.startsWith(adminprefix + 'ls')) {// لجعل البوت في حاله الاستماع
  client.user.setActivity(argresult , {type:'LISTENING'});
      message.channel.sendMessage(`**:white_check_mark:   ${argresult}**`)
  } else     //Narox
    if (message.content.startsWith(adminprefix + 'setname')) {// لتغير اسم البوت
  client.user.setUsername(argresult).then
      message.channel.sendMessage(`**${argresult}** : Done `)
  return message.reply("**Name Changed :white_check_mark:**");
  } else
    if (message.content.startsWith(adminprefix + 'setavatar')) {// لتغير صوره البوت
  client.user.setAvatar(argresult);
    message.channel.sendMessage(`**${argresult}** : تم تغير صورة البوت`);
        } else    
  if (message.content.startsWith(adminprefix + 'st')) {// لعمل ستريمنق للبوت
    client.user.setGame(argresult, "https://www.twitch.tv/idk");
      message.channel.sendMessage(`**:white_check_mark:   ${argresult}**`)
  }
    if(message.content === adminprefix + "restart") {// لعمل ريسترت للبوت
      if (!devs.includes(message.author.id)) return;
          message.channel.send(`:warning:️ **Bot restarting by ${message.author.username}**`);
        console.log("\n\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
        console.log(`⚠️ Bot restarting... ⚠️`);
        console.log("===============================================\n\n");
        client.destroy();
        child_process.fork(__dirname + "/bot.js");
        console.log(`Bot Successfully Restarted`);
    }
 
  });

client.on('message', function(message) {
    if (!message.member.hasPermissions(['ADMINISTRATOR'])){
            let command = message.content.split(" ")[0];
        if(message.content.includes('discord.gg')){
        message.reply (' ')
           if(!message.channel.guild) return message.reply('** This command only for servers**');
     message.member.addRole(message.guild.roles.find('name', 'Muted')); 
    const embed500 = new Discord.RichEmbed()
      .setTitle(":x: | تمت معاقبتك")
            .addField(`** لقد قمت بمخالفة قوانين السيرفر من خلال نشر سيرفرات اخرى  **` , `**ملاحظة  : إن كآن هذآ الميوت عن طريق الخطأ تكلم مع الادآرة**`)
      .addField(`by`,`A7med`)
            .setColor("c91616")
            .setThumbnail(`${message.author.avatarURL}`)
            .setAuthor(message.author.username, message.author.avatarURL) 
        .setFooter(`${message.guild.name} Server`)
     message.channel.send(embed500) 
    
        
    }
    }
})

//This Bot by a7med//This Bot by a7med//This Bot by a7med
//This Bot by a7med//This Bot by a7med//This Bot by a7med
//This Bot by a7med//This Bot by a7med//This Bot by a7med
// THIS  MUST  BE  THIS  WAY
client.login(process.env.BOT_TOKEN);
