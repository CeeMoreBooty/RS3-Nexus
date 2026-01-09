# RS3-Nexus

An Enhanced Version of Alt1 for RuneScape 3 - A powerful desktop companion application built with Electron, React, and TypeScript.

![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg)

## 🎮 Features

### 📊 Dashboard
- Quick overview of your active tasks
- Statistics on completed tasks
- Quick access to all tools
- Recent activity tracking

### 💰 Price Checker
- Real-time Grand Exchange price lookup
- Price history tracking
- Profit margin calculator
- Price alerts system
- Integration with RS3 Wiki API

### ✅ Task Manager
- Create and track goals
- XP progress tracking
- Skill-based task organization
- Progress bars and notifications
- Task completion tracking

### ⚔️ Combat Helper
- DPS calculator for all combat styles
- Combat level calculator
- Ability damage calculator
- Boss mechanics reference
- Combat stats optimization

### 🗺️ Clue Solver
- Anagram solver
- Coordinate clue solver
- Common clue reference library
- Quick lookup for puzzle solutions

### ⚙️ Settings
- Window customization (always-on-top, opacity)
- Notification preferences
- Theme selection
- Data management

## 🚀 Installation

### Prerequisites
- Node.js 18+ and npm
- Git

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/CeeMoreBooty/RS3-Nexus.git
   cd RS3-Nexus
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run in development mode**
   ```bash
   npm run electron:dev
   ```

4. **Build for production**
   ```bash
   npm run electron:build
   ```

## 🛠️ Development

### Project Structure

```
rs3-nexus/
├── electron/                    # Electron main process
│   ├── main.js                 # Main process entry
│   ├── preload.js              # Preload script for security
│   └── package.json            # Electron config
│
├── src/
│   ├── App.tsx                 # Main React app
│   ├── App.css                 # App styles
│   ├── index.tsx               # Entry point
│   ├── index.css               # Global styles
│   │
│   ├── components/             # UI components
│   │   ├── Dashboard.tsx       # Main dashboard
│   │   ├── PriceChecker.tsx    # GE price tool
│   │   ├── TaskManager.tsx     # Goal tracker
│   │   ├── CombatHelper.tsx    # Combat tools
│   │   ├── ClueSolver.tsx      # Clue solver
│   │   └── Settings.tsx        # App settings
│   │
│   ├── services/               # Backend logic
│   │   ├── screenCapture.ts    # Screen reading
│   │   ├── api.ts              # API calls
│   │   ├── database.ts         # Local storage
│   │   └── notifications.ts    # Alert system
│   │
│   └── utils/                  # Helpers
│       ├── parsers.ts          # Game data parsing
│       ├── calculators.ts      # Math/stats
│       └── constants.ts        # Game constants
│
├── public/
│   ├── index.html              # HTML template
│   └── assets/                 # Images, icons
│
├── package.json                # Dependencies
├── tsconfig.json               # TypeScript config
├── vite.config.ts              # Build config
└── README.md                   # Documentation
```

### Available Scripts

- `npm run dev` - Start Vite dev server
- `npm run build` - Build React app for production
- `npm run preview` - Preview production build
- `npm run electron:dev` - Run Electron in development mode
- `npm run electron:build` - Build Electron app for distribution

### Technology Stack

- **Electron** - Desktop application framework
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Navigation
- **IndexedDB (idb)** - Local data storage
- **Axios** - HTTP client for API calls

## 📚 API Usage

### RS3 Wiki Price API

The application integrates with the RS3 Wiki price API to fetch Grand Exchange prices:

```typescript
import { apiService } from './services/api'

// Get item price by ID
const price = await apiService.getItemPrice(995) // Coins

// Get latest prices for all items
const prices = await apiService.getLatestPrices()

// Calculate flip margins
const margins = await apiService.getFlipMargins([995, 1511, 2349])
```

### Database Service

Local data is stored using IndexedDB:

```typescript
import { database } from './services/database'

// Initialize database
await database.init()

// Add a task
await database.addTask({
  id: '1',
  title: 'Get 99 Fishing',
  description: 'Fish sharks at Living Rock Caverns',
  skill: 'Fishing',
  currentXp: 1000000,
  targetLevel: 99,
  status: 'active',
  createdAt: Date.now()
})

// Get all tasks
const tasks = await database.getAllTasks()
```

### Notification Service

Show notifications to users:

```typescript
import { notifications } from './services/notifications'

// Show custom notification
await notifications.show({
  title: 'Task Complete!',
  body: 'You completed: Get 99 Fishing',
  type: 'TASK_COMPLETE'
})

// Show level up notification
await notifications.notifyLevelUp('Fishing', 99)
```

## 🎨 Customization

### Theme Colors

The app uses CSS custom properties for theming. Edit `src/index.css`:

```css
:root {
  --bg-primary: #1a1a2e;
  --bg-secondary: #16213e;
  --bg-tertiary: #0f3460;
  --accent-primary: #e94560;
  --accent-secondary: #533483;
  --text-primary: #eee;
  --text-secondary: #aaa;
}
```

### Adding New Features

1. Create a new component in `src/components/`
2. Add a route in `src/App.tsx`
3. Create supporting services if needed
4. Update navigation menu

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style

- Use TypeScript for all new code
- Follow existing code formatting
- Add comments for complex logic
- Keep components focused and reusable

## 📝 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- RuneScape 3 Wiki for API access
- Alt1 Toolkit for inspiration
- Jagex for creating RuneScape

## 📞 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check existing issues for solutions

## 🔒 Security

- No remote code execution
- Secure IPC communication via context isolation
- Local data storage only
- No sensitive data stored in plain text

## 🗺️ Roadmap

- [ ] OCR for screen text reading
- [ ] More clue scroll puzzle types
- [ ] Boss timer overlay
- [ ] Drop tracker
- [ ] XP tracker with graphs
- [ ] Light theme support
- [ ] Custom notification sounds
- [ ] Plugin system for community extensions

---

**Note**: This application is a third-party tool and is not affiliated with or endorsed by Jagex Ltd. Use at your own discretion.
