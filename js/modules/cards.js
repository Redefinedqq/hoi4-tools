/**
 * Card Factory & Card Interaction Controller
 */

import { state, getCardById, isCardFullyPlaced, getCurrentTierList } from './state.js';
import { removeCardIdFromZone } from './matrix.js';
import { showToast } from './toast.js';
import { openLightbox } from './lightbox.js';
import { applyZoneDragOverHighlight, clearAllDragOverStyles, handleCardDrop } from './dnd.js';

export function createCardElement(cardId, isInCell = false, zoneKey = null, itemIndex = null) {
  const cardData = getCardById(cardId);
  if (!cardData) return document.createElement('div');

  const card = document.createElement('div');
  card.className = 'mistake-card';
  card.draggable = true;
  card.dataset.cardId = cardId;

  if (isInCell) {
    card.dataset.inCell = 'true';
    card.dataset.zoneKey = zoneKey;
    card.dataset.itemIndex = itemIndex;
  } else {
    card.dataset.inCell = 'false';
  }

  const isLocked = Boolean(cardData.locked);
  if (isLocked) {
    card.classList.add('is-locked');
    card.draggable = false;
    card.setAttribute('aria-disabled', 'true');
  }

  const captionClass = 'card-caption';

  let tooltipHtml = '';
  if (isLocked) {
    tooltipHtml = `<div class="card-tooltip"><span>${cardData.title}</span><small class="card-tooltip-desc" style="color:#ff8a80;">Временно заблокировано</small></div>`;
  } else if (isInCell) {
    tooltipHtml = `<button class="card-remove-btn" title="Убрать из ячейки"><i class="fa-solid fa-xmark"></i></button>${cardData.desc ? '<div class="card-tooltip card-tooltip-desc-only"><small class="card-tooltip-desc">' + cardData.desc + '</small></div>' : ''}`;
  } else if (cardData.desc) {
    tooltipHtml = `<div class="card-tooltip card-tooltip-desc-only"><small class="card-tooltip-desc">${cardData.desc}</small></div>`;
  }

  const hasDesc = Boolean(cardData.desc);

  card.innerHTML = `
    <div class="card-art-box">
      <img class="card-img" src="${cardData.img}" alt="${cardData.title}" loading="lazy" decoding="async" />
      ${isLocked ? '<div class="card-lock-badge" title="Временно недоступно"><i class="fa-solid fa-lock"></i></div>' : ''}
      ${hasDesc && !isLocked ? '<div class="card-desc-indicator" title="Есть описание"><i class="fa-solid fa-circle-info"></i></div>' : ''}
    </div>
    <div class="${captionClass}">${cardData.title}</div>
    ${tooltipHtml}
  `;

  // Remove button in cell
  if (isInCell) {
    const removeBtn = card.querySelector('.card-remove-btn');
    if (removeBtn) {
      removeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        removeCardIdFromZone(zoneKey, cardId);
      });
    }
  }

  // HTML5 Dragstart
  card.addEventListener('dragstart', (e) => {
    if (isLocked) {
      e.preventDefault();
      showToast('Карточка «' + cardData.title + '» временно заблокирована!', 2500, false, 'warning');
      return;
    }

    if (!isInCell && isCardFullyPlaced(cardId)) {
      e.preventDefault();
      return;
    }

    state.isDraggingFlag = true;
    state.draggedCardInfo = {
      cardId: cardId,
      sourceZoneKey: isInCell ? zoneKey : null,
      sourceIndex: isInCell ? itemIndex : null
    };
    card.classList.add('is-dragging');
    e.dataTransfer.setData('text/plain', cardId);
    e.dataTransfer.effectAllowed = 'move';
  });

  card.addEventListener('dragend', () => {
    card.classList.remove('is-dragging');
    clearAllDragOverStyles();
    state.draggedCardInfo = null;
    setTimeout(() => {
      state.isDraggingFlag = false;
    }, 50);
  });

  // Touch Drag-and-Drop
  let touchStartX = 0;
  let touchStartY = 0;
  let isTouchDragging = false;
  let touchGhost = null;

  card.addEventListener('touchstart', (e) => {
    if (isLocked) return;
    if (!isInCell && isCardFullyPlaced(cardId)) return;
    if (e.touches.length !== 1) return;
    const touch = e.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
    isTouchDragging = false;
  }, { passive: true });

  card.addEventListener('touchmove', (e) => {
    if (isLocked) return;
    if (!isInCell && isCardFullyPlaced(cardId)) return;
    if (e.touches.length !== 1) return;
    const touch = e.touches[0];
    const dx = touch.clientX - touchStartX;
    const dy = touch.clientY - touchStartY;

    if (!isTouchDragging && (Math.abs(dx) > 10 || Math.abs(dy) > 10)) {
      isTouchDragging = true;
      state.isDraggingFlag = true;
      state.draggedCardInfo = {
        cardId: cardId,
        sourceZoneKey: isInCell ? zoneKey : null,
        sourceIndex: isInCell ? itemIndex : null
      };

      touchGhost = document.createElement('div');
      touchGhost.className = 'touch-drag-avatar';
      touchGhost.innerHTML = `<img src="${cardData.img}" alt="${cardData.title}" />`;
      touchGhost.style.left = `${touch.clientX}px`;
      touchGhost.style.top = `${touch.clientY}px`;
      document.body.appendChild(touchGhost);
    }

    if (isTouchDragging && touchGhost) {
      e.preventDefault();
      touchGhost.style.left = `${touch.clientX}px`;
      touchGhost.style.top = `${touch.clientY}px`;

      clearAllDragOverStyles();
      const elemBelow = document.elementFromPoint(touch.clientX, touch.clientY);
      const targetZone = elemBelow?.closest('.cell-sub-zone');
      if (targetZone) {
        const list = getCurrentTierList();
        const tier = list.tiers.find(t => t.id === targetZone.dataset.tier);
        applyZoneDragOverHighlight(targetZone, tier);
      }
    }
  }, { passive: false });

  card.addEventListener('touchend', (e) => {
    if (isTouchDragging) {
      if (touchGhost) {
        touchGhost.remove();
        touchGhost = null;
      }

      const touch = e.changedTouches[0];
      const elemBelow = document.elementFromPoint(touch.clientX, touch.clientY);
      const targetZone = elemBelow?.closest('.cell-sub-zone');

      clearAllDragOverStyles();

      if (targetZone && state.draggedCardInfo) {
        const targetZoneKey = targetZone.dataset.zoneKey;
        const { cardId: dCardId, sourceZoneKey } = state.draggedCardInfo;
        handleCardDrop(targetZoneKey, dCardId, sourceZoneKey);
      }

      state.draggedCardInfo = null;
      setTimeout(() => {
        state.isDraggingFlag = false;
        isTouchDragging = false;
      }, 60);
    }
  }, { passive: true });

  // Click handler: Lightbox Zoom
  card.addEventListener('click', (e) => {
    if (state.isDraggingFlag || isTouchDragging) return;
    e.stopPropagation();

    if (isLocked) {
      showToast('Карточка «' + cardData.title + '» временно заблокирована!', 2500, false, 'warning');
      return;
    }

    if (!isInCell && isCardFullyPlaced(cardId)) {
      showToast('Карточка уже выставлена во всех странах!', 2500, false, 'tip');
      return;
    }

    openLightbox(cardId);
  });

  return card;
}
