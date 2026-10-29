/**
 * Reset & Undo Controller Module
 */

import { state, hasPlacedCards } from './state.js';
import { showToast } from './toast.js';
import { renderAllCells, removeCardIdFromZone } from './matrix.js';
import { updateBankCardsStatus } from './tray.js';

let activeConfirmToast = null;
let toastContainerEl = null;
let resetBtnEl = null;
let undoBtnEl = null;
let bankCardsTrayEl = null;

export function requestResetConfirmation() {
  if (!hasPlacedCards()) {
    showToast('Матрица уже пуста!', 2200, false, 'tip');
    return;
  }

  if (activeConfirmToast) {
    activeConfirmToast.remove();
    activeConfirmToast = null;
  }

  toastContainerEl = document.getElementById('toast-container');
  if (!toastContainerEl) return;

  const toast = document.createElement('div');
  toast.className = 'toast toast-danger';
  toast.innerHTML = `
    <div class="toast-icon-badge">
      <i class="fa-solid fa-triangle-exclamation"></i>
    </div>
    <div class="toast-content">
      <span>Сбросить все клетки матрицы?</span>
    </div>
    <div class="toast-actions">
      <button class="toast-btn toast-btn-confirm" id="confirm-reset-action">
        <i class="fa-solid fa-check"></i>
        <span>Да</span>
      </button>
      <button class="toast-btn toast-btn-cancel" id="cancel-reset-action">
        <i class="fa-solid fa-xmark"></i>
        <span>Отмена</span>
      </button>
    </div>
  `;

  toastContainerEl.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));
  activeConfirmToast = toast;

  let autoCloseTimer = setTimeout(() => {
    dismissConfirmToast();
  }, 8000);

  function dismissConfirmToast() {
    clearTimeout(autoCloseTimer);
    if (toast.parentNode) {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 160);
    }
    activeConfirmToast = null;
  }

  const confirmBtn = toast.querySelector('#confirm-reset-action');
  if (confirmBtn) {
    confirmBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      dismissConfirmToast();
      executeReset();
    });
  }

  const cancelBtn = toast.querySelector('#cancel-reset-action');
  if (cancelBtn) {
    cancelBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      dismissConfirmToast();
    });
  }
}

export function executeReset() {
  state.lastResetSnapshot = JSON.parse(JSON.stringify(state.matrixState));
  state.matrixState = {};
  if (state.listStates[state.currentTierListId]) {
    state.listStates[state.currentTierListId] = {};
  }
  renderAllCells();
  updateBankCardsStatus();

  undoBtnEl = document.getElementById('undo-btn');
  if (undoBtnEl) {
    undoBtnEl.style.display = 'inline-flex';
  }

  showToast('Матрица очищена.', 6000, true);
}

export function executeUndo() {
  if (!state.lastResetSnapshot) return;
  state.matrixState = JSON.parse(JSON.stringify(state.lastResetSnapshot));
  if (state.listStates[state.currentTierListId]) {
    state.listStates[state.currentTierListId] = state.matrixState;
  }
  state.lastResetSnapshot = null;
  renderAllCells();
  updateBankCardsStatus();

  undoBtnEl = document.getElementById('undo-btn');
  if (undoBtnEl) {
    undoBtnEl.style.display = 'none';
  }

  showToast('Матрица восстановлена!', 2500, false, 'success');
}

// Global hook for toast undo action button
if (typeof window !== 'undefined') {
  window._executeUndo = executeUndo;
}

export function setupActionListeners() {
  resetBtnEl = document.getElementById('reset-matrix-btn');
  undoBtnEl = document.getElementById('undo-btn');
  bankCardsTrayEl = document.getElementById('bank-cards-tray');

  if (resetBtnEl) {
    resetBtnEl.addEventListener('click', (e) => {
      e.stopPropagation();
      requestResetConfirmation();
    });
  }

  if (undoBtnEl) {
    undoBtnEl.addEventListener('click', (e) => {
      e.stopPropagation();
      executeUndo();
    });
  }

  // Drag back to tray to remove card from matrix
  if (bankCardsTrayEl) {
    bankCardsTrayEl.addEventListener('dragover', (e) => {
      e.preventDefault();
      bankCardsTrayEl.classList.add('drag-over');
    });

    bankCardsTrayEl.addEventListener('dragleave', () => {
      bankCardsTrayEl.classList.remove('drag-over');
    });

    bankCardsTrayEl.addEventListener('drop', (e) => {
      e.preventDefault();
      bankCardsTrayEl.classList.remove('drag-over');

      if (state.draggedCardInfo && state.draggedCardInfo.sourceZoneKey) {
        removeCardIdFromZone(state.draggedCardInfo.sourceZoneKey, state.draggedCardInfo.cardId, true);
      }
    });
  }
}
