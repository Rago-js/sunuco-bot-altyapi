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
        .setName("blacklist")
        .setDescription("Belirtilen sunucuyu duyuru-dm komudu için kara listeye ekler.")
        .addStringOption(option =>
            option.setName("sunucuid")
                .setDescription("Kara listeye eklemek istediğiniz sunucunun ID'sini belirtin.")
                .setRequired(true)
        ),

    async execute(interaction) {
        if (interaction.user.id !== "KENDİ İDNİZİ GİRİN") {
            return interaction.reply({ 
                content: "<a:red1:1302918709161230336> | Bu komutu kullanma yetkiniz bulunmamaktadır.", 
                ephemeral: true 
            });
        }

        const sunucuId = interaction.options.getString("sunucuid");
        const blacklist = loadBlacklist();

        if (blacklist.includes(sunucuId)) {
            return interaction.reply({ 
                content: "<a:unlem:1318678164016468060> | Belirttiğiniz sunucu zaten kara listede yer almaktadır.", 
                ephemeral: true 
            });
        }

        const guild = await interaction.client.guilds.fetch(sunucuId).catch(() => null);

        if (!guild) {
            return interaction.reply({ 
                content: "<a:red1:1302918709161230336> | Belirttiğiniz sunucu bulunamadı.", 
                ephemeral: true 
            });
        }

        const owner = await guild.fetchOwner().catch(() => null);

        if (!owner) {
            return interaction.reply({ 
                content: "<a:red1:1302918709161230336> | Sunucu sahibine ulaşılamadı.", 
                ephemeral: true 
            });
        }

        blacklist.push(sunucuId);
        saveBlacklist(blacklist);

        const embed = new EmbedBuilder()
            .setColor("FF0000")
            .setTitle("Duyuru-DM Komut Engeli")
            .setDescription(`Merhaba ${owner.user.username},`)
            .addFields(
                { name: "<a:unlem:1318678164016468060> Yasaklama Bilgisi:", value: `Sunucunuz **${guild.name}** (**ID: ${sunucuId}**) **kara listeye** eklendiği için **/duyuru-dm** komutunu kullanmanız yasaklanmıştır. Fakat diğer kodları kullanmaya devam edebilirsiniz.` },
                { name: "<a:bilgilendirme:1328307805001875456> Neden Kara Listedeyim?", value: "Nedenini öğrenmek veya itiraz etmek için [Destek Sunucumuzu](https://discord.gg/DAeXnzkuBb) ziyaret edebilirsiniz." }
            )
            .setFooter({ text: "Anlayışınız için teşekkür ederiz.", iconURL: interaction.client.user.displayAvatarURL() })
            .setTimestamp();

        await owner.send({ embeds: [embed] }).catch(() => {
            console.log(`Sunucu sahibine mesaj gönderilemedi: ${owner.id}`);
        });

        return interaction.reply({ 
            content: `<a:onay2gif:1304772562475024384> | Sunucu ID'si **${sunucuId}** başarıyla kara listeye eklenmiştir ve sunucu sahibine bilgilendirme mesajı gönderilmiştir. Sunucu Adı: **${guild.name}**`, 
            ephemeral: true 
        });
    },
};