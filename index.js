require('dotenv').config();
const { Client, GatewayIntentBits, Collection, Events } = require('discord.js');
const config = require('./config');

// ── Command imports ──────────────────────────────────────────────────────────
const { createFlight, listFlights, flightInfo, updateFlight, cancelFlight }
  = require('./commands/flights/flightCommands');
const { bookFlight, myBookings, cancelBooking, viewBookings }
  = require('./commands/flights/bookingCommands');
const { hire, fire, promote, staffList, staffInfo }
  = require('./commands/staff/staffCommands');
const { setup, givePassengerRole, airlineInfo, stats, clearCancelled }
  = require('./commands/admin/adminCommands');

// ── Create client ────────────────────────────────────────────────────────────
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
  ],
});

// ── Register commands ────────────────────────────────────────────────────────
client.commands = new Collection();

const allCommands = [
  createFlight, listFlights, flightInfo, updateFlight, cancelFlight,
  bookFlight, myBookings, cancelBooking, viewBookings,
  hire, fire, promote, staffList, staffInfo,
  setup, givePassengerRole, airlineInfo, stats, clearCancelled,
];

for (const cmd of allCommands) {
  client.commands.set(cmd.data.name, cmd);
}

// ── Ready event ──────────────────────────────────────────────────────────────
client.once(Events.ClientReady, (c) => {
  console.log(`\n✅ ${config.airline.name} Bot is online!`);
  console.log(`   Logged in as: ${c.user.tag}`);
  console.log(`   Commands loaded: ${client.commands.size}`);
  console.log(`   Server ID: ${config.guildId}`);

  c.user.setPresence({
    activities: [{ name: `${config.airline.name} | /airline`, type: 3 }], // Watching
    status: 'online',
  });
});

// ── Interaction handler ───────────────────────────────────────────────────────
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(`❌ Error in command /${interaction.commandName}:`, error);

    const errMsg = {
      content: '❌ An error occurred while running this command. Please contact an administrator.',
      ephemeral: true,
    };

    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(errMsg).catch(() => {});
    } else {
      await interaction.reply(errMsg).catch(() => {});
    }
  }
});

// ── Error handling ────────────────────────────────────────────────────────────
client.on('error', (err) => console.error('Discord client error:', err));
process.on('unhandledRejection', (err) => console.error('Unhandled promise rejection:', err));

// ── Login ─────────────────────────────────────────────────────────────────────
if (!config.token) {
  console.error('❌ No TOKEN found in .env! Copy .env.example to .env and fill it out.');
  process.exit(1);
}

client.login(config.token);
