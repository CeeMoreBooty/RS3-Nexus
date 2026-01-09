import { XP_TABLE } from './constants'

/**
 * Convert XP to level
 */
export function xpToLevel(xp: number): number {
  for (let i = XP_TABLE.length - 1; i >= 0; i--) {
    if (xp >= XP_TABLE[i]) {
      return i
    }
  }
  return 1
}

/**
 * Convert level to XP
 */
export function levelToXp(level: number): number {
  if (level < 1 || level >= XP_TABLE.length) {
    return 0
  }
  return XP_TABLE[level]
}

/**
 * Calculate XP needed for next level
 */
export function xpToNextLevel(currentXp: number): number {
  const currentLevel = xpToLevel(currentXp)
  if (currentLevel >= XP_TABLE.length - 1) {
    return 0
  }
  return XP_TABLE[currentLevel + 1] - currentXp
}

/**
 * Calculate progress percentage to next level
 */
export function levelProgress(currentXp: number): number {
  const currentLevel = xpToLevel(currentXp)
  if (currentLevel >= XP_TABLE.length - 1) {
    return 100
  }
  
  const currentLevelXp = XP_TABLE[currentLevel]
  const nextLevelXp = XP_TABLE[currentLevel + 1]
  const xpInLevel = currentXp - currentLevelXp
  const xpForLevel = nextLevelXp - currentLevelXp
  
  return (xpInLevel / xpForLevel) * 100
}

/**
 * Calculate actions needed for level goal
 */
export function actionsToLevel(currentXp: number, targetLevel: number, xpPerAction: number): number {
  const targetXp = levelToXp(targetLevel)
  const xpNeeded = targetXp - currentXp
  return Math.ceil(xpNeeded / xpPerAction)
}

/**
 * Calculate DPS (Damage Per Second)
 */
export function calculateDPS(damage: number, attackSpeed: number): number {
  // Attack speed in game ticks (0.6 seconds per tick)
  const secondsPerAttack = attackSpeed * 0.6
  return damage / secondsPerAttack
}

/**
 * Calculate ability damage
 */
export function calculateAbilityDamage(
  weaponDamage: number,
  abilityPercent: number,
  strengthBonus: number = 0
): number {
  const baseDamage = weaponDamage * (abilityPercent / 100)
  const bonusDamage = baseDamage * (strengthBonus / 100)
  return Math.floor(baseDamage + bonusDamage)
}

/**
 * Calculate profit margin
 */
export function calculateProfit(buyPrice: number, sellPrice: number, quantity: number = 1): number {
  // GE takes 1% tax on sales
  const tax = sellPrice * 0.01
  const profitPerItem = sellPrice - tax - buyPrice
  return profitPerItem * quantity
}

/**
 * Calculate profit margin percentage
 */
export function calculateProfitMargin(buyPrice: number, sellPrice: number): number {
  if (buyPrice === 0) return 0
  const tax = sellPrice * 0.01
  const profit = sellPrice - tax - buyPrice
  return (profit / buyPrice) * 100
}

/**
 * Calculate time to level
 */
export function timeToLevel(
  currentXp: number,
  targetLevel: number,
  xpPerHour: number
): { hours: number; minutes: number } {
  const targetXp = levelToXp(targetLevel)
  const xpNeeded = targetXp - currentXp
  const hoursNeeded = xpNeeded / xpPerHour
  
  const hours = Math.floor(hoursNeeded)
  const minutes = Math.round((hoursNeeded - hours) * 60)
  
  return { hours, minutes }
}

/**
 * Format large numbers with suffixes (K, M, B)
 */
export function formatNumber(num: number): string {
  if (num >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(2) + 'B'
  }
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(2) + 'M'
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1) + 'K'
  }
  return num.toString()
}

/**
 * Calculate combat level
 */
export function calculateCombatLevel(stats: {
  attack: number
  strength: number
  defence: number
  constitution: number
  ranged: number
  magic: number
  prayer: number
  summoning: number
}): number {
  const base = (stats.defence + stats.constitution + Math.floor(stats.prayer / 2)) * 0.25
  
  const melee = (stats.attack + stats.strength) * 0.325
  const range = Math.floor(stats.ranged * 1.5) * 0.325
  const mage = Math.floor(stats.magic * 1.5) * 0.325
  
  const combat = base + Math.max(melee, range, mage) + Math.floor(stats.summoning / 2) * 0.25
  
  return Math.floor(combat)
}

/**
 * Calculate max hit
 */
export function calculateMaxHit(
  strengthLevel: number,
  strengthBonus: number,
  prayerBonus: number = 1
): number {
  const effectiveStrength = Math.floor((strengthLevel * prayerBonus) + 8)
  const baseDamage = Math.floor((effectiveStrength * (strengthBonus + 64)) / 640)
  return baseDamage
}
