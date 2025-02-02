module.exports = {
    name: "guildDelete",
    execute(guild) {
        const logChannelID = '1327583295436750959';
        const client = guild.client;
        const logChannel = client.channels.cache.get(logChannelID);

        if (logChannel) {
            logChannel.send(`📤 Bot şu sunucudan kaldırıldı: **${guild.name}** (ID: ${guild.id})`);
        }
        console.log(`Bot sunucudan kaldırıldı: ${guild.name} (ID: ${guild.id})`);
    },
};