/**
 * Dynamic Drag-and-Drop Sub-Zone Controller
 */

import { state, getCardById, isCardInZone, getCurrentTierList } from './state.js';
import { showToast } from './toast.js';
import { addCardToZone, removeCardIdFromZone, removeCardFromCountry } from './matrix.js';

export function applyZoneDragOverHighlight(zoneEl, tier) {
  if (tier) {
    zoneEl.style.setProperty('--cell-drag-color', tier.color);
    zoneEl.style.setProperty('--cell-drag-glow', tier.glow);
    zoneEl.style.setProperty('--cell-drag-bg', tier.bg);
  }
  zoneEl.classList.add('drag-over');
}

export function clearZoneDragOverHighlight(zoneEl) {
  zoneEl.classList.remove('drag-over');
  zoneEl.style.removeProperty('--cell-drag-color');
  zoneEl.style.removeProperty('--cell-drag-glow');
  zoneEl.style.removeProperty('--cell-drag-bg');
}

export function clearAllDragOverStyles() {
  document.querySelectorAll('.cell-sub-zone.drag-over').forEach(el => clearZoneDragOverHighlight(el));
  const bankCardsTrayEl = document.getElementById('bank-cards-tray');
  if (bankCardsTrayEl) bankCardsTrayEl.classList.remove('drag-over');
}

export function setupSubZoneDragEvents(zoneEl, tier) {
  const zoneKey = zoneEl.dataset.zoneKey;

  zoneEl.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
    applyZoneDragOverHighlight(zoneEl, tier);
  });

  zoneEl.addEventListener('dragleave', (e) => {
    e.stopPropagation();
    if (!zoneEl.contains(e.relatedTarget)) {
      clearZoneDragOverHighlight(zoneEl);
    }
  });

  zoneEl.addEventListener('drop', (e) => {
    e.preventDefault();
    e.stopPropagation();
    clearAllDragOverStyles();

    let cardId = null;
    let sourceZoneKey = null;

    if (state.draggedCardInfo) {
      cardId = state.draggedCardInfo.cardId;
      sourceZoneKey = state.draggedCardInfo.sourceZoneKey;
    } else {
      cardId = e.dataTransfer.getData('text/plain');
    }

    if (!cardId || !getCardById(cardId)) return;

    handleCardDrop(zoneKey, cardId, sourceZoneKey);
  });
}

export function handleCardDrop(targetZoneKey, cardId, sourceZoneKey = null) {
  if (!targetZoneKey || !cardId) return;
  const cardData = getCardById(cardId);
  if (cardData && cardData.locked) {
    showToast('Карточка «' + cardData.title + '» временно заблокирована!', 2500, false, 'warning');
    return;
  }

  const [targetCountryId] = targetZoneKey.split('__');

  // If dropped into the exact same sub-zone - no-op
  if (sourceZoneKey && sourceZoneKey === targetZoneKey) {
    return;
  }

  // If already present in this exact target sub-zone
  if (isCardInZone(targetZoneKey, cardId)) {
    showToast('Карточка уже находится в этой категории', 2000, false, 'tip');
    return;
  }

  // If dragged from another country on the board, remove from that country first
  if (sourceZoneKey) {
    const [sourceCountryId] = sourceZoneKey.split('__');
    if (sourceCountryId !== targetCountryId) {
      removeCardIdFromZone(sourceZoneKey, cardId, false);
    }
  }

  // Anti-double-standard rule: In one country, a card cannot exist in multiple tiers!
  // If card was already placed in this country in another tier or sub-zone, move it cleanly
  removeCardFromCountry(targetCountryId, cardId, false);

  // Add to target zone
  addCardToZone(targetZoneKey, cardId);
}
