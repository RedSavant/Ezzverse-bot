import { 
    ApplicationIntegrationType, 
    ChatInputCommandInteraction, 
    ContainerBuilder,
    InteractionContextType, 
    MessageFlags,
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
        const container = new ContainerBuilder()
            .addTextDisplayComponents((textDisplay) => 
                textDisplay.setContent(
                    `# Information sur le serveur\n\n` +
                    `**Proprietaire:** ${interaction.guild?.ownerId}\n` +
                    `**ID du serveur:** <@${interaction.guild?.id}>\n` +
                    `**Creation:** ${interaction.guild?.createdAt}\n` +
                    `**Region:** ${interaction.guild?.preferredLocale}\n` +
                    `**Membres:** ${interaction.guild?.memberCount}, Humains: ${interaction.guild?.members.cache.filter(m => !m.user.bot).size}, Bots: ${interaction.guild?.members.cache.filter(m => m.user.bot).size}\n` +
                    `**Roles:** ${interaction.guild?.roles.cache.size}\n` +
                    `**Canaux:** ${interaction.guild?.channels.cache.size}\n` +
                    `**Boosts:** ${interaction.guild?.premiumSubscriptionCount} (Niveau ${interaction.guild?.premiumTier})`
                )
            )
            .addSeparatorComponents((s) => s)
            .addTextDisplayComponents((textDisplay) => 
                textDisplay.setContent(`Demandé par ${interaction.user.username}`)
            );

        await interaction.reply({
            components: [container],
            flags: MessageFlags.IsComponentsV2
        });
    }
};

export default cmd;