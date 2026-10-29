/**
 * Dynamic Wallpapers Controller Module
 */

import { WALLPAPERS } from '../data/wallpapers.js';
import { showToast } from './toast.js';

let currentWpIndex = 0;
let wallpaperBtnEl = null;
let previewWpBtnEl = null;
let wpExitBtnEl = null;
let wpPrevBtnEl = null;
let wpNextBtnEl = null;
let wpTitleLabelEl = null;

export function initWallpaper() {
  wallpaperBtnEl = document.getElementById('wallpaper-btn');
  previewWpBtnEl = document.getElementById('preview-wallpaper-btn');
  wpExitBtnEl = document.getElementById('wp-exit-btn');
  wpPrevBtnEl = document.getElementById('wp-prev-btn');
  wpNextBtnEl = document.getElementById('wp-next-btn');
  wpTitleLabelEl = document.getElementById('wp-title-label');

  try {
    const saved = localStorage.getItem('hoi4_tier_wp');
    if (saved !== null) {
      currentWpIndex = parseInt(saved, 10) || 0;
    }
  } catch (e) {}
  applyWallpaper(currentWpIndex, false);
}

export function applyWallpaper(index, showFeedback = true) {
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

  if (!wpTitleLabelEl) wpTitleLabelEl = document.getElementById('wp-title-label');
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

export function setWallpaperPreview(active) {
  if (active) {
    document.body.classList.add('wallpaper-preview-active');
  } else {
    document.body.classList.remove('wallpaper-preview-active');
  }
}

export function setupWallpaperListeners() {
  if (!wallpaperBtnEl) wallpaperBtnEl = document.getElementById('wallpaper-btn');
  if (!previewWpBtnEl) previewWpBtnEl = document.getElementById('preview-wallpaper-btn');
  if (!wpExitBtnEl) wpExitBtnEl = document.getElementById('wp-exit-btn');
  if (!wpPrevBtnEl) wpPrevBtnEl = document.getElementById('wp-prev-btn');
  if (!wpNextBtnEl) wpNextBtnEl = document.getElementById('wp-next-btn');

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
