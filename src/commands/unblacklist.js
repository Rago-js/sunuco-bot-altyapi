const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fs = require("fs");

const blacklistFilePath = "karaliste.json";  

const loadBlacklist = () => {
    if (!fs.existsSync(blacklistFilePath)) {
        fs.writeFileSync(blacklistFilePath, JSON.stringify([]));
    }
    return JSON.parse(fs.readFileSync(blacklistFilePath, "utf-8"));
};

const saveBlacklist = (blacklist) => {
    fs.writeFileSync(blacklistFilePath, JSON.stringify(blacklist, null, 2));
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName("unblacklist")
        .setDescription("Belirtilen sunucuyu duyuru-dm komudu için kara listeden kaldırır.")
        .addStringOption(option =>
            option.setName("sunucuid")
                .setDescription("Kara listeden çıkarmak istediğiniz sunucunun ID'sini belirtin.")
                .setRequired(true)
        ),

    async execute(interaction) {
        if (interaction.user.id !== "KULLANICI İDNİZ") {
            return interaction.reply({ 
                content: "<a:red1:1302918709161230336> | Bu komutu kullanma yetkiniz bulunmamaktadır.", 
                ephemeral: true 
            });
        }

        const sunucuId = interaction.options.getString("sunucuid");
        const blacklist = loadBlacklist();

        if (!blacklist.includes(sunucuId)) {
            return interaction.reply({ 
                content: "<a:unlem:1318678164016468060> | Belirttiğiniz sunucu kara listede bulunmamaktadır.", 
                ephemeral: true 
            });
        }

        const updatedBlacklist = blacklist.filter(id => id !== sunucuId);
        saveBlacklist(updatedBlacklist);

        const guild = await interaction.client.guilds.fetch(sunucuId).catch(() => null);

        if (!guild) {
            return interaction.reply({ 
                content: "<a:red1:1302918709161230336> | Belirttiğiniz sunucu bulunamadı.", 
                ephemeral: true 
            });
        }

        const owner = await guild.fetchOwner().catch(() => null);

        if (owner) {
            const embed = new EmbedBuilder()
                .setColor("#00FF00")
                .setTitle("Kara Liste Kaldırma Bildirimi")
                .setDescription(`Merhaba ${owner.user.username},`)
                .addFields(
                    { name: "<a:konfeti:1303107906820116521> Tebrikler!", value: `Sunucunuz **${guild.name}** başarıyla **kara listeden** kaldırıldı. Artık **/duyuru-dm** komutunu kullanabilirsiniz.` },
                    { name: "<a:destek:1330268955499298828> Yardım:", value: "Herhangi bir sorunuz varsa, [Destek Sunucumuzu](https://discord.gg/linkiniz) ziyaret edebilirsiniz." }
                )
                .setFooter({ text: "Anlayışınız için teşekkür ederiz.", iconURL: interaction.client.user.displayAvatarURL() })
                .setTimestamp();

            await owner.send({ embeds: [embed] }).catch(() => {
                console.log(`Sunucu sahibine mesaj gönderilemedi: ${owner.id}`);
            });
        }

        return interaction.reply({ 
            content: `<a:onay2gif:1304772562475024384> | Sunucu ID'si **${sunucuId}** başarıyla kara listeden kaldırılmıştır ve sunucu sahibine bilgilendirme mesajı gönderilmiştir. Sunucu Adı: **${guild.name}**`, 
            ephemeral: true 
        });
    },
};