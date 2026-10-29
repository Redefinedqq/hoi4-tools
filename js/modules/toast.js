/**
 * Toast Notification System (M3 / HOI4 Style)
 */

let toastContainerEl = null;

export function showToast(message, arg2 = 3600, arg3 = false, arg4 = 'info') {
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
        if (window._executeUndo) {
          window._executeUndo();
        }
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

// Global hook for non-module compatibility
if (typeof window !== 'undefined') {
  window.showToast = showToast;
}
