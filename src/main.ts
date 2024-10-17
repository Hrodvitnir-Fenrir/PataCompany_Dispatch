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

const trustUsers = ["236552969544269826", "382290051440181250", "354371346026987521", "229643102191747072", "169899983263236097"]

client.once("ready", async () => {
	console.log(`Bot ${client.user.tag} is online.`);

	client.user.setPresence({
		status: "dnd",
		activities: [
			{
				type: ActivityType.Watching,
				name: "Dorgan faire des bêtises"
			}
		]
	})

	// const guild = await client.guilds.fetch("606191377067278359");
	// const channel = await guild.channels.fetch("800866648189829131") as TextChannel;
	// messagePannel = await initMessage(channel);
	// const event = await getTheLastEvent(guild);
	// await verificationUpdate(event, messagePannel);
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

	if (interaction.customId === "update") {
		if (!trustUsers.includes(interaction.user.id)) return interaction.reply({ content: "Vous n'avez pas la permission de faire ça.", ephemeral: true });
		const event = await getTheLastEvent(interaction.guild);
		await verificationUpdate(event, interaction.message);
		await interaction.reply({ content: "Event mis à jour.", ephemeral: true });
	}
});

client.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isStringSelectMenu()) return;

	if (interaction.customId === "roleSelection") {
		userRoleManager(interaction);
		}

});

client.login(process.env.DISCORD_TOKEN);