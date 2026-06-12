const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { checkPerm } = require('../../utils/permissions');
const { successEmbed, errorEmbed, airlineEmbed } = require('../../utils/embeds');
const db     = require('../../utils/db');
const config = require('../../config');

// ─── /setup ───────────────────────────────────────────────────────────────────
const setup = {
  data: new SlashCommandBuilder()
    .setName('setup')
    .setDescription('[Owner] Display setup guide for the bot')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const roles    = config.roles;
    const channels = config.channels;

    const roleStatus = (key) => {
      const id = roles[key];
      return id ? `✅ <@&${id}>` : '❌ Not configured';
    };
    const chStatus = (key) => {
      const id = channels[key];
      return id ? `✅ <#${id}>` : '❌ Not configured';
    };

    const embed = airlineEmbed(
      `⚙️ ${config.airline.name} — Bot Setup`,
      'Below is the current configuration status. Edit your `.env` file to update.\n\n**Restart the bot after making changes!**'
    )
    .addFields(
      {
        name: '👥 Roles',
        value: [
          `Owner:      ${roleStatus('owner')}`,
          `HR:         ${roleStatus('hr')}`,
          `Supervisor: ${roleStatus('supervisor')}`,
          `Dispatcher: ${roleStatus('dispatcher')}`,
          `Pilot:      ${roleStatus('pilot')}`,
          `Crew:       ${roleStatus('crew')}`,
          `Passenger:  ${roleStatus('passenger')}`,
        ].join('\n'),
      },
      {
        name: '📢 Channels',
        value: [
          `Flights:     ${chStatus('flights')}`,
          `Booking Log: ${chStatus('bookingLog')}`,
          `Staff Log:   ${chStatus('staffLog')}`,
          `Gate Info:   ${chStatus('gateInfo')}`,
        ].join('\n'),
      },
      {
        name: '✈️ Airline',
        value: `Name: **${config.airline.name}**\nCode: **${config.airline.code}**`,
      }
    );

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};

// ─── /setrole ─────────────────────────────────────────────────────────────────
// Allows giving a user the passenger role so they can book flights
const givePassengerRole = {
  data: new SlashCommandBuilder()
    .setName('giverole')
    .setDescription('[Staff] Give a user the passenger role so they can book flights')
    .addUserOption(o => o.setName('user').setDescription('User to give role to').setRequired(true)),

  async execute(interaction) {
    if (!await checkPerm(interaction, 'MANAGE_ROLES')) return;

    const target = interaction.options.getMember('user');
    const roleId = config.roles.passenger;

    if (!roleId) {
      return interaction.reply({ embeds: [errorEmbed('Config Error', 'Passenger role ID not set in `.env`.')], ephemeral: true });
    }

    if (target.roles.cache.has(roleId)) {
      return interaction.reply({ embeds: [errorEmbed('Already Has Role', `<@${target.id}> already has the Passenger role.`)], ephemeral: true });
    }

    await target.roles.add(roleId);
    await interaction.reply({ embeds: [successEmbed('Role Given', `<@${target.id}> has been given the **Passenger** role and can now book flights.`)] });
  },
};

// ─── /airline ─────────────────────────────────────────────────────────────────
const airlineInfo = {
  data: new SlashCommandBuilder()
    .setName('airline')
    .setDescription('View information about the airline'),

  async execute(interaction) {
    const flights  = db.getActiveFlights();
    const staff    = db.getStaff();
    const bookings = db.getBookings().filter(b => b.status !== 'cancelled');

    const embed = airlineEmbed(
      `✈️ ${config.airline.name}`,
      `Welcome to **${config.airline.name}**! Here's a quick overview.`
    )
    .addFields(
      { name: '🛫 Active Flights',    value: String(flights.length),  inline: true },
      { name: '👥 Staff Members',     value: String(staff.length),    inline: true },
      { name: '🎫 Total Bookings',    value: String(bookings.length), inline: true },
      { name: '✈️ Airline Code',      value: config.airline.code,     inline: true },
    )
    .addFields({
      name: '📋 Commands',
      value: [
        '`/listflights` — View all active flights',
        '`/flightinfo` — View details of a flight',
        '`/book` — Book a seat on a flight',
        '`/mybookings` — View your bookings',
        '`/cancelbooking` — Cancel a booking',
      ].join('\n'),
    });

    await interaction.reply({ embeds: [embed] });
  },
};

// ─── /stats ───────────────────────────────────────────────────────────────────
const stats = {
  data: new SlashCommandBuilder()
    .setName('stats')
    .setDescription('[Staff] View airline statistics'),

  async execute(interaction) {
    if (!await checkPerm(interaction, 'VIEW_BOOKINGS')) return;

    const allFlights  = db.getFlights();
    const allBookings = db.getBookings();
    const allStaff    = db.getStaff();

    const flightsByStatus = {};
    for (const f of allFlights) {
      flightsByStatus[f.status] = (flightsByStatus[f.status] || 0) + 1;
    }

    const totalSeats   = allBookings.filter(b => b.status !== 'cancelled').length;
    const economyCount = allBookings.filter(b => b.class === 'economy'  && b.status !== 'cancelled').length;
    const bizCount     = allBookings.filter(b => b.class === 'business' && b.status !== 'cancelled').length;
    const firstCount   = allBookings.filter(b => b.class === 'first'    && b.status !== 'cancelled').length;

    const embed = airlineEmbed('📊 Airline Statistics')
      .addFields(
        { name: '✈️ Total Flights',    value: String(allFlights.length),  inline: true },
        { name: '👥 Total Staff',      value: String(allStaff.length),    inline: true },
        { name: '🎫 Total Bookings',   value: String(totalSeats),         inline: true },
        {
          name: 'Flights by Status',
          value: Object.entries(flightsByStatus).map(([s, c]) => `${s}: ${c}`).join('\n') || 'None',
          inline: true,
        },
        {
          name: 'Bookings by Class',
          value: `💺 Economy: ${economyCount}\n🛋️ Business: ${bizCount}\n👑 First: ${firstCount}`,
          inline: true,
        },
      );

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};

// ─── /clearcancelledflights ───────────────────────────────────────────────────
const clearCancelled = {
  data: new SlashCommandBuilder()
    .setName('clearcancelled')
    .setDescription('[HR] Remove all cancelled flights from the database'),

  async execute(interaction) {
    if (!await checkPerm(interaction, 'MANAGE_STAFF')) return;

    const flights   = db.getFlights();
    const cancelled = flights.filter(f => f.status === 'cancelled');

    for (const f of cancelled) db.deleteFlight(f.id);

    await interaction.reply({ embeds: [successEmbed('Cleared', `Removed **${cancelled.length}** cancelled flight(s) from the database.`)] });
  },
};

module.exports = { setup, givePassengerRole, airlineInfo, stats, clearCancelled };
