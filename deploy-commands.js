require('dotenv').config();

module.exports = {
  token: process.env.TOKEN,
  clientId: process.env.CLIENT_ID,
  guildId: process.env.GUILD_ID,

  // Role hierarchy (highest to lowest)
  roles: {
    owner:      process.env.ROLE_OWNER,
    hr:         process.env.ROLE_HR,
    supervisor: process.env.ROLE_SUPERVISOR,
    dispatcher: process.env.ROLE_DISPATCHER,
    pilot:      process.env.ROLE_PILOT,
    crew:       process.env.ROLE_CREW,
    passenger:  process.env.ROLE_PASSENGER,
  },

  channels: {
    flights:     process.env.CHANNEL_FLIGHTS,
    bookingLog:  process.env.CHANNEL_BOOKING_LOG,
    staffLog:    process.env.CHANNEL_STAFF_LOG,
    gateInfo:    process.env.CHANNEL_GATE_INFO,
  },

  // Permission levels mapped to minimum role required
  permissions: {
    BOOK_FLIGHT:      ['passenger', 'crew', 'pilot', 'dispatcher', 'supervisor', 'hr', 'owner'],
    CREATE_FLIGHT:    ['dispatcher', 'supervisor', 'hr', 'owner'],
    EDIT_FLIGHT:      ['dispatcher', 'supervisor', 'hr', 'owner'],
    CANCEL_FLIGHT:    ['supervisor', 'hr', 'owner'],
    VIEW_BOOKINGS:    ['dispatcher', 'supervisor', 'hr', 'owner'],
    MANAGE_STAFF:     ['hr', 'owner'],
    MANAGE_ROLES:     ['hr', 'owner'],
    BOT_SETTINGS:     ['owner'],
    VIEW_STAFF_LIST:  ['supervisor', 'hr', 'owner'],
  },

  // Airline branding
  airline: {
    name: process.env.AIRLINE_NAME || 'SkyLink Airways',
    code: process.env.AIRLINE_CODE || 'SKL',
    color: 0x2B6CB0,  // Embed accent color (blue)
    logo:  process.env.AIRLINE_LOGO || null,
  },
};
