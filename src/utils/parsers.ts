import { CLUE_ANAGRAMS, CLUE_COORDINATES } from './constants'

/**
 * Parse item name from game text
 */
export function parseItemName(text: string): string | null {
  // Remove common prefixes
  const cleaned = text.replace(/^(a |an |the )/i, '').trim()
  
  // Basic validation
  if (cleaned.length < 2) return null
  
  return cleaned
}

/**
 * Parse XP from game chat
 * Example: "You gain 1,234 experience."
 */
export function parseXpGain(text: string): number | null {
  const match = text.match(/gain\s+([\d,]+)\s+(?:experience|xp)/i)
  if (match) {
    return parseInt(match[1].replace(/,/g, ''), 10)
  }
  return null
}

/**
 * Parse level up from game chat
 * Example: "Congratulations! You have advanced a Defence level."
 */
export function parseLevelUp(text: string): string | null {
  const match = text.match(/advanced\s+(?:a|an)\s+(\w+)\s+level/i)
  if (match) {
    return match[1]
  }
  return null
}

/**
 * Parse coordinates from clue scroll
 * Example: "14 degrees 00 minutes north, 26 degrees 00 minutes east"
 */
export function parseCoordinates(text: string): string | null {
  const match = text.match(/(\d+)\s+degrees?\s+(\d+)\s+minutes?\s+(north|south),\s*(\d+)\s+degrees?\s+(\d+)\s+minutes?\s+(east|west)/i)
  
  if (match) {
    const lat = `${match[1].padStart(2, '0')}:${match[2].padStart(2, '0')}${match[3][0].toUpperCase()}`
    const lon = `${match[4].padStart(2, '0')}:${match[5].padStart(2, '0')}${match[6][0].toUpperCase()}`
    return `${lat} ${lon}`
  }
  
  return null
}

/**
 * Solve clue anagram
 */
export function solveAnagram(anagram: string): string | null {
  const normalized = anagram.toUpperCase().trim()
  return CLUE_ANAGRAMS[normalized] || null
}

/**
 * Get location from coordinates
 */
export function getCoordinateLocation(coords: string): { location: string; description: string } | null {
  return CLUE_COORDINATES[coords] || null
}

/**
 * Parse price from text
 * Example: "1,234,567 gp" or "1.2M"
 */
export function parsePrice(text: string): number | null {
  // Handle abbreviated format (1.2M, 500K, 1B)
  const abbreviatedMatch = text.match(/([\d.]+)\s*([KMB])/i)
  if (abbreviatedMatch) {
    const value = parseFloat(abbreviatedMatch[1])
    const suffix = abbreviatedMatch[2].toUpperCase()
    
    switch (suffix) {
      case 'K': return value * 1_000
      case 'M': return value * 1_000_000
      case 'B': return value * 1_000_000_000
    }
  }
  
  // Handle full number format
  const numberMatch = text.match(/([\d,]+)/i)
  if (numberMatch) {
    return parseInt(numberMatch[1].replace(/,/g, ''), 10)
  }
  
  return null
}

/**
 * Parse quantity from text
 * Example: "x 123" or "123x"
 */
export function parseQuantity(text: string): number | null {
  const match = text.match(/(?:x\s*)?(\d+)(?:\s*x)?/i)
  if (match) {
    return parseInt(match[1], 10)
  }
  return null
}

/**
 * Parse game message type
 */
export function parseMessageType(text: string): 'system' | 'chat' | 'trade' | 'combat' | 'unknown' {
  if (text.includes('experience') || text.includes('level')) return 'system'
  if (text.includes('damage') || text.includes('hit')) return 'combat'
  if (text.includes('trade') || text.includes('offer')) return 'trade'
  if (text.includes(':')) return 'chat'
  return 'unknown'
}

/**
 * Clean game text (remove formatting)
 * This function removes HTML-like tags and formatting from game text.
 * Note: This should only be used with text from the game, not user-generated content
 * displayed as HTML. For HTML sanitization, use a proper HTML sanitizer library.
 */
export function cleanGameText(text: string): string {
  // Create a temporary DOM element to safely extract text content
  // This properly handles all HTML entities and tags
  if (typeof document !== 'undefined') {
    const tempDiv = document.createElement('div')
    tempDiv.textContent = text // Use textContent to prevent HTML parsing
    return tempDiv.textContent || ''
  }
  
  // Fallback for non-browser environments
  // Remove HTML tags multiple times to handle nested tags
  let cleaned = text
  let previousLength = 0
  
  // Keep removing tags until no more are found
  while (cleaned.length !== previousLength) {
    previousLength = cleaned.length
    cleaned = cleaned.replace(/<[^>]*>/g, '')
  }
  
  // Remove color codes
  cleaned = cleaned.replace(/\[color=[^\]]*\]/g, '')
  cleaned = cleaned.replace(/\[\/color\]/g, '')
  
  // Normalize whitespace
  cleaned = cleaned.replace(/\s+/g, ' ').trim()
  
  return cleaned
}

/**
 * Parse combat style from ability name
 */
export function parseCombatStyle(abilityName: string): 'melee' | 'ranged' | 'magic' | 'necromancy' | 'unknown' {
  const lower = abilityName.toLowerCase()
  
  if (lower.includes('slice') || lower.includes('fury') || lower.includes('assault')) {
    return 'melee'
  }
  if (lower.includes('shot') || lower.includes('arrow') || lower.includes('bolt')) {
    return 'ranged'
  }
  if (lower.includes('spell') || lower.includes('surge') || lower.includes('blast')) {
    return 'magic'
  }
  if (lower.includes('soul') || lower.includes('death') || lower.includes('skeleton')) {
    return 'necromancy'
  }
  
  return 'unknown'
}

/**
 * Extract numbers from text
 */
export function extractNumbers(text: string): number[] {
  const matches = text.match(/\d+/g)
  return matches ? matches.map(n => parseInt(n, 10)) : []
}

/**
 * Validate item name
 */
export function isValidItemName(name: string): boolean {
  // Must be at least 2 characters
  if (name.length < 2) return false
  
  // Must contain at least one letter
  if (!/[a-zA-Z]/.test(name)) return false
  
  // Must not be all numbers
  if (/^\d+$/.test(name)) return false
  
  return true
}
