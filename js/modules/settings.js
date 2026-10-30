/**
 * Settings Dropdown & Country Customization Modal Controller
 * Allows toggling displayed countries in matrix grid,
 * deck scale, censorship mode, wallpapers, and matrix reset.
 * Author: @redefinedtgk
 */

import { COUNTRIES } from '../data/countries.js';
import { state, getVisibleCountries } from './state.js';
import { buildMatrixGrid, renderAllCells } from './matrix.js';
import { updateBankCardsStatus } from './tray.js';
import { showToast } from './toast.js';

let settingsDropdownWrapperEl = null;
let settingsMenuBtnEl = null;
let settingsDropdownMenuEl = null;
let openCountriesModalBtnEl = null;
let countriesStatusLabelEl = null;

let countriesModalEl = null;
let countriesChecklistGridEl = null;
let countriesSummaryEl = null;

// Temporary selection during modal interaction
let tempSelectedCountryIds = new Set();

export function initSettings() {
  settingsDropdownWrapperEl = document.getElementById('settings-dropdown-wrapper');
  settingsMenuBtnEl = document.getElementById('settings-menu-btn');
  settingsDropdownMenuEl = document.getElementById('settings-dropdown-menu');
  openCountriesModalBtnEl = document.getElementById('open-countries-modal-btn');
  countriesStatusLabelEl = document.getElementById('settings-countries-status');

  countriesModalEl = document.getElementById('countries-modal');
  countriesChecklistGridEl = document.getElementById('countries-checklist-grid');

  setupDropdownListeners();
  setupCountriesModalListeners();
  updateCountriesStatusLabel();
}

/**
 * Update dropdown subtitle indicating visible countries count
 */
export function updateCountriesStatusLabel() {
  if (!countriesStatusLabelEl) countriesStatusLabelEl = document.getElementById('settings-countries-status');
  if (countriesStatusLabelEl) {
    const visibleCount = state.visibleCountryIds ? state.visibleCountryIds.length : COUNTRIES.length;
    countriesStatusLabelEl.textContent = `Показано: ${visibleCount} из ${COUNTRIES.length}`;
  }
}

/**
 * Setup Toggle, Backdrop, and Escape handlers for the Settings Dropdown
 */
function setupDropdownListeners() {
  if (settingsMenuBtnEl) {
    settingsMenuBtnEl.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleSettingsDropdown();
    });
  }

  // Close dropdown on click outside
  document.addEventListener('click', (e) => {
    if (settingsDropdownMenuEl && settingsDropdownMenuEl.classList.contains('is-open')) {
      if (!settingsDropdownWrapperEl.contains(e.target)) {
        closeSettingsDropdown();
      }
    }
  });

  // Close dropdown on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' || e.key === 'Esc') {
      if (settingsDropdownMenuEl && settingsDropdownMenuEl.classList.contains('is-open')) {
        closeSettingsDropdown();
      }
    }
  });

  // Auto-close dropdown when actions like Wallpaper or Reset are pressed
  const autoCloseSelectors = ['#wallpaper-btn', '#preview-wallpaper-btn', '#reset-matrix-btn'];
  autoCloseSelectors.forEach(sel => {
    const el = document.querySelector(sel);
    if (el) {
      el.addEventListener('click', () => {
        closeSettingsDropdown();
      });
    }
  });
}

export function toggleSettingsDropdown() {
  if (!settingsDropdownMenuEl) return;
  const isOpen = settingsDropdownMenuEl.classList.contains('is-open');
  if (isOpen) {
    closeSettingsDropdown();
  } else {
    openSettingsDropdown();
  }
}

export function openSettingsDropdown() {
  if (!settingsDropdownMenuEl || !settingsMenuBtnEl) return;
  settingsDropdownMenuEl.classList.add('is-open');
  settingsMenuBtnEl.classList.add('is-active');
  settingsMenuBtnEl.setAttribute('aria-expanded', 'true');
  updateCountriesStatusLabel();
}

export function closeSettingsDropdown() {
  if (!settingsDropdownMenuEl || !settingsMenuBtnEl) return;
  settingsDropdownMenuEl.classList.remove('is-open');
  settingsMenuBtnEl.classList.remove('is-active');
  settingsMenuBtnEl.setAttribute('aria-expanded', 'false');
}

/**
 * Countries Customization Modal Setup & Event Listeners
 */
function setupCountriesModalListeners() {
  if (openCountriesModalBtnEl) {
    openCountriesModalBtnEl.addEventListener('click', (e) => {
      e.stopPropagation();
      closeSettingsDropdown();
      openCountriesModal();
    });
  }

  const closeBtn = document.getElementById('close-countries-modal-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeCountriesModal);
  }

  const cancelBtn = document.getElementById('cancel-countries-btn');
  if (cancelBtn) {
    cancelBtn.addEventListener('click', closeCountriesModal);
  }

  // Click on modal backdrop to close
  if (countriesModalEl) {
    countriesModalEl.addEventListener('click', (e) => {
      if (e.target === countriesModalEl) {
        closeCountriesModal();
      }
    });
  }

  // Apply Changes
  const applyBtn = document.getElementById('apply-countries-btn');
  if (applyBtn) {
    applyBtn.addEventListener('click', applyCountriesSelection);
  }

  // Escape key for modal
  document.addEventListener('keydown', (e) => {
    if ((e.key === 'Escape' || e.key === 'Esc') && countriesModalEl && countriesModalEl.classList.contains('is-active')) {
      closeCountriesModal();
    }
  });
}

export function openCountriesModal() {
  if (!countriesModalEl) return;

  // Initialize temp selection from current state
  tempSelectedCountryIds = new Set(state.visibleCountryIds || COUNTRIES.map(c => c.id));

  renderCountriesChecklist();
  countriesModalEl.classList.add('is-active');
  countriesModalEl.setAttribute('aria-hidden', 'false');
}

export function closeCountriesModal() {
  if (!countriesModalEl) return;
  countriesModalEl.classList.remove('is-active');
  countriesModalEl.setAttribute('aria-hidden', 'true');
}

/**
 * Render Country Toggle Items inside the Modal Grid
 */
function renderCountriesChecklist() {
  if (!countriesChecklistGridEl) countriesChecklistGridEl = document.getElementById('countries-checklist-grid');
  if (!countriesChecklistGridEl) return;

  countriesChecklistGridEl.innerHTML = '';

  COUNTRIES.forEach(country => {
    const isChecked = tempSelectedCountryIds.has(country.id);

    // Calculate placed cards count for this country
    let placedCount = 0;
    for (const key in state.matrixState) {
      if (key.startsWith(`${country.id}__`) && Array.isArray(state.matrixState[key])) {
        placedCount += state.matrixState[key].length;
      }
    }

    const itemEl = document.createElement('label');
    itemEl.className = `country-toggle-card ${isChecked ? 'is-active' : ''}`;
    itemEl.dataset.countryId = country.id;

    const flagHtml = country.flag
      ? `<div class="country-toggle-flag-box"><img src="${country.flag}" alt="${country.name}" /></div>`
      : `<div class="country-toggle-flag-box general-toggle-box"><i class="fa-solid fa-layer-group"></i></div>`;

    const placedBadgeHtml = placedCount > 0
      ? `<span class="country-toggle-badge"><i class="fa-solid fa-thumbtack"></i> ${placedCount}</span>`
      : '';

    itemEl.innerHTML = `
      <input type="checkbox" class="country-toggle-checkbox" value="${country.id}" ${isChecked ? 'checked' : ''} />
      ${flagHtml}
      <div class="country-toggle-info">
        <span class="country-toggle-name">${country.name}</span>
        ${placedBadgeHtml}
      </div>
      <div class="country-toggle-switch">
        <span class="country-toggle-slider"></span>
      </div>
    `;

    const checkbox = itemEl.querySelector('.country-toggle-checkbox');
    checkbox.addEventListener('change', () => {
      if (checkbox.checked) {
        tempSelectedCountryIds.add(country.id);
        itemEl.classList.add('is-active');
      } else {
        if (tempSelectedCountryIds.size <= 1) {
          checkbox.checked = true;
          showToast('В таблице должна остаться хотя бы одна страна!', 2200, false, 'warning');
          return;
        }
        tempSelectedCountryIds.delete(country.id);
        itemEl.classList.remove('is-active');
      }
    });

    countriesChecklistGridEl.appendChild(itemEl);
  });
}

/**
 * Apply the selected countries to matrix state and re-render grid
 */
function applyCountriesSelection() {
  if (tempSelectedCountryIds.size === 0) {
    showToast('Выберите хотя бы одну страну!', 2200, false, 'warning');
    return;
  }

  // Preserve original ordering from COUNTRIES array
  const orderedSelected = COUNTRIES
    .filter(c => tempSelectedCountryIds.has(c.id))
    .map(c => c.id);

  state.visibleCountryIds = orderedSelected;

  try {
    localStorage.setItem('hoi4_visible_countries', JSON.stringify(orderedSelected));
  } catch (e) {
    console.error('Failed to save visible countries to localStorage:', e);
  }

  // Rebuild Matrix with new visible columns
  buildMatrixGrid();
  renderAllCells();
  updateBankCardsStatus();
  updateCountriesStatusLabel();

  closeCountriesModal();
  showToast(`Список стран обновлен! Отображается: ${orderedSelected.length} из ${COUNTRIES.length}`, 2800, false, 'info');
}
