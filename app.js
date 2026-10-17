/**
 * Hearts of Iron IV - 2D Mistakes Matrix Tier List
 * Streamlined UI / Pure Material 3 / Dynamic Square Grid
 * Author: @Redefinedgg for Hearts of This Gym (Данил)
 */

(function () {
  'use strict';

  // --- CONFIGURATION & DATA ---
  const COUNTRIES = [
    { id: 'all', name: 'ОБЩЕЕ' },
    { id: 'germany', name: 'ГЕРМАНИЯ', flag: 'assets/flags/germany.svg' },
    { id: 'ussr', name: 'СССР', flag: 'assets/flags/ussr.svg' },
    { id: 'usa', name: 'США', flag: 'assets/flags/usa.svg' },
    { id: 'uk', name: 'ВЕЛИКОБРИТАНИЯ', flag: 'assets/flags/uk.svg' },
    { id: 'japan', name: 'ЯПОНИЯ', flag: 'assets/flags/japan.svg' },
    { id: 'italy', name: 'ИТАЛИЯ', flag: 'assets/flags/italy.svg' },
    { id: 'france', name: 'ФРАНЦИЯ', flag: 'assets/flags/france.svg' }
  ];

  const TIERS = [
    { id: 'meta', name: 'ПОЛОЖИТЕЛЬНО', className: 'tier-meta' },
    { id: 'whatever', name: 'БЕЗ РАЗНИЦЫ', className: 'tier-whatever' },
    { id: 'noob', name: 'НЕПРИЯТНЕНЬКО', className: 'tier-noob' },
    { id: 'serious', name: 'СЕРЬЁЗНАЯ ОШИБКА', className: 'tier-serious' },
    { id: 'ruin', name: 'РУИНА', className: 'tier-ruin' },
    { id: 'situational', name: 'СИТУАТИВНО', className: 'tier-situational' }
  ];

  // 30 Authentically Curated HOI4 Mistakes in high-res WebP
  const MISTAKES = [
    { id: 'card-01-rubber-deficit', title: 'НЕТ РЕЗИНЫ', img: 'assets/cards/card-01-rubber-deficit.webp' },
    { id: 'card-02-training-in-war', title: 'ЗАБЫЛ СНЯТЬ С ТРЕНИРОВКИ НУЖНЫЕ ДИВКИ', img: 'assets/cards/card-02-training-in-war.webp' },
    { id: 'card-03-no-order', title: 'НАСТУПАТЬ БЕЗ ПРИКАЗА', img: 'assets/cards/card-03-no-order.webp' },
    { id: 'card-04-forgot-building', title: 'ЗАБЫЛ СТРОЙКУ', img: 'assets/cards/card-04-forgot-building.webp' },
    { id: 'card-05-bad-templates', title: 'НЕ МЕТА ШАБЛОНЫ ДИВОК', img: 'assets/cards/card-05-bad-templates.webp' },
    { id: 'card-05b-bad-templates-tanks', title: 'НЕ МЕТА ШАБЛОНЫ ТАНКОВ', img: 'assets/cards/card-05b-bad-templates-tanks.webp' },
    { id: 'card-05c-bad-templates-air', title: 'НЕ МЕТА ШАБЛОНЫ АВИАЦИИ', img: 'assets/cards/card-05c-bad-templates-air.webp' },
    { id: 'card-05d-bad-templates-navy', title: 'НЕ МЕТА ШАБЛОНЫ ФЛОТА', img: 'assets/cards/card-05d-bad-templates-navy.webp' },
    { id: 'card-06-forgot-agency', title: 'ЗАБЫЛ АГЕНТСТВО', img: 'assets/cards/card-06-forgot-agency.webp' },
    { id: 'card-07-zero-stability', title: 'НЕ СЛЕДИТЬ ПРО СТАБИЛЬНОСТЬ И ПОДДЕРЖКУ ВОЙНЫ', img: 'assets/cards/card-07-zero-stability.webp' },
    { id: 'card-10-fleet-sunk-one-battle', title: 'МИНУС ВЕСЬ ФЛОТ В ОДНОМ СРАЖЕНИИ', img: 'assets/cards/card-10-fleet-sunk-one-battle.webp' },
    { id: 'card-11-naval-bombers-no-fleet', title: 'МОРБОБРЫ БЕЗ ФЛОТА', img: 'assets/cards/card-11-naval-bombers-no-fleet.webp' },
    { id: 'card-12-no-manpower', title: '0 МЕНПАВЕРА', img: 'assets/cards/card-12-no-manpower.webp' },
    { id: 'card-13-lost-air', title: 'КРАСНЫЙ ВОЗДУХ', img: 'assets/cards/card-13-lost-air.webp' },
    { id: 'card-15-guns-deficit', title: 'ДЕФИЦИТ СКЛАДОВ НА НАЧАЛЕ ВОЙНЫ', img: 'assets/cards/card-15-guns-deficit.webp' },
    { id: 'card-18-tanks-no-supply', title: 'ГОРЕНИЕ ДИВОК ОТ СНАБЖЕНИЯ', img: 'assets/cards/card-18-tanks-no-supply.webp' },
    { id: 'card-19-no-focus', title: 'ЗАБЫЛ ПОСТАВИТЬ НОВЫЙ ФОКУС', img: 'assets/cards/card-19-no-focus.webp' },
    { id: 'card-26-cb-expired', title: 'СГОРЕЛА ЦЕЛЬ ВОЙНЫ', img: 'assets/cards/card-26-cb-expired.webp' },
    { id: 'card-27-no-dockyards-repair', title: '0 ВЕРФЕЙ НА РЕМОНТ', img: 'assets/cards/card-27-no-dockyards-repair.webp' },
    { id: 'card-28-zero-doctrines', title: 'НЕ ВКАЧЕННЫЕ ДОКТРИНЫ НА НУЖНОМ ЭТАПЕ ВОЙНЫ', img: 'assets/cards/card-28-zero-doctrines.webp' },
    { id: 'card-32-no-trains', title: '0 ПОЕЗДОВ', img: 'assets/cards/card-32-no-trains.webp' },
    { id: 'card-33-no-convoys-trade', title: '0 КОНВОЕВ', img: 'assets/cards/card-33-no-convoys-trade.webp' },
    { id: 'card-34-generals-no-traits', title: 'АРМИЯ БЕЗ ГЕНЕРАЛА', img: 'assets/cards/card-34-generals-no-traits.webp' },
    { id: 'card-36-early-mobilization', title: 'ЗАБЫЛ ПОМЕНЯТЬ ЗАКОН ОБ ЭКОНОМИКЕ', img: 'assets/cards/card-36-early-mobilization.webp' },
    { id: 'card-38-no-radar', title: 'БЕЗ РАДИО', img: 'assets/cards/card-38-no-radar.webp' },
    { id: 'card-39-no-fuel-empty', title: '0 ТОПЛИВА', img: 'assets/cards/card-39-no-fuel-empty.webp' },
    { id: 'card-40-tanks-in-mountains', title: 'ТАНКИ В ГОРАХ', img: 'assets/cards/card-40-tanks-in-mountains.webp' },
    { id: 'card-42-no-decryption', title: 'БЕЗ ДЕШИФРОВКИ', img: 'assets/cards/card-42-no-decryption.webp' },
    { id: 'card-48-english-channel-convoy', title: 'КОНВОИ В КРАСНОМ МОРЕ', img: 'assets/cards/card-48-english-channel-convoy.webp' },
    { id: 'card-55-no-microcontrol', title: 'ОТСУТСТВИЕ МИКРОКОНТРОЛЯ', img: 'assets/cards/card-55-no-microcontrol.webp' }
  ];

  const MISTAKES_MAP = new Map(MISTAKES.map(m => [m.id, m]));

  // Wallpapers gallery
  const WALLPAPERS = [
    { id: 'bg-1', name: 'ИС-3 и горничные', src: 'assets/wallpapers/bg-1.webp' },
    { id: 'bg-2', name: 'Sherman Firefly', src: 'assets/wallpapers/bg-2.webp' },
    { id: 'bg-3', name: 'Т-90 экипаж', src: 'assets/wallpapers/bg-3.webp' },
    { id: 'bg-4', name: 'Танковая рота', src: 'assets/wallpapers/bg-4.webp' },
    { id: 'bg-5', name: 'Girls und Panzer', src: 'assets/wallpapers/bg-5.webp' }
  ];
  let currentWpIndex = 0;

  // App State: { [cellKey]: [cardId1, cardId2, ...] }
  // STARTS 100% EMPTY BY DEFAULT!
  let matrixState = {};
  let lastResetSnapshot = null;

  // Drag Tracking
  let draggedCardInfo = null;
  let isDraggingFlag = false;

  // Tap-to-Place Selection Tracking
  let selectedCardForPlacement = null;

  function clearCardSelection() {
    selectedCardForPlacement = null;
    document.querySelectorAll('.mistake-card.is-selected').forEach(el => el.classList.remove('is-selected'));
    document.body.classList.remove('card-selection-active');
  }

  function selectCardForPlacement(cardId, sourceCellKey, sourceIndex, cardEl) {
    clearCardSelection();
    selectedCardForPlacement = { cardId, sourceCellKey, sourceIndex };
    if (cardEl) {
      cardEl.classList.add('is-selected');
    }
    document.body.classList.add('card-selection-active');
    const mistake = MISTAKES_MAP.get(cardId);
    if (mistake) {
      showToast(`Выбрано: ${mistake.title}. Нажмите на ячейку матрицы.`, 'info', 2200);
    }
  }

  // DOM Elements
  const matrixHeaderRowEl = document.getElementById('matrix-header-row');
  const matrixBoardEl = document.getElementById('matrix-board');
  const bankCardsTrayEl = document.getElementById('bank-cards-tray');
  const resetBtnEl = document.getElementById('reset-matrix-btn') || document.getElementById('reset-btn');
  const undoBtnEl = document.getElementById('undo-btn');
  const wallpaperBtnEl = document.getElementById('wallpaper-btn');
  const previewWpBtnEl = document.getElementById('preview-wallpaper-btn');
  const wpControlBarEl = document.getElementById('wallpaper-control-bar');
  const wpExitBtnEl = document.getElementById('wp-exit-btn');
  const wpPrevBtnEl = document.getElementById('wp-prev-btn');
  const wpNextBtnEl = document.getElementById('wp-next-btn');
  const wpTitleLabelEl = document.getElementById('wp-title-label');
  const toastContainerEl = document.getElementById('toast-container');

  // Lightbox DOM Elements
  const lightboxModalEl = document.getElementById('lightbox-modal');
  const lightboxCloseBtnEl = document.getElementById('lightbox-close-btn');
  const lightboxImgEl = document.getElementById('lightbox-img');
  const lightboxTitleEl = document.getElementById('lightbox-title');

  // --- INITIALIZATION ---
  function init() {
    initWallpaper();
    buildMatrixGrid();
    renderBankCards();
    loadStateFromURL();
    setupEventListeners();
    setupLightboxListeners();
    setupWallpaperListeners();
    updateBankUsageCounters();
  }

  // --- WALLPAPERS CONTROLLER ---
  function initWallpaper() {
    try {
      const saved = localStorage.getItem('hoi4_tier_wp');
      if (saved !== null) {
        currentWpIndex = parseInt(saved, 10) || 0;
      }
    } catch (e) {}
    applyWallpaper(currentWpIndex, false);
  }

  function applyWallpaper(index, showFeedback = true) {
    if (index < 0) index = WALLPAPERS.length - 1;
    if (index >= WALLPAPERS.length) index = 0;
    currentWpIndex = index;
    const wp = WALLPAPERS[currentWpIndex];

    let styleEl = document.getElementById('dynamic-wallpaper-style');
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'dynamic-wallpaper-style';
      document.head.appendChild(styleEl);
    }
    styleEl.textContent = `
      body::before {
        background-image: url('${wp.src}') !important;
      }
    `;

    if (wpTitleLabelEl) {
      wpTitleLabelEl.textContent = `${wp.name} (${currentWpIndex + 1}/${WALLPAPERS.length})`;
    }

    try {
      localStorage.setItem('hoi4_tier_wp', currentWpIndex);
    } catch (e) {}

    if (showFeedback) {
      showToast(`Обои: ${wp.name}`);
    }
  }

  function setWallpaperPreview(active) {
    if (active) {
      document.body.classList.add('wallpaper-preview-active');
    } else {
      document.body.classList.remove('wallpaper-preview-active');
    }
  }

  function setupWallpaperListeners() {
    if (wallpaperBtnEl) {
      wallpaperBtnEl.addEventListener('click', (e) => {
        e.stopPropagation();
        applyWallpaper(currentWpIndex + 1);
      });
    }

    if (previewWpBtnEl) {
      previewWpBtnEl.addEventListener('click', (e) => {
        e.stopPropagation();
        setWallpaperPreview(true);
      });
    }

    if (wpExitBtnEl) {
      wpExitBtnEl.addEventListener('click', (e) => {
        e.stopPropagation();
        setWallpaperPreview(false);
      });
    }

    if (wpPrevBtnEl) {
      wpPrevBtnEl.addEventListener('click', (e) => {
        e.stopPropagation();
        applyWallpaper(currentWpIndex - 1, false);
      });
    }

    if (wpNextBtnEl) {
      wpNextBtnEl.addEventListener('click', (e) => {
        e.stopPropagation();
        applyWallpaper(currentWpIndex + 1, false);
      });
    }

    // Click anywhere on wallpaper in preview mode exits preview
    document.addEventListener('click', (e) => {
      if (document.body.classList.contains('wallpaper-preview-active')) {
        if (!e.target.closest('#wallpaper-control-bar')) {
          setWallpaperPreview(false);
        }
      }
    });
  }

  // --- MATRIX BUILDING ---
  function buildMatrixGrid() {
    if (matrixHeaderRowEl) matrixHeaderRowEl.innerHTML = '';
    matrixBoardEl.innerHTML = '';

    const headerContainer = matrixHeaderRowEl || matrixBoardEl;

    // 1. Top-Left Corner Header
    const cornerEl = document.createElement('div');
    cornerEl.className = 'matrix-corner-header';
    cornerEl.innerHTML = `
      <div class="axis-label-h"><i class="fa-solid fa-arrow-right"></i> Направления</div>
      <div class="axis-label-v"><i class="fa-solid fa-arrow-down"></i> Критичность</div>
    `;
    headerContainer.appendChild(cornerEl);

    // 2. Top Columns: 7 Majors + "ОБЩЕЕ" (Centered, No Subtitles)
    COUNTRIES.forEach(country => {
      const colEl = document.createElement('div');
      colEl.className = 'country-col-header';
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

    // 3. Rows: 6 Tiers x 8 Columns (Centered, Single Clean Main Label)
    TIERS.forEach(tier => {
      const rowHeaderEl = document.createElement('div');
      rowHeaderEl.className = `tier-row-header ${tier.className}`;
      rowHeaderEl.innerHTML = `
        <span class="tier-badge-text">${tier.name}</span>
      `;
      matrixBoardEl.appendChild(rowHeaderEl);

      COUNTRIES.forEach(country => {
        const cellKey = getCellKey(country.id, tier.id);
        const cellEl = document.createElement('div');
        cellEl.className = 'matrix-cell cell-empty';
        cellEl.dataset.cellKey = cellKey;
        cellEl.dataset.country = country.id;
        cellEl.dataset.tier = tier.id;

        cellEl.innerHTML = `
          <div class="cell-placeholder-hint">
            <i class="fa-solid fa-plus"></i>
          </div>
        `;

        setupCellDragEvents(cellEl);
        matrixBoardEl.appendChild(cellEl);
      });
    });
  }

  function getCellKey(countryId, tierId) {
    return `${countryId}__${tierId}`;
  }

  // --- CARD BANK RENDERING ---
  function renderBankCards() {
    bankCardsTrayEl.innerHTML = '';

    MISTAKES.forEach(mistake => {
      const cardEl = createCardElement(mistake.id, false);
      bankCardsTrayEl.appendChild(cardEl);
    });
  }

  // Smart middle truncation: keeps beginning and end of long titles,
  // omitting only the middle words if the text is very long (> 38 chars)
  function formatCardCaption(title) {
    if (!title) return '';
    if (title.length <= 38) return title;
    const words = title.split(/\s+/);
    if (words.length <= 3) {
      const half = 14;
      return `${title.slice(0, half).trim()}... ${title.slice(-half).trim()}`;
    }
    let headWords = [];
    let tailWords = [];
    let i = 0;
    let j = words.length - 1;
    let currentLen = 4;
    while (i < j) {
      const nextHeadLen = words[i].length + (headWords.length > 0 ? 1 : 0);
      const nextTailLen = words[j].length + (tailWords.length > 0 ? 1 : 0);
      if (headWords.length <= tailWords.length && currentLen + nextHeadLen <= 30) {
        headWords.push(words[i]);
        currentLen += nextHeadLen;
        i++;
      } else if (currentLen + nextTailLen <= 30) {
        tailWords.unshift(words[j]);
        currentLen += nextTailLen;
        j--;
      } else {
        break;
      }
    }
    if (headWords.length === 0) headWords.push(words[0]);
    if (tailWords.length === 0) tailWords.unshift(words[words.length - 1]);
    return `${headWords.join(' ')}... ${tailWords.join(' ')}`;
  }

  // --- CREATE MISTAKE CARD ELEMENT ---
  function createCardElement(cardId, isInCell = false, cellKey = null, itemIndex = null) {
    const mistake = MISTAKES_MAP.get(cardId);
    if (!mistake) return document.createElement('div');

    const card = document.createElement('div');
    card.className = 'mistake-card';
    card.draggable = true;
    card.dataset.cardId = cardId;

    if (isInCell) {
      card.dataset.inCell = 'true';
      card.dataset.cellKey = cellKey;
      card.dataset.itemIndex = itemIndex;
    } else {
      card.dataset.inCell = 'false';
    }

    card.innerHTML = `
      <div class="card-art-box">
        <img class="card-img" src="${mistake.img}" alt="${mistake.title}" loading="lazy" decoding="async" />
      </div>
      <div class="card-caption" title="${mistake.title}">${formatCardCaption(mistake.title)}</div>
      <div class="card-tooltip">${mistake.title}</div>
      ${isInCell ? '<button class="card-remove-btn" title="Убрать"><i class="fa-solid fa-xmark"></i></button>' : ''}
      ${!isInCell ? '<span class="card-usage-badge" style="display:none;">0</span>' : ''}
    `;

    // Quick remove button inside cell
    if (isInCell) {
      const removeBtn = card.querySelector('.card-remove-btn');
      if (removeBtn) {
        removeBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          removeCardFromCell(cellKey, itemIndex);
          if (selectedCardForPlacement && selectedCardForPlacement.sourceCellKey === cellKey && selectedCardForPlacement.sourceIndex === itemIndex) {
            clearCardSelection();
          }
        });
      }
    }

    // Desktop Drag events
    card.addEventListener('dragstart', (e) => {
      isDraggingFlag = true;
      draggedCardInfo = {
        cardId: cardId,
        sourceCellKey: isInCell ? cellKey : null,
        sourceIndex: isInCell ? itemIndex : null
      };
      card.classList.add('is-dragging');
      e.dataTransfer.setData('text/plain', cardId);
      e.dataTransfer.effectAllowed = 'move';
    });

    card.addEventListener('dragend', () => {
      card.classList.remove('is-dragging');
      clearAllDragOverStyles();
      draggedCardInfo = null;
      setTimeout(() => {
        isDraggingFlag = false;
      }, 50);
    });

    // Mobile / Touch Drag-and-Drop
    let touchStartX = 0;
    let touchStartY = 0;
    let isTouchDragging = false;
    let touchGhost = null;

    card.addEventListener('touchstart', (e) => {
      if (e.touches.length !== 1) return;
      const touch = e.touches[0];
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
      isTouchDragging = false;
    }, { passive: true });

    card.addEventListener('touchmove', (e) => {
      if (e.touches.length !== 1) return;
      const touch = e.touches[0];
      const dx = touch.clientX - touchStartX;
      const dy = touch.clientY - touchStartY;

      if (!isTouchDragging && (Math.abs(dx) > 10 || Math.abs(dy) > 10)) {
        isTouchDragging = true;
        isDraggingFlag = true;
        draggedCardInfo = {
          cardId: cardId,
          sourceCellKey: isInCell ? cellKey : null,
          sourceIndex: isInCell ? itemIndex : null
        };

        touchGhost = document.createElement('div');
        touchGhost.className = 'touch-drag-avatar';
        touchGhost.innerHTML = `<img src="${mistake.img}" alt="${mistake.title}" />`;
        touchGhost.style.left = `${touch.clientX}px`;
        touchGhost.style.top = `${touch.clientY}px`;
        document.body.appendChild(touchGhost);
      }

      if (isTouchDragging && touchGhost) {
        e.preventDefault(); // Prevent page scroll during card drag
        touchGhost.style.left = `${touch.clientX}px`;
        touchGhost.style.top = `${touch.clientY}px`;

        clearAllDragOverStyles();
        const elemBelow = document.elementFromPoint(touch.clientX, touch.clientY);
        const targetCell = elemBelow?.closest('.matrix-cell');
        if (targetCell) {
          targetCell.classList.add('drag-over');
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
        const targetCell = elemBelow?.closest('.matrix-cell');

        clearAllDragOverStyles();

        if (targetCell && draggedCardInfo) {
          const targetCellKey = targetCell.dataset.cellKey;
          const { cardId: dCardId, sourceCellKey, sourceIndex: dIndex } = draggedCardInfo;
          if (sourceCellKey) {
            if (sourceCellKey !== targetCellKey) {
              removeCardFromCell(sourceCellKey, dIndex, false);
              addCardToCell(targetCellKey, dCardId);
            }
          } else {
            addCardToCell(targetCellKey, dCardId);
          }
        }

        draggedCardInfo = null;
        setTimeout(() => {
          isDraggingFlag = false;
          isTouchDragging = false;
        }, 60);
      }
    }, { passive: true });

    // Click on the entire card opens Fullscreen Lightbox Modal (Zoom)
    card.addEventListener('click', (e) => {
      if (isDraggingFlag || isTouchDragging) return;
      e.stopPropagation();
      openLightbox(cardId);
    });

    return card;
  }

  // --- FULLSCREEN LIGHTBOX CONTROLLER ---
  function openLightbox(cardId) {
    const mistake = MISTAKES_MAP.get(cardId);
    if (!mistake) return;

    lightboxImgEl.src = mistake.img;
    lightboxImgEl.alt = mistake.title;
    if (lightboxTitleEl) {
      lightboxTitleEl.textContent = mistake.title;
    }

    lightboxModalEl.classList.add('is-active');
    lightboxModalEl.setAttribute('aria-hidden', 'false');
  }

  function closeLightbox() {
    lightboxModalEl.classList.remove('is-active');
    lightboxModalEl.setAttribute('aria-hidden', 'true');
  }

  function setupLightboxListeners() {
    if (!lightboxModalEl) return;

    if (lightboxCloseBtnEl) {
      lightboxCloseBtnEl.addEventListener('click', (e) => {
        e.stopPropagation();
        closeLightbox();
      });
    }

    lightboxModalEl.addEventListener('click', (e) => {
      if (!e.target.closest('.lightbox-img')) {
        closeLightbox();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (lightboxModalEl.classList.contains('is-active')) {
          closeLightbox();
        } else if (document.body.classList.contains('wallpaper-preview-active')) {
          setWallpaperPreview(false);
        }
      }
    });
  }

  // --- CELL DRAG & DROP EVENTS & TAP-TO-PLACE ---
  function setupCellDragEvents(cellEl) {
    const cellKey = cellEl.dataset.cellKey;

    cellEl.addEventListener('click', (e) => {
      if (selectedCardForPlacement) {
        e.stopPropagation();
        const { cardId, sourceCellKey, sourceIndex } = selectedCardForPlacement;
        if (sourceCellKey) {
          if (sourceCellKey !== cellKey) {
            removeCardFromCell(sourceCellKey, sourceIndex, false);
            addCardToCell(cellKey, cardId);
          }
        } else {
          addCardToCell(cellKey, cardId);
        }
        clearCardSelection();
      }
    });

    cellEl.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      cellEl.classList.add('drag-over');
    });

    cellEl.addEventListener('dragleave', (e) => {
      if (!cellEl.contains(e.relatedTarget)) {
        cellEl.classList.remove('drag-over');
      }
    });

    cellEl.addEventListener('drop', (e) => {
      e.preventDefault();
      cellEl.classList.remove('drag-over');

      if (!draggedCardInfo) {
        const cardId = e.dataTransfer.getData('text/plain');
        if (cardId && MISTAKES_MAP.has(cardId)) {
          addCardToCell(cellKey, cardId);
        }
        return;
      }

      const { cardId, sourceCellKey, sourceIndex } = draggedCardInfo;

      if (sourceCellKey) {
        if (sourceCellKey === cellKey) {
          return;
        }
        removeCardFromCell(sourceCellKey, sourceIndex, false);
        addCardToCell(cellKey, cardId);
      } else {
        addCardToCell(cellKey, cardId);
      }
    });
  }

  // --- STATE MUTATION & CELL SCALING (DYNAMIC SQUARE GRID ALGORITHM) ---
  function addCardToCell(cellKey, cardId) {
    if (!matrixState[cellKey]) {
      matrixState[cellKey] = [];
    }
    matrixState[cellKey].push(cardId);
    renderCell(cellKey);
    syncStateToURL();
    updateBankUsageCounters();
  }

  function removeCardFromCell(cellKey, itemIndex, shouldSync = true) {
    if (!matrixState[cellKey]) return;
    matrixState[cellKey].splice(itemIndex, 1);
    if (matrixState[cellKey].length === 0) {
      delete matrixState[cellKey];
    }
    renderCell(cellKey);
    if (shouldSync) {
      syncStateToURL();
      updateBankUsageCounters();
    }
  }

  function renderCell(cellKey) {
    const cellEl = document.querySelector(`.matrix-cell[data-cell-key="${cellKey}"]`);
    if (!cellEl) return;

    const cardsInCell = matrixState[cellKey] || [];
    const count = cardsInCell.length;
    cellEl.innerHTML = '';

    if (count === 0) {
      cellEl.classList.add('cell-empty');
      cellEl.classList.remove('cell-has-items', 'cell-dense', 'cell-dense-max');
      cellEl.removeAttribute('data-count');
      cellEl.removeAttribute('data-count-tier');
      cellEl.style.removeProperty('--cols');
      cellEl.innerHTML = `
        <div class="cell-placeholder-hint">
          <i class="fa-solid fa-plus"></i>
        </div>
      `;
    } else {
      cellEl.classList.remove('cell-empty');
      cellEl.classList.add('cell-has-items');
      cellEl.dataset.count = count;

      // Adaptive density scaling: 1-3 -> normal (64px), 4-8 -> dense (48px), 9+ -> ultra-dense (40px)
      if (count <= 3) {
        cellEl.classList.remove('cell-dense', 'cell-dense-max');
        cellEl.dataset.countTier = 'normal';
      } else if (count <= 8) {
        cellEl.classList.add('cell-dense');
        cellEl.classList.remove('cell-dense-max');
        cellEl.dataset.countTier = 'dense';
      } else {
        cellEl.classList.add('cell-dense', 'cell-dense-max');
        cellEl.dataset.countTier = 'ultra-dense';
      }

      cardsInCell.forEach((cId, idx) => {
        const cardEl = createCardElement(cId, true, cellKey, idx);
        cellEl.appendChild(cardEl);
      });
    }
  }

  function renderAllCells() {
    const cells = document.querySelectorAll('.matrix-cell');
    cells.forEach(cell => {
      renderCell(cell.dataset.cellKey);
    });
  }

  function clearAllDragOverStyles() {
    document.querySelectorAll('.matrix-cell.drag-over').forEach(el => el.classList.remove('drag-over'));
    if (bankCardsTrayEl) bankCardsTrayEl.classList.remove('drag-over');
  }

  function updateBankUsageCounters() {
    const counts = {};
    Object.values(matrixState).forEach(arr => {
      arr.forEach(cId => {
        counts[cId] = (counts[cId] || 0) + 1;
      });
    });

    document.querySelectorAll('#bank-cards-tray .mistake-card').forEach(cardEl => {
      const cId = cardEl.dataset.cardId;
      const count = counts[cId] || 0;
      const badge = cardEl.querySelector('.card-usage-badge');
      if (badge) {
        if (count > 0) {
          badge.textContent = count;
          badge.style.display = 'block';
        } else {
          badge.style.display = 'none';
        }
      }
    });
  }

  // --- COMPACT HUMAN-READABLE URL CODEC ---
  // Format: ?m=GER:1:5,12|USA:4:1|ALL:6:14
  const COUNTRY_TO_CODE = {
    germany: 'GER',
    ussr: 'SOV',
    usa: 'USA',
    uk: 'ENG',
    japan: 'JAP',
    italy: 'ITA',
    france: 'FRA',
    all: 'ALL'
  };

  const CODE_TO_COUNTRY = {
    GER: 'germany',
    SOV: 'ussr',
    USA: 'usa',
    ENG: 'uk',
    JAP: 'japan',
    ITA: 'italy',
    FRA: 'france',
    ALL: 'all',
    GEN: 'all'
  };

  const TIER_TO_NUM = {
    meta: '1',         // 1: Положительно
    whatever: '2',     // 2: Без разницы
    noob: '3',         // 3: Неприятненько
    serious: '4',      // 4: Серьёзная ошибка
    ruin: '5',         // 5: Руина
    situational: '6'   // 6: Ситуативно
  };

  const NUM_TO_TIER = {
    '1': 'meta',
    '2': 'whatever',
    '3': 'noob',
    '4': 'serious',
    '5': 'ruin',
    '6': 'situational',
    'SIT': 'situational',
    'S': 'situational'
  };

  // Map cardId <-> integer ID (1..54) based on card number
  const CARD_TO_NUM = {};
  const NUM_TO_CARD = {};
  MISTAKES.forEach((m, idx) => {
    const match = m.id.match(/^card-(\d+)/);
    const num = match ? parseInt(match[1], 10) : (idx + 1);
    CARD_TO_NUM[m.id] = num;
    NUM_TO_CARD[num] = m.id;
  });

  function syncStateToURL() {
    try {
      const segments = [];
      // Deterministic ordering: by Country, then by Tier
      COUNTRIES.forEach(country => {
        TIERS.forEach(tier => {
          const cellKey = getCellKey(country.id, tier.id);
          const cardIds = matrixState[cellKey];
          if (cardIds && cardIds.length > 0) {
            const cCode = COUNTRY_TO_CODE[country.id];
            const tNum = TIER_TO_NUM[tier.id];
            const cardNums = cardIds
              .map(id => CARD_TO_NUM[id])
              .filter(Boolean)
              .join(',');
            if (cardNums.length > 0) {
              segments.push(`${cCode}:${tNum}:${cardNums}`);
            }
          }
        });
      });

      if (segments.length === 0) {
        window.history.replaceState({}, '', window.location.pathname);
      } else {
        const compactStr = segments.join('|');
        window.history.replaceState({}, '', `${window.location.pathname}?m=${compactStr}`);
      }
    } catch (err) {
      console.error('URL serialization error:', err);
    }
  }

  function loadStateFromURL() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const compactParam = urlParams.get('m');

      if (compactParam) {
        const newState = {};
        const segments = decodeURIComponent(compactParam).split(/[|;]/);
        for (const seg of segments) {
          const trimmed = seg.trim();
          if (!trimmed) continue;
          const parts = trimmed.split(':');
          if (parts.length >= 3) {
            const countryCode = parts[0].toUpperCase();
            const tierNum = parts[1].toUpperCase();
            const cardNums = parts[2].split(',');

            const countryId = CODE_TO_COUNTRY[countryCode];
            const tierId = NUM_TO_TIER[tierNum];

            if (countryId && tierId) {
              const cellKey = getCellKey(countryId, tierId);
              const cardIds = cardNums
                .map(n => parseInt(n.trim(), 10))
                .filter(n => !isNaN(n) && NUM_TO_CARD[n])
                .map(n => NUM_TO_CARD[n]);

              if (cardIds.length > 0) {
                newState[cellKey] = cardIds;
              }
            }
          }
        }

        if (Object.keys(newState).length > 0) {
          matrixState = newState;
          renderAllCells();
          updateBankUsageCounters();
          showToast('Тир-лист загружен из ссылки!');
          return;
        }
      }

      // Backward compatibility for legacy ?matrix=... if present
      const legacyEncoded = urlParams.get('matrix');
      if (legacyEncoded) {
        let jsonStr = null;
        if (window.LZString && typeof window.LZString.decompressFromEncodedURIComponent === 'function') {
          jsonStr = window.LZString.decompressFromEncodedURIComponent(legacyEncoded);
        }
        if (!jsonStr) {
          try {
            jsonStr = decodeURIComponent(atob(legacyEncoded));
          } catch (e) {}
        }
        if (jsonStr) {
          const parsed = JSON.parse(jsonStr);
          if (parsed && typeof parsed === 'object') {
            matrixState = parsed;
            renderAllCells();
            updateBankUsageCounters();
            syncStateToURL();
            showToast('Тир-лист загружен и обновлен!');
            return;
          }
        }
      }
    } catch (err) {
      console.warn('Could not restore state from URL:', err);
    }

    // Default start state is COMPLETELY EMPTY!
    matrixState = {};
    renderAllCells();
    updateBankUsageCounters();
  }

  // --- TWO-STEP RESET CONFIRMATION & UNDO ---
  let activeConfirmToast = null;

  function hasPlacedCards() {
    for (const key in matrixState) {
      if (Array.isArray(matrixState[key]) && matrixState[key].length > 0) {
        return true;
      }
    }
    return false;
  }

  function requestResetConfirmation() {
    if (!hasPlacedCards()) {
      showToast('Матрица уже пуста!');
      return;
    }

    if (activeConfirmToast) {
      activeConfirmToast.remove();
      activeConfirmToast = null;
    }

    const toast = document.createElement('div');
    toast.className = 'toast toast-confirm show';
    toast.innerHTML = `
      <div class="toast-content">
        <i class="fa-solid fa-triangle-exclamation toast-icon"></i>
        <span>Сбросить матрицу?</span>
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

  function executeReset() {
    lastResetSnapshot = JSON.parse(JSON.stringify(matrixState));
    matrixState = {};
    renderAllCells();
    try {
      window.history.replaceState(null, '', window.location.pathname);
    } catch (e) {}
    updateBankUsageCounters();

    if (undoBtnEl) {
      undoBtnEl.style.display = 'inline-flex';
    }

    showToast('Матрица очищена.', 6000, true);
  }

  function executeUndo() {
    if (!lastResetSnapshot) return;
    matrixState = JSON.parse(JSON.stringify(lastResetSnapshot));
    lastResetSnapshot = null;
    renderAllCells();
    syncStateToURL();
    updateBankUsageCounters();

    if (undoBtnEl) {
      undoBtnEl.style.display = 'none';
    }

    showToast('Матрица полностью восстановлена!');
  }

  // --- ACTIONS & CONTROLS ---
  function setupEventListeners() {
    // Direct and delegated listeners for robust event handling
    document.addEventListener('click', (e) => {
      const resetBtn = e.target.closest('#reset-matrix-btn, #reset-btn');
      if (resetBtn) {
        e.preventDefault();
        e.stopPropagation();
        requestResetConfirmation();
        return;
      }

      const undoBtn = e.target.closest('#undo-btn');
      if (undoBtn) {
        e.preventDefault();
        e.stopPropagation();
        executeUndo();
        return;
      }

      // If clicked outside cards and matrix cells, clear card selection
      if (selectedCardForPlacement) {
        if (!e.target.closest('.mistake-card') && !e.target.closest('.matrix-cell')) {
          clearCardSelection();
        }
      }
    });

    // Clicking or dropping on the bottom tray returns selected in-cell card to bank
    if (bankCardsTrayEl) {
      bankCardsTrayEl.addEventListener('click', (e) => {
        if (selectedCardForPlacement && selectedCardForPlacement.sourceCellKey) {
          e.stopPropagation();
          const { sourceCellKey, sourceIndex } = selectedCardForPlacement;
          removeCardFromCell(sourceCellKey, sourceIndex, true);
          clearCardSelection();
        }
      });

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

        if (draggedCardInfo && draggedCardInfo.sourceCellKey) {
          removeCardFromCell(draggedCardInfo.sourceCellKey, draggedCardInfo.sourceIndex, true);
        }
      });
    }
  }

  // --- TOAST NOTIFICATIONS (TOP-LEFT) ---
  function showToast(message, duration = 3200, showUndo = false) {
    if (!toastContainerEl) return;

    const toast = document.createElement('div');
    toast.className = 'toast';

    if (showUndo) {
      toast.innerHTML = `
        <div class="toast-content">
          <i class="fa-solid fa-circle-check toast-icon"></i>
          <span>${message}</span>
        </div>
        <div class="toast-actions">
          <button class="toast-btn toast-btn-cancel" id="toast-undo-action">
            <i class="fa-solid fa-rotate-left"></i>
            <span>Вернуть</span>
          </button>
        </div>
      `;
      const undoBtn = toast.querySelector('#toast-undo-action');
      if (undoBtn) {
        undoBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          toast.classList.remove('show');
          setTimeout(() => toast.remove(), 160);
          executeUndo();
        });
      }
    } else {
      toast.innerHTML = `
        <div class="toast-content">
          <i class="fa-solid fa-circle-info toast-icon"></i>
          <span>${message}</span>
        </div>
      `;
    }

    toastContainerEl.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    setTimeout(() => {
      if (toast.parentNode) {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 160);
      }
    }, duration);
  }

  // Start app
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
