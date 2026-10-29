/**
 * Tier-Lists Configuration & Tiers Metadata
 */

import { MISTAKES } from './mistakes.js';
import { MECHANICS } from './mechanics.js';

export const TIER_LISTS = {
  mistakes: {
    id: 'mistakes',
    title: 'ОШИБКИ В HOI 4',
    author: 'trikiwi',
    trayTitle: 'КОЛОДА ОШИБОК',
    itemNoun: 'ошибок',
    axisH: 'НАПРАВЛЕНИЯ',
    axisV: 'КРИТИЧНОСТЬ',
    tiers: [
      { id: 'meta', name: 'ПО&shy;ЛО&shy;ЖИ&shy;ТЕЛЬ&shy;НО', className: 'tier-meta', color: '#2e7d32', glow: 'rgba(46, 125, 50, 0.45)', bg: 'rgba(46, 125, 50, 0.15)' },
      { id: 'whatever', name: 'БЕЗ РАЗНИЦЫ', className: 'tier-whatever', color: '#8bc34a', glow: 'rgba(139, 195, 74, 0.45)', bg: 'rgba(139, 195, 74, 0.15)' },
      { id: 'noob', name: 'НЕ&shy;ПРИ&shy;ЯТ&shy;НЕНЬ&shy;КО', className: 'tier-noob', color: '#fbc02d', glow: 'rgba(251, 192, 45, 0.45)', bg: 'rgba(251, 192, 45, 0.15)' },
      { id: 'serious', name: 'СЕРЬЁЗНАЯ ОШИБКА', className: 'tier-serious', color: '#f57c00', glow: 'rgba(245, 124, 0, 0.45)', bg: 'rgba(245, 124, 0, 0.15)' },
      { id: 'ruin', name: 'РУИНА', className: 'tier-ruin', color: '#c62828', glow: 'rgba(198, 40, 40, 0.45)', bg: 'rgba(198, 40, 40, 0.15)' },
      { id: 'situational', name: 'СИ&shy;ТУ&shy;А&shy;ТИВ&shy;НО', className: 'tier-situational', color: '#f5f5f7', glow: 'rgba(245, 245, 247, 0.45)', bg: 'rgba(245, 245, 247, 0.15)' }
    ],
    cards: MISTAKES
  },
  features: {
    id: 'features',
    title: 'ФИШКИ И МЕХАНИКИ',
    author: 'Атом в леггинсах',
    trayTitle: 'КОЛОДА ФИШЕК',
    itemNoun: 'фишек',
    axisH: 'СТРАНЫ',
    axisV: 'ПОЛЕЗНОСТЬ',
    tiers: [
      { id: 'must_have', name: 'МАСТ-ХЭВ', className: 'tier-meta', color: '#2e7d32', glow: 'rgba(46, 125, 50, 0.45)', bg: 'rgba(46, 125, 50, 0.15)' },
      { id: 'strong', name: 'ОЧЕНЬ СИЛЬНО', className: 'tier-whatever', color: '#8bc34a', glow: 'rgba(139, 195, 74, 0.45)', bg: 'rgba(139, 195, 74, 0.15)' },
      { id: 'useful', name: 'ПОЛЕЗНО', className: 'tier-noob', color: '#fbc02d', glow: 'rgba(251, 192, 45, 0.45)', bg: 'rgba(251, 192, 45, 0.15)' },
      { id: 'situational', name: 'СИ&shy;ТУ&shy;А&shy;ТИВ&shy;НО', className: 'tier-situational', color: '#f5f5f7', glow: 'rgba(245, 245, 247, 0.45)', bg: 'rgba(245, 245, 247, 0.15)' },
      { id: 'weak', name: 'СОМ&shy;НИ&shy;ТЕЛЬ&shy;НО', className: 'tier-serious', color: '#f57c00', glow: 'rgba(245, 124, 0, 0.45)', bg: 'rgba(245, 124, 0, 0.15)' },
      { id: 'useless', name: 'Ммм... Хуета', className: 'tier-ruin', color: '#c62828', glow: 'rgba(198, 40, 40, 0.45)', bg: 'rgba(198, 40, 40, 0.15)' }
    ],
    cards: MECHANICS
  }
};

// Backward compatibility aliases
TIER_LISTS.trikiwi = TIER_LISTS.mistakes;
TIER_LISTS.atom = TIER_LISTS.features;
TIER_LISTS.mechanics = TIER_LISTS.features;
