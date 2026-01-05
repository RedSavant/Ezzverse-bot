import { 
    ApplicationIntegrationType, 
    ChatInputCommandInteraction,
    EmbedBuilder,
    InteractionContextType, 
    SlashCommandBuilder 
} from "discord.js";
import { CommandDefinition } from "../../type";

const cmd: CommandDefinition = {
    data: new SlashCommandBuilder()
        .setName('serverinfo')
        .setDescription('Get information about the server')
        .setIntegrationTypes(
            ApplicationIntegrationType.GuildInstall
        )
        .setContexts(
            InteractionContextType.Guild
        ),
    
    async execute(interaction: ChatInputCommandInteraction) {
        if (!interaction.guild) {
            await interaction.reply({
                content: "Cette commande ne peut être utilisée que dans un serveur.",
                ephemeral: true
            });
            return;
        }

        await interaction.guild.members.fetch();

        const guild = interaction.guild;
        const owner = await guild.fetchOwner();
        
        const totalMembers = guild.memberCount;
        const humanMembers = guild.members.cache.filter(m => !m.user.bot).size;
        const botMembers = guild.members.cache.filter(m => m.user.bot).size;

        const textChannels = guild.channels.cache.filter(c => c.isTextBased()).size;
        const voiceChannels = guild.channels.cache.filter(c => c.isVoiceBased()).size;

        const createdDate = guild.createdAt.toLocaleDateString('fr-FR');

        const embed = new EmbedBuilder()
            .setTitle(`Informations : ${guild.name}`)
            .setThumbnail(guild.iconURL({ size: 1024 }))
            .setColor(0x5865F2)
            .addFields(
                {
                    name: 'Proprietaire',
                    value: `<@${owner.id}>`,
                    inline: true
                },
                {
                    name: 'ID du Serveur',
                    value: `\`${guild.id}\``,
                    inline: true
                },
                {
                    name: 'Creation',
                    value: createdDate,
                    inline: true
                },
                {
                    name: 'Membres',
                    value: `Total: **${totalMembers}**\nHumains: **${humanMembers}**\nBots: **${botMembers}**`,
                    inline: true
                },
                {
                    name: 'Salons',
                    value: `Texte: **${textChannels}**\nVocaux: **${voiceChannels}**`,
                    inline: true
                },
                {
                    name: 'Boosts',
                    value: `Niveau **${guild.premiumTier}**\n**${guild.premiumSubscriptionCount || 0}** Boosts`,
                    inline: true
                }
            )
            .setFooter({
                text: `Demande par ${interaction.user.username}`,
                iconURL: interaction.user.displayAvatarURL({ size: 1024 })
            });

        await interaction.reply({
            embeds: [embed]
        });
    }
};

export default cmd;
