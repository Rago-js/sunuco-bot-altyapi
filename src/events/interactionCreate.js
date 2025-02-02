const { Events } = require('discord.js');
const { logCommandUsage } = require('../events/logger'); 

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isCommand()) return;

        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) {
            console.error(`Komut bulunamadı: ${interaction.commandName}`);
            return;
        }

        try {
            await command.execute(interaction);

            await logCommandUsage(interaction, interaction.client);
        } catch (error) {
            console.error(`Komut yürütülürken hata oluştu: ${interaction.commandName}`);
            console.error(error);

            await logCommandUsage(interaction, interaction.client, error);

            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({
                    content: 'Bu komut çalıştırılırken bir hata oluştu!',
                    ephemeral: true,
                });
            } else {
                await interaction.reply({
                    content: 'Bu komut çalıştırılırken bir hata oluştu!',
                    ephemeral: true,
                });
            }
        }
    },
};