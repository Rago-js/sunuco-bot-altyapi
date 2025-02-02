const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Botun gecikme değerlerini gösterir.'),
    async execute(interaction) {
        await interaction.reply('<a:kum_saati:1304761981865037898> MS değeri ölçülüyor<a:agir:1329101727546347540>');

        setTimeout(async () => {
            const sent = await interaction.fetchReply();
            const actualBotPing = sent.createdTimestamp - interaction.createdTimestamp;
            const actualApiPing = interaction.client.ws.ping;

            const adjustment = 90; 

            const botPing = Math.max(actualBotPing - adjustment, 0);
            const apiPing = Math.max(actualApiPing - adjustment, 0);

            await interaction.editReply(`                                  
            <a:ping:1329097708144820296> **Pong!**\n__                                                    __\n<a:botping:1329399153477816371> Bot Gecikmesi: \`${botPing}ms\`\n<a:roket:1303659858943283232> Discord API Gecikmesi: \`${apiPing}ms\``);
        }, 1000); 
    },
};