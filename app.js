/**
 * Hearts of Iron IV - 2D Matrix Tier List Hub
 * Supports:
 *   1. "Ошибки в HOI4 (trikiwi)"
 *   2. "Фишки и механики (Атом в леггинсах)"
 * Features:
 *   - Welcome Screen / Modal Tier-List Selector
 *   - Dynamic Tier-Colored Drag-and-Drop Highlights
 *   - Anti-Duplicate Protection (Streamer Bug Fix)
 *   - Share & Restore State via URL (LZString / Base64)
 *   - Smooth Horizontal Wheel Scrolling & Zoom Control (80%-120% with double-click reset)
 *   - High-contrast M3 Dark Graphite HOI4 styling
 * Author: @redefinedtgk
 */

(function () {
  'use strict';

  // --- 1. CONFIGURATION & DATASETS ---

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

  // 30 Curated Mistakes (trikiwi)
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
    { id: 'card-48-english-channel-convoy', title: 'КОНВОИ В ЛА-МАНШЕ', img: 'assets/cards/card-48-english-channel-convoy.webp' },
    { id: 'card-55-no-microcontrol', title: 'ОТСУТСТВИЕ МИКРОКОНТРОЛЯ', img: 'assets/cards/card-55-no-microcontrol.webp' }
  ];

  // 30 Curated Mechanics and Tricks (Атом в леггинсах) - All using authentic in-game HOI4 screenshots
  const MECHANICS = [
    { id: 'trick-01-radio-rotation', title: 'РОТАЦИЯ ЧЕРЕЗ РАДИО', img: 'assets/cards/card-38-no-radar.webp' },
    { id: 'trick-02-supply-interception', title: 'ПЕРЕХВАТ СНАБЖЕНИЯ', img: 'assets/cards/card-32-no-trains.webp' },
    { id: 'trick-03-naval-drops', title: 'МОРСКИЕ ДРОПЫ', img: 'assets/cards/card-17-no-naval-invasion.webp' },
    { id: 'trick-04-hull-conversion', title: 'КОНВЕРСИЯ КОРПУСОВ', img: 'assets/cards/card-05b-bad-templates-tanks.webp' },
    { id: 'trick-05-spg-piercing', title: 'ПРОБИТИЕ САУ', img: 'assets/cards/card-05-bad-templates.webp' },
    { id: 'trick-06-attache-coop', title: 'АТТАШЕ И КООП', img: 'assets/cards/card-07-zero-stability.webp' },
    { id: 'trick-07-force-attack-cycling', title: 'ЦИКЛИЧНЫЙ FORCE ATTACK', img: 'assets/cards/card-03-no-order.webp' },
    { id: 'trick-08-cas-logistics-strike', title: 'УДАР ШТУРМОВИКОВ ПО СНАБЖЕНИЮ', img: 'assets/cards/card-13-lost-air.webp' },
    { id: 'trick-09-air-transports-supply', title: 'СНАБЖЕНИЕ С ВОЗДУХА', img: 'assets/cards/card-18-tanks-no-supply.webp' },
    { id: 'trick-10-space-marines', title: 'КОСМОДЕСАНТ', img: 'assets/cards/card-40-tanks-in-mountains.webp' },
    { id: 'trick-11-licence-production', title: 'ЛИЦЕНЗИОННОЕ ПРОИЗВОДСТВО', img: 'assets/cards/card-04-forgot-building.webp' },
    { id: 'trick-12-manual-naval-strike', title: 'РУЧНОЙ МОРСКОЙ НАЛЁТ', img: 'assets/cards/card-11-naval-bombers-no-fleet.webp' },
    { id: 'trick-13-fake-intel-divisions', title: 'ДЕКОЙНЫЕ ДИВИЗИИ (ЛОЖНЫЕ ЦЕЛИ)', img: 'assets/cards/card-06-forgot-agency.webp' },
    { id: 'trick-14-motorized-supply-hub', title: 'МОТОРИЗАЦИЯ ХАБОВ', img: 'assets/cards/card-23-horse-logistics.webp' },
    { id: 'trick-15-collaborators-govt', title: 'КОЛЛАБОРАЦИОНИСТЫ', img: 'assets/cards/card-42-no-decryption.webp' },
    { id: 'trick-16-scorch-earth-retreat', title: 'ВЫЖЖЕННАЯ ЗЕМЛЯ', img: 'assets/cards/card-52-fort-line-flanked.webp' },
    { id: 'trick-17-paradrop-victory-points', title: 'ДРОП В ПОБЕДНЫЕ ОЧКИ', img: 'assets/cards/card-45-lost-capital-paratroopers.webp' },
    { id: 'trick-18-refit-cruiser-armor', title: 'РЕФИТ КРЕЙСЕРОВ', img: 'assets/cards/card-27-no-dockyards-repair.webp' },
    { id: 'trick-19-carrier-overcrowding', title: 'ПЕРЕГРУЗ АВИАНОСЦЕВ', img: 'assets/cards/card-05c-bad-templates-air.webp' },
    { id: 'trick-20-tank-speed-matching', title: 'СИНХРОНИЗАЦИЯ СКОРОСТИ', img: 'assets/cards/card-29-width-too-big.webp' },
    { id: 'trick-21-sniping-supply-depot', title: 'СНАЙПИНГ СКЛАДОВ', img: 'assets/cards/card-14-uncovered-front.webp' },
    { id: 'trick-22-sub-pack-tactics', title: 'ВОЛЧЬИ СТАИ НА МЕЛКОВОДЬЕ', img: 'assets/cards/card-56-no-sub-repair.webp' },
    { id: 'trick-23-entrenchment-stacking', title: 'СТАКАНИЕ ОКАПЫВАНИЯ', img: 'assets/cards/card-31-attack-river-forts.webp' },
    { id: 'trick-24-doctrine-xp-boost', title: 'ФАРМ ОПЫТА НА ПОЛИГОНЕ', img: 'assets/cards/card-28-zero-doctrines.webp' },
    { id: 'trick-25-puppet-manpower', title: 'МЕНПАВЕР МАРИОНЕТОК', img: 'assets/cards/card-12-no-manpower.webp' },
    { id: 'trick-26-railway-guns-barrage', title: 'АРТОБСТРЕЛ Ж/Д ОРУДИЙ', img: 'assets/cards/card-15-guns-deficit.webp' },
    { id: 'trick-27-midget-sub-mines', title: 'МИННЫЕ ПОЛЯ В ПРОЛИВАХ', img: 'assets/cards/card-48-english-channel-convoy.webp' },
    { id: 'trick-28-armor-meme-slicing', title: 'СРЕЗ БРОНИ ПОД ПРОБИТИЕ', img: 'assets/cards/card-34-generals-no-traits.webp' },
    { id: 'trick-29-anti-air-piercing', title: 'ПВО ВМЕСТО ПТ', img: 'assets/cards/card-05d-bad-templates-navy.webp' },
    { id: 'trick-30-volunteer-air-wing', title: 'ДОБРОВОЛЬЧЕСКАЯ АВИАЦИЯ', img: 'assets/cards/card-19-no-focus.webp' }
  ];

  const TIER_LISTS = {
    trikiwi: {
      id: 'trikiwi',
      title: 'ОШИБКИ В HOI 4',
      author: 'trikiwi',
      trayTitle: 'КОЛОДА ОШИБОК',
      itemNoun: 'ошибок',
      axisH: 'НАПРАВЛЕНИЯ',
      axisV: 'КРИТИЧНОСТЬ',
      tiers: [
        { id: 'meta', name: 'ПОЛОЖИТЕЛЬНО', className: 'tier-meta', color: '#2e7d32', glow: 'rgba(46, 125, 50, 0.45)', bg: 'rgba(46, 125, 50, 0.15)' },
        { id: 'whatever', name: 'БЕЗ РАЗНИЦЫ', className: 'tier-whatever', color: '#8bc34a', glow: 'rgba(139, 195, 74, 0.45)', bg: 'rgba(139, 195, 74, 0.15)' },
        { id: 'noob', name: 'НЕПРИЯТНЕНЬКО', className: 'tier-noob', color: '#fbc02d', glow: 'rgba(251, 192, 45, 0.45)', bg: 'rgba(251, 192, 45, 0.15)' },
        { id: 'serious', name: 'СЕРЬЁЗНАЯ ОШИБКА', className: 'tier-serious', color: '#f57c00', glow: 'rgba(245, 124, 0, 0.45)', bg: 'rgba(245, 124, 0, 0.15)' },
        { id: 'ruin', name: 'РУИНА', className: 'tier-ruin', color: '#c62828', glow: 'rgba(198, 40, 40, 0.45)', bg: 'rgba(198, 40, 40, 0.15)' },
        { id: 'situational', name: 'СИТУАТИВНО', className: 'tier-situational', color: '#f5f5f7', glow: 'rgba(245, 245, 247, 0.45)', bg: 'rgba(245, 245, 247, 0.15)' }
      ],
      cards: MISTAKES
    },
    atom: {
      id: 'atom',
      title: 'ФИШКИ И МЕХАНИКИ',
      author: 'Атом в леггинсах',
      trayTitle: 'КОЛОДА ФИШЕК',
      itemNoun: 'фишек',
      axisH: 'СТРАНЫ',
      axisV: 'ПОЛЕЗНОСТЬ',
      tiers: [
        { id: 'must_have', name: 'МАСТ-ХЭВ', className: 'tier-meta', color: '#2e7d32', glow: 'rgba(46, 125, 50, 0.45)', bg: 'rgba(46, 125, 50, 0.15)' },
        { id: 'strong', name: 'ОЧЕНЬ СИЛЬНО', className: 'tier-whatever', color: '#8bc34a', glow: 'rgba(139, 195, 74, 0.45)', bg: 'rgba(139, 195, 74, 0.15)' },
        { id: 'useful', name: 'ПОЛЕЗНО', className: 'tier-noob', color: '#fbc02d', glow: 'rgba(251, 192, 45, 0.45)', bg: 'rgba(251, 192, 45, 0.15)' },
        { id: 'situational', name: 'СИТУАТИВНО', className: 'tier-situational', color: '#f5f5f7', glow: 'rgba(245, 245, 247, 0.45)', bg: 'rgba(245, 245, 247, 0.15)' },
        { id: 'weak', name: 'СОМНИТЕЛЬНО', className: 'tier-serious', color: '#f57c00', glow: 'rgba(245, 124, 0, 0.45)', bg: 'rgba(245, 124, 0, 0.15)' },
        { id: 'useless', name: 'Ммм... Хуета', className: 'tier-ruin', color: '#c62828', glow: 'rgba(198, 40, 40, 0.45)', bg: 'rgba(198, 40, 40, 0.15)' }
      ],
      cards: MECHANICS
    }
  };

  // Wallpapers gallery
  const WALLPAPERS = [
    { id: 'bg-1', name: 'ИС-3 и горничные', src: 'assets/wallpapers/bg-1.webp' },
    { id: 'bg-2', name: 'Sherman Firefly', src: 'assets/wallpapers/bg-2.webp' },
    { id: 'bg-3', name: 'Т-90 экипаж', src: 'assets/wallpapers/bg-3.webp' },
    { id: 'bg-4', name: 'Танковая рота', src: 'assets/wallpapers/bg-4.webp' },
    { id: 'bg-5', name: 'Girls und Panzer', src: 'assets/wallpapers/bg-5.webp' }
  ];
  let currentWpIndex = 0;

  // --- 2. APPLICATION STATE ---
  let currentTierListId = 'trikiwi'; // 'trikiwi' or 'atom'
  let matrixState = {}; // { [cellKey]: [cardId] }
  let lastResetSnapshot = null;

  // Drag Tracking
  let draggedCardInfo = null;
  let isDraggingFlag = false;

  // Tap-to-Place Selection Tracking
  let selectedCardForPlacement = null;

  // DOM Elements
  let welcomeScreenEl = null;
  let leaveConfirmModalEl = null;
  let selectTrikiwiCardEl = null;
  let selectAtomCardEl = null;
  let backToSelectBtnEl = null;
  let cancelLeaveBtnEl = null;
  let confirmLeaveBtnEl = null;
  let brandTitleEl = null;
  let shareBtnEl = null;

  let matrixHeaderRowEl = null;
  let matrixBoardEl = null;
  let bankCardsTrayEl = null;
  let trayTitleTextEl = null;
  let trayCardsCountEl = null;

  let resetBtnEl = null;
  let undoBtnEl = null;
  let wallpaperBtnEl = null;
  let previewWpBtnEl = null;
  let wpControlBarEl = null;
  let wpExitBtnEl = null;
  let wpPrevBtnEl = null;
  let wpNextBtnEl = null;
  let wpTitleLabelEl = null;
  let toastContainerEl = null;

  let lightboxModalEl = null;
  let lightboxCloseBtnEl = null;
  let lightboxImgEl = null;
  let lightboxTitleEl = null;

  // --- 3. HELPER LOOKUPS ---
  function getCurrentTierList() {
    return TIER_LISTS[currentTierListId] || TIER_LISTS.trikiwi;
  }

  function getCurrentCards() {
    return getCurrentTierList().cards;
  }

  function getCardById(cardId) {
    const list = getCurrentTierList();
    return list.cards.find(c => c.id === cardId) || null;
  }

  function getCellKey(countryId, tierId) {
    return `${countryId}__${tierId}`;
  }

  function getCardCountries(cardId) {
    const countrySet = new Set();
    for (const key in matrixState) {
      if (Array.isArray(matrixState[key]) && matrixState[key].includes(cardId)) {
        const [countryId] = key.split('__');
        if (countryId) countrySet.add(countryId);
      }
    }
    return countrySet;
  }

  function findCardCellInCountry(cardId, countryId) {
    const list = getCurrentTierList();
    for (const tier of list.tiers) {
      const cellKey = getCellKey(countryId, tier.id);
      if (Array.isArray(matrixState[cellKey])) {
        const idx = matrixState[cellKey].indexOf(cardId);
        if (idx !== -1) {
          return { cellKey, tierId: tier.id, index: idx };
        }
      }
    }
    return null;
  }

  function isCardPlacedInCountry(cardId, countryId) {
    return findCardCellInCountry(cardId, countryId) !== null;
  }

  function isCardFullyPlaced(cardId) {
    return getCardCountries(cardId).size >= COUNTRIES.length;
  }

  function isCardPlacedOnBoard(cardId) {
    for (const key in matrixState) {
      if (Array.isArray(matrixState[key]) && matrixState[key].includes(cardId)) {
        return true;
      }
    }
    return false;
  }

  function countPlacedCards() {
    let count = 0;
    for (const key in matrixState) {
      if (Array.isArray(matrixState[key])) {
        count += matrixState[key].length;
      }
    }
    return count;
  }

  function hasPlacedCards() {
    return countPlacedCards() > 0;
  }

  // --- 4. DOM ELEMENT INIT ---
  function initElements() {
    welcomeScreenEl = document.getElementById('welcome-screen');
    leaveConfirmModalEl = document.getElementById('leave-confirm-modal');
    selectTrikiwiCardEl = document.getElementById('select-trikiwi-card');
    selectAtomCardEl = document.getElementById('select-atom-card');
    backToSelectBtnEl = document.getElementById('back-to-select-btn');
    cancelLeaveBtnEl = document.getElementById('cancel-leave-btn');
    confirmLeaveBtnEl = document.getElementById('confirm-leave-btn');
    brandTitleEl = document.getElementById('brand-title');
    shareBtnEl = document.getElementById('share-btn');

    matrixHeaderRowEl = document.getElementById('matrix-header-row');
    matrixBoardEl = document.getElementById('matrix-board');
    bankCardsTrayEl = document.getElementById('bank-cards-tray');
    trayTitleTextEl = document.getElementById('tray-title-text');
    trayCardsCountEl = document.getElementById('tray-cards-count');

    resetBtnEl = document.getElementById('reset-matrix-btn');
    undoBtnEl = document.getElementById('undo-btn');
    wallpaperBtnEl = document.getElementById('wallpaper-btn');
    previewWpBtnEl = document.getElementById('preview-wallpaper-btn');
    wpControlBarEl = document.getElementById('wallpaper-control-bar');
    wpExitBtnEl = document.getElementById('wp-exit-btn');
    wpPrevBtnEl = document.getElementById('wp-prev-btn');
    wpNextBtnEl = document.getElementById('wp-next-btn');
    wpTitleLabelEl = document.getElementById('wp-title-label');
    toastContainerEl = document.getElementById('toast-container');

    lightboxModalEl = document.getElementById('lightbox-modal');
    lightboxCloseBtnEl = document.getElementById('lightbox-close-btn');
    lightboxImgEl = document.getElementById('lightbox-img');
    lightboxTitleEl = document.getElementById('lightbox-title');
  }

  // --- 5. INITIALIZATION ---
  function init() {
    try {
      console.log('--- Initializing HOI4 2D Matrix Hub ---');
      initElements();
      initWallpaper();
      initTrayScale();
      setupWelcomeAndNavListeners();
      setupTrayScaleListeners();
      setupTrayWheelScroll();
      setupLightboxListeners();
      setupWallpaperListeners();
      setupActionListeners();

      // Check if URL has state/list parameters
      const urlLoadResult = loadStateFromURL();
      if (!urlLoadResult) {
        // First visit or no state: show Welcome Screen
        showWelcomeScreen();
      }
      console.log('--- HOI4 Matrix App Initialized Successfully ---');
    } catch (e) {
      console.error('CRITICAL INIT ERROR:', e);
    }
  }

  // --- 6. WELCOME SCREEN & TIER LIST SELECTION ---
  function showWelcomeScreen() {
    clearCardSelection();
    if (welcomeScreenEl) {
      welcomeScreenEl.classList.remove('is-hidden');
    }
  }

  function hideWelcomeScreen() {
    if (welcomeScreenEl) {
      welcomeScreenEl.classList.add('is-hidden');
    }
  }

  function selectTierList(listId, skipUrlUpdate = false) {
    if (!TIER_LISTS[listId]) listId = 'trikiwi';
    currentTierListId = listId;
    const list = TIER_LISTS[listId];

    // Update UI headers
    if (brandTitleEl) brandTitleEl.textContent = list.title;
    if (trayTitleTextEl) trayTitleTextEl.textContent = list.trayTitle;

    // Reset matrix & build
    matrixState = {};
    lastResetSnapshot = null;
    if (undoBtnEl) undoBtnEl.style.display = 'none';

    buildMatrixGrid();
    renderBankCards();
    updateBankCardsStatus();

    hideWelcomeScreen();

    if (!skipUrlUpdate) {
      try {
        window.history.pushState({}, '', `${window.location.pathname}?list=${listId}`);
      } catch (e) {}
    }
  }

  function requestReturnToWelcomeScreen() {
    if (hasPlacedCards()) {
      if (leaveConfirmModalEl) {
        leaveConfirmModalEl.classList.add('is-active');
      }
    } else {
      executeReturnToWelcomeScreen();
    }
  }

  function executeReturnToWelcomeScreen() {
    if (leaveConfirmModalEl) {
      leaveConfirmModalEl.classList.remove('is-active');
    }
    matrixState = {};
    lastResetSnapshot = null;
    clearCardSelection();
    try {
      window.history.pushState({}, '', window.location.pathname);
    } catch (e) {}
    showWelcomeScreen();
  }

  function setupWelcomeAndNavListeners() {
    if (selectTrikiwiCardEl) {
      selectTrikiwiCardEl.addEventListener('click', () => selectTierList('trikiwi'));
      selectTrikiwiCardEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          selectTierList('trikiwi');
        }
      });
    }

    if (selectAtomCardEl) {
      selectAtomCardEl.addEventListener('click', () => selectTierList('atom'));
      selectAtomCardEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          selectTierList('atom');
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

  // --- 7. URL PERSISTENCE & SHARING (LZ-STRING / BASE64) ---
  function encodeStatePayload(stateObj) {
    const jsonStr = JSON.stringify(stateObj);
    if (window.LZString && typeof window.LZString.compressToEncodedURIComponent === 'function') {
      return window.LZString.compressToEncodedURIComponent(jsonStr);
    }
    try {
      return encodeURIComponent(btoa(unescape(encodeURIComponent(jsonStr))));
    } catch (e) {
      return encodeURIComponent(jsonStr);
    }
  }

  function decodeStatePayload(encodedStr) {
    if (!encodedStr) return null;
    let jsonStr = null;
    if (window.LZString && typeof window.LZString.decompressFromEncodedURIComponent === 'function') {
      jsonStr = window.LZString.decompressFromEncodedURIComponent(encodedStr);
    }
    if (!jsonStr) {
      try {
        jsonStr = decodeURIComponent(escape(atob(decodeURIComponent(encodedStr))));
      } catch (e) {
        try {
          jsonStr = atob(encodedStr);
        } catch (e2) {
          try {
            jsonStr = decodeURIComponent(encodedStr);
          } catch (e3) {}
        }
      }
    }
    if (jsonStr) {
      try {
        return JSON.parse(jsonStr);
      } catch (e) {}
    }
    return null;
  }

  async function copyShareLink() {
    try {
      const stateObj = {
        l: currentTierListId,
        m: matrixState
      };
      const encoded = encodeStatePayload(stateObj);
      const shareUrl = `${window.location.origin}${window.location.pathname}?state=${encoded}`;

      // Update address bar
      window.history.replaceState({}, '', shareUrl);

      // Copy to clipboard
      let copied = false;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        try {
          await navigator.clipboard.writeText(shareUrl);
          copied = true;
        } catch (e) {}
      }

      if (!copied) {
        const ta = document.createElement('textarea');
        ta.value = shareUrl;
        ta.style.position = 'fixed';
        ta.style.left = '-9999px';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        copied = document.execCommand('copy');
        ta.remove();
      }

      showToast('Ссылка скопирована! Открыв её, откроется ваш заполненный тир-лист', 4200, false, 'success');
    } catch (err) {
      console.error('Failed to copy share link:', err);
      showToast('Не удалось скопировать ссылку в буфер обмена', 3000, false, 'danger');
    }
  }

  function loadStateFromURL() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      let stateParam = urlParams.get('state');

      // Check hash #state=... or #data=...
      if (!stateParam && window.location.hash) {
        const hashStr = window.location.hash.substring(1);
        const hashParams = new URLSearchParams(hashStr);
        stateParam = hashParams.get('state') || hashParams.get('data');
      }

      if (stateParam) {
        const payload = decodeStatePayload(stateParam);
        if (payload && typeof payload === 'object') {
          const listId = payload.l || payload.list || 'trikiwi';
          const matrix = payload.m || payload.matrix || {};

          selectTierList(listId, true);
          matrixState = matrix;
          renderAllCells();
          updateBankCardsStatus();
          showToast('Тир-лист загружен из ссылки!', 3500, false, 'success');
          return true;
        }
      }

      // Check list param: ?list=trikiwi or ?list=atom
      const listParam = urlParams.get('list');
      if (listParam && TIER_LISTS[listParam]) {
        selectTierList(listParam, true);
        const legacyM = urlParams.get('m');
        if (legacyM) {
          parseLegacyCompactParam(legacyM);
        }
        return true;
      }

      // Legacy parameter ?m=...
      const legacyM = urlParams.get('m');
      if (legacyM) {
        selectTierList('trikiwi', true);
        parseLegacyCompactParam(legacyM);
        return true;
      }
    } catch (e) {
      console.warn('Error reading URL state:', e);
    }
    return false;
  }

  function parseLegacyCompactParam(compactStr) {
    try {
      const list = getCurrentTierList();
      const codeToCountry = {
        GER: 'germany', SOV: 'ussr', USA: 'usa', ENG: 'uk', JAP: 'japan', ITA: 'italy', FRA: 'france', ALL: 'all', GEN: 'all'
      };
      const numToTier = {
        '1': list.tiers[0]?.id,
        '2': list.tiers[1]?.id,
        '3': list.tiers[2]?.id,
        '4': list.tiers[3]?.id,
        '5': list.tiers[4]?.id,
        '6': list.tiers[5]?.id
      };
      const numToCard = {};
      list.cards.forEach((c, idx) => {
        const match = c.id.match(/^card-(\d+)/) || c.id.match(/^trick-(\d+)/);
        const num = match ? parseInt(match[1], 10) : (idx + 1);
        numToCard[num] = c.id;
      });

      const segments = decodeURIComponent(compactStr).split(/[|;]/);
      for (const seg of segments) {
        const parts = seg.trim().split(':');
        if (parts.length >= 3) {
          const countryId = codeToCountry[parts[0].toUpperCase()];
          const tierId = numToTier[parts[1].toUpperCase()];
          const cardNums = parts[2].split(',');
          if (countryId && tierId) {
            const cellKey = getCellKey(countryId, tierId);
            const cardIds = cardNums
              .map(n => parseInt(n.trim(), 10))
              .filter(n => !isNaN(n) && numToCard[n])
              .map(n => numToCard[n]);
            if (cardIds.length > 0) {
              matrixState[cellKey] = cardIds;
            }
          }
        }
      }
      renderAllCells();
      updateBankCardsStatus();
    } catch (e) {}
  }

  // --- 8. MATRIX GRID BUILDING ---
  function buildMatrixGrid() {
    if (matrixHeaderRowEl) matrixHeaderRowEl.innerHTML = '';
    if (matrixBoardEl) matrixBoardEl.innerHTML = '';

    const list = getCurrentTierList();
    const headerContainer = matrixHeaderRowEl || matrixBoardEl;

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

    // 2. Top Columns: 7 Majors + "ОБЩЕЕ"
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

    // 3. Rows: 6 Tiers x 8 Columns
    list.tiers.forEach(tier => {
      const rowHeaderEl = document.createElement('div');
      rowHeaderEl.className = `tier-row-header ${tier.className}`;
      rowHeaderEl.dataset.tier = tier.id;
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

        setupCellDragEvents(cellEl, tier);
        matrixBoardEl.appendChild(cellEl);
      });
    });
  }

  // --- 9. TRAY & CARD BANK RENDERING ---
  function renderBankCards() {
    if (!bankCardsTrayEl) return;
    bankCardsTrayEl.innerHTML = '';

    const cards = getCurrentCards();
    cards.forEach(cardData => {
      const cardEl = createCardElement(cardData.id, false);
      bankCardsTrayEl.appendChild(cardEl);
    });

    updateBankCardsStatus();
  }

  // Multi-Country Matrix Logic: Update status and placement counters of all cards in tray
  function updateBankCardsStatus() {
    const cards = getCurrentCards();
    const totalCountries = COUNTRIES.length; // 8

    // Map each cardId to the Set of countryIds where it is placed
    const cardCountriesMap = new Map();
    cards.forEach(c => cardCountriesMap.set(c.id, new Set()));

    let totalPlacements = 0;

    for (const key in matrixState) {
      if (Array.isArray(matrixState[key])) {
        const [countryId] = key.split('__');
        matrixState[key].forEach(cId => {
          totalPlacements++;
          const set = cardCountriesMap.get(cId);
          if (set && countryId) {
            set.add(countryId);
          }
        });
      }
    }

    let fullyPlacedCount = 0;

    if (bankCardsTrayEl) {
      const trayCards = bankCardsTrayEl.querySelectorAll('.mistake-card');
      trayCards.forEach(cardEl => {
        const cId = cardEl.dataset.cardId;
        const placedCountriesSet = cardCountriesMap.get(cId) || new Set();
        const count = placedCountriesSet.size;
        const isFullyPlaced = count >= totalCountries;

        if (isFullyPlaced) {
          fullyPlacedCount++;
        }

        // Clean existing badges
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
          badge.innerHTML = `<i class="fa-solid fa-check"></i><span>${count}/${totalCountries} стран</span>`;
          cardEl.appendChild(badge);
        } else if (count > 0) {
          cardEl.classList.remove('is-placed');
          cardEl.classList.add('is-partial');
          cardEl.draggable = true;
          cardEl.removeAttribute('aria-disabled');

          const badge = document.createElement('div');
          badge.className = 'card-counter-badge';
          badge.title = `Размещено в ${count} из ${totalCountries} стран`;
          badge.innerHTML = `<i class="fa-solid fa-flag"></i><span>${count}/${totalCountries}</span>`;
          cardEl.appendChild(badge);
        } else {
          cardEl.classList.remove('is-placed', 'is-partial');
          cardEl.draggable = true;
          cardEl.removeAttribute('aria-disabled');
        }
      });
    }

    // Update Counter: available cards / total cards
    const totalCount = cards.length;
    const availableCount = totalCount - fullyPlacedCount;
    if (trayCardsCountEl) {
      trayCardsCountEl.textContent = `${availableCount} / ${totalCount}`;
      trayCardsCountEl.title = `Доступно в колоде: ${availableCount} из ${totalCount} (всего на доске: ${totalPlacements})`;
    }
  }

  function formatCardCaption(title) {
    if (!title) return '';
    if (title.length <= 34) return title;
    const words = title.split(/\s+/);
    if (words.length <= 3) {
      const half = 12;
      return `${title.slice(0, half).trim()}... ${title.slice(-half).trim()}`;
    }
    let head = [];
    let tail = [];
    let i = 0;
    let j = words.length - 1;
    let len = 4;
    while (i < j) {
      const nHead = words[i].length + (head.length > 0 ? 1 : 0);
      const nTail = words[j].length + (tail.length > 0 ? 1 : 0);
      if (head.length <= tail.length && len + nHead <= 26) {
        head.push(words[i]);
        len += nHead;
        i++;
      } else if (len + nTail <= 26) {
        tail.unshift(words[j]);
        len += nTail;
        j--;
      } else {
        break;
      }
    }
    if (head.length === 0) head.push(words[0]);
    if (tail.length === 0) tail.unshift(words[words.length - 1]);
    return `${head.join(' ')}... ${tail.join(' ')}`;
  }

  // --- 10. CREATE CARD ELEMENT ---
  function createCardElement(cardId, isInCell = false, cellKey = null, itemIndex = null) {
    const cardData = getCardById(cardId);
    if (!cardData) return document.createElement('div');

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
        <img class="card-img" src="${cardData.img}" alt="${cardData.title}" loading="lazy" decoding="async" />
      </div>
      <div class="card-caption" title="${cardData.title}">${cardData.title}</div>
      <div class="card-tooltip">${cardData.title}</div>
      ${isInCell ? '<button class="card-remove-btn" title="Убрать из ячейки"><i class="fa-solid fa-xmark"></i></button>' : ''}
    `;

    // Remove button in cell
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

    // Dragstart
    card.addEventListener('dragstart', (e) => {
      // If card in tray is already placed across all countries, cancel drag
      if (!isInCell && isCardFullyPlaced(cardId)) {
        e.preventDefault();
        return;
      }

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

    // Touch Drag-and-Drop
    let touchStartX = 0;
    let touchStartY = 0;
    let isTouchDragging = false;
    let touchGhost = null;

    card.addEventListener('touchstart', (e) => {
      if (!isInCell && isCardFullyPlaced(cardId)) return;
      if (e.touches.length !== 1) return;
      const touch = e.touches[0];
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
      isTouchDragging = false;
    }, { passive: true });

    card.addEventListener('touchmove', (e) => {
      if (!isInCell && isCardFullyPlaced(cardId)) return;
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
        const targetCell = elemBelow?.closest('.matrix-cell');
        if (targetCell) {
          applyCellDragOverHighlight(targetCell);
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
          const { cardId: dCardId, sourceCellKey } = draggedCardInfo;
          handleCardDrop(targetCellKey, dCardId, sourceCellKey);
        }

        draggedCardInfo = null;
        setTimeout(() => {
          isDraggingFlag = false;
          isTouchDragging = false;
        }, 60);
      }
    }, { passive: true });

    // Click handler: Lightbox Zoom or Tap-to-Place
    card.addEventListener('click', (e) => {
      if (isDraggingFlag || isTouchDragging) return;
      e.stopPropagation();

      // If in tray and placed in all countries: inform user
      if (!isInCell && isCardFullyPlaced(cardId)) {
        showToast('Карточка уже выставлена во всех странах!', 2500, false, 'tip');
        return;
      }

      openLightbox(cardId);
    });

    return card;
  }

  // --- 11. DYNAMIC COLOR DRAG-AND-DROP (REQUIREMENT 3.1) ---
  function applyCellDragOverHighlight(cellEl) {
    const list = getCurrentTierList();
    const tierId = cellEl.dataset.tier;
    const tier = list.tiers.find(t => t.id === tierId);

    if (tier) {
      cellEl.style.setProperty('--cell-drag-color', tier.color);
      cellEl.style.setProperty('--cell-drag-glow', tier.glow);
      cellEl.style.setProperty('--cell-drag-bg', tier.bg);
    }
    cellEl.classList.add('drag-over');
  }

  function clearCellDragOverHighlight(cellEl) {
    cellEl.classList.remove('drag-over');
    cellEl.style.removeProperty('--cell-drag-color');
    cellEl.style.removeProperty('--cell-drag-glow');
    cellEl.style.removeProperty('--cell-drag-bg');
  }

  function clearAllDragOverStyles() {
    document.querySelectorAll('.matrix-cell.drag-over').forEach(el => clearCellDragOverHighlight(el));
    if (bankCardsTrayEl) bankCardsTrayEl.classList.remove('drag-over');
  }

  // Setup Cell Drag & Drop
  function setupCellDragEvents(cellEl, tier) {
    const cellKey = cellEl.dataset.cellKey;

    cellEl.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      applyCellDragOverHighlight(cellEl);
    });

    cellEl.addEventListener('dragleave', (e) => {
      if (!cellEl.contains(e.relatedTarget)) {
        clearCellDragOverHighlight(cellEl);
      }
    });

    cellEl.addEventListener('drop', (e) => {
      e.preventDefault();
      clearCellDragOverHighlight(cellEl);

      let cardId = null;
      let sourceCellKey = null;

      if (draggedCardInfo) {
        cardId = draggedCardInfo.cardId;
        sourceCellKey = draggedCardInfo.sourceCellKey;
      } else {
        cardId = e.dataTransfer.getData('text/plain');
      }

      if (!cardId || !getCardById(cardId)) return;

      handleCardDrop(cellKey, cardId, sourceCellKey);
    });
  }

  // Multi-Country Matrix Drop Handler
  function handleCardDrop(targetCellKey, cardId, sourceCellKey = null) {
    if (!targetCellKey || !cardId) return;

    const [targetCountryId] = targetCellKey.split('__');
    if (!targetCountryId) return;

    // 1. Dragged from another cell on the board
    if (sourceCellKey) {
      if (sourceCellKey === targetCellKey) return;

      const [sourceCountryId] = sourceCellKey.split('__');

      // If moving within the same country to another tier
      if (sourceCountryId === targetCountryId) {
        removeCardIdFromCell(sourceCellKey, cardId, false);
        addCardToCell(targetCellKey, cardId);
        return;
      }

      // If moving between different countries:
      // Remove any existing copy in targetCountry to prevent duplicate in target country
      removeCardFromCountry(targetCountryId, cardId, false);
      // Remove from source cell
      removeCardIdFromCell(sourceCellKey, cardId, false);
      // Add to target cell
      addCardToCell(targetCellKey, cardId);
      return;
    }

    // 2. Dragged from the bottom tray
    const existingPlacement = findCardCellInCountry(cardId, targetCountryId);
    if (existingPlacement) {
      if (existingPlacement.cellKey === targetCellKey) {
        showToast('Карточка уже находится в этой ячейке', 2000, false, 'tip');
        return;
      }
      // Move within the country to the new tier
      removeCardIdFromCell(existingPlacement.cellKey, cardId, false);
      addCardToCell(targetCellKey, cardId);
      return;
    }

    // New placement in this country
    addCardToCell(targetCellKey, cardId);
  }

  // --- 12. STATE MUTATION & CELL SCALING ---
  function addCardToCell(cellKey, cardId) {
    if (!matrixState[cellKey]) {
      matrixState[cellKey] = [];
    }
    matrixState[cellKey].push(cardId);
    renderCell(cellKey);
    updateBankCardsStatus();
  }

  function removeCardIdFromCell(cellKey, cardId, shouldUpdateStatus = true) {
    if (!matrixState[cellKey]) return;
    const idx = matrixState[cellKey].indexOf(cardId);
    if (idx !== -1) {
      matrixState[cellKey].splice(idx, 1);
      if (matrixState[cellKey].length === 0) {
        delete matrixState[cellKey];
      }
      renderCell(cellKey);
      if (shouldUpdateStatus) {
        updateBankCardsStatus();
      }
    }
  }

  function removeCardFromCountry(countryId, cardId, shouldUpdateStatus = true) {
    const list = getCurrentTierList();
    for (const tier of list.tiers) {
      const cellKey = getCellKey(countryId, tier.id);
      if (Array.isArray(matrixState[cellKey])) {
        const idx = matrixState[cellKey].indexOf(cardId);
        if (idx !== -1) {
          matrixState[cellKey].splice(idx, 1);
          if (matrixState[cellKey].length === 0) {
            delete matrixState[cellKey];
          }
          renderCell(cellKey);
          if (shouldUpdateStatus) {
            updateBankCardsStatus();
          }
          return;
        }
      }
    }
  }

  function removeCardFromCell(cellKey, itemIndex, shouldUpdateStatus = true) {
    if (!matrixState[cellKey]) return;
    matrixState[cellKey].splice(itemIndex, 1);
    if (matrixState[cellKey].length === 0) {
      delete matrixState[cellKey];
    }
    renderCell(cellKey);
    if (shouldUpdateStatus) {
      updateBankCardsStatus();
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
      cellEl.classList.remove('cell-has-items');
      cellEl.removeAttribute('data-count');
      cellEl.innerHTML = `
        <div class="cell-placeholder-hint">
          <i class="fa-solid fa-plus"></i>
        </div>
      `;
    } else {
      cellEl.classList.remove('cell-empty');
      cellEl.classList.add('cell-has-items');
      cellEl.dataset.count = count;

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

  // --- 13. TRAY SCALE & SMOOTH HORIZONTAL SCROLL ---
  let currentTrayScale = 100; // in percent (80 to 120)

  function initTrayScale() {
    try {
      const saved = localStorage.getItem('hoi4_tray_scale_v2');
      if (saved !== null) {
        const val = parseInt(saved, 10);
        if (!isNaN(val) && val >= 80 && val <= 120) {
          currentTrayScale = val;
        }
      }
    } catch (e) {}
    applyTrayScale(currentTrayScale, false);
  }

  function applyTrayScale(percent, save = true) {
    percent = Math.max(80, Math.min(120, Math.round(percent / 5) * 5));
    currentTrayScale = percent;

    const scaleFactor = (percent / 100).toFixed(2);
    document.documentElement.style.setProperty('--tray-scale', scaleFactor);

    const sliderEl = document.getElementById('tray-scale-slider');
    const valueEl = document.getElementById('tray-scale-value');

    if (sliderEl) sliderEl.value = percent;
    if (valueEl) valueEl.textContent = `${percent}%`;

    if (save) {
      try {
        localStorage.setItem('hoi4_tray_scale_v2', percent);
      } catch (e) {}
    }
  }

  function setupTrayScaleListeners() {
    const sliderEl = document.getElementById('tray-scale-slider');
    const downBtn = document.getElementById('tray-scale-down');
    const upBtn = document.getElementById('tray-scale-up');
    const resetBtn = document.getElementById('tray-scale-reset');
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

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        applyTrayScale(100);
        showToast('Масштаб колоды сброшен на 100%', 2000, false, 'info');
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

  // Smooth Horizontal Wheel Scroll for Bottom Tray
  function setupTrayWheelScroll() {
    if (!bankCardsTrayEl) return;
    bankCardsTrayEl.addEventListener('wheel', (e) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        bankCardsTrayEl.scrollLeft += e.deltaY;
      }
    }, { passive: false });
  }

  // --- 14. TAP-TO-PLACE SELECTION LOGIC ---
  function clearCardSelection() {
    selectedCardForPlacement = null;
    document.querySelectorAll('.mistake-card.is-selected').forEach(el => el.classList.remove('is-selected'));
    document.body.classList.remove('card-selection-active');
  }

  // --- 15. LIGHTBOX MODAL ---
  function openLightbox(cardId) {
    const cardData = getCardById(cardId);
    if (!cardData || !lightboxModalEl) return;

    if (lightboxImgEl) {
      lightboxImgEl.src = cardData.img;
      lightboxImgEl.alt = cardData.title;
    }
    if (lightboxTitleEl) {
      lightboxTitleEl.textContent = cardData.title;
    }

    lightboxModalEl.classList.add('is-active');
    lightboxModalEl.setAttribute('aria-hidden', 'false');
  }

  function closeLightbox() {
    if (!lightboxModalEl) return;
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
        } else if (leaveConfirmModalEl && leaveConfirmModalEl.classList.contains('is-active')) {
          leaveConfirmModalEl.classList.remove('is-active');
        }
      }
    });
  }

  // --- 16. WALLPAPERS CONTROLLER ---
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
      showToast(`Обои: ${wp.name}`, 2200, false, 'info');
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

    document.addEventListener('click', (e) => {
      if (document.body.classList.contains('wallpaper-preview-active')) {
        if (!e.target.closest('#wallpaper-control-bar')) {
          setWallpaperPreview(false);
        }
      }
    });
  }

  // --- 17. RESET & UNDO CONTROLLER ---
  let activeConfirmToast = null;

  function requestResetConfirmation() {
    if (!hasPlacedCards()) {
      showToast('Матрица уже пуста!', 2200, false, 'tip');
      return;
    }

    if (activeConfirmToast) {
      activeConfirmToast.remove();
      activeConfirmToast = null;
    }

    const toast = document.createElement('div');
    toast.className = 'toast toast-danger show';
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
    updateBankCardsStatus();

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
    updateBankCardsStatus();

    if (undoBtnEl) {
      undoBtnEl.style.display = 'none';
    }

    showToast('Матрица восстановлена!', 2500, false, 'success');
  }

  // --- 18. ACTION LISTENERS ---
  function setupActionListeners() {
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

        if (draggedCardInfo && draggedCardInfo.sourceCellKey) {
          removeCardIdFromCell(draggedCardInfo.sourceCellKey, draggedCardInfo.cardId, true);
        }
      });
    }
  }

  // --- 19. TOAST NOTIFICATIONS ---
  function showToast(message, arg2 = 3600, arg3 = false, arg4 = 'info') {
    let duration = 3600;
    let showUndo = false;
    let type = 'info';

    if (typeof arg2 === 'number') {
      duration = arg2;
      if (typeof arg3 === 'boolean') {
        showUndo = arg3;
        if (typeof arg4 === 'string') type = arg4;
      } else if (typeof arg3 === 'string') {
        type = arg3;
      }
    } else if (typeof arg2 === 'string') {
      type = arg2;
      if (typeof arg3 === 'number') {
        duration = arg3;
      } else if (typeof arg3 === 'boolean') {
        showUndo = arg3;
      }
    } else if (typeof arg2 === 'boolean') {
      showUndo = arg2;
      if (typeof arg3 === 'number') duration = arg3;
    }

    if (isNaN(duration) || duration <= 0) {
      duration = 3600;
    }

    if (!toastContainerEl) {
      toastContainerEl = document.getElementById('toast-container');
    }
    if (!toastContainerEl) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let iconClass = 'fa-solid fa-circle-info';
    if (type === 'tip') {
      iconClass = 'fa-solid fa-lightbulb';
    } else if (type === 'danger') {
      iconClass = 'fa-solid fa-triangle-exclamation';
    } else if (type === 'success') {
      iconClass = 'fa-solid fa-circle-check';
    }

    if (showUndo) {
      toast.innerHTML = `
        <div class="toast-icon-badge">
          <i class="${iconClass}"></i>
        </div>
        <div class="toast-content">
          <span>${message}</span>
        </div>
        <div class="toast-actions">
          <button class="toast-btn toast-btn-cancel" id="toast-undo-action">
            <i class="fa-solid fa-rotate-left"></i>
            <span>Вернуть</span>
          </button>
          <button class="toast-close-btn" title="Закрыть">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      `;
      const undoBtn = toast.querySelector('#toast-undo-action');
      if (undoBtn) {
        undoBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          dismissToast(toast);
          executeUndo();
        });
      }
    } else {
      toast.innerHTML = `
        <div class="toast-icon-badge">
          <i class="${iconClass}"></i>
        </div>
        <div class="toast-content">
          <span>${message}</span>
        </div>
        <button class="toast-close-btn" title="Закрыть">
          <i class="fa-solid fa-xmark"></i>
        </button>
      `;
    }

    const closeBtn = toast.querySelector('.toast-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        dismissToast(toast);
      });
    }

    toastContainerEl.appendChild(toast);
    toast.classList.add('show');

    const timer = setTimeout(() => {
      dismissToast(toast);
    }, duration);

    function dismissToast(el) {
      clearTimeout(timer);
      if (el && el.parentNode) {
        el.classList.remove('show');
        setTimeout(() => el.remove(), 220);
      }
    }
  }

  window.showToast = showToast;

  // Boot Application
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
