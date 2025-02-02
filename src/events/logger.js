const { EmbedBuilder } = require('discord.js');

module.exports = {
    logCommandUsage: async (interaction, client, error = null) => {
        const logChannelId = 'kanal id girin';

        const guild = interaction.guild;
        const botMember = guild?.members?.me;
        const channel = interaction.channel;

        const now = new Date();
        const turkishTime = new Date(now.getTime() + 3 * 60 * 60 * 1000); 
        const formattedDate = turkishTime.toLocaleString('tr-TR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
        const formattedTime = turkishTime.toLocaleString('tr-TR', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });

        const logEmbed = new EmbedBuilder()
            .setTitle('Komut Kullanımı')
            .setColor(error ? 'Red' : 'Blue')
            .addFields(
                { name: '**Kullanılan Komut:**', value: `**/${interaction.commandName}**`, inline: false },
                { name: '**Kullanan Kişi:**', value: `**${interaction.user.tag}** (**${interaction.user.id}**)`, inline: false },
                {
                    name: 'Komut Kullanılan Sunucu Bilgileri',
                    value: guild
                        ? `▷ **Sunucu ismi:** ${guild.name}\n▷ **Sunucu ID:** ${guild.id}\n▷ **Kanal İsmi:** ${channel.name}\n▷ **Kanal ID:** ${channel.id}\n▷ **Üye Sayısı:** ${guild.memberCount}\n▷ **Bot Eklenme Tarihi:** ${botMember?.joinedAt?.toLocaleDateString('tr-TR') || 'Bilinmiyor'}`
                        : 'DM (Direkt Mesaj)',
                    inline: false
                },
                { name: '**Komut Kullanılma Saati:**', value: `${formattedDate}, ${formattedTime}`, inline: false }
            )
            .setFooter({ text: 'Log Sistemi', iconURL: client.user.displayAvatarURL() })
            .setTimestamp();

        if (error) {
            logEmbed.addFields({ name: 'Hata:', value: `\`\`\`${error.message}\`\`\``, inline: false });
        }

        try {
            const logChannel = client.channels.cache.get(logChannelId);
            if (logChannel) {
                await logChannel.send({ embeds: [logEmbed] });
            } else {
                console.error('Log kanalı bulunamadı.');
            }
        } catch (sendError) {
            console.error('Log mesajı gönderilemedi:', sendError);
        }
    },
};