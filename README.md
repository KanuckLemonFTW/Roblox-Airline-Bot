# ✈️ Roblox Airline Discord Bot

A full-featured Discord bot for managing a Roblox airline — flights, bookings, staff, and permissions all in one place.

---

## 📦 Installation

### Prerequisites
- [Node.js](https://nodejs.org/) v18 or higher
- A Discord bot application ([create one here](https://discord.com/developers/applications))

### Steps

```bash
# 1. Install dependencies
npm install

# 2. Set up your config
cp .env.example .env
# Edit .env with your values (see below)

# 3. Register slash commands with Discord
npm run deploy

# 4. Start the bot
npm start
```

---

## ⚙️ Configuration (`.env`)

Copy `.env.example` to `.env` and fill in:

| Variable | Description |
|---|---|
| `TOKEN` | Your bot token from Discord Developer Portal |
| `CLIENT_ID` | Your application's client/app ID |
| `GUILD_ID` | Your Discord server ID |
| `ROLE_OWNER` | Role ID for Airline Owner |
| `ROLE_HR` | Role ID for HR Managers |
| `ROLE_SUPERVISOR` | Role ID for Supervisors |
| `ROLE_DISPATCHER` | Role ID for Flight Dispatchers |
| `ROLE_PILOT` | Role ID for Pilots |
| `ROLE_CREW` | Role ID for Cabin Crew |
| `ROLE_PASSENGER` | Role ID for Passengers (bookers) |
| `CHANNEL_FLIGHTS` | Channel ID for flight announcements |
| `CHANNEL_BOOKING_LOG` | Channel ID for booking logs (staff only) |
| `CHANNEL_STAFF_LOG` | Channel ID for staff activity logs |
| `CHANNEL_GATE_INFO` | Channel ID for gate info |

### Tip: Getting IDs
Enable **Developer Mode** in Discord settings → right-click any role/channel → **Copy ID**.

---

## 🎭 Role Hierarchy & Permissions

| Role | Level | Can Do |
|---|---|---|
| 👑 Owner | 7 | Everything |
| 👔 HR Manager | 6 | Manage staff, roles, flights |
| 🔍 Supervisor | 5 | Cancel flights, view staff |
| 📋 Dispatcher | 4 | Create & edit flights |
| 🧑‍✈️ Pilot | 3 | Book flights |
| ✈️ Cabin Crew | 2 | Book flights |
| 💺 Passenger | 1 | Book flights |

---

## 📋 Commands

### ✈️ Flight Commands
| Command | Permission | Description |
|---|---|---|
| `/createflight` | Dispatcher+ | Create a new flight with all details |
| `/listflights` | Everyone | View all active/scheduled flights |
| `/flightinfo` | Everyone | View detailed info on a flight |
| `/updateflight` | Dispatcher+ | Update status, gate, pilot, etc. |
| `/cancelflight` | Supervisor+ | Cancel a flight (with confirmation) |

### 🎫 Booking Commands
| Command | Permission | Description |
|---|---|---|
| `/book` | Passenger+ | Book economy/business/first on a flight |
| `/mybookings` | Everyone | View your current bookings |
| `/cancelbooking` | Everyone | Cancel one of your bookings |
| `/viewbookings` | Dispatcher+ | View all passenger bookings on a flight |

### 👥 Staff Commands
| Command | Permission | Description |
|---|---|---|
| `/hire` | HR+ | Hire a user and assign their role |
| `/fire` | HR+ | Remove a staff member |
| `/promote` | HR+ | Change a staff member's position |
| `/stafflist` | Supervisor+ | View all staff members by rank |
| `/staffinfo` | Supervisor+ | View a staff member's profile |

### ⚙️ Admin Commands
| Command | Permission | Description |
|---|---|---|
| `/airline` | Everyone | View airline overview & quick commands |
| `/setup` | Admin only | View bot configuration status |
| `/giverole` | HR+ | Give the Passenger role to a user |
| `/stats` | Dispatcher+ | View airline statistics |
| `/clearcancelled` | HR+ | Remove cancelled flights from DB |

---

## 📁 Project Structure

```
airline-bot/
├── index.js              # Bot entry point
├── config.js             # Config & env loading
├── deploy-commands.js    # Register slash commands
├── .env.example          # Config template
├── commands/
│   ├── flights/
│   │   ├── flightCommands.js   # Create, list, update, cancel flights
│   │   └── bookingCommands.js  # Book, view, cancel bookings
│   ├── staff/
│   │   └── staffCommands.js    # Hire, fire, promote, list staff
│   └── admin/
│       └── adminCommands.js    # Setup, stats, admin tools
├── utils/
│   ├── db.js             # JSON file database
│   ├── permissions.js    # Permission checking helpers
│   └── embeds.js         # Embed builder helpers
└── data/                 # Auto-created JSON databases
    ├── flights.json
    ├── bookings.json
    ├── staff.json
    └── settings.json
```

---

## 🔧 Recommended Discord Server Setup

Create these roles in order (Discord uses order for hierarchy):
1. ✈️ **Airline Owner**
2. 👔 **HR Manager**
3. 🔍 **Supervisor**
4. 📋 **Flight Dispatcher**
5. 🧑‍✈️ **Pilot**
6. ✈️ **Cabin Crew**
7. 💺 **Passenger**

Create these channels (suggest a category `✈️ AIRLINE`):
- `#flight-schedules` — flight announcements
- `#gate-info` — gate information
- `#booking-log` (staff only) — booking records
- `#staff-log` (staff only) — hire/fire/flight logs

---

## 💾 Data Storage

All data is stored locally as JSON files in `/data/`. For a production bot, consider replacing `utils/db.js` with a real database (SQLite, MongoDB, or PostgreSQL).

---

## 🤖 Bot Permissions Required

When adding the bot to your server, it needs:
- `Send Messages`
- `Embed Links`
- `Read Message History`
- `Manage Roles` (for hire/fire/promote)
- `Use Slash Commands`

Use this OAuth2 scope when inviting: `bot` + `applications.commands`
