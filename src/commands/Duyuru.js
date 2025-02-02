const { EmbedBuilder, PermissionsBitField, SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("duyuru")
        .setDescription("Duyuru gönderir.")
        .addChannelOption(option =>
            option.setName("kanal")
                .setDescription("Duyurunun gönderileceği kanal.")
                .setRequired(true))
        .addStringOption(option =>
            option.setName("baslik")
                .setDescription("Duyuru başlığı.")
                .setRequired(true))
        .addStringOption(option =>
            option.setName("mesaj")
                .setDescription("Duyuru mesajı.")
                .setRequired(true))
        .addStringOption(option =>
            option.setName("alt_bilgi")
                .setDescription("Duyuru alt bilgisi.")
                .setRequired(false))
        .addStringOption(option =>
            option.setName("imza")
                .setDescription("Duyuru imzası.")
                .setRequired(false))
        .addStringOption(option =>
            option.setName("etiket")
                .setDescription("Duyuruya eklemek için etiketler. (Örn: @everyone, @here)")
                .setRequired(false)),

    async execute(interaction) {
        const kanal = interaction.options.getChannel("kanal");
        const baslik = interaction.options.getString("baslik");
        const mesaj = interaction.options.getString("mesaj");
        const alt_bilgi = interaction.options.getString("alt_bilgi") || "Bir duyuru gönderildi!";
        const imza = interaction.options.getString("imza") || interaction.user.tag;
        const etiket = interaction.options.getString("etiket");

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
            return interaction.reply({ content: "🚫 | Duyuru gönderme yetkiniz yok!", ephemeral: true });
        }

        // Botun kanal için mesaj gönderme yetkisi var mı?
        if (!kanal.permissionsFor(interaction.guild.members.me).has(PermissionsBitField.Flags.SendMessages)) {
            return interaction.reply({ content: `🚫 | Botun **${kanal.name}** kanalında mesaj gönderme yetkisi yok!`, ephemeral: true });
        }

        const embed = new EmbedBuilder()
            .setColor("#00FF00")
            .setTitle(`${baslik}`)
            .setDescription(mesaj)
            .setFooter({ text: imza, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
            .setTimestamp();

        if (alt_bilgi) embed.setAuthor({ name: alt_bilgi });

        await interaction.reply("✅ | Duyuru gönderilmeye başlanıyor...");

        try {
            if (etiket) {
                await kanal.send({
                    content: etiket,
                    embeds: [embed]
                });
            } else {
                await kanal.send({
                    embeds: [embed]
                });
            }

            await interaction.followUp("✅ | Duyuru başarıyla gönderildi!");
        } catch (error) {
            console.error("Duyuru gönderilirken hata oluştu:", error);
            await interaction.followUp("❌ | Duyuru gönderilirken bir hata oluştu.");
        }
    },
};