// Game constants and configurations

// XP Table for levels 1-99 and 120
export const XP_TABLE: number[] = [
  0, 0, 83, 174, 276, 388, 512, 650, 801, 969, 1154, 1358, 1584, 1833, 2107,
  2411, 2746, 3115, 3523, 3973, 4470, 5018, 5624, 6291, 7028, 7842, 8740, 9730,
  10824, 12031, 13363, 14833, 16456, 18247, 20224, 22406, 24815, 27473, 30408,
  33648, 37224, 41171, 45529, 50339, 55649, 61512, 67983, 75127, 83014, 91721,
  101333, 111945, 123660, 136594, 150872, 166636, 184040, 203254, 224466, 247886,
  273742, 302288, 333804, 368599, 407015, 449428, 496254, 547953, 605032, 668051,
  737627, 814445, 899257, 992895, 1096278, 1210421, 1336443, 1475581, 1629200,
  1798808, 1986068, 2192818, 2421087, 2673114, 2951373, 3258594, 3597792, 3972294,
  4385776, 4842295, 5346332, 5902831, 6517253, 7195629, 7944614, 8771558, 9684577,
  10692629, 11805606, 13034431, 14391160, 15889109, 17542976, 19368992, 21385073,
  23611006, 26068632, 28782069, 31777943, 35085654, 38737661, 42769801, 47221641,
  52136869, 57563718, 63555443, 70170840, 77474828, 85539082, 94442737, 104273167
]

// API Endpoints
export const API_ENDPOINTS = {
  WIKI_PRICES: 'https://api.weirdgloop.org/exchange/history/rs/latest',
  WIKI_ITEM_INFO: 'https://api.weirdgloop.org/exchange/history/rs/all',
  OSRS_GE: 'https://prices.runescape.wiki/api/v1/osrs/latest',
  RS3_GE: 'https://prices.runescape.wiki/api/v1/rs/latest',
}

// Combat styles
export const COMBAT_STYLES = {
  MELEE: 'Melee',
  RANGED: 'Ranged',
  MAGIC: 'Magic',
  NECROMANCY: 'Necromancy',
}

// Prayer levels
export const PRAYER_LEVELS = {
  NORMAL: ['Protect from Melee', 'Protect from Missiles', 'Protect from Magic'],
  CURSES: ['Deflect Melee', 'Deflect Missiles', 'Deflect Magic', 'Soul Split'],
}

// Skill names
export const SKILLS = [
  'Attack', 'Strength', 'Defence', 'Ranged', 'Prayer', 'Magic',
  'Runecrafting', 'Construction', 'Dungeoneering', 'Constitution',
  'Agility', 'Herblore', 'Thieving', 'Crafting', 'Fletching',
  'Slayer', 'Hunter', 'Mining', 'Smithing', 'Fishing',
  'Cooking', 'Firemaking', 'Woodcutting', 'Farming', 'Summoning',
  'Divination', 'Invention', 'Archaeology', 'Necromancy'
]

// Common item IDs (sample - would be expanded)
export const ITEM_IDS = {
  // Currency
  COINS: 995,
  BOND: 29492,
  
  // Common resources
  LOGS: 1511,
  OAK_LOGS: 1521,
  WILLOW_LOGS: 1519,
  
  // Bars
  BRONZE_BAR: 2349,
  IRON_BAR: 2351,
  STEEL_BAR: 2353,
  
  // Runes
  AIR_RUNE: 556,
  WATER_RUNE: 555,
  EARTH_RUNE: 557,
  FIRE_RUNE: 554,
}

// Clue scroll anagrams (sample)
export const CLUE_ANAGRAMS: Record<string, string> = {
  'A BAKER': 'Baraek',
  'ACE MATCH ELM': 'Cam the Camel',
  'BAKER CLIMB': 'Brambickle',
  'ARE COL': 'Oracle',
  'SAND NUT': 'Dunstan',
}

// Coordinate solver (sample)
export const CLUE_COORDINATES: Record<string, {location: string; description: string}> = {
  '00:00N 00:00E': { location: 'Tutorial Island', description: 'Starting area' },
  '14:00N 26:00E': { location: 'Burthorpe', description: 'Warriors Guild' },
  '03:00S 18:00E': { location: 'Lumbridge', description: 'Castle courtyard' },
}

// Boss mechanics
export const BOSS_MECHANICS = {
  RAKSHA: {
    phases: ['P1: 100-75%', 'P2: 75-50%', 'P3: 50-25%', 'P4: 25-0%'],
    abilities: ['Shadow Bomb', 'Tail Swipe', 'Mind Poison', 'Rockfall'],
  },
  KERAPAC: {
    phases: ['P1: Echo 1', 'P2: Echo 2', 'P3: Echo 3', 'P4: Combined'],
    abilities: ['Time Rift', 'Lightning', 'Jump', 'Clone Attack'],
  },
}

// Notification sounds
export const NOTIFICATION_TYPES = {
  TASK_COMPLETE: 'task-complete',
  PRICE_ALERT: 'price-alert',
  WARNING: 'warning',
  INFO: 'info',
}

// Default settings
export const DEFAULT_SETTINGS = {
  theme: 'dark',
  alwaysOnTop: false,
  opacity: 1.0,
  notifications: {
    enabled: true,
    sound: true,
    desktop: true,
  },
  priceChecker: {
    refreshInterval: 60000, // 1 minute
    showMargins: true,
  },
}
