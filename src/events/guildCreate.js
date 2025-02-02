module.exports = {
    name: "guildCreate",
    execute(guild) {
        const logChannelID = '1327583295436750959';
        const client = guild.client;
        const logChannel = client.channels.cache.get(logChannelID);

        if (logChannel) {
            logChannel.send(`📥 Bot şu sunucuya eklendi: **${guild.name}** (ID: ${guild.id})`);
        }
        console.log(`Bot sunucuya katıldı: ${guild.name} (ID: ${guild.id})`);
    },
};