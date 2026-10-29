/**
 * Censorship Toggle Module (Historical vs Censored German Flag)
 */

import { COUNTRIES } from '../data/countries.js';
import { showToast } from './toast.js';
import { state } from './state.js';

let censorBtnHistoricalEl = null;
let censorBtnCensoredEl = null;

export function initCensorshipMode() {
  censorBtnHistoricalEl = document.getElementById('censor-btn-historical');
  censorBtnCensoredEl = document.getElementById('censor-btn-censored');

  try {
    const saved = localStorage.getItem('hoi4_censorship_mode');
    if (saved === 'historical' || saved === 'censored') {
      state.currentCensorshipMode = saved;
    }
  } catch (e) {}
  setCensorshipMode(state.currentCensorshipMode, false);
}

export function setCensorshipMode(mode, save = true) {
  if (mode !== 'historical' && mode !== 'censored') mode = 'censored';
  state.currentCensorshipMode = mode;

  const gerCountry = COUNTRIES.find(c => c.id === 'germany');
  if (gerCountry) {
    gerCountry.flag = mode === 'historical'
      ? 'assets/flags/germany-historical.svg'
      : 'assets/flags/germany-censored.svg';
  }

  // Live update Germany flag in matrix if currently displayed
  const gerImg = document.querySelector('.country-col-header[data-country="germany"] img');
  if (gerImg && gerCountry) {
    gerImg.src = gerCountry.flag;
  }

  if (!censorBtnHistoricalEl) censorBtnHistoricalEl = document.getElementById('censor-btn-historical');
  if (!censorBtnCensoredEl) censorBtnCensoredEl = document.getElementById('censor-btn-censored');

  if (censorBtnHistoricalEl && censorBtnCensoredEl) {
    if (mode === 'historical') {
      censorBtnHistoricalEl.classList.add('is-active');
      censorBtnCensoredEl.classList.remove('is-active');
    } else {
      censorBtnCensoredEl.classList.add('is-active');
      censorBtnHistoricalEl.classList.remove('is-active');
    }
  }

  if (save) {
    try {
      localStorage.setItem('hoi4_censorship_mode', mode);
    } catch (e) {}
    const modeLabel = mode === 'historical' ? 'Исторический (1933–1945)' : 'Цензурный';
    showToast(`Режим символики: ${modeLabel}`, 2500, false, 'info');
  }
}

export function setupCensorshipListeners() {
  if (!censorBtnHistoricalEl) censorBtnHistoricalEl = document.getElementById('censor-btn-historical');
  if (!censorBtnCensoredEl) censorBtnCensoredEl = document.getElementById('censor-btn-censored');

  if (censorBtnHistoricalEl) {
    censorBtnHistoricalEl.addEventListener('click', (e) => {
      e.stopPropagation();
      setCensorshipMode('historical');
    });
  }

  if (censorBtnCensoredEl) {
    censorBtnCensoredEl.addEventListener('click', (e) => {
      e.stopPropagation();
      setCensorshipMode('censored');
    });
  }
}
