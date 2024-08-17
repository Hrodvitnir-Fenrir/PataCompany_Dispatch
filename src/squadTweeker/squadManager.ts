import { ActionRowBuilder, APIEmbed, APIEmbedField, ButtonBuilder, ButtonInteraction, ButtonStyle, Embed, EmbedBuilder, Message, StringSelectMenuInteraction } from "discord.js";
import { embedMaker } from "../pannelManager/updatePannel";

const squadNames = [ "Alpha", "Bretelle", "Camelote", "Delirium", "E" ]
const roleEmojis = {
	lead: "<:lead:1273604837992300574>",
	at: "<:at:1273604853704298597>",
	rifle: "<:rifle:1273604860251471894>",
	grenadier: "<:grenadier:1273604859469314055>",
	engineer: "<:engineer:1273604874520629269>",
	autorifleman: "<:autorifleman:1273604894380527690>",
	marksman: "<:marksman:1273604901498519723>",
	sniper: "<:sniper:1273604908200755211>",
	medic: "<:medic:1273604914685149279>",
	pilot: "<:pilot:1273604922633355401>"
}

export async function updateMessage(interaction: ButtonInteraction | StringSelectMenuInteraction, fields: APIEmbedField[]) {
	const pannel = await embedMaker(interaction.message.embeds[0].title, JSON.parse(interaction.message.embeds[0]?.footer?.text)[0], parseInt(JSON.parse(interaction.message.embeds[0]?.footer?.text)[1]));
	
	fields.forEach(field => {
		field.name = squadNames[fields.indexOf(field)];
	});

	const buttonsSquadRaw = await buttonsSquadMaker(fields);

	pannel.embed.addFields(fields);

	await interaction.update({ embeds: [pannel.embed], components: [buttonsSquadRaw, pannel.squadManagementRow, pannel.roleSelectionRow] });
}

export async function createSquad(interaction: ButtonInteraction) {
	let fileds = interaction.message.embeds[0].fields;

	if (fileds.length >= 5) {
		return interaction.reply({ content: "La maximum de squad a été créé", ephemeral: true });
	} else if (fileds.length != 0) {
		fileds = await removeUser(interaction);
	}
	fileds.push({ name: `${squadNames[fileds.length]}`, value: `<@${interaction.user.id}>`, inline: true });

	await updateMessage(interaction, fileds);
}

export async function removeUser(interaction: ButtonInteraction): Promise<APIEmbedField[]> {
	let fields = interaction.message.embeds[0].fields;

	fields.forEach(filed => {
		let value = filed.value.split("\n")
		value.forEach((user, index) => {
			if (user.includes(`<@${interaction.user.id}>`)) {
				value.splice(index, 1);
			}
		});
		filed.value = value.join("\n");
		if (filed.value === "") {
			fields.splice(fields.indexOf(filed), 1);
		}
	});

	return fields;
}

async function buttonsSquadMaker(fileds: APIEmbedField[]): Promise<ActionRowBuilder<ButtonBuilder>> {
	if (fileds.length === 0) {
		const squadButton = new ButtonBuilder()
		.setCustomId("noSquad")
		.setLabel("Aucune escouade créé !")
		.setStyle(ButtonStyle.Secondary)
		.setDisabled(true);

		const firstRow = new ActionRowBuilder<ButtonBuilder>()
		.addComponents(squadButton);

		return firstRow;
	} else {
		const buttons = [];
		fileds.forEach(filed => {
			const squadButton = new ButtonBuilder()
			.setCustomId(`${filed.name}`)
			.setLabel(`Rejoindre ${filed.name}`)
			.setStyle(ButtonStyle.Primary);

			buttons.push(squadButton);
		});

		const firstRow = new ActionRowBuilder<ButtonBuilder>()
		.addComponents(buttons);

		return firstRow;
	}
}

export async function userRoleManager(interaction: StringSelectMenuInteraction) {
	const fields = interaction.message.embeds[0].fields;
	let userIn = false;

    fields.forEach(field => {
        let value = field.value.split("\n");
        value = value.map(user => {
            if (user.includes(`<@${interaction.user.id}>`)) {
                userIn = true;
                return `<@${interaction.user.id}> ${roleEmojis[interaction.values[0]] ? roleEmojis[interaction.values[0]] : "" } ${interaction.values[1] ? roleEmojis[interaction.values[1]] : ""}`;
            }
            return user;
        });
        field.value = value.join("\n");
    });

	if (!userIn) {
		return interaction.reply({ content: "Veuillez rejoindre une squad avant de sélectionner un rôle.", ephemeral: true });
	} else {
		return await updateMessage(interaction, fields);
	}
}
