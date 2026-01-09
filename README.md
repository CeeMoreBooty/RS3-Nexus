# RS3 Nexus - Price Checker

A modern, real-time Grand Exchange price checker for RuneScape 3. Built with React, TypeScript, and Vite, this tool provides accurate item prices and market information using the RuneScape Wiki API.

## Features

- 🔍 **Real-time Price Search**: Search for any tradeable RS3 item and get current Grand Exchange prices
- 💰 **Buy/Sell Prices**: View both high (buy) and low (sell) prices for accurate trading
- 📊 **Margin Calculator**: Calculate potential profit margins instantly
- ⚡ **Fast & Responsive**: Optimized performance with caching and debounced search
- 🎨 **Modern UI**: Clean, intuitive interface with gradient design
- 📱 **Mobile Friendly**: Fully responsive design that works on all devices

## Technology Stack

- **React 19** - Modern UI library
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **RuneScape Wiki API** - Real-time price data via Weird Gloop API

## API Integration

This application uses the **Weird Gloop API** (api.weirdgloop.org) to fetch RuneScape 3 Grand Exchange data:

### API Endpoints Used

- **Latest Prices**: `https://api.weirdgloop.org/exchange/history/rs/latest`
- **Item Mapping**: `https://api.weirdgloop.org/exchange/history/rs/mapping`
- **Price History**: `https://api.weirdgloop.org/exchange/history/rs/{itemId}.json`

### Data Attribution

All price data is provided by the [RuneScape Wiki](https://runescape.wiki) through their public API. This tool is not affiliated with Jagex or RuneScape.

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/CeeMoreBooty/RS3-Nexus.git
cd RS3-Nexus
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Demo Mode

For testing without API access, enable demo mode by creating/editing `.env`:

```bash
VITE_DEMO_MODE=true
```

Demo mode uses mock data for 5 sample items. Remove the file or set to `false` for production.

### Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Usage

1. **Search for Items**: Type the name of any tradeable item in the search bar
2. **Select an Item**: Click on an item from the search results
3. **View Prices**: See the current buy and sell prices, along with margin calculations
4. **Refresh Prices**: Click the refresh button to get the latest prices

## Features Explained

### Caching System

The application implements intelligent caching to minimize API calls:
- Price data cached for 1 minute
- Item mappings cached for 24 hours
- Automatic cache invalidation

### Search Functionality

- Debounced search (300ms) to reduce API calls
- Fuzzy matching for better results
- Shows top 50 matches
- Displays member status and item descriptions

### Margin Calculator

Automatically calculates:
- Absolute profit margin (buy price - sell price)
- Percentage margin
- Helps identify profitable trading opportunities

## Development

### Project Structure

```
src/
├── components/        # React components
│   ├── PriceChecker.tsx
│   └── PriceChecker.css
├── services/         # API and cache services
│   ├── apiService.ts
│   └── cacheService.ts
├── types/           # TypeScript interfaces
│   └── api.ts
├── utils/           # Helper functions
│   ├── constants.ts
│   └── helpers.ts
└── main.tsx         # Application entry point
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## API Rate Limiting

The application implements:
- Request retry logic (3 retries with 1s delay)
- Request timeout (5 seconds)
- Caching to reduce API load
- Custom User-Agent header for identification

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the Apache License 2.0 - see the LICENSE file for details.

## Disclaimer

This tool is not affiliated with, endorsed by, or in any way officially connected with Jagex Limited or RuneScape. All product names, logos, and brands are property of their respective owners.

Price data is indicative and may not reflect actual trading prices in-game. Always verify prices before making trades.

## Acknowledgments

- [RuneScape Wiki](https://runescape.wiki) for providing the API
- [Weird Gloop](https://weirdgloop.org) for maintaining the API infrastructure
- [DailyScape](https://dailyscape.github.io) for inspiration

## Support

If you encounter any issues or have questions, please [open an issue](https://github.com/CeeMoreBooty/RS3-Nexus/issues) on GitHub.
