/**
 * Hearts of Iron IV - 2D Matrix Tier List Hub
 * Supports:
 *   1. "Ошибки в HOI4" (?list=mistakes)
 *   2. "Фишки и механики" (?list=features)
 * Features:
 *   - Three-Zone Matrix Cells (MP / ALL / SP per cell)
 *   - Censored vs Historical Mode (German WWII flag toggle with localStorage)
 *   - Dynamic Tier-Colored Drag-and-Drop Sub-Zone Highlights
 *   - Clean Neutral URLs & Browser History API (Back button support)
 *   - Deck Zoom Control (50% - 200% with double-click reset)
 *   - Anti-Duplicate Protection (per-country unique placement)
 *   - Fullscreen Lightbox with Mechanics Encyclopedia and Forum References
 *   - High-contrast M3 Dark Graphite HOI4 styling
 * Author: @redefinedtgk
 */

(function () {
  'use strict';

  // --- 1. CONFIGURATION & DATASETS ---

  const COUNTRIES = [
    { id: 'all', name: 'ОБЩЕЕ' },
    { id: 'germany', name: 'ГЕРМАНИЯ', flag: 'assets/flags/germany-censored.svg' },
    { id: 'ussr', name: 'СССР', flag: 'assets/flags/ussr.svg' },
    { id: 'usa', name: 'США', flag: 'assets/flags/usa.svg' },
    { id: 'uk', name: 'ВЕЛИКОБРИТАНИЯ', flag: 'assets/flags/uk.svg' },
    { id: 'japan', name: 'ЯПОНИЯ', flag: 'assets/flags/japan.svg' },
    { id: 'italy', name: 'ИТАЛИЯ', flag: 'assets/flags/italy.svg' },
    { id: 'france', name: 'ФРАНЦИЯ', flag: 'assets/flags/france.svg' }
  ];

  // 30 Curated Mistakes (trikiwi) - Pure titles without descriptions
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

  // Centralized toggle: Switch to false to instantly restore authentic game screenshots in 1 click
  const USE_AI_PLACEHOLDER_GRAPHICS = true;

  // 18 Curated Mechanics and Tricks (Pure titles, with 1 single authorized description on division spam)
  const MECHANICS = [
    {
      id: 'trick-03-naval-drops',
      title: 'МОРСКИЕ ДРОПЫ',
      nativeImg: 'assets/cards/card-17-no-naval-invasion.webp',
      placeholderImg: 'assets/cards/placeholders/trick-03-naval-drops.svg'
    },
    {
      id: 'trick-04-hull-conversion',
      title: 'КОНВЕРСИЯ',
      nativeImg: 'assets/cards/card-05b-bad-templates-tanks.webp',
      placeholderImg: 'assets/cards/placeholders/trick-04-hull-conversion.svg'
    },
    {
      id: 'trick-06-attache-coop',
      title: 'АТТАШЕ',
      nativeImg: 'assets/cards/card-07-zero-stability.webp',
      placeholderImg: 'assets/cards/placeholders/trick-06-attache.svg'
    },
    {
      id: 'trick-09-air-transports-supply',
      title: 'СНАБЖЕНИЕ С ВОЗДУХА',
      nativeImg: 'assets/cards/card-18-tanks-no-supply.webp',
      placeholderImg: 'assets/cards/placeholders/trick-09-air-transports-supply.svg'
    },
    {
      id: 'trick-10-space-marines',
      title: 'КОСМОДЕСАНТ',
      nativeImg: 'assets/cards/card-40-tanks-in-mountains.webp',
      placeholderImg: 'assets/cards/placeholders/trick-10-space-marines.svg'
    },
    {
      id: 'trick-11-licence-production',
      title: 'ЛИЦЕНЗИИ',
      nativeImg: 'assets/cards/card-04-forgot-building.webp',
      placeholderImg: 'assets/cards/placeholders/trick-11-licence-production.svg'
    },
    {
      id: 'trick-12-manual-naval-strike',
      title: 'МОРБОБРЫ',
      nativeImg: 'assets/cards/card-11-naval-bombers-no-fleet.webp',
      placeholderImg: 'assets/cards/placeholders/trick-12-manual-naval-strike.svg'
    },
    {
      id: 'trick-13-fake-intel-divisions',
      title: 'КУЧУ ДИВИЗИЙ С ОДНОГО БАТАЛЬОНА ДЛЯ НЕКОТОРЫХ МЕХАНИК',
      nativeImg: 'assets/cards/card-06-forgot-agency.webp',
      placeholderImg: 'assets/cards/placeholders/trick-13-fake-intel-divisions.svg',
      desc: 'Например, для быстрого аншлюза или чтобы больше добровольческих дивизий в Испанию отправить.'
    },
    {
      id: 'trick-16-scorch-earth-retreat',
      title: 'ВЫЖЖЕННАЯ ЗЕМЛЯ',
      nativeImg: 'assets/cards/card-52-fort-line-flanked.webp',
      placeholderImg: 'assets/cards/placeholders/trick-16-scorch-earth-retreat.svg'
    },
    {
      id: 'trick-17-paradrop-victory-points',
      title: 'ДРОП В ПОБЕДНЫЕ ОЧКИ',
      nativeImg: 'assets/cards/card-45-lost-capital-paratroopers.webp',
      placeholderImg: 'assets/cards/placeholders/trick-17-paradrop-victory-points.svg'
    },
    {
      id: 'trick-18-refit-cruiser-armor',
      title: 'МОДЕРНИЗАЦИЯ ФЛОТА',
      nativeImg: 'assets/cards/card-27-no-dockyards-repair.webp',
      placeholderImg: 'assets/cards/placeholders/trick-18-refit-cruiser-armor.svg'
    },
    {
      id: 'trick-19-carrier-overcrowding',
      title: 'ПЕРЕГРУЗ АВИАНОСЦЕВ',
      nativeImg: 'assets/cards/card-05c-bad-templates-air.webp',
      placeholderImg: 'assets/cards/placeholders/trick-19-carrier-overcrowding.svg',
      locked: true
    },
    {
      id: 'trick-22-sub-pack-tactics',
      title: 'ВОЛЧЬИ СТАИ НА МЕЛКОВОДЬЕ',
      nativeImg: 'assets/cards/card-56-no-sub-repair.webp',
      placeholderImg: 'assets/cards/placeholders/trick-22-sub-pack-tactics.svg'
    },
    {
      id: 'trick-26-railway-guns-barrage',
      title: 'ЮЗАНИЕ ОРУДИЙ НАПОДОБИЕ ДОРЫ',
      nativeImg: 'assets/cards/card-15-guns-deficit.webp',
      placeholderImg: 'assets/cards/placeholders/trick-26-railway-guns-barrage.svg'
    },
    {
      id: 'trick-27-midget-sub-mines',
      title: 'МИННЫЕ ПОЛЯ В ПРОЛИВАХ',
      nativeImg: 'assets/cards/card-48-english-channel-convoy.webp',
      placeholderImg: 'assets/cards/placeholders/trick-27-midget-sub-mines.svg'
    },
    {
      id: 'trick-29-anti-air-piercing',
      title: 'ПВО ВМЕСТО ПТ',
      nativeImg: 'assets/cards/card-05d-bad-templates-navy.webp',
      placeholderImg: 'assets/cards/placeholders/trick-29-anti-air-piercing.svg'
    },
    {
      id: 'trick-30-volunteer-air-wing',
      title: 'ДОБРОВОЛЬЧЕСКАЯ АВИАЦИЯ',
      nativeImg: 'assets/cards/card-19-no-focus.webp',
      placeholderImg: 'assets/cards/placeholders/trick-30-volunteer-air-wing.svg'
    }
  ];

  // Resolve active image based on centralized toggle
  MECHANICS.forEach(card => {
    card.img = (USE_AI_PLACEHOLDER_GRAPHICS && card.placeholderImg) ? card.placeholderImg : card.nativeImg;
  });

  const TIER_LISTS = {
    mistakes: {
      id: 'mistakes',
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
    features: {
      id: 'features',
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

  // Backward compatibility aliases
  TIER_LISTS.trikiwi = TIER_LISTS.mistakes;
  TIER_LISTS.atom = TIER_LISTS.features;
  TIER_LISTS.mechanics = TIER_LISTS.features;

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
  let currentTierListId = 'mistakes'; // 'mistakes' or 'features'
  let currentCensorshipMode = 'censored'; // 'historical' or 'censored'

  // Per-tierlist matrix state: [listId] -> { [zoneKey]: [cardId, ...] }
  // zoneKey format: `${countryId}__${tierId}__${zone}` (zone is 'mp', 'all', or 'sp')
  const listStates = {
    mistakes: {},
    features: {}
  };

  let matrixState = {}; // active list state pointer
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

  let censorBtnHistoricalEl = null;
  let censorBtnCensoredEl = null;

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
  let lightboxDescEl = null;
  let lightboxForumLinksEl = null;

  // --- 3. HELPER LOOKUPS ---
  function getCurrentTierList() {
    return TIER_LISTS[currentTierListId] || TIER_LISTS.mistakes;
  }

  function getCurrentCards() {
    return getCurrentTierList().cards;
  }

  function getCardById(cardId) {
    const list = getCurrentTierList();
    return list.cards.find(c => c.id === cardId) || null;
  }

  function getZoneKey(countryId, tierId, zone) {
    return `${countryId}__${tierId}__${zone}`;
  }

  function isCardInZone(zoneKey, cardId) {
    return Array.isArray(matrixState[zoneKey]) && matrixState[zoneKey].includes(cardId);
  }

  function getCardPlacementCount(cardId) {
    let count = 0;
    for (const key in matrixState) {
      if (Array.isArray(matrixState[key]) && matrixState[key].includes(cardId)) {
        count++;
      }
    }
    return count;
  }

  function getTotalPossibleSubZones() {
    const list = getCurrentTierList();
    const tierCount = (list && list.tiers) ? list.tiers.length : 6;
    return COUNTRIES.length * tierCount * 3;
  }

  function isCardFullyPlaced(cardId) {
    const cardData = getCardById(cardId);
    if (cardData && cardData.locked) return true;
    return getCardPlacementCount(cardId) >= getTotalPossibleSubZones();
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

    censorBtnHistoricalEl = document.getElementById('censor-btn-historical');
    censorBtnCensoredEl = document.getElementById('censor-btn-censored');

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
    lightboxDescEl = document.getElementById('lightbox-desc');
    lightboxForumLinksEl = document.getElementById('lightbox-forum-links');
  }

  // --- 5. INITIALIZATION ---
  function init() {
    try {
      console.log('--- Initializing HOI4 2D Matrix Hub ---');
      initElements();
      initWallpaper();
      initCensorshipMode();
      initTrayScale();
      initDeckOffsetObserver();
      setupWelcomeAndNavListeners();
      setupCensorshipListeners();
      setupTrayScaleListeners();
      setupTrayWheelScroll();
      setupLightboxListeners();
      setupWallpaperListeners();
      setupActionListeners();
      setupHistoryListener();

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
    if (listId === 'trikiwi') listId = 'mistakes';
    if (listId === 'atom' || listId === 'mechanics') listId = 'features';
    if (!TIER_LISTS[listId]) listId = 'mistakes';

    currentTierListId = listId;
    const list = TIER_LISTS[listId];

    if (!listStates[listId]) {
      listStates[listId] = {};
    }

    // Update UI headers
    if (brandTitleEl) brandTitleEl.textContent = list.title;
    if (trayTitleTextEl) trayTitleTextEl.textContent = list.trayTitle;

    matrixState = listStates[listId] || {};
    lastResetSnapshot = null;
    if (undoBtnEl) undoBtnEl.style.display = 'none';

    buildMatrixGrid();
    renderBankCards();
    renderAllCells();
    updateBankCardsStatus();

    hideWelcomeScreen();

    if (!skipUrlUpdate) {
      try {
        const url = `${window.location.pathname}?list=${listId}`;
        window.history.pushState({ screen: 'tierlist', list: listId }, '', url);
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
    listStates[currentTierListId] = {};
    matrixState = {};
    lastResetSnapshot = null;
    clearCardSelection();
    try {
      window.history.pushState({ screen: 'welcome' }, '', window.location.pathname);
    } catch (e) {}
    showWelcomeScreen();
  }

  function setupWelcomeAndNavListeners() {
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

  // Native Browser History (Back / Forward)
  function setupHistoryListener() {
    window.addEventListener('popstate', (e) => {
      const state = e.state;
      if (state && state.screen === 'tierlist' && state.list) {
        selectTierList(state.list, true);
      } else {
        clearCardSelection();
        showWelcomeScreen();
      }
    });
  }

  // --- 7. CENSORSHIP TOGGLE (HISTORICAL / CENSORED) ---
  function initCensorshipMode() {
    try {
      const saved = localStorage.getItem('hoi4_censorship_mode');
      if (saved === 'historical' || saved === 'censored') {
        currentCensorshipMode = saved;
      }
    } catch (e) {}
    setCensorshipMode(currentCensorshipMode, false);
  }

  function setCensorshipMode(mode, save = true) {
    if (mode !== 'historical' && mode !== 'censored') mode = 'censored';
    currentCensorshipMode = mode;

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

  function setupCensorshipListeners() {
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

  // --- 8. URL PERSISTENCE & SHARING (LZ-STRING / BASE64) ---
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
      syncActiveListState();

      const fullStateObj = {
        v: 3,
        l: currentTierListId,
        matrix: matrixState
      };

      const encodedFull = encodeStatePayload(fullStateObj);

      // Clean neutral query parameter (?list=mistakes or ?list=features)
      const shareUrl = `${window.location.origin}${window.location.pathname}?list=${currentTierListId}&state=${encodedFull}`;

      // Update address bar
      window.history.replaceState({ screen: 'tierlist', list: currentTierListId }, '', shareUrl);

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

      showToast('Ссылка скопирована! Все зоны (MP/ALL/SP) сохранены', 4200, false, 'success');
    } catch (err) {
      console.error('Failed to copy share link:', err);
      showToast('Не удалось скопировать ссылку в буфер обмена', 3000, false, 'danger');
    }
  }

  function loadStateFromURL() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      let stateParam = urlParams.get('state');
      const listParam = urlParams.get('list');
      const mpParam = urlParams.get('mp');
      const spParam = urlParams.get('sp');

      // Check hash #state=... or #data=...
      if (!stateParam && window.location.hash) {
        const hashStr = window.location.hash.substring(1);
        const hashParams = new URLSearchParams(hashStr);
        stateParam = hashParams.get('state') || hashParams.get('data');
      }

      let loaded = false;
      let targetListId = 'mistakes';

      if (listParam) {
        if (listParam === 'trikiwi' || listParam === 'mistakes') targetListId = 'mistakes';
        else if (listParam === 'atom' || listParam === 'features' || listParam === 'mechanics') targetListId = 'features';
      }

      if (!listStates[targetListId]) {
        listStates[targetListId] = {};
      }

      const targetMatrix = {};

      if (stateParam) {
        const payload = decodeStatePayload(stateParam);
        if (payload && typeof payload === 'object') {
          if (payload.l) {
            if (payload.l === 'trikiwi' || payload.l === 'mistakes') targetListId = 'mistakes';
            else if (payload.l === 'atom' || payload.l === 'features' || payload.l === 'mechanics') targetListId = 'features';
          }

          // Format v3: { v: 3, matrix: { 'country__tier__zone': [...] } }
          if (payload.matrix && typeof payload.matrix === 'object') {
            for (const key in payload.matrix) {
              if (Array.isArray(payload.matrix[key])) {
                if (key.split('__').length === 3) {
                  targetMatrix[key] = payload.matrix[key];
                } else {
                  targetMatrix[`${key}__all`] = payload.matrix[key];
                }
              }
            }
            loaded = true;
          }

          // Format v2: { v: 2, mp: {...}, sp: {...} }
          if (payload.mp && typeof payload.mp === 'object') {
            for (const key in payload.mp) {
              if (Array.isArray(payload.mp[key])) {
                targetMatrix[`${key}__mp`] = payload.mp[key];
              }
            }
            loaded = true;
          }
          if (payload.sp && typeof payload.sp === 'object') {
            for (const key in payload.sp) {
              if (Array.isArray(payload.sp[key])) {
                targetMatrix[`${key}__sp`] = payload.sp[key];
              }
            }
            loaded = true;
          }

          // Legacy format v1 fallback
          if (!payload.matrix && !payload.mp && (payload.m || typeof payload === 'object')) {
            const rawObj = payload.m || payload;
            for (const key in rawObj) {
              if (Array.isArray(rawObj[key])) {
                if (key.split('__').length === 3) {
                  targetMatrix[key] = rawObj[key];
                } else {
                  targetMatrix[`${key}__all`] = rawObj[key];
                }
                loaded = true;
              }
            }
          }
        }
      }

      if (mpParam) {
        const decodedMp = decodeStatePayload(mpParam);
        if (decodedMp && typeof decodedMp === 'object') {
          for (const key in decodedMp) {
            if (Array.isArray(decodedMp[key])) {
              targetMatrix[`${key}__mp`] = decodedMp[key];
            }
          }
          loaded = true;
        }
      }

      if (spParam) {
        const decodedSp = decodeStatePayload(spParam);
        if (decodedSp && typeof decodedSp === 'object') {
          for (const key in decodedSp) {
            if (Array.isArray(decodedSp[key])) {
              targetMatrix[`${key}__sp`] = decodedSp[key];
            }
          }
          loaded = true;
        }
      }

      if (loaded || listParam) {
        listStates[targetListId] = targetMatrix;
        selectTierList(targetListId, true);
        matrixState = listStates[targetListId] || {};
        renderAllCells();
        updateBankCardsStatus();
        if (loaded) {
          showToast('Тир-лист успешно загружен!', 3500, false, 'success');
        }
        return true;
      }
    } catch (e) {
      console.warn('Error reading URL state:', e);
    }
    return false;
  }

  // --- 9. MATRIX GRID BUILDING (THREE-ZONE ARCHITECTURE) ---
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

    // 3. Rows: 6 Tiers x 8 Columns with 3 Sub-Zones per Cell
    list.tiers.forEach(tier => {
      const rowHeaderEl = document.createElement('div');
      rowHeaderEl.className = `tier-row-header ${tier.className}`;
      rowHeaderEl.dataset.tier = tier.id;
      rowHeaderEl.innerHTML = `
        <span class="tier-badge-text">${tier.name}</span>
      `;
      matrixBoardEl.appendChild(rowHeaderEl);

      COUNTRIES.forEach(country => {
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

  // --- 10. TRAY & CARD BANK RENDERING ---
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

  function updateBankCardsStatus() {
    const cards = getCurrentCards();
    const totalSubZones = getTotalPossibleSubZones();

    const cardPlacementCounts = new Map();
    cards.forEach(c => cardPlacementCounts.set(c.id, 0));

    let totalPlacements = 0;

    for (const key in matrixState) {
      if (Array.isArray(matrixState[key])) {
        matrixState[key].forEach(cId => {
          totalPlacements++;
          if (cardPlacementCounts.has(cId)) {
            cardPlacementCounts.set(cId, cardPlacementCounts.get(cId) + 1);
          }
        });
      }
    }

    let fullyPlacedCount = 0;

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

  // --- 11. CREATE CARD ELEMENT ---
  function createCardElement(cardId, isInCell = false, zoneKey = null, itemIndex = null) {
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

    const isLongTitle = Boolean(cardData.title && cardData.title.length > 25);
    const captionClass = isLongTitle ? 'card-caption card-caption-long' : 'card-caption';

    let tooltipHtml = '';
    if (isLocked) {
      tooltipHtml = `<div class="card-tooltip"><span>${cardData.title}</span><small class="card-tooltip-desc" style="color:#ff8a80;">Временно заблокировано</small></div>`;
    } else if (isInCell) {
      tooltipHtml = `<div class="card-tooltip"><span>${cardData.title}</span>${cardData.desc ? '<small class="card-tooltip-desc">' + cardData.desc + '</small>' : ''}</div><button class="card-remove-btn" title="Убрать из ячейки"><i class="fa-solid fa-xmark"></i></button>`;
    } else if (cardData.desc) {
      tooltipHtml = `<div class="card-tooltip card-tooltip-desc-only"><small class="card-tooltip-desc">${cardData.desc}</small></div>`;
    }

    card.innerHTML = `
      <div class="card-art-box">
        <img class="card-img" src="${cardData.img}" alt="${cardData.title}" loading="lazy" decoding="async" />
        ${isLocked ? '<div class="card-lock-badge" title="Временно недоступно"><i class="fa-solid fa-lock"></i></div>' : ''}
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

    // Dragstart
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

      isDraggingFlag = true;
      draggedCardInfo = {
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
        isDraggingFlag = true;
        draggedCardInfo = {
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

        if (targetZone && draggedCardInfo) {
          const targetZoneKey = targetZone.dataset.zoneKey;
          const { cardId: dCardId, sourceZoneKey } = draggedCardInfo;
          handleCardDrop(targetZoneKey, dCardId, sourceZoneKey);
        }

        draggedCardInfo = null;
        setTimeout(() => {
          isDraggingFlag = false;
          isTouchDragging = false;
        }, 60);
      }
    }, { passive: true });

    // Click handler: Lightbox Zoom
    card.addEventListener('click', (e) => {
      if (isDraggingFlag || isTouchDragging) return;
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

  // --- 12. DYNAMIC COLOR DRAG-AND-DROP FOR SUB-ZONES ---
  function applyZoneDragOverHighlight(zoneEl, tier) {
    if (tier) {
      zoneEl.style.setProperty('--cell-drag-color', tier.color);
      zoneEl.style.setProperty('--cell-drag-glow', tier.glow);
      zoneEl.style.setProperty('--cell-drag-bg', tier.bg);
    }
    zoneEl.classList.add('drag-over');
  }

  function clearZoneDragOverHighlight(zoneEl) {
    zoneEl.classList.remove('drag-over');
    zoneEl.style.removeProperty('--cell-drag-color');
    zoneEl.style.removeProperty('--cell-drag-glow');
    zoneEl.style.removeProperty('--cell-drag-bg');
  }

  function clearAllDragOverStyles() {
    document.querySelectorAll('.cell-sub-zone.drag-over').forEach(el => clearZoneDragOverHighlight(el));
    if (bankCardsTrayEl) bankCardsTrayEl.classList.remove('drag-over');
  }

  function setupSubZoneDragEvents(zoneEl, tier) {
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

      if (draggedCardInfo) {
        cardId = draggedCardInfo.cardId;
        sourceZoneKey = draggedCardInfo.sourceZoneKey;
      } else {
        cardId = e.dataTransfer.getData('text/plain');
      }

      if (!cardId || !getCardById(cardId)) return;

      handleCardDrop(zoneKey, cardId, sourceZoneKey);
    });
  }

  // Drop Handler strictly targeting the chosen sub-zone
  function handleCardDrop(targetZoneKey, cardId, sourceZoneKey = null) {
    if (!targetZoneKey || !cardId) return;
    const cardData = getCardById(cardId);
    if (cardData && cardData.locked) {
      showToast('Карточка «' + cardData.title + '» временно заблокирована!', 2500, false, 'warning');
      return;
    }

    // 1. Dragged from another sub-zone on the board
    if (sourceZoneKey) {
      if (sourceZoneKey === targetZoneKey) {
        // Dropped inside the exact same sub-zone - keep position
        return;
      }

      // If already present in target sub-zone: prevent duplicate in this specific sub-zone
      if (isCardInZone(targetZoneKey, cardId)) {
        showToast('Карточка уже находится в этой подсекции', 2000, false, 'tip');
        return;
      }

      // Move card from source sub-zone to target sub-zone
      removeCardIdFromZone(sourceZoneKey, cardId, false);
      addCardToZone(targetZoneKey, cardId);
      return;
    }

    // 2. Dragged from bottom deck
    if (isCardInZone(targetZoneKey, cardId)) {
      showToast('Карточка уже находится в этой подсекции', 2000, false, 'tip');
      return;
    }

    // New placement in this independent sub-zone
    addCardToZone(targetZoneKey, cardId);
  }

  // --- 13. STATE MUTATION & SUB-ZONE RENDERING ---
  function syncActiveListState() {
    if (!listStates[currentTierListId]) {
      listStates[currentTierListId] = {};
    }
    listStates[currentTierListId] = matrixState;
  }

  function addCardToZone(zoneKey, cardId) {
    if (!matrixState[zoneKey]) {
      matrixState[zoneKey] = [];
    }
    matrixState[zoneKey].push(cardId);
    syncActiveListState();
    renderZone(zoneKey);
    updateBankCardsStatus();
  }

  function removeCardIdFromZone(zoneKey, cardId, shouldUpdateStatus = true) {
    if (!matrixState[zoneKey]) return;
    const idx = matrixState[zoneKey].indexOf(cardId);
    if (idx !== -1) {
      matrixState[zoneKey].splice(idx, 1);
      if (matrixState[zoneKey].length === 0) {
        delete matrixState[zoneKey];
      }
      syncActiveListState();
      renderZone(zoneKey);
      if (shouldUpdateStatus) {
        updateBankCardsStatus();
      }
    }
  }

  function removeCardFromCountry(countryId, cardId, shouldUpdateStatus = true) {
    for (const key in matrixState) {
      const [cId] = key.split('__');
      if (cId === countryId && Array.isArray(matrixState[key])) {
        const idx = matrixState[key].indexOf(cardId);
        if (idx !== -1) {
          matrixState[key].splice(idx, 1);
          if (matrixState[key].length === 0) {
            delete matrixState[key];
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

  function renderZone(zoneKey) {
    const zoneEl = document.querySelector(`.cell-sub-zone[data-zone-key="${zoneKey}"]`);
    if (!zoneEl) return;

    const cardsContainer = zoneEl.querySelector('.zone-cards');
    if (!cardsContainer) return;

    const cardsInZone = matrixState[zoneKey] || [];
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

  function renderCell(cellKey) {
    const [countryId, tierId] = cellKey.split('__');
    ['mp', 'all', 'sp'].forEach(z => {
      renderZone(getZoneKey(countryId, tierId, z));
    });
  }

  function renderAllCells() {
    const list = getCurrentTierList();
    COUNTRIES.forEach(country => {
      list.tiers.forEach(tier => {
        ['mp', 'all', 'sp'].forEach(z => {
          renderZone(getZoneKey(country.id, tier.id, z));
        });
      });
    });
  }

  // --- 14. TRAY SCALE (50% TO 200%) & SMOOTH HORIZONTAL SCROLL ---
  let currentTrayScale = 100; // in percent (50 to 200)

  function initTrayScale() {
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

  function updateDeckOffset() {
    const deckEl = document.querySelector('.bank-cards-strip-container');
    if (deckEl) {
      const deckHeight = Math.ceil(deckEl.getBoundingClientRect().height);
      if (deckHeight > 0) {
        document.documentElement.style.setProperty('--deck-height', `${deckHeight}px`);
      }
    }
  }

  function initDeckOffsetObserver() {
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

  function applyTrayScale(percent, save = true) {
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

  function setupTrayScaleListeners() {
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

  // --- 15. SELECTION CLEANUP ---
  function clearCardSelection() {
    selectedCardForPlacement = null;
    document.querySelectorAll('.mistake-card.is-selected').forEach(el => el.classList.remove('is-selected'));
    document.body.classList.remove('card-selection-active');
  }

  // --- 16. LIGHTBOX MODAL ---
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

    if (lightboxDescEl) {
      if (cardData.desc) {
        lightboxDescEl.textContent = cardData.desc;
        lightboxDescEl.style.display = 'block';
      } else {
        lightboxDescEl.style.display = 'none';
      }
    }

    if (lightboxForumLinksEl) {
      lightboxForumLinksEl.innerHTML = '';
      if (cardData.links && Array.isArray(cardData.links) && cardData.links.length > 0) {
        cardData.links.forEach(linkItem => {
          const btn = document.createElement('a');
          btn.href = linkItem.url;
          btn.target = '_blank';
          btn.rel = 'noopener noreferrer';
          btn.className = 'forum-link-btn';
          btn.innerHTML = `<i class="fa-solid fa-arrow-up-right-from-square"></i><span>${linkItem.title}</span>`;
          lightboxForumLinksEl.appendChild(btn);
        });
        lightboxForumLinksEl.style.display = 'flex';
      } else {
        lightboxForumLinksEl.style.display = 'none';
      }
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

  // --- 17. WALLPAPERS CONTROLLER ---
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

  // --- 18. RESET & UNDO CONTROLLER ---
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

  function executeReset() {
    lastResetSnapshot = JSON.parse(JSON.stringify(matrixState));
    matrixState = {};
    if (listStates[currentTierListId]) {
      listStates[currentTierListId] = {};
    }
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
    if (listStates[currentTierListId]) {
      listStates[currentTierListId] = matrixState;
    }
    lastResetSnapshot = null;
    renderAllCells();
    updateBankCardsStatus();

    if (undoBtnEl) {
      undoBtnEl.style.display = 'none';
    }

    showToast('Матрица восстановлена!', 2500, false, 'success');
  }

  // --- 19. ACTION LISTENERS ---
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

        if (draggedCardInfo && draggedCardInfo.sourceZoneKey) {
          removeCardIdFromZone(draggedCardInfo.sourceZoneKey, draggedCardInfo.cardId, true);
        }
      });
    }
  }

  // --- 20. TOAST NOTIFICATIONS ---
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
    requestAnimationFrame(() => toast.classList.add('show'));

    const timer = setTimeout(() => {
      dismissToast(toast);
    }, duration);

    function dismissToast(el) {
      clearTimeout(timer);
      if (el && el.parentNode) {
        el.classList.remove('show');
        setTimeout(() => el.remove(), 240);
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
