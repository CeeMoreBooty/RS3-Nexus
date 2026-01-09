import { useState } from 'react'
import { calculateDPS, calculateCombatLevel } from '../utils/calculators'
import { COMBAT_STYLES, BOSS_MECHANICS } from '../utils/constants'

function CombatHelper() {
  const [combatStyle, setCombatStyle] = useState('Melee')
  const [weaponDamage, setWeaponDamage] = useState(1000)
  const [attackSpeed, setAttackSpeed] = useState(4)
  const [strengthBonus, setStrengthBonus] = useState(0)
  
  // Combat level calculator
  const [stats, setStats] = useState({
    attack: 99,
    strength: 99,
    defence: 99,
    constitution: 99,
    ranged: 99,
    magic: 99,
    prayer: 99,
    summoning: 99,
  })

  const dps = calculateDPS(weaponDamage, attackSpeed)
  const combatLevel = calculateCombatLevel(stats)

  return (
    <div className="component-container">
      <div className="component-header">
        <h2>Combat Helper</h2>
        <p>Calculate DPS, combat levels, and boss mechanics</p>
      </div>

      <div className="grid grid-2 mb-4">
        <div className="card">
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>DPS Calculator</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Combat Style</label>
              <select
                value={combatStyle}
                onChange={(e) => setCombatStyle(e.target.value)}
                style={{ width: '100%' }}
              >
                {Object.values(COMBAT_STYLES).map(style => (
                  <option key={style} value={style}>{style}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                Weapon Damage
              </label>
              <input
                type="number"
                value={weaponDamage}
                onChange={(e) => setWeaponDamage(parseInt(e.target.value) || 0)}
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                Attack Speed (ticks)
              </label>
              <input
                type="number"
                value={attackSpeed}
                onChange={(e) => setAttackSpeed(parseInt(e.target.value) || 1)}
                min="1"
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                Strength Bonus (%)
              </label>
              <input
                type="number"
                value={strengthBonus}
                onChange={(e) => setStrengthBonus(parseInt(e.target.value) || 0)}
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ 
              padding: '1.5rem', 
              backgroundColor: 'var(--bg-tertiary)', 
              borderRadius: '6px',
              textAlign: 'center'
            }}>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                Estimated DPS
              </p>
              <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--accent-primary)' }}>
                {dps.toFixed(1)}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Combat Level Calculator</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Attack</label>
              <input
                type="number"
                value={stats.attack}
                onChange={(e) => setStats({ ...stats, attack: parseInt(e.target.value) || 1 })}
                min="1"
                max="120"
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Strength</label>
              <input
                type="number"
                value={stats.strength}
                onChange={(e) => setStats({ ...stats, strength: parseInt(e.target.value) || 1 })}
                min="1"
                max="120"
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Defence</label>
              <input
                type="number"
                value={stats.defence}
                onChange={(e) => setStats({ ...stats, defence: parseInt(e.target.value) || 1 })}
                min="1"
                max="120"
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Constitution</label>
              <input
                type="number"
                value={stats.constitution}
                onChange={(e) => setStats({ ...stats, constitution: parseInt(e.target.value) || 10 })}
                min="10"
                max="120"
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Ranged</label>
              <input
                type="number"
                value={stats.ranged}
                onChange={(e) => setStats({ ...stats, ranged: parseInt(e.target.value) || 1 })}
                min="1"
                max="120"
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Magic</label>
              <input
                type="number"
                value={stats.magic}
                onChange={(e) => setStats({ ...stats, magic: parseInt(e.target.value) || 1 })}
                min="1"
                max="120"
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Prayer</label>
              <input
                type="number"
                value={stats.prayer}
                onChange={(e) => setStats({ ...stats, prayer: parseInt(e.target.value) || 1 })}
                min="1"
                max="120"
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Summoning</label>
              <input
                type="number"
                value={stats.summoning}
                onChange={(e) => setStats({ ...stats, summoning: parseInt(e.target.value) || 1 })}
                min="1"
                max="120"
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <div style={{ 
            padding: '1.5rem', 
            backgroundColor: 'var(--bg-tertiary)', 
            borderRadius: '6px',
            textAlign: 'center',
            marginTop: '1.5rem'
          }}>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
              Combat Level
            </p>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--accent-primary)' }}>
              {combatLevel}
            </p>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Boss Mechanics</h3>
        
        <div className="grid grid-2">
          {Object.entries(BOSS_MECHANICS).map(([boss, mechanics]) => (
            <div
              key={boss}
              style={{
                padding: '1.5rem',
                backgroundColor: 'var(--bg-tertiary)',
                borderRadius: '6px'
              }}
            >
              <h4 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--accent-primary)' }}>
                {boss}
              </h4>
              
              <div style={{ marginBottom: '1rem' }}>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                  Phases:
                </p>
                <ul style={{ paddingLeft: '1.5rem' }}>
                  {mechanics.phases.map((phase, i) => (
                    <li key={i} style={{ fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                      {phase}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                  Key Abilities:
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {mechanics.abilities.map((ability, i) => (
                    <span
                      key={i}
                      style={{
                        padding: '0.25rem 0.75rem',
                        backgroundColor: 'var(--bg-secondary)',
                        borderRadius: '4px',
                        fontSize: '0.85rem'
                      }}
                    >
                      {ability}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CombatHelper
