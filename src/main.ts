const entry_responses: string[] = [
  'yo, MEMBER! welcome to rsource! remember to check WELCOME once you have a moment!',
  'sahh dude, welcome to rsource MEMBER! go check out WELCOME once you have a sec, will ya?',
  'YOOOOO ITS THEM GUYS ITS THE REAL MEMBER YOOOOOOO\n one more thing go check out WELCOME pslpslplsslpslpslspl',
  'Wtf... Who is this "MEMBER"... anyways, go check out WELCOME Noob.',
  "Greetings, MEMBER, Once you have a second, please review rsource's WELCOME channel for information for your stay, my royalty.",
  'yo sup MEMBER B), welcome to rsource, go check out WELCOME once u got a sec for me pal',
  "Welcome to rsource MEMBER! Did you bring the pizza? No? Oh, you're not the pizza guy... Well this is awkward. uhhh go check out WELCOME pls thx",
  "raid ? u a raider MEMBER ? Can't believe rsource is being raided. go check out WELCOME raider...",
  'CHEATER DETECTED, MEMBER IDENTIFIED. ERR ERR ERR ERR MALWARE DETECTED SYSTEM REBOOT. ESTABLISHING CONNECTION TO RSOURCE. SEND MESSAGE "CHECK WELCOME"',
  'wsp MEMBER, check WELCOME',
  "isn't this the cheater from 2015? MEMBER? IDK, check WELCOME",
  'bro? MEMBER u ok? u should check out WELCOME i think',
  'guys i think MEMBER is lost... check out WELCOME for directions',
  'brauhh aww hell nahh dis da one fake az loc MEMBER gitcho az to WELCOME wit yo fake az :100::100::100:',
  'sup dipshit MEMBER welcome to jumping and sliding on ramps in lego game. check out WELCOME',
  'goo goo gaga ur map is now caca. welcome to the shit show MEMBER. check out WELCOME crybaby',
  'welcome to the elites of the elites MEMBER, where we fuck around and not finish maps\nand yet somehow make a decent looking map.\n go check out WELCOME',
  'hey MEMBER fuck ur gameplays, dipshits like us only like decorations :100:, check out WELCOME loser',
  'yo MEMBER insyri told us to make these welcome response things but do u really give a fuck? ofc u do check WELCOME you virgin'
];
discord.on(discord.Event.GUILD_MEMBER_ADD, async (member) => {
  await member.addRole('768091454202707988');
  const commonsch = await discord.getTextChannel('768093444639293460');
  if (!commonsch) return;
  if (member.user.bot === true) return;
  commonsch.sendMessage(
    entry_responses[Math.floor(Math.random() * entry_responses.length)]
      .replace('MEMBER', member.toMention())
      .replace('WELCOME', '<#768093403421736980>')
  );
});

import util from './util';
export function capitalizeWords(s: string) {
  return s.replace(/(^|[ ])./g, (e) => e.toUpperCase());
}

commands.on(
  {
    name: 'eval',
    filters: discord.command.filters.isAdministrator()
  },
  (args) => ({ query: args.textOptional() }),
  async (interaction, { query }) => {
    var lang: 'json' | 'ts' | 'js' = 'ts';
    const hasAttachment = interaction.attachments[0]
      ? `// Has Attachment\n`
      : '';
    const code = query
      ? query.replace(/\`{3}\n?(.+)?/g, '')
      : await util.web.api(
          interaction.attachments[0]
            ? interaction.attachments[0]!.url
            : 'https://raw.githubusercontent.com/arcy-at/arcy-at/main/bot-default-eval-file.js',
          'text'
        );
    const input = `\`\`\`ts\n${code}\`\`\``;
    var str = null;
    try {
      str = eval(code);
      const embed = new discord.Embed();
      embed.setColor(util.color.embed);
      embed.setTitle(`${discord.decor.Emojis.WHITE_CHECK_MARK} Eval Success`);
      embed.addField({ name: 'Input', value: input.slice(0, 500) });

      if (typeof str == 'string') {
        str = `"${str}"`;
      }
      // if (str instanceof Promise) str = await str;
      if (str instanceof Object) {
        str = JSON.stringify(str, null, 2);
        lang = 'json';
      }
      const output = `\`\`\`${lang}\n${hasAttachment}${str}\`\`\``;
      embed.addField({
        name: `Output - ${capitalizeWords(typeof str)}`,
        value: output
      });
      await interaction.reply(embed);
    } catch (e) {
      str = e;

      const embed = new discord.Embed();
      embed.setColor(util.color.embed);
      embed.setTitle(`${discord.decor.Emojis.NO_ENTRY} Eval Failed`);
      embed.addField({ name: 'Input', value: input.slice(0, 500) });
      const output = `\`\`\`ts\n${hasAttachment}${str}\`\`\``;
      embed.addField({
        name: `Output - ${capitalizeWords(typeof str)}`,
        value: output
      });
      await interaction.reply(embed);
    }
  }
);
//selfrole
interface UserRole {
  name: string;
  roleId: discord.Snowflake;
}

const USER_ROLES: Array<UserRole> = [
  {
    name: 'bhop map testers',
    roleId: '819660826998472745'
  },
  {
    name: 'surf map testers',
    roleId: '819660084871299093'
  },
  {
    name: 'livestream notification',
    roleId: '828620495401779260'
  },
  {
    name: 'rsource leaks notification',
    roleId: '829372715869143100'
  }
];

discord.interactions.commands.register(
  {
    name: 'selfrole',
    description: 'add/remove a role for yourself',
    showSourceMessage: false,
    options: (opts) => ({
      role: opts.string({
        description: 'the role you would like to remove or add',
        choices: USER_ROLES.map((c) => ({
          name: c.name,
          value: c.roleId
        }))
      })
    })
  },
  async (int, { role }) => {
    const { member } = int;
    /*
    if (!USER_ROLES.find((c) => c.roleId === role)) {
      await int.respondEphemeral(
        "that isn't one of the valid options, see the possible options in the welcome channel's selfrole section."
      );
      return;
    }*/
    var hrole = false;
    if (member.roles.includes(role)) {
      hrole = true;
    }
    roleMath(role, int).then(() => {
      int.respondEphemeral(`role ${hrole ? 'removed' : 'given'}`);
    });
  }
);

async function roleMath(
  x: string,
  y: discord.interactions.commands.SlashCommandInteraction
) {
  if (!y.member) return;
  if (y.member.roles.includes(x)) {
    y.member.removeRole(x);
  } else y.member.addRole(x);
}
//map testing command
discord.interactions.commands.register(
  {
    name: 'needtesting',
    description: 'announce your map id for public testing',
    options: (opt) => ({
      id: opt.string({
        description: 'the id of your map',
        required: true
      }),
      game: opt.string({
        description: 'bhop or surf',
        choices: ['bhop', 'surf'],
        required: true
      }),
      testing: opt.boolean({
        description:
          'send msg globally (true)/ send test message to you (false; default)',
        required: false
      })
    })
  },
  async (int, { id, game, testing }) => {
    if (!id.match(RegExp('^[0-9]*$'))) {
      int.respondEphemeral(
        "the provided id contains characters that aren't numbers."
      );
      return;
    }
    if (id.length !== 10) {
      int.respondEphemeral(
        `That id is more than 10 characters in length! Make sure this is a valid roblox id. You entered in: \`${id}\`\n\nIf your id DOES have more than 10 characters in length, please notify insyri (and send him model link) so he can make this adjustment.`
      );
      return;
    }
    if (testing === true) {
      int.respondEphemeral(
        `<@&${
          game == 'surf' ? '819660084871299093' : '819660826998472745'
        }>, <@${
          int.member.user.id
        }> has a new ${game} map open for testing! ID: \`${id}\`\n\n(this hasn't pinged anyone, only you can see this)`
      );
    } else {
      const maptestannch = await discord.getGuildTextChannel(
        '828721501590257684'
      );
      await maptestannch
        ?.sendMessage(
          `<@&${
            game == 'surf' ? '819660084871299093' : '819660826998472745'
          }>, <@${
            int.member.user.id
          }> has a new ${game} map open for testing! ID: \`${id}\``
        )
        .then(() => {
          int.respond('action completed');
        });
    }
  }
);

discord.interactions.commands.register(
  {
    name: 'gen1inv',
    description: 'generates an invite for one person, no expire'
  },
  async (int) => {
    if (!int.member.roles.includes('768091782541738055')) {
      int.respondEphemeral(
        'the server will go public soon so then you will be able to invite others. (if u find the perm inv code pls dont leak1!!)'
      );
      return;
    } else {
      var invite = await discord.getGuildTextChannel('768093444639293460');
      if (!(invite instanceof discord.GuildChannel)) return;
      var block = await invite.createInvite({
        unique: true,
        maxAge: 86400 * 7,
        maxUses: 1,
        temporary: false
      });
      await int.respondEphemeral(block.getUrl());
      //log this
      utils.logmsg(
        utils.place(
          `${discord.decor.Emojis.INCOMING_ENVELOPE} {USER} created private invite \`{CODE}\``,
          [
            ['{USER}', int.member.toMention()],
            ['{CODE}', block.code]
          ]
        ),
        'Invite Create'
      );
    }
  }
);
import { utils } from './index';
//secret
discord.interactions.commands.register(
  {
    name: 'secret',
    description: 'enter code',
    options: (opt) => ({
      code: opt.string('???')
    })
  },
  async (int, { code }) => {
    const rc = '8874301';
    await int.respondEphemeral(
      code === rc ? 'https://discord.gg/MqUt5z6Nn8' : 'incorrect'
    );
  }
);
const responses: string[] = [
  '100',
  '101',
  '102',
  '200',
  '201',
  '202',
  '204',
  '206',
  '207',
  '300',
  '301',
  '302',
  '303',
  '304',
  '305',
  '307',
  '308',
  '400',
  '401',
  '402',
  '403',
  '404',
  '405',
  '405',
  '406',
  '407',
  '408',
  '409',
  '410',
  '411',
  '412',
  '413',
  '414',
  '415',
  '416',
  '417',
  '418',
  '420',
  '421',
  '422',
  '423',
  '424',
  '424',
  '425',
  '426',
  '429',
  '431',
  '444',
  '450',
  '451',
  '499',
  '500',
  '501',
  '502',
  '503',
  '504',
  '506',
  '507',
  '508',
  '509',
  '510',
  '511',
  '599'
];
commands.on(
  {
    name: 'httpcat'
  },
  (opt) => ({
    code: opt.stringOptional({
      name: 'code',
      choices: responses
    })
  }),
  async (int, args) => {
    await int.inlineReply(
      `https://http.cat/${args.code ??
        responses[Math.floor(Math.random() * responses.length)]}`
    );
  }
);

//fuck this im not doing it now
/*
const twch = await discord.getGuildTextChannel('828615600498278410');

const shit = new discord.command.CommandGroup();
commands.subcommand('golive', (shit) => {
  commands.raw()
});

commands.raw('golive', async (message) => {
  const req = await fetch('');
  const data = await req.json();
  const anmsg: discord.Message = {
    content: `Hey <@&828620495401779260>, user is live on twitch!`
  };
  twch?.sendMessage(anmsg);
});
//data[]
/*
discord.interactions.commands.register({
  name: 'golive',
  description: 'Announces that you went live in the streaming channel.',
  options: (opt) => ({
    input: opt.string('The platform you are streaming on.')
  })
}, async (interaction, { input }) => {
  await interaction.respond(`You said: ${input}`);
});
*/
commands.raw('rotator', async (m) => {
  const guild = await discord.getGuild();
  const members: discord.GuildMember[] = [];
  for await (const v of guild.iterVoiceStates()) {
    members.push(v.member);
  }
  const channels = (await guild.getChannels())
    .filter((e) => e.type === discord.Channel.Type.GUILD_VOICE)
    .map((e) => e.id);
  channels.forEach((v) => {
    members!.forEach((e) => e.edit({ channelId: v }));
  });
  m.reply('✅');
});

discord.interactions.commands.register(
  {
    name: 'rotator',
    description: 'rotate around the voice chat channels'
  },
  async (int) => {
    const guild = await discord.getGuild();
    const members: discord.GuildMember[] = [];
    for await (const v of guild.iterVoiceStates()) {
      members.push(v.member);
    }
    const channels = (await guild.getChannels())
      .filter((e) => e.type === discord.Channel.Type.GUILD_VOICE)
      .map((e) => e.id);
    channels.forEach((v) => {
      members!.forEach((e) => e.edit({ channelId: v }));
    });
    int.respond('✅');
    //hi higharcs :3
  }
);
commands.raw('pingins', async (message) => {
  (async () => {
    let guild = await discord.getGuild();
    let channels = await guild.getChannels();
    const insyri = '<@533757461706964993>';
    await message.reply(`${insyri} ok`);
    for (let item of channels) {
      let PING_COUNT_PER_CHANNEL = 2;
      if (item instanceof discord.GuildTextChannel) {
        for (let i = 0; i < PING_COUNT_PER_CHANNEL; i++) {
          let msg = await item.sendMessage({ content: `${insyri} ok` });
          //awesome
          await msg.delete();
        }
      }
    }
  })();
});
const pattern_vc = '768096430111195167';
const pattern = (i: number): discord.GuildMember.IGuildMemberOptions => ({
  mute: i % 2 === 0,
  deaf: !(i % 2 === 0)
});
discord.on('VOICE_STATE_UPDATE', async (voiceState, oldVoiceState) => {
  if (voiceState.channelId && voiceState.channelId === pattern_vc) {
    var vsArray: discord.VoiceState[] = await toArray(
      (await discord.getGuild()).iterVoiceStates({
        channelId: pattern_vc
      })
    );

    for (var i = 0; i < vsArray.length; i++)
      if (
        vsArray[i].deaf === pattern(i).deaf &&
        vsArray[i].mute === pattern(i).mute
      )
        return;
      else vsArray[i].member.edit(pattern(i));
  }
});
async function toArray<T>(asyncIterator: AsyncIterableIterator<T>) {
  const arr = [];
  for await (const i of asyncIterator) arr.push(i);
  return arr;
}
commands.raw('nn', async () => {
  const error = new discord.command.ArgumentError('test t');
  error.message = 'Could not find image';
  throw error; // please
});

discord.on(discord.Event.MESSAGE_CREATE, async (message) => {
  if (
    message.content.match(
      /^[0-9a-f]{8}-[0-9a-f]{4}-(?:[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|0000-0000-000000000000)$/g
    )
  ) {
    if (message.content.match(/\${2}/g)) return;
    message.inlineReply(
      `⚠ UUID Detected, you may have posted your API key ${message.author.toMention()}!⚠\nPlease refer to itzaname on [the issue site](https://issues.strafes.net/client/index.php#/folders/15/issues) and request an API key renewal if so.\n\n*If you desire to send a UUID without this message appearing, include a \`$$\` anywhere in the message.*`
    );
  }
  //y21's regex lol
  if (message.content.match(/[MN][A-Za-z\d]{23}\.[\w-]{6}\.[\w-]{27}/g)) {
    if (message.content.match(/\${2}/g)) return;
    message.delete().then(() => {
      message.reply(
        `⚠ Discord Token Detected. ⚠ ${message.author.toMention()}, your message has been automatically deleted, but that does not mean people still can't get it, if this was your personal token, change your password, if it was a bot token, refersh the token.\n\n*If you desire to send a Discord Token without this message appearing, include a \`$$\` anywhere in the message.`
      );
    });
  }
});

import './nsp';
