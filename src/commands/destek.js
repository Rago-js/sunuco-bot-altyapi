
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('destek')
        .setDescription('Duyuru botu destek sunucusunun bağlantısını al.'),
    async execute(interaction) {
        await interaction.reply({
            content: 'Sunuco Duyuru botumuz için destek sunucusu:\nhttps://discord.gg/linkiniz\n\n𝐓𝐨𝐦𝐚𝐧',
            ephemeral: true
        });
    },
};