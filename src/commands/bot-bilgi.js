const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bot-bilgi')
        .setDescription('Bot hakkında bilgi verir.'),

    async execute(interaction) {
        const { client } = interaction;

        const totalGuilds = client.guilds.cache.size;
        const totalMembers = client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);

        const infoEmbed = new EmbedBuilder()
            .setColor('#5865F2')
            .setDescription(
                `**Sunuco - Bilgi**\n` +
                `<:sagok:1302297146820919337> **Bot kaç sunucuda var:** ${totalGuilds}\n` +
                `<:sagok:1302297146820919337> **Toplam üye sayısı:** ${totalMembers}\n\n` +
                `**Sunuco - Hakkında**\n` +
                `<:sagok:1302297146820919337> **Destek Sunucusu:** [Destek Sunucusu](sunucu linkiniz)\n` +
                `<:sagok:1302297146820919337> **Davet Linki:** [Davet Et](bot davet linki)\n` +
                `<:sagok:1302297146820919337> **Top.gg Oy Ver:** [Oy Ver](top.gg linkiniz)\n` +
                `<:sagok:1302297146820919337> **Botu Sunucuna Ekle:** [Sunucuna Ekle](oauth2 urlniz)`
            )
            .setFooter({ text: 'Sunuco Bot | Her hakkı saklıdır.', iconURL: client.user.displayAvatarURL() })
            .setTimestamp();

        await interaction.reply({ embeds: [infoEmbed] });
    },
};