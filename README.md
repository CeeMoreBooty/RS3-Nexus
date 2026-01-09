# ⚔️ RS3 Nexus

**A Highly Enhanced Alt1 Toolkit for RuneScape 3**

RS3 Nexus is a comprehensive desktop application built with Electron, React, and TypeScript that provides powerful tools for RuneScape 3 players. It features real-time price checking, instant clue solving, wiki integration, and Discord notifications.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## ✨ Features

### 💰 Enhanced Price Checker
- **Real-time price updates** from RS Wiki API and GE tracker
- **Price history charts** with interactive graphs (7, 30, 90 days, 1 year)
- **Advanced profit calculations**:
  - Buy limit tracking
  - Margin calculator with GE tax calculations
  - ROI (Return on Investment) calculator
  - Flip timer estimates
- **Bulk price checking** - check multiple items simultaneously
- **Price alerts** - set target buy/sell prices with notifications
- **Trending items** - view most traded/profitable items
- **Favorites system** - save frequently checked items for quick access
- **Data export** - export price data in CSV/JSON format
- **Auto-refresh** - configurable automatic price updates

### 🗺️ Highly Enhanced Clue Solver
- **Instant solve times** (< 100ms for all clue types)
- **All clue types supported**:
  - Anagrams with fuzzy matching
  - Coordinates with map locations
  - Cryptic clues with keyword detection
  - Puzzle boxes with step-by-step solutions
  - Scan clues with precise locations
  - Map clues
  - Emote clues with requirements
- **Clue tracker** - track your clue scroll progress and rewards
- **Optimal route suggestions** with teleport recommendations
- **Equipment requirements** checker
- **Reward statistics** - analyze your clue scroll loot

### 📚 Wiki Integration
- **In-app wiki browser** with full search functionality
- **Quick lookup** - instant wiki information
- **Item and monster database** integration
- **Autocomplete suggestions** for faster searching
- **Bookmarking system** - save your favorite wiki pages
- **Recent searches** history
- **Offline caching** for frequently accessed pages

### 💬 Discord Integration
- **Webhook notifications** for:
  - Price alerts
  - Clue scroll completions
  - Game events
- **Rich presence** (planned) - show your activity
- **Discord bot commands** (planned):
  - `/price <item>` - check item prices
  - `/clue <text>` - solve clue scrolls
  - `/wiki <query>` - search wiki
  - `/event` - check upcoming events

### 🎨 Additional Features
- **Modern UI/UX** with smooth animations
- **Dark/Light theme** support
- **Keyboard shortcuts** for major features
- **Performance optimized** with React.memo and lazy loading
- **Responsive design** - works on all screen sizes

## 🚀 Installation

### Prerequisites
- Node.js 18+ and npm

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
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## 📖 Usage

### Price Checker
1. Navigate to the **Price Checker** tab
2. Enter an item name in the search box
3. View current price, daily change, and buy limit
4. Click **Show Price History** to see historical data
5. Use **Calculate Margin** to compute profit margins
6. Set price alerts for automated notifications
7. Add items to favorites for quick access

### Clue Solver
1. Navigate to the **Clue Solver** tab
2. Enter or paste your clue text
3. Click **Solve Clue** to get instant solution
4. View location, teleport suggestions, and requirements
5. Add completed clues to tracker for statistics

### Wiki Browser
1. Navigate to the **Wiki** tab
2. Search for items, monsters, quests, or guides
3. Click on results to view full wiki pages
4. Bookmark pages for quick access later
5. Use quick links for common searches

### Discord Integration
1. Navigate to **Settings** → **Discord Integration**
2. Enable Discord Integration
3. Create a webhook in your Discord server:
   - Server Settings → Integrations → Webhooks → New Webhook
   - Copy the webhook URL
4. Paste webhook URL in RS3 Nexus settings
5. Test the connection
6. Configure notification preferences

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript
- **Desktop**: Electron
- **Build Tool**: Vite
- **Charts**: Chart.js + react-chartjs-2
- **Fuzzy Search**: Fuse.js
- **HTTP Client**: Axios
- **Date Utilities**: date-fns
- **Styling**: CSS3 with modern features

## 📊 Performance

- **Clue solving**: < 100ms for all clue types
- **Price lookup**: Cached results for instant access
- **Memory efficient**: Optimized with React.memo and lazy loading
- **Fast startup**: Code splitting for faster initial load

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 Planned Features

- [ ] OCR integration for screenshot clue detection
- [ ] Screen overlay mode
- [ ] Web Worker for puzzle solving
- [ ] A* pathfinding for optimal routes
- [ ] Discord Rich Presence
- [ ] Full Discord bot with commands
- [ ] Real-time WebSocket price updates
- [ ] More advanced price analytics
- [ ] Quest guide integration
- [ ] Skill calculators

## ⚠️ Disclaimer

This tool is not affiliated with or endorsed by Jagex. RuneScape is a registered trademark of Jagex Ltd. Use at your own discretion. This is a third-party tool designed to enhance your gaming experience.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- RuneScape Wiki API for data
- Alt1 Toolkit for inspiration
- The RS3 community for feedback and support

## 📞 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check existing issues for solutions

---

**Made with ❤️ for the RuneScape 3 community**
