const { Client, Collection, GatewayIntentBits, Partials } = require("discord.js");
const { readdirSync } = require("fs");
const path = require("path");
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
require('dotenv').config();

const token = process.env.TOKEN || require('../src/config.js').token;

if (!token) {
  console.error("❌ Discord token bulunamadı. Lütfen .env dosyanızı veya config.js dosyanızı kontrol edin!");
  process.exit(1);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Message, Partials.Channel, Partials.GuildMember],
});

client.commands = new Collection();

const dayjs = require("dayjs");
const log = (l) => {
  console.log(`[${dayjs().format("DD-MM-YYYY HH:mm:ss")}] ${l}`);
};

const commands = [];
const commandsPath = path.join(__dirname, "../src/commands");
readdirSync(commandsPath).forEach(file => {
  const command = require(path.join(commandsPath, file));
  if (command.data) {
    commands.push(command.data.toJSON());
    client.commands.set(command.data.name, command);
  } else {
    console.error(`⚠️ Komut ${file} doğru şekilde tanımlanmamış.`);
  }
});

const eventsPath = path.join(__dirname, "../src/events");
readdirSync(eventsPath).forEach(file => {
  const event = require(path.join(eventsPath, file));
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
});

client.on("ready", async () => {
  try {
    const rest = new REST({ version: '10' }).setToken(token);
    await rest.put(Routes.applicationCommands(client.user.id), { body: commands });
    log(`${client.user.username} is now online!`);
  } catch (error) {
    console.error("⚠️ Komutları yüklerken bir hata oluştu:", error);
  }
});

client.login(token);
