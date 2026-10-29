/**
 * Fullscreen Lightbox & Mechanics Encyclopedia Modal
 */

import { getCardById } from './state.js';
import { setWallpaperPreview } from './wallpaper.js';

let lightboxModalEl = null;
let lightboxCloseBtnEl = null;
let lightboxImgEl = null;
let lightboxTitleEl = null;
let lightboxDescEl = null;
let lightboxForumLinksEl = null;
let leaveConfirmModalEl = null;

export function openLightbox(cardId) {
  if (!lightboxModalEl) lightboxModalEl = document.getElementById('lightbox-modal');
  if (!lightboxImgEl) lightboxImgEl = document.getElementById('lightbox-img');
  if (!lightboxTitleEl) lightboxTitleEl = document.getElementById('lightbox-title');
  if (!lightboxDescEl) lightboxDescEl = document.getElementById('lightbox-desc');
  if (!lightboxForumLinksEl) lightboxForumLinksEl = document.getElementById('lightbox-forum-links');

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

export function closeLightbox() {
  if (!lightboxModalEl) lightboxModalEl = document.getElementById('lightbox-modal');
  if (!lightboxModalEl) return;
  lightboxModalEl.classList.remove('is-active');
  lightboxModalEl.setAttribute('aria-hidden', 'true');
}

export function setupLightboxListeners() {
  lightboxModalEl = document.getElementById('lightbox-modal');
  lightboxCloseBtnEl = document.getElementById('lightbox-close-btn');
  lightboxImgEl = document.getElementById('lightbox-img');
  lightboxTitleEl = document.getElementById('lightbox-title');
  lightboxDescEl = document.getElementById('lightbox-desc');
  lightboxForumLinksEl = document.getElementById('lightbox-forum-links');
  leaveConfirmModalEl = document.getElementById('leave-confirm-modal');

  if (lightboxCloseBtnEl) {
    lightboxCloseBtnEl.addEventListener('click', (e) => {
      e.stopPropagation();
      closeLightbox();
    });
  }

  if (lightboxModalEl) {
    lightboxModalEl.addEventListener('click', (e) => {
      if (!e.target.closest('.lightbox-img')) {
        closeLightbox();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (lightboxModalEl && lightboxModalEl.classList.contains('is-active')) {
        closeLightbox();
      } else if (document.body.classList.contains('wallpaper-preview-active')) {
        setWallpaperPreview(false);
      } else if (leaveConfirmModalEl && leaveConfirmModalEl.classList.contains('is-active')) {
        leaveConfirmModalEl.classList.remove('is-active');
      }
    }
  });
}
