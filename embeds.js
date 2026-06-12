const fs   = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const FILES = {
  flights:  path.join(DATA_DIR, 'flights.json'),
  bookings: path.join(DATA_DIR, 'bookings.json'),
  staff:    path.join(DATA_DIR, 'staff.json'),
  settings: path.join(DATA_DIR, 'settings.json'),
};

// Ensure data directory and files exist
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
for (const [, filePath] of Object.entries(FILES)) {
  if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, '[]');
}

function load(file) {
  try {
    const raw = fs.readFileSync(file, 'utf8');
    return JSON.parse(raw);
  } catch { return []; }
}

function save(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// ─── Flights ──────────────────────────────────────────────────────────────────

const db = {
  // FLIGHTS
  getFlights: ()              => load(FILES.flights),
  getFlight:  (flightId)      => load(FILES.flights).find(f => f.id === flightId),
  getFlightByNumber: (num)    => load(FILES.flights).find(f => f.flightNumber === num.toUpperCase()),

  saveFlight(flight) {
    const flights = load(FILES.flights);
    const idx = flights.findIndex(f => f.id === flight.id);
    if (idx >= 0) flights[idx] = flight;
    else flights.push(flight);
    save(FILES.flights, flights);
  },

  deleteFlight(flightId) {
    const flights = load(FILES.flights).filter(f => f.id !== flightId);
    save(FILES.flights, flights);
  },

  getActiveFlights() {
    return load(FILES.flights).filter(f => ['scheduled', 'boarding', 'delayed'].includes(f.status));
  },

  // BOOKINGS
  getBookings: ()              => load(FILES.bookings),
  getBooking:  (bookingId)     => load(FILES.bookings).find(b => b.id === bookingId),
  getBookingsByUser: (userId)  => load(FILES.bookings).filter(b => b.userId === userId),
  getBookingsByFlight: (fId)   => load(FILES.bookings).filter(b => b.flightId === fId),

  saveBooking(booking) {
    const bookings = load(FILES.bookings);
    const idx = bookings.findIndex(b => b.id === booking.id);
    if (idx >= 0) bookings[idx] = booking;
    else bookings.push(booking);
    save(FILES.bookings, bookings);
  },

  deleteBooking(bookingId) {
    const bookings = load(FILES.bookings).filter(b => b.id !== bookingId);
    save(FILES.bookings, bookings);
  },

  // STAFF
  getStaff: ()             => load(FILES.staff),
  getStaffMember: (userId) => load(FILES.staff).find(s => s.userId === userId),

  saveStaffMember(member) {
    const staff = load(FILES.staff);
    const idx = staff.findIndex(s => s.userId === member.userId);
    if (idx >= 0) staff[idx] = member;
    else staff.push(member);
    save(FILES.staff, staff);
  },

  removeStaffMember(userId) {
    const staff = load(FILES.staff).filter(s => s.userId !== userId);
    save(FILES.staff, staff);
  },

  // SETTINGS
  getSettings() {
    try {
      const raw = fs.readFileSync(FILES.settings, 'utf8');
      return JSON.parse(raw);
    } catch { return {}; }
  },

  saveSetting(key, value) {
    const settings = this.getSettings();
    settings[key] = value;
    fs.writeFileSync(FILES.settings, JSON.stringify(settings, null, 2));
  },
};

module.exports = db;
