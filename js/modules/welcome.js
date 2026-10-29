/**
 * Welcome Screen & Tier-List Navigation Controller
 */

import { TIER_LISTS } from '../data/tierlists.js';
import { state, hasPlacedCards, clearCardSelection } from './state.js';
import { buildMatrixGrid, renderAllCells } from './matrix.js';
import { renderBankCards, updateBankCardsStatus, updateDeckOffset } from './tray.js';
import { copyShareLink } from './url.js';

let welcomeScreenEl = null;
let leaveConfirmModalEl = null;
let selectTrikiwiCardEl = null;
let selectAtomCardEl = null;
let backToSelectBtnEl = null;
let cancelLeaveBtnEl = null;
let confirmLeaveBtnEl = null;
let brandTitleEl = null;
let trayTitleTextEl = null;
let shareBtnEl = null;
let undoBtnEl = null;

export function getCardCountLabel(count) {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod100 >= 11 && mod100 <= 19) return `${count} карточек`;
  if (mod10 === 1) return `${count} карточка`;
  if (mod10 >= 2 && mod10 <= 4) return `${count} карточки`;
  return `${count} карточек`;
}

export function updateWelcomeScreenCounts() {
  const trikiwiBadge = document.getElementById('trikiwi-card-count-badge');
  const atomBadge = document.getElementById('atom-card-count-badge');

  if (trikiwiBadge && TIER_LISTS.mistakes) {
    const count = TIER_LISTS.mistakes.cards.length;
    trikiwiBadge.innerHTML = `<i class="fa-solid fa-layer-group"></i><span>${count}</span>`;
  }

  if (atomBadge && TIER_LISTS.features) {
    const count = TIER_LISTS.features.cards.length;
    atomBadge.innerHTML = `<i class="fa-solid fa-layer-group"></i><span>${count}</span>`;
  }
}

export function showWelcomeScreen() {
  welcomeScreenEl = document.getElementById('welcome-screen');
  clearCardSelection();
  updateWelcomeScreenCounts();
  if (welcomeScreenEl) {
    welcomeScreenEl.classList.remove('is-hidden');
  }
}

export function hideWelcomeScreen() {
  welcomeScreenEl = document.getElementById('welcome-screen');
  if (welcomeScreenEl) {
    welcomeScreenEl.classList.add('is-hidden');
  }
}

export function selectTierList(listId, skipUrlUpdate = false) {
  if (listId === 'trikiwi') listId = 'mistakes';
  if (listId === 'atom' || listId === 'mechanics') listId = 'features';
  if (!TIER_LISTS[listId]) listId = 'mistakes';

  state.currentTierListId = listId;
  const list = TIER_LISTS[listId];

  if (!state.listStates[listId]) {
    state.listStates[listId] = {};
  }

  brandTitleEl = document.getElementById('brand-title');
  trayTitleTextEl = document.getElementById('tray-title-text');
  undoBtnEl = document.getElementById('undo-btn');

  // Update UI headers
  if (brandTitleEl) brandTitleEl.textContent = list.title;
  if (trayTitleTextEl) trayTitleTextEl.textContent = list.trayTitle;

  state.matrixState = state.listStates[listId] || {};
  state.lastResetSnapshot = null;
  if (undoBtnEl) undoBtnEl.style.display = 'none';

  buildMatrixGrid();
  renderBankCards();
  renderAllCells();
  updateBankCardsStatus();
  requestAnimationFrame(updateDeckOffset);

  hideWelcomeScreen();

  if (!skipUrlUpdate) {
    try {
      const url = `${window.location.pathname}?list=${listId}`;
      window.history.pushState({ screen: 'tierlist', list: listId }, '', url);
    } catch (e) {}
  }
}

export function requestReturnToWelcomeScreen() {
  leaveConfirmModalEl = document.getElementById('leave-confirm-modal');
  if (hasPlacedCards()) {
    if (leaveConfirmModalEl) {
      leaveConfirmModalEl.classList.add('is-active');
    }
  } else {
    executeReturnToWelcomeScreen();
  }
}

export function executeReturnToWelcomeScreen() {
  leaveConfirmModalEl = document.getElementById('leave-confirm-modal');
  if (leaveConfirmModalEl) {
    leaveConfirmModalEl.classList.remove('is-active');
  }
  state.listStates[state.currentTierListId] = {};
  state.matrixState = {};
  state.lastResetSnapshot = null;
  clearCardSelection();
  try {
    window.history.pushState({ screen: 'welcome' }, '', window.location.pathname);
  } catch (e) {}
  showWelcomeScreen();
}

export function setupWelcomeAndNavListeners() {
  selectTrikiwiCardEl = document.getElementById('select-trikiwi-card');
  selectAtomCardEl = document.getElementById('select-atom-card');
  backToSelectBtnEl = document.getElementById('back-to-select-btn');
  cancelLeaveBtnEl = document.getElementById('cancel-leave-btn');
  confirmLeaveBtnEl = document.getElementById('confirm-leave-btn');
  shareBtnEl = document.getElementById('share-btn');
  leaveConfirmModalEl = document.getElementById('leave-confirm-modal');

  if (selectTrikiwiCardEl) {
    selectTrikiwiCardEl.addEventListener('click', () => selectTierList('mistakes'));
    selectTrikiwiCardEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectTierList('mistakes');
      }
    });
  }

  if (selectAtomCardEl) {
    selectAtomCardEl.addEventListener('click', () => selectTierList('features'));
    selectAtomCardEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectTierList('features');
      }
    });
  }

  if (backToSelectBtnEl) {
    backToSelectBtnEl.addEventListener('click', (e) => {
      e.stopPropagation();
      requestReturnToWelcomeScreen();
    });
  }

  if (cancelLeaveBtnEl) {
    cancelLeaveBtnEl.addEventListener('click', () => {
      if (leaveConfirmModalEl) leaveConfirmModalEl.classList.remove('is-active');
    });
  }

  if (confirmLeaveBtnEl) {
    confirmLeaveBtnEl.addEventListener('click', () => {
      executeReturnToWelcomeScreen();
    });
  }

  if (shareBtnEl) {
    shareBtnEl.addEventListener('click', (e) => {
      e.stopPropagation();
      copyShareLink();
    });
  }
}

export function setupHistoryListener() {
  window.addEventListener('popstate', (e) => {
    const historyState = e.state;
    if (historyState && historyState.screen === 'tierlist' && historyState.list) {
      selectTierList(historyState.list, true);
    } else {
      clearCardSelection();
      showWelcomeScreen();
    }
  });
}
