/**
 * Tray & Deck Controller (Cards Strip, 50-200% Zoom, Smooth Scroll)
 */

import { state, getCurrentCards, getTotalPossibleSubZones, getCardById } from './state.js';
import { createCardElement } from './cards.js';
import { showToast } from './toast.js';

let currentTrayScale = 100; // in percent (50 to 200)

export function getCurrentTrayScale() {
  return currentTrayScale;
}

export function initTrayScale() {
  try {
    const saved = localStorage.getItem('hoi4_tray_scale_v3');
    if (saved !== null) {
      const val = parseInt(saved, 10);
      if (!isNaN(val) && val >= 50 && val <= 200) {
        currentTrayScale = val;
      }
    }
  } catch (e) {}
  applyTrayScale(currentTrayScale, false);
}

export function updateDeckOffset() {
  const deckEl = document.querySelector('.bank-cards-strip-container');
  if (deckEl) {
    const deckHeight = Math.ceil(deckEl.getBoundingClientRect().height);
    if (deckHeight > 0) {
      document.documentElement.style.setProperty('--deck-height', `${deckHeight}px`);
    }
  }
}

export function initDeckOffsetObserver() {
  updateDeckOffset();

  const deckEl = document.querySelector('.bank-cards-strip-container');
  if (deckEl && window.ResizeObserver) {
    try {
      const ro = new ResizeObserver(() => {
        updateDeckOffset();
      });
      ro.observe(deckEl);
    } catch (e) {}
  }

  window.addEventListener('resize', updateDeckOffset);
}

export function applyTrayScale(percent, save = true) {
  percent = Math.max(50, Math.min(200, Math.round(percent / 5) * 5));
  currentTrayScale = percent;

  const scaleFactor = (percent / 100).toFixed(2);
  document.documentElement.style.setProperty('--tray-scale', scaleFactor);

  const sliderEl = document.getElementById('tray-scale-slider');
  const valueEl = document.getElementById('tray-scale-value');

  if (sliderEl) sliderEl.value = percent;
  if (valueEl) valueEl.textContent = `${percent}%`;

  requestAnimationFrame(updateDeckOffset);

  if (save) {
    try {
      localStorage.setItem('hoi4_tray_scale_v3', percent);
    } catch (e) {}
  }
}

export function setupTrayScaleListeners() {
  const sliderEl = document.getElementById('tray-scale-slider');
  const downBtn = document.getElementById('tray-scale-down');
  const upBtn = document.getElementById('tray-scale-up');
  const valueEl = document.getElementById('tray-scale-value');

  if (sliderEl) {
    sliderEl.addEventListener('input', (e) => {
      applyTrayScale(parseInt(e.target.value, 10));
    });
    // Double click reset
    sliderEl.addEventListener('dblclick', () => {
      applyTrayScale(100);
      showToast('Масштаб колоды сброшен на 100%', 2000, false, 'info');
    });
  }

  if (downBtn) {
    downBtn.addEventListener('click', () => {
      applyTrayScale(currentTrayScale - 5);
    });
  }

  if (upBtn) {
    upBtn.addEventListener('click', () => {
      applyTrayScale(currentTrayScale + 5);
    });
  }

  if (valueEl) {
    valueEl.addEventListener('click', () => {
      applyTrayScale(100);
      showToast('Масштаб колоды сброшен на 100%', 2000, false, 'info');
    });
    valueEl.addEventListener('dblclick', () => {
      applyTrayScale(100);
    });
  }
}

export function setupTrayWheelScroll() {
  const bankCardsTrayEl = document.getElementById('bank-cards-tray');
  if (!bankCardsTrayEl) return;
  bankCardsTrayEl.addEventListener('wheel', (e) => {
    if (e.deltaY !== 0) {
      e.preventDefault();
      bankCardsTrayEl.scrollLeft += e.deltaY;
    }
  }, { passive: false });
}

export function renderBankCards() {
  const bankCardsTrayEl = document.getElementById('bank-cards-tray');
  if (!bankCardsTrayEl) return;
  bankCardsTrayEl.innerHTML = '';

  const cards = getCurrentCards();
  cards.forEach(cardData => {
    const cardEl = createCardElement(cardData.id, false);
    bankCardsTrayEl.appendChild(cardEl);
  });

  updateBankCardsStatus();
}

export function updateBankCardsStatus() {
  const cards = getCurrentCards();
  const totalSubZones = getTotalPossibleSubZones();

  const cardPlacementCounts = new Map();
  cards.forEach(c => cardPlacementCounts.set(c.id, 0));

  let totalPlacements = 0;

  for (const key in state.matrixState) {
    if (Array.isArray(state.matrixState[key])) {
      state.matrixState[key].forEach(cId => {
        totalPlacements++;
        if (cardPlacementCounts.has(cId)) {
          cardPlacementCounts.set(cId, cardPlacementCounts.get(cId) + 1);
        }
      });
    }
  }

  let fullyPlacedCount = 0;
  const bankCardsTrayEl = document.getElementById('bank-cards-tray');
  const trayCardsCountEl = document.getElementById('tray-cards-count');

  if (bankCardsTrayEl) {
    const trayCards = bankCardsTrayEl.querySelectorAll('.mistake-card');
    trayCards.forEach(cardEl => {
      const cId = cardEl.dataset.cardId;
      const cardData = getCardById(cId);

      if (cardData && cardData.locked) {
        cardEl.classList.add('is-locked');
        cardEl.classList.remove('is-placed', 'is-partial');
        cardEl.draggable = false;
        cardEl.setAttribute('aria-disabled', 'true');
        return;
      }

      const count = cardPlacementCounts.get(cId) || 0;
      const isFullyPlaced = count >= totalSubZones;

      if (isFullyPlaced) {
        fullyPlacedCount++;
      }

      const oldPlacedBadge = cardEl.querySelector('.card-placed-badge');
      if (oldPlacedBadge) oldPlacedBadge.remove();
      const oldCounterBadge = cardEl.querySelector('.card-counter-badge');
      if (oldCounterBadge) oldCounterBadge.remove();

      if (isFullyPlaced) {
        cardEl.classList.add('is-placed');
        cardEl.classList.remove('is-partial');
        cardEl.draggable = false;
        cardEl.setAttribute('aria-disabled', 'true');

        const badge = document.createElement('div');
        badge.className = 'card-placed-badge';
        badge.innerHTML = `<i class="fa-solid fa-check"></i><span>${count}</span>`;
        cardEl.appendChild(badge);
      } else if (count > 0) {
        cardEl.classList.remove('is-placed');
        cardEl.classList.add('is-partial');
        cardEl.draggable = true;
        cardEl.removeAttribute('aria-disabled');

        const badge = document.createElement('div');
        badge.className = 'card-counter-badge';
        badge.title = `Размещено в подсекциях: ${count}`;
        badge.innerHTML = `<i class="fa-solid fa-layer-group"></i><span>${count}</span>`;
        cardEl.appendChild(badge);
      } else {
        cardEl.classList.remove('is-placed', 'is-partial');
        cardEl.draggable = true;
        cardEl.removeAttribute('aria-disabled');
      }
    });
  }

  // Counter: available / total
  const totalCount = cards.length;
  const lockedCount = cards.filter(c => c.locked).length;
  const availableCount = totalCount - fullyPlacedCount - lockedCount;
  if (trayCardsCountEl) {
    trayCardsCountEl.textContent = `${availableCount} / ${totalCount}`;
    trayCardsCountEl.title = `Доступно в колоде: ${availableCount} из ${totalCount} (всего на доске: ${totalPlacements}${lockedCount ? ', заблокировано: ' + lockedCount : ''})`;
  }
}
