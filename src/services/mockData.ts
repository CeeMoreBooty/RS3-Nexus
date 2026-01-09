/**
 * Mock data for testing and demo purposes
 */

import type { ApiItemMapping } from '../types/api';

export const MOCK_ITEMS: ApiItemMapping[] = [
  {
    id: 4151,
    name: 'Abyssal whip',
    examine: 'A weapon from the abyss.',
    members: true,
    lowalch: 48000,
    highalch: 72000,
    value: 120001,
    limit: 10000,
  },
  {
    id: 1050,
    name: 'Santa hat',
    examine: 'Ho ho ho!',
    members: false,
    lowalch: 1,
    highalch: 1,
    value: 1,
    limit: 2,
  },
  {
    id: 21787,
    name: 'Armadyl battlestaff',
    examine: 'A mystical battlestaff.',
    members: true,
    lowalch: 4000,
    highalch: 6000,
    value: 10000,
    limit: 10000,
  },
  {
    id: 4708,
    name: 'Godsword shard 1',
    examine: 'A shard of the godsword.',
    members: true,
    lowalch: 100000,
    highalch: 150000,
    value: 250000,
    limit: 10,
  },
  {
    id: 25454,
    name: 'Noxious scythe',
    examine: 'A scythe created from spider parts.',
    members: true,
    lowalch: 400000,
    highalch: 600000,
    value: 1000000,
    limit: 2,
  },
];

export const MOCK_PRICES: Record<number, { high: number; highTime: number; low: number; lowTime: number }> = {
  4151: {
    high: 1250000,
    highTime: Math.floor(Date.now() / 1000) - 300,
    low: 1245000,
    lowTime: Math.floor(Date.now() / 1000) - 180,
  },
  1050: {
    high: 1850000000,
    highTime: Math.floor(Date.now() / 1000) - 600,
    low: 1800000000,
    lowTime: Math.floor(Date.now() / 1000) - 400,
  },
  21787: {
    high: 45600000,
    highTime: Math.floor(Date.now() / 1000) - 120,
    low: 45200000,
    lowTime: Math.floor(Date.now() / 1000) - 90,
  },
  4708: {
    high: 125000000,
    highTime: Math.floor(Date.now() / 1000) - 240,
    low: 124500000,
    lowTime: Math.floor(Date.now() / 1000) - 150,
  },
  25454: {
    high: 256000000,
    highTime: Math.floor(Date.now() / 1000) - 360,
    low: 254000000,
    lowTime: Math.floor(Date.now() / 1000) - 200,
  },
};

export const MOCK_HISTORY: Record<number, Record<string, number>> = {
  4151: {
    [Math.floor(Date.now() / 1000) - 86400]: 1200000,
    [Math.floor(Date.now() / 1000) - 43200]: 1220000,
    [Math.floor(Date.now() / 1000) - 21600]: 1235000,
    [Math.floor(Date.now() / 1000) - 10800]: 1240000,
    [Math.floor(Date.now() / 1000) - 3600]: 1245000,
  },
};

export const getMockItemMappings = (): ApiItemMapping[] => {
  return [...MOCK_ITEMS];
};

export const getMockPrice = (itemId: number) => {
  return MOCK_PRICES[itemId] || null;
};

export const getMockHistory = (itemId: number) => {
  return MOCK_HISTORY[itemId] || {};
};
