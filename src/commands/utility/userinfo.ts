import { 
    ApplicationIntegrationType, 
    ChatInputCommandInteraction,
    EmbedBuilder,
    InteractionContextType, 
    SlashCommandBuilder,
    GuildMember
} from "discord.js";
import { CommandDefinition } from "../../type";

const cmd: CommandDefinition = {
    data: new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription('Get information about a user')
        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('The user to get information about')
                .setRequired(false)
        )
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

        const targetUser = interaction.options.getUser('user') || interaction.user;
        const member = await interaction.guild.members.fetch(targetUser.id).catch(() => null);

        if (!member) {
            await interaction.reply({
                content: "Impossible de trouver ce membre sur le serveur.",
                ephemeral: true
            });
            return;
        }

        const roles = member.roles.cache
            .filter(role => role.id !== interaction.guild!.id)
            .sort((a, b) => b.position - a.position)
            .map(role => `<@&${role.id}>`)
            .join(' ');

        const createdDate = targetUser.createdAt.toLocaleDateString('fr-FR');
        const joinedDate = member.joinedAt?.toLocaleDateString('fr-FR') || 'Inconnu';

        const embed = new EmbedBuilder()
            .setTitle(`Profil de ${targetUser.username}`)
            .setThumbnail(member.displayAvatarURL({ size: 1024 }))
            .setColor(member.displayColor || 0x5865F2)
            .addFields(
                {
                    name: 'ID',
                    value: `\`${targetUser.id}\``,
                    inline: true
                },
                {
                    name: 'Surnom',
                    value: member.nickname || 'Aucun',
                    inline: true
                },
                {
                    name: 'Compte créé le',
                    value: createdDate,
                    inline: false
                },
                {
                    name: 'Rejoint le',
                    value: joinedDate,
                    inline: false
                },
                {
                    name: `Roles (${member.roles.cache.size - 1})`,
                    value: roles || 'Aucun rôle',
                    inline: false
                }
            )
            .setFooter({
                text: `Demandé par ${interaction.user.username}`,
                iconURL: interaction.user.displayAvatarURL({ size: 1024 })
            });

        await interaction.reply({
            embeds: [embed]
        });
    }
};

export default cmd;