/**
 * Centralized Application State & Helpers
 */

import { COUNTRIES } from '../data/countries.js';
import { TIER_LISTS } from '../data/tierlists.js';

export function loadSavedVisibleCountryIds() {
  try {
    const raw = localStorage.getItem('hoi4_visible_countries');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const validIds = COUNTRIES.map(c => c.id);
        const filtered = parsed.filter(id => validIds.includes(id));
        if (filtered.length > 0) return filtered;
      }
    }
  } catch (e) {}
  return COUNTRIES.map(c => c.id);
}

export const state = {
  currentTierListId: 'mistakes', // 'mistakes' or 'features'
  currentCensorshipMode: 'censored', // 'historical' or 'censored'
  isMpSpSplitEnabled: false, // Default: false (unified cell mode, MP/SP disabled)
  visibleCountryIds: loadSavedVisibleCountryIds(),
  listStates: {
    mistakes: {},
    features: {}
  },
  matrixState: {}, // active list state pointer
  lastResetSnapshot: null,
  draggedCardInfo: null,
  isDraggingFlag: false,
  selectedCardForPlacement: null
};

export function getVisibleCountries() {
  const ids = state.visibleCountryIds || [];
  return COUNTRIES.filter(c => ids.includes(c.id));
}

export function getCurrentTierList() {
  return TIER_LISTS[state.currentTierListId] || TIER_LISTS.mistakes;
}

export function getCurrentCards() {
  return getCurrentTierList().cards;
}

export function getCardById(cardId) {
  const list = getCurrentTierList();
  return list.cards.find(c => c.id === cardId) || null;
}

export function getZoneKey(countryId, tierId, zone) {
  return `${countryId}__${tierId}__${zone}`;
}

export function isCardInZone(zoneKey, cardId) {
  return Array.isArray(state.matrixState[zoneKey]) && state.matrixState[zoneKey].includes(cardId);
}

export function getCardPlacementCount(cardId) {
  let count = 0;
  for (const key in state.matrixState) {
    if (Array.isArray(state.matrixState[key]) && state.matrixState[key].includes(cardId)) {
      count++;
    }
  }
  return count;
}

export function getMaxCountryPlacements() {
  return getVisibleCountries().length;
}

export function getTotalPossibleSubZones() {
  return getMaxCountryPlacements();
}

export function isCardFullyPlaced(cardId) {
  const cardData = getCardById(cardId);
  if (cardData && cardData.locked) return true;
  return getCardPlacementCount(cardId) >= getMaxCountryPlacements();
}

export function isCardPlacedOnBoard(cardId) {
  for (const key in state.matrixState) {
    if (Array.isArray(state.matrixState[key]) && state.matrixState[key].includes(cardId)) {
      return true;
    }
  }
  return false;
}

export function countPlacedCards() {
  let count = 0;
  for (const key in state.matrixState) {
    if (Array.isArray(state.matrixState[key])) {
      count += state.matrixState[key].length;
    }
  }
  return count;
}

export function hasPlacedCards() {
  return countPlacedCards() > 0;
}

export function syncActiveListState() {
  if (!state.listStates[state.currentTierListId]) {
    state.listStates[state.currentTierListId] = {};
  }
  state.listStates[state.currentTierListId] = state.matrixState;
}

export function clearCardSelection() {
  state.selectedCardForPlacement = null;
  document.querySelectorAll('.mistake-card.is-selected').forEach(el => el.classList.remove('is-selected'));
  document.body.classList.remove('card-selection-active');
}
