import { Message, TextChannel } from "discord.js";

export async function initMessage(channel: TextChannel): Promise<Message> {
	const fetchedMessage = await channel.messages.fetch();
	if (fetchedMessage.size === 0) {
		const message = await channel.send("<a:load:1275136888386359328>");
		return message;
	} else {
		return fetchedMessage.first();
	}
}