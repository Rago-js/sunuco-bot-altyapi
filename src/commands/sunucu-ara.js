const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('sunucu-ara')
    .setDescription('Sunucu ID, davet bağlantısı veya isim kullanarak sunucu bilgilerini getirir.')
    .addStringOption(option =>
      option
        .setName('bağlam')
        .setDescription('Arama bağlamını seçin: "sunucu-id", "sunucu-davet" veya "sunucu-isim".')
        .setRequired(true)
        .addChoices(
          { name: 'Sunucu ID', value: 'id' },
          { name: 'Sunucu Davet', value: 'davet' },
          { name: 'Sunucu İsim', value: 'isim' }
        )
    )
    .addStringOption(option =>
      option
        .setName('değer')
        .setDescription('Sunucu ID, davet bağlantısı veya isim belirtin. Ancak botun bu sunucuda olduğundan emin olun.')
        .setRequired(true)
    ),

  async execute(interaction) {
    const bağlam = interaction.options.getString('bağlam');
    const değer = interaction.options.getString('değer');

    if (bağlam === 'id') {
      try {
        const guild = await interaction.client.guilds.fetch(değer);
        if (!guild) {
          return interaction.reply({
            content: 'Belirtilen ID ile eşleşen bir sunucu bulunamadı.',
            ephemeral: true
          });
        }

        const members = await guild.members.fetch();
        const botCount = members.filter(member => member.user.bot).size;
        const realUserCount = members.size - botCount;

        const channel = guild.systemChannelId
          ? guild.channels.cache.get(guild.systemChannelId)
          : guild.channels.cache.find(ch =>
              ch.isTextBased() &&
              ch.permissionsFor(guild.members.me).has(PermissionFlagsBits.CreateInstantInvite)
            );

        let inviteUrl = 'Davet bağlantısı oluşturulamadı.';
        if (channel) {
          const invite = await channel.createInvite({
            maxAge: 180,
            maxUses: 1,
            unique: true
          });
          inviteUrl = `[Tıkla ve Katıl](${invite.url})`;
        }

        const embed = new EmbedBuilder()
          .setColor('#0099ff')
          .setTitle('Sunucu Bilgileri')
          .setThumbnail(guild.iconURL({ dynamic: true }))
          .addFields(
            { name: 'Sunucu Adı', value: guild.name, inline: true },
            { name: 'Sunucu ID', value: guild.id, inline: true },
            { name: 'Toplam Üye Sayısı', value: `${members.size}`, inline: true },
            { name: 'Gerçek Üyeler', value: `${realUserCount}`, inline: true },
            { name: 'Bot Sayısı', value: `${botCount}`, inline: true },
            { name: 'Davet Bağlantısı', value: inviteUrl, inline: false }
          )
          .setFooter({ text: 'Davet bağlantısı 3 dakika geçerlidir.' })
          .setTimestamp();

        return interaction.reply({ embeds: [embed], ephemeral: true });
      } catch (error) {
        console.error(error);
        return interaction.reply({
          content: 'Bir hata oluştu veya geçersiz bir ID sağladınız. Botun bu sunucuda olduğundan emin olunuz.',
          ephemeral: true
        });
      }
    } else if (bağlam === 'davet') {
      try {
        const invite = await interaction.client.fetchInvite(değer);
        if (!invite) {
          return interaction.reply({
            content: 'Belirtilen davet bağlantısı geçerli değil.',
            ephemeral: true
          });
        }

        const guild = invite.guild;
        const members = await guild.members.fetch();
        const botCount = members.filter(member => member.user.bot).size;
        const realUserCount = members.size - botCount;

        const embed = new EmbedBuilder()
          .setColor('#0099ff')
          .setTitle('Sunucu Bilgileri')
          .setThumbnail(guild.iconURL({ dynamic: true }))
          .addFields(
            { name: 'Sunucu Adı', value: guild.name, inline: true },
            { name: 'Sunucu ID', value: guild.id, inline: true },
            { name: 'Toplam Üye Sayısı', value: `${members.size}`, inline: true },
            { name: 'Gerçek Üyeler', value: `${realUserCount}`, inline: true },
            { name: 'Bot Sayısı', value: `${botCount}`, inline: true },
            { name: 'Davet Bağlantısı', value: `[Tıkla ve Katıl](${invite.url})`, inline: false }
          )
          .setFooter({ text: 'Bu bilgiler davet bağlantısı kullanılarak alındı.' })
          .setTimestamp();

        return interaction.reply({ embeds: [embed], ephemeral: true });
      } catch (error) {
        console.error(error);
        return interaction.reply({
          content: 'Geçersiz bir davet bağlantısı sağladınız veya bir hata oluştu. Botun bu sunucuda olduğundan emin olunuz.',
          ephemeral: true
        });
      }
    } else if (bağlam === 'isim') {
      try {
        const guild = interaction.client.guilds.cache.find(g => g.name.toLowerCase() === değer.toLowerCase());
        if (!guild) {
          return interaction.reply({
            content: 'Belirtilen isimle eşleşen bir sunucu bulunamadı.',
            ephemeral: true
          });
        }

        const members = await guild.members.fetch();
        const botCount = members.filter(member => member.user.bot).size;
        const realUserCount = members.size - botCount;

        const channel = guild.systemChannelId
          ? guild.channels.cache.get(guild.systemChannelId)
          : guild.channels.cache.find(ch =>
              ch.isTextBased() &&
              ch.permissionsFor(guild.members.me).has(PermissionFlagsBits.CreateInstantInvite)
            );

        let inviteUrl = 'Davet bağlantısı oluşturulamadı.';
        if (channel) {
          const invite = await channel.createInvite({
            maxAge: 180,
            maxUses: 1,
            unique: true
          });
          inviteUrl = `[Tıkla ve Katıl](${invite.url})`;
        }

        const embed = new EmbedBuilder()
          .setColor('#0099ff')
          .setTitle('Sunucu Bilgileri')
          .setThumbnail(guild.iconURL({ dynamic: true }))
          .addFields(
            { name: 'Sunucu Adı', value: guild.name, inline: true },
            { name: 'Sunucu ID', value: guild.id, inline: true },
            { name: 'Toplam Üye Sayısı', value: `${members.size}`, inline: true },
            { name: 'Gerçek Üyeler', value: `${realUserCount}`, inline: true },
            { name: 'Bot Sayısı', value: `${botCount}`, inline: true },
            { name: 'Davet Bağlantısı', value: inviteUrl, inline: false }
          )
          .setFooter({ text: 'Bu bilgiler sunucu ismi kullanılarak alındı.' })
          .setTimestamp();

        return interaction.reply({ embeds: [embed], ephemeral: true });
      } catch (error) {
        console.error(error);
        return interaction.reply({
          content: 'Bir hata oluştu veya geçersiz bir isim sağladınız. Botun bu sunucuda olduğundan emin olunuz.',
          ephemeral: true
        });
      }
    } else {
      return interaction.reply({
        content: 'Geçersiz bir bağlam seçimi yaptınız.',
        ephemeral: true
      });
    }
  }
};