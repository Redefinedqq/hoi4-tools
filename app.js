/**
 * Hearts of Iron IV - 2D Matrix Tier List Hub
 * Modular ES6 Application Entry Point
 * Supports:
 *   1. "Ошибки в HOI4" (?list=mistakes)
 *   2. "Фишки и механики" (?list=features)
 * Features:
 *   - Three-Zone Matrix Cells (MP / ALL / SP per cell)
 *   - Censored vs Historical Mode (German WWII flag toggle with localStorage)
 *   - Dynamic Tier-Colored Drag-and-Drop Sub-Zone Highlights
 *   - Clean Neutral URLs & Browser History API (Back button support)
 *   - Deck Zoom Control (50% - 200% with double-click reset)
 *   - Fullscreen Lightbox with Mechanics Encyclopedia and Forum References
 *   - High-contrast M3 Dark Graphite HOI4 styling
 * Author: @redefinedtgk
 */

import { updateWelcomeScreenCounts, showWelcomeScreen, selectTierList, setupWelcomeAndNavListeners, setupHistoryListener } from './js/modules/welcome.js';
import { initWallpaper, setupWallpaperListeners } from './js/modules/wallpaper.js';
import { initCensorshipMode, setupCensorshipListeners } from './js/modules/censor.js';
import { initTrayScale, initDeckOffsetObserver, setupTrayScaleListeners, setupTrayWheelScroll } from './js/modules/tray.js';
import { setupLightboxListeners } from './js/modules/lightbox.js';
import { setupActionListeners } from './js/modules/reset.js';
import { loadStateFromURL } from './js/modules/url.js';

// Re-export key modules for browser/console inspection
export * from './js/modules/state.js';
export * from './js/modules/toast.js';
export * from './js/modules/welcome.js';
export * from './js/modules/tray.js';
export * from './js/modules/matrix.js';
export * from './js/modules/censor.js';
export * from './js/modules/wallpaper.js';

function init() {
  try {
    console.log('--- Initializing HOI4 2D Matrix Hub (ES6 Modular Architecture) ---');
    updateWelcomeScreenCounts();
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
    const urlLoadResult = loadStateFromURL((listId, skipUrl) => selectTierList(listId, skipUrl));
    if (!urlLoadResult) {
      // First visit or no state: show Welcome Screen
      showWelcomeScreen();
    }
    console.log('--- HOI4 Matrix App Initialized Successfully ---');
  } catch (e) {
    console.error('CRITICAL INIT ERROR:', e);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
