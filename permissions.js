const { EmbedBuilder } = require('discord.js');
const config = require('../config');

const COLOR = {
  primary: config.airline.color,
  success: 0x38A169,
  error:   0xE53E3E,
  warning: 0xD69E2E,
  info:    0x3182CE,
};

const STATUS_EMOJI = {
  scheduled: '🕐',
  boarding:  '🚪',
  departed:  '✈️',
  arrived:   '🛬',
  delayed:   '⏰',
  cancelled: '❌',
};

const CLASS_EMOJI = {
  economy:  '💺',
  business: '🛋️',
  first:    '👑',
};

function airlineEmbed(title, description) {
  return new EmbedBuilder()
    .setColor(COLOR.primary)
    .setTitle(title)
    .setDescription(description || null)
    .setFooter({ text: config.airline.name })
    .setTimestamp();
}

function successEmbed(title, description) {
  return new EmbedBuilder()
    .setColor(COLOR.success)
    .setTitle(`✅ ${title}`)
    .setDescription(description || null)
    .setFooter({ text: config.airline.name })
    .setTimestamp();
}

function errorEmbed(title, description) {
  return new EmbedBuilder()
    .setColor(COLOR.error)
    .setTitle(`❌ ${title}`)
    .setDescription(description || null);
}

function flightEmbed(flight) {
  const statusEmoji = STATUS_EMOJI[flight.status] || '❓';
  const embed = new EmbedBuilder()
    .setColor(flight.status === 'cancelled' ? COLOR.error : COLOR.primary)
    .setTitle(`${statusEmoji} Flight ${flight.flightNumber}`)
    .addFields(
      { name: '🛫 Departure',    value: `**${flight.departure}**\n${flight.departureTime}`, inline: true },
      { name: '🛬 Arrival',      value: `**${flight.arrival}**\n${flight.arrivalTime}`,     inline: true },
      { name: '📋 Status',       value: flight.status.charAt(0).toUpperCase() + flight.status.slice(1), inline: true },
      { name: '✈️ Aircraft',     value: flight.aircraft || 'TBD',    inline: true },
      { name: '🧑‍✈️ Pilot',      value: flight.pilotTag || 'TBD',    inline: true },
      { name: '🗺️ Gate',         value: flight.gate || 'TBD',        inline: true },
    )
    .setFooter({ text: `Flight ID: ${flight.id} • ${config.airline.name}` })
    .setTimestamp();

  // Seats summary
  const totalSeats  = (flight.seats?.economy || 0) + (flight.seats?.business || 0) + (flight.seats?.first || 0);
  const bookedSeats = (flight.booked?.economy || 0) + (flight.booked?.business || 0) + (flight.booked?.first || 0);
  embed.addFields({
    name: '💺 Seats',
    value: [
      `Economy: ${(flight.seats?.economy || 0) - (flight.booked?.economy || 0)}/${flight.seats?.economy || 0} available`,
      `Business: ${(flight.seats?.business || 0) - (flight.booked?.business || 0)}/${flight.seats?.business || 0} available`,
      `First: ${(flight.seats?.first || 0) - (flight.booked?.first || 0)}/${flight.seats?.first || 0} available`,
      `Total: ${totalSeats - bookedSeats}/${totalSeats} available`,
    ].join('\n'),
  });

  if (flight.notes) embed.addFields({ name: '📝 Notes', value: flight.notes });

  return embed;
}

function bookingEmbed(booking, flight) {
  return new EmbedBuilder()
    .setColor(COLOR.success)
    .setTitle('🎫 Booking Confirmation')
    .addFields(
      { name: 'Booking ID',   value: `\`${booking.id}\``,           inline: true },
      { name: 'Flight',       value: flight.flightNumber,            inline: true },
      { name: 'Class',        value: `${CLASS_EMOJI[booking.class]} ${booking.class.charAt(0).toUpperCase() + booking.class.slice(1)}`, inline: true },
      { name: '🛫 From',      value: flight.departure,               inline: true },
      { name: '🛬 To',        value: flight.arrival,                 inline: true },
      { name: '🕐 Departs',   value: flight.departureTime,           inline: true },
      { name: 'Gate',         value: flight.gate || 'TBD',           inline: true },
      { name: 'Seat',         value: booking.seat || 'Assigned at gate', inline: true },
    )
    .setFooter({ text: `${config.airline.name} • Thank you for flying with us!` })
    .setTimestamp(new Date(booking.bookedAt));
}

module.exports = {
  COLOR, STATUS_EMOJI, CLASS_EMOJI,
  airlineEmbed, successEmbed, errorEmbed, flightEmbed, bookingEmbed,
};
