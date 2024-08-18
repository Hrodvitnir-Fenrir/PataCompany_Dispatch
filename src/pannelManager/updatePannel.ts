import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Collection, EmbedBuilder, GuildScheduledEvent, GuildScheduledEventStatus, Message, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "discord.js";
import { eventStructure } from "./scheduleFetcher";

interface PannelStructure {
	embed: EmbedBuilder;
	squadJoinRow: ActionRowBuilder<ButtonBuilder>;
	squadManagementRow: ActionRowBuilder<ButtonBuilder>;
	roleSelectionRow: ActionRowBuilder<StringSelectMenuBuilder>;
}

export async function embedMaker(eventName: string, eventId: string, eventTimestamp: number): Promise<PannelStructure> {
	const embed = new EmbedBuilder()
		.setColor("#449e48")
		.setTitle(eventName)
		.setAuthor({ name: "PataCompany" })
		.setThumbnail("https://i.imgur.com/hqFhz0Q.png")
		.setDescription(`Date et heure : <t:${eventTimestamp / 1000}:F>
			IP : patapignouf.youdontcare.com:2302
			TeamSpeak : [cliquez pour rejoindre](https://tinyurl.com/47r9ur8z)`)
		.setImage("https://i.imgur.com/XqQEGD0.png")
		.setFooter({ text: `[${eventId}, ${eventTimestamp}]`, iconURL: "https://i.imgur.com/Aq9AzvO.png" });

	const squadButton = new ButtonBuilder()
		.setCustomId("noSquad")
		.setLabel("Aucune escouade créé !")
		.setStyle(ButtonStyle.Secondary)
		.setDisabled(true);

	const createSquad = new ButtonBuilder()
		.setCustomId("createSquad")
		.setLabel("Créer une escouade")
		.setStyle(ButtonStyle.Success);

	const leaveSquad = new ButtonBuilder()
		.setCustomId("leaveSquad")
		.setLabel("Quitter l'escouade")
		.setStyle(ButtonStyle.Danger);

	const roleSelection = new StringSelectMenuBuilder()
		.setCustomId("roleSelection")
		.setPlaceholder("Sélectionnez votre rôle [2 MAX]")
		.setMaxValues(2)
		.setMinValues(1)
		.addOptions(
			new StringSelectMenuOptionBuilder()
				.setLabel("Team lead")
				.setDescription("Sitrep ?")
				.setValue("lead")
				.setEmoji("1274659075329888329"),
			new StringSelectMenuOptionBuilder()
				.setLabel("Anti-tank")
				.setDescription("Backblast !!")
				.setValue("at")
				.setEmoji("1274659089372287006"),
			new StringSelectMenuOptionBuilder()
				.setLabel("Rifleman")
				.setDescription("Pew pew")
				.setValue("rifle")
				.setEmoji("1274659097366630482"),
			new StringSelectMenuOptionBuilder()
				.setLabel("Grenadier")
				.setDescription("40mm dans la poche")
				.setValue("grenadier")
				.setEmoji("1274659105729937559"),
			new StringSelectMenuOptionBuilder()
				.setLabel("Engineer")
				.setDescription("IED en vue !")
				.setValue("engineer")
				.setEmoji("1274659113250590740"),
			new StringSelectMenuOptionBuilder()
				.setLabel("Autorifleman")
				.setDescription("\"Pew pew\" mais beaucoup plus")
				.setValue("autorifleman")
				.setEmoji("1274659120011673681"),
			new StringSelectMenuOptionBuilder()
				.setLabel("Marksman")
				.setDescription("Tire de loins")
				.setValue("marksman")
				.setEmoji("1274659126374301759"),
			new StringSelectMenuOptionBuilder()
				.setLabel("Sniper")
				.setDescription("Tire de encore plus loins")
				.setValue("sniper")
				.setEmoji("1274659133165146142"),
			new StringSelectMenuOptionBuilder()
				.setLabel("Medic")
				.setDescription("Bouchez les trous")
				.setValue("medic")
				.setEmoji("1274659139699867669"),
			new StringSelectMenuOptionBuilder()
				.setLabel("Pilot")
				.setDescription("Brrrrrrr !")
				.setValue("pilot")
				.setEmoji("1274659147031515136")
		)

	const firstRow = new ActionRowBuilder<ButtonBuilder>()
		.addComponents(squadButton)

	const secondRow = new ActionRowBuilder<ButtonBuilder>()
		.addComponents(createSquad, leaveSquad);

	const thirdRow = new ActionRowBuilder<StringSelectMenuBuilder>()
		.addComponents(roleSelection);

	return {
		embed: embed,
		squadJoinRow: firstRow,
		squadManagementRow: secondRow,
		roleSelectionRow: thirdRow
	};
}

export async function verificationUpdate(event: eventStructure | null, message: Message) {
	if (event === null) {
		// message.edit({ content: "Aucune opération de prévu pour le moment.", embeds: [], components: [] });
		console.log("No event found.");
		return;
	}

	const eventTimestamp = event.scheduledStartTime;
	const currentTimestamp = message.embeds[0]?.footer?.text ? JSON.parse(message.embeds[0]?.footer?.text)[1] : undefined;

	if (eventTimestamp === undefined || eventTimestamp.toString() != currentTimestamp) {
		const pannel = await embedMaker(event.name, event.id, eventTimestamp);
		await message.edit({ 
			content: "",
			embeds: [pannel.embed], 
			components: [pannel.squadJoinRow, pannel.squadManagementRow, pannel.roleSelectionRow] 
		});
		console.log("Message updated.");
	} else {
		console.log("Message is up to date.");
	}
}
