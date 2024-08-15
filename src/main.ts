import { ActivityType, Client, Events, Guild, Message, TextChannel } from "discord.js";
import { config } from "dotenv";
import * as path from "path";
import { initMessage } from "./pannelManager/initMessage";
import { getTheLastEvent } from "./pannelManager/scheduleFetcher";
import { verificationUpdate } from "./pannelManager/updatePannel";
config({ path: path.resolve(__dirname, "..", ".env") });

export const client = new Client({ intents: ["Guilds"] });

export let messagePannel: Message;

client.once("ready", async () => {
	console.log(`Bot ${client.user.tag} is online.`);

	const guild = await client.guilds.fetch("897141056087404584");
	const channel = await guild.channels.fetch("1273505346979102832") as TextChannel;
	messagePannel = await initMessage(channel);

	const event = await getTheLastEvent(guild);
	await verificationUpdate(event, messagePannel);
});

client.login(process.env.DISCORD_TOKEN);