import { ActivityType, Client, EmbedBuilder, Events, GatewayDispatchEvents, GatewayIntentBits, Guild, Message, Partials, TextChannel } from "discord.js";
import { config } from "dotenv";
import * as path from "path";
import { initMessage } from "./pannelManager/initMessage";
import { getTheLastEvent } from "./pannelManager/scheduleFetcher";
import { verificationUpdate } from "./pannelManager/updatePannel";
import { createSquad, removeUser, updateMessage, userRoleManager } from "./squadTweeker/squadManager";
config({ path: path.resolve(__dirname, "..", ".env") });

export const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildScheduledEvents], partials: [Partials.GuildScheduledEvent] });

export let messagePannel: Message;

client.once("ready", async () => {
	console.log(`Bot ${client.user.tag} is online.`);

	const guild = await client.guilds.fetch("897141056087404584");
	const channel = await guild.channels.fetch("1273505346979102832") as TextChannel;
	messagePannel = await initMessage(channel);

	const event = await getTheLastEvent(guild);
	await verificationUpdate(event, messagePannel);

	// setInterval(async () => {
	// 	const event = await getTheLastEvent(guild);
	// 	await verificationUpdate(event, messagePannel);
	// }, 10 * 60 * 1000);
});

client.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isButton()) return;

	if (interaction.customId === "createSquad") {
		createSquad(interaction);
	}

	if (interaction.customId === "leaveSquad") {
		const fields = await removeUser(interaction);
		await updateMessage(interaction, fields);
	}

	if (interaction.customId === "Alpha" || interaction.customId === "Bretelle" || interaction.customId === "Camelote" || interaction.customId === "Delirium" || interaction.customId === "E") {
		const fields = await removeUser(interaction);
		fields.forEach(filed => {
			if (filed.name === interaction.customId) {
				filed.value += `\n<@${interaction.user.id}>`;
			}
		});
		await updateMessage(interaction, fields);
	}
});

client.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isStringSelectMenu()) return;

	if (interaction.customId === "roleSelection") {
		userRoleManager(interaction);
		}

});

client.login(process.env.DISCORD_TOKEN);