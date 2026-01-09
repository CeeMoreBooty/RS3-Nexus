# RS3 Nexus

An Enhanced Version of Alt1 for RuneScape 3

## Features

### 🌊 Deep Sea Hub Event Tracker

Track Deep Sea Hub events with real-time countdown timers and never miss an event again!

#### Key Features:
- **Live Countdown Timers** - Real-time countdowns that update every second
- **Current Event Display** - Shows active events with progress bars and time remaining
- **24-Hour Event Schedule** - View all upcoming events for the next day
- **Customizable Notifications** - Get browser notifications before events start
- **Event Information** - Detailed descriptions, rewards, and location info
- **Minimize/Expand Mode** - Compact view when you need more screen space
- **Dark Mode Support** - Matches your system theme preferences
- **Responsive Design** - Works on desktop and mobile devices

#### Event Types:
1. **Merchant's Arrival** - Special merchant with unique items and trades
2. **Resource Rush** - Increased resource gathering rates and bonus drops
3. **Combat Training** - Enhanced combat experience and training opportunities
4. **Community Gathering** - Social events with group activities and rewards

## Getting Started

### Prerequisites
- Node.js 16+ and npm

### Installation

```bash
# Clone the repository
git clone https://github.com/CeeMoreBooty/RS3-Nexus.git
cd RS3-Nexus

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Building for Production

```bash
# Build the app
npm run build

# Preview the production build
npm run preview
```

## Usage

### Dashboard View
Navigate to the main dashboard to see the Deep Sea Hub tracker along with welcome information and feature highlights.

### Standalone Tracker
Click on "Event Tracker" in the navigation to access the standalone tracker view with more focus on the events.

### Notifications
1. Click the ⚙️ settings button on the tracker
2. Enable notifications
3. Choose how far in advance you want to be notified (5, 10, 15, or 30 minutes)
4. Optionally enable sound alerts

**Note:** You'll need to grant browser notification permissions when prompted.

### Minimizing the Tracker
Click the ▲/▼ button to toggle between expanded and minimized views.

## Technical Details

### Architecture
- **Frontend Framework:** React 19 with TypeScript
- **Build Tool:** Vite
- **Routing:** React Router v7
- **Styling:** CSS with CSS Modules

### Project Structure
```
src/
├── components/
│   ├── DeepSeaHubTracker.tsx    # Main tracker component
│   ├── DeepSeaHubTracker.css    # Tracker styles
│   ├── Dashboard.tsx             # Dashboard component
│   └── Dashboard.css             # Dashboard styles
├── services/
│   ├── eventTimer.ts             # Event timing calculations
│   └── notifications.ts          # Browser notification service
├── utils/
│   └── constants.ts              # Event data and constants
├── App.tsx                       # Main app component with routing
├── main.tsx                      # Application entry point
└── index.css                     # Global styles
```

### Event Timing Logic
Events rotate on a fixed schedule with each event lasting 60 minutes and occurring every 180 minutes (3 hours). The rotation starts from a fixed reference point (midnight UTC on Jan 1, 2024) and cycles through all four events in sequence.

### Timer Accuracy
The timer updates every second using `setInterval` and properly cleans up on component unmount to prevent memory leaks. All time calculations account for timezone differences by using UTC timestamps.

### Browser Notifications
Utilizes the Web Notifications API for browser notifications. Notifications are triggered based on user preferences and persist in localStorage for convenience across sessions.

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run TypeScript type checking

### Adding New Events

To add or modify events, edit `src/utils/constants.ts`:

```typescript
export const DEEP_SEA_HUB_EVENTS: DeepSeaHubEvent[] = [
  {
    name: "Event Name",
    description: "Event description",
    duration: 60,      // Duration in minutes
    interval: 180,     // Time between event starts
    rewards: ["List", "of", "rewards"],
    location: "Event location"
  },
  // Add more events...
];
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by Alt1 Toolkit for RuneScape 3
- Built with React and TypeScript
- Uses Vite for fast development and building

## Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

**Note:** This is a community project and is not affiliated with or endorsed by Jagex Ltd.
