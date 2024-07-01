import { Client as Bot, Intents, MessageEmbed, TextChannel } from 'discord.js';
import { Client as SelfBot } from 'discord.js-selfbot-v13';
import config from '../config.json';
import consola from 'consola';

const bot = new Bot({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});
const selfbot = new SelfBot();

bot.on('ready', async () => {
	consola.success(`${bot.user?.username} is Ready!`);
});

selfbot.on('ready', async () => {
	consola.success(`${selfbot.user?.username} is Ready!`);
});

selfbot.on('messageDelete', async (msg) => {
	if (msg.author?.bot) return;
	if (!msg.content || (msg.content && !(msg.content.length > 0))) return;
	consola.log(
		`Deleted message: ${msg.guild?.name}(${msg.guild?.id}) - ${msg.author?.username}(displayname: ${msg.author?.displayName}) said ${msg.content}`
	);
	//prettier-ignore
	const channel = bot.channels.cache.get(config.guild.loggingChannel) as TextChannel
	//prettier-ignore
	const embed = new MessageEmbed()
		.setTitle(`[DELETE] ${msg.author?.username}(${msg.author?.id})`)
		.setURL(`https://discord.com/channels/${msg.guildId}/${msg.channelId}/${msg.id}`)
		.addFields(
			{name: "チャンネル", value: `${msg.channel}`},
			{name: "内容", value: msg.content}
		)
		.setColor('GREY')
		.setFooter(`on ${msg.guild?.name}(${msg.guildId})`)
		.setTimestamp()

	await channel.send({
		embeds: [embed],
	});
});

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

async function shutdown() {
	consola.info('Shutting down...');
	bot.destroy();
	selfbot.destroy();
	consola.success('Goodbye!');
	process.exit(0);
}

process.on('uncaughtException', function (e) {
	consola.error(e);
});

bot.login(config.tokens.bot);
selfbot.login(config.tokens.selfbot);
