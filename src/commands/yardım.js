const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('yardım')
    .setDescription('Botun komutları hakkında bilgi alırsınız.'),
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor(0x00AE86)
      .setTitle('Sunuco Yardım Menüsü')
      .setDescription('Aşağıda botun mevcut komutlarını bulabilirsiniz:')
      .addFields(
        { name: '<a:ok:1329739989902426133> /bot-bilgi', value: 'Sunucu hakkında bilgi alırsınız.', inline: false },
        { name: '<a:ok:1329739989902426133> /destek', value: 'Sunucu desteğe nasıl ulaşacağınızı öğrenirsiniz.', inline: false },
        { name: '<a:ok:1329739989902426133> /duyuru', value: 'Belirtilen kanala mesaj ve isteğe bağlı olarak etiket ile duyuru yaparsınız.', inline: false },
        { name: '<a:ok:1329739989902426133> /duyuru-dm', value: 'Sunucunuzdaki bütün üyelerinize DM üzerinden duyuru yaparsınız ([Kullanım Koşulları ve Gizlilik Politikamız](https://sites.google.com/view/sunucoduyuru/ana-sayfa)\'ı okumadan kullanmayınız!).', inline: false },
        { name: '<a:ok:1329739989902426133> /ping', value: 'Botun ping değerini öğrenirsiniz.', inline: false },
        { name: '<a:ok:1329739989902426133> /sunucu-ara', value: 'Belirtilen Sunucu İsmi, Sunucu ID veya Sunucu Davet ile sunucunun birçok bilgisine ulaşabilirsiniz. (Belirtilen sunucularda botun olduğundan emin olun!)', inline: false }
      )
      .setFooter({ text: 'Sunuco Bot | Tüm Hakları Saklıdır.' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: false });
  },
};