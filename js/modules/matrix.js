/**
 * Matrix Grid & 3-Zone Cell Rendering Controller
 */

import { COUNTRIES } from '../data/countries.js';
import { state, getCurrentTierList, getZoneKey, syncActiveListState, getVisibleCountries } from './state.js';
import { createCardElement } from './cards.js';
import { setupSubZoneDragEvents } from './dnd.js';
import { updateBankCardsStatus } from './tray.js';

export function buildMatrixGrid() {
  const matrixHeaderRowEl = document.getElementById('matrix-header-row');
  const matrixBoardEl = document.getElementById('matrix-board');
  if (matrixHeaderRowEl) matrixHeaderRowEl.innerHTML = '';
  if (matrixBoardEl) matrixBoardEl.innerHTML = '';

  const list = getCurrentTierList();
  const headerContainer = matrixHeaderRowEl || matrixBoardEl;
  const visibleCountries = getVisibleCountries();
  const colCount = visibleCountries.length;

  // Dynamic Grid Template Columns & Container Min-Width
  const gridCols = `90px repeat(${colCount}, minmax(145px, 1fr))`;
  const minWidthPx = Math.max(800, 90 + colCount * 148 + 10);

  if (matrixHeaderRowEl) {
    matrixHeaderRowEl.style.gridTemplateColumns = gridCols;
    matrixHeaderRowEl.style.minWidth = `${minWidthPx}px`;
  }
  if (matrixBoardEl) {
    matrixBoardEl.style.gridTemplateColumns = gridCols;
    matrixBoardEl.style.minWidth = `${minWidthPx}px`;
  }
  const scrollContainer = document.querySelector('.matrix-scroll-container');
  if (scrollContainer) {
    scrollContainer.style.minWidth = `${minWidthPx}px`;
  }

  // 1. Top-Left Corner Header
  const axisH = list.axisH || 'НАПРАВЛЕНИЯ';
  const axisV = list.axisV || 'КРИТИЧНОСТЬ';

  const cornerEl = document.createElement('div');
  cornerEl.className = 'matrix-corner-header';
  cornerEl.innerHTML = `
    <div class="axis-label-h"><i class="fa-solid fa-arrow-right"></i> ${axisH}</div>
    <div class="axis-label-v"><i class="fa-solid fa-arrow-down"></i> ${axisV}</div>
  `;
  headerContainer.appendChild(cornerEl);

  // 2. Top Columns: Selected visible countries
  visibleCountries.forEach(country => {
    const colEl = document.createElement('div');
    colEl.className = 'country-col-header';
    colEl.dataset.country = country.id;
    if (country.flag) {
      colEl.innerHTML = `
        <div class="flag-box country-flag-box">
          <img src="${country.flag}" alt="${country.name}" loading="lazy" />
        </div>
        <div class="country-title">${country.name}</div>
      `;
    } else {
      colEl.classList.add('general-col-header');
      colEl.innerHTML = `
        <div class="country-title general-title">
          <span>${country.name}</span>
        </div>
      `;
    }
    headerContainer.appendChild(colEl);
  });

  // 3. Rows: 6 Tiers x Selected Columns with 3 Sub-Zones per Cell
  list.tiers.forEach(tier => {
    const rowHeaderEl = document.createElement('div');
    rowHeaderEl.className = `tier-row-header ${tier.className}`;
    rowHeaderEl.dataset.tier = tier.id;
    rowHeaderEl.innerHTML = `
      <span class="tier-badge-text">${tier.name}</span>
    `;
    matrixBoardEl.appendChild(rowHeaderEl);

    visibleCountries.forEach(country => {
      const cellKey = `${country.id}__${tier.id}`;
      const cellEl = document.createElement('div');
      cellEl.className = 'matrix-cell';
      cellEl.dataset.cellKey = cellKey;
      cellEl.dataset.country = country.id;
      cellEl.dataset.tier = tier.id;

      const subZones = [
        { id: 'mp', name: 'МП', title: 'МП (Мультиплеер)', className: 'cell-zone-mp' },
        { id: 'all', name: 'ОБЩ', title: 'ОБЩЕЕ (актуально везде)', className: 'cell-zone-all' },
        { id: 'sp', name: 'СП', title: 'СП (Одиночная игра)', className: 'cell-zone-sp' }
      ];

      subZones.forEach(z => {
        const zoneKey = getZoneKey(country.id, tier.id, z.id);
        const zoneEl = document.createElement('div');
        zoneEl.className = `cell-sub-zone ${z.className}`;
        zoneEl.dataset.zone = z.id;
        zoneEl.dataset.zoneKey = zoneKey;
        zoneEl.dataset.country = country.id;
        zoneEl.dataset.tier = tier.id;
        zoneEl.title = z.title;

        zoneEl.innerHTML = `
          <div class="zone-badge">
            <span class="zone-label">${z.name}</span>
          </div>
          <div class="zone-cards"></div>
        `;

        setupSubZoneDragEvents(zoneEl, tier);
        cellEl.appendChild(zoneEl);
      });

      matrixBoardEl.appendChild(cellEl);
    });
  });
}

export function addCardToZone(zoneKey, cardId) {
  if (!state.matrixState[zoneKey]) {
    state.matrixState[zoneKey] = [];
  }
  state.matrixState[zoneKey].push(cardId);
  syncActiveListState();
  renderZone(zoneKey);
  updateBankCardsStatus();
}

export function removeCardIdFromZone(zoneKey, cardId, shouldUpdateStatus = true) {
  if (!state.matrixState[zoneKey]) return;
  const idx = state.matrixState[zoneKey].indexOf(cardId);
  if (idx !== -1) {
    state.matrixState[zoneKey].splice(idx, 1);
    if (state.matrixState[zoneKey].length === 0) {
      delete state.matrixState[zoneKey];
    }
    syncActiveListState();
    renderZone(zoneKey);
    if (shouldUpdateStatus) {
      updateBankCardsStatus();
    }
  }
}

export function removeCardFromCountry(countryId, cardId, shouldUpdateStatus = true) {
  for (const key in state.matrixState) {
    const [cId] = key.split('__');
    if (cId === countryId && Array.isArray(state.matrixState[key])) {
      const idx = state.matrixState[key].indexOf(cardId);
      if (idx !== -1) {
        state.matrixState[key].splice(idx, 1);
        if (state.matrixState[key].length === 0) {
          delete state.matrixState[key];
        }
        syncActiveListState();
        renderZone(key);
        if (shouldUpdateStatus) {
          updateBankCardsStatus();
        }
        return;
      }
    }
  }
}

export function renderZone(zoneKey) {
  const zoneEl = document.querySelector(`.cell-sub-zone[data-zone-key="${zoneKey}"]`);
  if (!zoneEl) return;

  const cardsContainer = zoneEl.querySelector('.zone-cards');
  if (!cardsContainer) return;

  const cardsInZone = state.matrixState[zoneKey] || [];
  cardsContainer.innerHTML = '';

  if (cardsInZone.length === 0) {
    zoneEl.classList.remove('has-cards');
  } else {
    zoneEl.classList.add('has-cards');
    cardsInZone.forEach((cId, idx) => {
      const cardEl = createCardElement(cId, true, zoneKey, idx);
      cardsContainer.appendChild(cardEl);
    });
  }
}

export function renderCell(cellKey) {
  const [countryId, tierId] = cellKey.split('__');
  ['mp', 'all', 'sp'].forEach(z => {
    renderZone(getZoneKey(countryId, tierId, z));
  });
}

export function renderAllCells() {
  const list = getCurrentTierList();
  getVisibleCountries().forEach(country => {
    list.tiers.forEach(tier => {
      ['mp', 'all', 'sp'].forEach(z => {
        renderZone(getZoneKey(country.id, tier.id, z));
      });
    });
  });
}
