/**
 * Centralized Application State & Helpers
 */

import { COUNTRIES } from '../data/countries.js';
import { TIER_LISTS } from '../data/tierlists.js';

export const state = {
  currentTierListId: 'mistakes', // 'mistakes' or 'features'
  currentCensorshipMode: 'censored', // 'historical' or 'censored'
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

export function getTotalPossibleSubZones() {
  const list = getCurrentTierList();
  const tierCount = (list && list.tiers) ? list.tiers.length : 6;
  return COUNTRIES.length * tierCount * 3;
}

export function isCardFullyPlaced(cardId) {
  const cardData = getCardById(cardId);
  if (cardData && cardData.locked) return true;
  return getCardPlacementCount(cardId) >= getTotalPossibleSubZones();
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
