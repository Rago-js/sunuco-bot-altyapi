const { ActivityType } = require("discord.js");

module.exports = {
  name: 'ready',
  once: true,
  execute(client) {
    client.user.setPresence({
      activities: [
        {
          name: "𝐒𝐮𝐧𝐮𝐜𝐨 𝐃𝐮𝐲𝐮𝐫𝐮",
          type: ActivityType.Streaming,
          url: "https://www.twitch.tv/2348724"
        }
      ],
      setStatus: 'idle'
    });
  }
}; 