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
        .setName('help')
        .setDescription('Get a list of available commands')
        .setIntegrationTypes(
            ApplicationIntegrationType.GuildInstall,
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
        await interaction.guild.commands.fetch();

        const embed = new EmbedBuilder()
            .setTitle('--- CENTRE D\'ASSISTANCE EZZVERSE ---')
            .setColor(0x3498DB)
            .addFields(
                {
                    name: "ECONOMIE ET ACTIVITE",
                    value: "`SOON` - Fonctionnalités à venir",
                    inline: false
                },
                {
                    name: "MINECRAFT",
                    value: "`SOON` `SOON`",
                    inline: false
                },
                {
                    name: "OUTILS ET INFOS",
                    value: ":ping_pong: `/ping` : Latence du bot.\n:bar_chart: `/serverinfo` : Infos du serveur.\n:bust_in_silhouette: `/userinfo [@user]` : Infos d'un membre.",
                    inline: false
                },
                {
                    name: "ADMINISTRATION (STAFF)",
                    value: ":broom: `/clear [nb]` : Supprimer des messages.\n:money_with_wings: `/addmoney [@user] [mt]` : Ajouter des coins.\n:x: `/delmoney [@user] [mt]` : Supprimer des coins.\n:arrows_counterclockwise: `/reload [cog]` : Actualiser un module.\n:envelope_with_arrow: `/ban [@user]` : Bannir un membre.",
                    inline: false
                }
            )
            .setFooter({text: 'EzzVerse Network - Communaute Active'})
        await interaction.reply({
            embeds: [embed],
            ephemeral: false
        });
    }
};

export default cmd;