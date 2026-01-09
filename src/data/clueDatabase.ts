// Clue Solver Database - Pre-compiled solutions for instant lookup
import { ClueSolution } from '../types';

// Anagram solutions
export const ANAGRAM_SOLUTIONS: Record<string, ClueSolution> = {
  'A BAKER': {
    type: 'anagram',
    input: 'A BAKER',
    solution: 'Baraek',
    location: 'Varrock Square, east side',
    teleports: ['Varrock teleport'],
  },
  'AIR RUNE': {
    type: 'anagram',
    input: 'AIR RUNE',
    solution: 'Aubury',
    location: 'Varrock, south of east bank',
    teleports: ['Varrock teleport'],
  },
  'ARE COL': {
    type: 'anagram',
    input: 'ARE COL',
    solution: 'Oracle',
    location: 'Ice Mountain, west of Edgeville',
    teleports: ['Edgeville teleport', 'Wilderness lodestone'],
  },
  // Add more anagrams...
};

// Coordinate solutions
export const COORDINATE_SOLUTIONS: Record<string, ClueSolution> = {
  '00:00 N 00:00 E': {
    type: 'coordinate',
    input: '00:00 N 00:00 E',
    solution: 'Observatory',
    location: 'Observatory, south of Ardougne',
    teleports: ['Ardougne teleport'],
    requirements: ['Combat with double agent'],
  },
  '02:40 N 31:48 E': {
    type: 'coordinate',
    input: '02:40 N 31:48 E',
    solution: 'Musa Point',
    location: 'Karamja, near volcano',
    teleports: ['Karamja gloves', 'Ardougne teleport + ship'],
  },
  // Add more coordinates...
};

// Cryptic clue solutions
export const CRYPTIC_SOLUTIONS: Record<string, ClueSolution> = {
  'in a town where everyone has a role in the circus': {
    type: 'cryptic',
    input: 'in a town where everyone has a role in the circus',
    solution: 'Seers Village',
    location: 'Seers Village, near bank',
    teleports: ['Camelot teleport'],
  },
  'speak to the keeper of ale': {
    type: 'cryptic',
    input: 'speak to the keeper of ale',
    solution: 'Bartender',
    location: 'Rising Sun Inn, Falador',
    teleports: ['Falador teleport'],
  },
  // Add more cryptic clues...
};

// Scan clue ranges (number of steps away)
export const SCAN_LOCATIONS: Record<string, { location: string; coordinates: string }> = {
  'lumbridge': { location: 'Lumbridge Castle courtyard', coordinates: '3222,3218' },
  'varrock': { location: 'Varrock Palace', coordinates: '3212,3460' },
  'falador': { location: 'Falador Park', coordinates: '2996,3374' },
  'ardougne': { location: 'Ardougne Market', coordinates: '2662,3300' },
  // Add more scan locations...
};

// Puzzle box solutions (simplified - would have step-by-step in real implementation)
export const PUZZLE_SOLUTIONS = {
  easy: 'Average 15 moves',
  medium: 'Average 25 moves',
  hard: 'Average 35 moves',
  elite: 'Average 45 moves',
  master: 'Average 60 moves',
};

// Map clue solutions
export const MAP_SOLUTIONS: Record<string, ClueSolution> = {
  'map_01': {
    type: 'map',
    input: 'map_01',
    solution: 'Dig spot',
    location: 'Feldip Hills, south of Gu\'Tanoth',
    teleports: ['Fairy ring AKS', 'Yanille teleport'],
  },
  // Add more maps...
};

// Emote clue solutions
export const EMOTE_SOLUTIONS: Record<string, ClueSolution> = {
  'dance in the party room': {
    type: 'emote',
    input: 'dance in the party room',
    solution: 'Dance emote in Falador Party Room',
    location: 'Falador, above bank',
    teleports: ['Falador teleport'],
    requirements: ['Dance emote'],
  },
  // Add more emotes...
};

// Export all databases
export const CLUE_DATABASE = {
  anagrams: ANAGRAM_SOLUTIONS,
  coordinates: COORDINATE_SOLUTIONS,
  cryptic: CRYPTIC_SOLUTIONS,
  scans: SCAN_LOCATIONS,
  puzzles: PUZZLE_SOLUTIONS,
  maps: MAP_SOLUTIONS,
  emotes: EMOTE_SOLUTIONS,
};

export default CLUE_DATABASE;
