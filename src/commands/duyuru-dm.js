const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const fs = require("fs");

const blacklistFilePath = "karaliste.json";

const loadBlacklist = () => {
    if (!fs.existsSync(blacklistFilePath)) {
        fs.writeFileSync(blacklistFilePath, JSON.stringify([]));
    }
    return JSON.parse(fs.readFileSync(blacklistFilePath, "utf-8"));
};

const cooldownTimestamps = {};

module.exports = {
    data: new SlashCommandBuilder()
        .setName("duyuru-dm")
        .setDescription("Belirttiğiniz mesajı üyelere özel mesaj olarak gönderir.")
        .addStringOption(option =>
            option.setName('mesaj')
                .setDescription('Göndermek istediğiniz duyuru mesajını yazın.')
                .setRequired(true)),

    async execute(interaction) {
        const blacklist = loadBlacklist();

        if (blacklist.includes(interaction.guild.id)) {
            const embed = new EmbedBuilder()
                .setColor("#FFD700")
                .setTitle("<a:noentry:1330212426121216081> Sunucu Kara Listede")
                .setDescription(
                    "Bu sunucu kara listeye alınmıştır. Bu nedenle `/duyuru-dm` komutunu kullanamazsınız. Lütfen diğer kodları kullanınız.\n\n" +
                    "Kara listeye alınma nedeninizi öğrenmek veya itirazda bulunmak için [Destek Sunucumuza](https://discord.gg/linkiniz) ulaşabilirsiniz."
                )
                .setFooter({ text: "Adil bir topluluk oluşturmak için çalışıyoruz.", iconURL: interaction.client.user.displayAvatarURL() })
                .setTimestamp();

            return interaction.reply({ embeds: [embed], ephemeral: false });
        }

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({ content: "<a:red1:1302918709161230336> | Bu komutu kullanabilmek için 'Yönetici' yetkisine sahip olmanız gerekiyor.", ephemeral: true });
        }

        const now = Date.now();
        const guildId = interaction.guild.id;

        if (cooldownTimestamps[guildId] && now - cooldownTimestamps[guildId] < 86400000) {
            const timeLeft = Math.ceil((86400000 - (now - cooldownTimestamps[guildId])) / (60 * 60 * 1000));
            return interaction.reply({ content: `<a:unlem:1318678164016468060> | Bu komut en son 24 saat önce kullanılmış. Yeni bir duyuru göndermek için **${timeLeft} saat** bekleyin.`, ephemeral: true });
        }

        const mesaj = interaction.options.getString('mesaj');

        if (mesaj.length < 30) {
            return interaction.reply({ content: "<a:red1:1302918709161230336> | Duyuru mesajınız en az 30 karakter uzunluğunda olmalıdır.", ephemeral: true });
        }

        const bilgiMesaj = new EmbedBuilder()
            .setColor("#FFD700")
            .setTitle("<a:dyuru:1325198781842591754> Duyuru Gönderim Kuralları")
            .setDescription(
                "🔹 Kullanıcıların rahatsız edilmeyeceğinden emin olun.\n" +
                "🔹 duyuru-dm komudu üzerinden gerçekleştirdiğiniz duyurular için en az 30 karakterlik bir metin gerekmektedir.\n"+
                "🔹 Komut, günde yalnızca bir kez kullanılabilir.\n" +
                "🔹 /duyuru-dm komutunun gereksiz kullanımı, sistemde blacklist işlemine neden olabilir.\n"+
                "🔹 Gizlilik Politikası ve Kullanım Koşullarını mutlaka okuyun.\n\n" +
                "[📄 Gizlilik Politikası ve Kullanım Koşulları](https://sites.google.com/view/sunucoduyuru/ana-sayfa)"
            )
            .setFooter({ text: "Sunuco Duyuru Botu", iconURL: interaction.client.user.displayAvatarURL() })
            .setTimestamp();

        await interaction.reply({ embeds: [bilgiMesaj], ephemeral: true });

        const onayMesaji = await interaction.followUp({
            content: "<a:msg:1329393049691885648> | Duyuru gönderimine devam etmek istiyorsanız 'Evet' yazın.",
            ephemeral: true
        });

        const filter = msg => msg.author.id === interaction.user.id && msg.content.toLowerCase() === "evet";
        const collector = interaction.channel.createMessageCollector({ filter, time: 30000 });

        collector.on("collect", async (msg) => {
            collector.stop();
            const reply = await msg.reply("<a:dyuru:1325198781842591754> | Duyuru gönderimi başlatılıyor. Bu işlem birkaç dakika sürebilir, lütfen bekleyin<a:yukleniyor:1328993443510226975>\n-# <:sunuco:1329407344643149825> Sunuco");

            const embed = new EmbedBuilder()
                .setColor(`#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`)
                .setTitle(`${interaction.guild.name} - Yeni Duyuru`)
                .setDescription(`-# <a:dyuru:1325198781842591754> Duyuru Mesajı:\n${mesaj}\n\n-# <:sunuco:1329407344643149825> **Sunuco Duyuru Botu**`)
                .setFooter({ text: `Gönderen: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
                .setTimestamp();

            const buttonRow = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setLabel("Sunuco Destek Sunucusu")
                    .setEmoji('<a:discord:1330284729014030358>')
                    .setStyle("Link")
                    .setURL("https://discord.gg/DAeXnzkuBb"),
                new ButtonBuilder()
                    .setLabel("Sunuco Şikayet Formu")
                    .setEmoji('<a:destek:1330268955499298828>')
                    .setStyle("Link")
                    .setURL("https://forms.gle/KhCYHtndiS7xn1qy6")
            );

            try {
                const members = await interaction.guild.members.fetch();
                const failedUsers = [];

                for (const member of members.values()) {
                    if (member.user.bot) continue;
                    try {
                        await member.send({ embeds: [embed], components: [buttonRow] });
                    } catch {
                        failedUsers.push(member.user.tag);
                    }
                }

                if (failedUsers.length > 0) {
                    await reply.edit(`<a:onay2gif:1304772562475024384> | Duyuru gönderildi ancak şu kullanıcılara ulaşılamadı:\n${failedUsers.join("\n")}\n-# <:sunuco:1329407344643149825> Sunuco`);
                } else {
                    await reply.edit("<a:onay2gif:1304772562475024384> | Duyuru başarıyla tüm kullanıcılara gönderildi.\n-# <:sunuco:1329407344643149825> Sunuco");
                }

                cooldownTimestamps[guildId] = now;
            } catch (error) {
                console.error("Hata:", error);
                await reply.edit("❌ | Duyuru gönderimi sırasında bir hata oluştu.");
            }
        });

        collector.on("end", collected => {
            if (collected.size === 0) {
                interaction.followUp({ content: "<a:kum_saati:1304761981865037898> | Zaman aşımına uğradı. Lütfen tekrar deneyin.", ephemeral: true });
            }
        });
    },
};