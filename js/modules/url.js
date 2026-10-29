/**
 * URL Persistence & Sharing Module (LZ-String / Base64)
 */

import { state, syncActiveListState } from './state.js';
import { showToast } from './toast.js';
import { renderAllCells } from './matrix.js';
import { updateBankCardsStatus } from './tray.js';

export function encodeStatePayload(stateObj) {
  const jsonStr = JSON.stringify(stateObj);
  if (typeof window !== 'undefined' && window.LZString && typeof window.LZString.compressToEncodedURIComponent === 'function') {
    return window.LZString.compressToEncodedURIComponent(jsonStr);
  }
  try {
    return encodeURIComponent(btoa(unescape(encodeURIComponent(jsonStr))));
  } catch (e) {
    return encodeURIComponent(jsonStr);
  }
}

export function decodeStatePayload(encodedStr) {
  if (!encodedStr) return null;
  let jsonStr = null;
  if (typeof window !== 'undefined' && window.LZString && typeof window.LZString.decompressFromEncodedURIComponent === 'function') {
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

export async function copyShareLink() {
  try {
    syncActiveListState();

    const fullStateObj = {
      v: 3,
      l: state.currentTierListId,
      matrix: state.matrixState
    };

    const encodedFull = encodeStatePayload(fullStateObj);

    // Clean neutral query parameter (?list=mistakes or ?list=features)
    const shareUrl = `${window.location.origin}${window.location.pathname}?list=${state.currentTierListId}&state=${encodedFull}`;

    // Update address bar
    window.history.replaceState({ screen: 'tierlist', list: state.currentTierListId }, '', shareUrl);

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

export function loadStateFromURL(onSelectTierList) {
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

    if (!state.listStates[targetListId]) {
      state.listStates[targetListId] = {};
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
      state.listStates[targetListId] = targetMatrix;
      if (typeof onSelectTierList === 'function') {
        onSelectTierList(targetListId, true);
      }
      state.matrixState = state.listStates[targetListId] || {};
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
